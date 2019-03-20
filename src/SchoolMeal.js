const querystring = require("querystring");
const request = require("request");
const EduSession = require("./EduSession");
const Meal = require("./Meal");

class SchoolMeal {

    static get eduCode() {
        return {
            SEOUL: 'sen.go.kr',
            BUSAN: 'pen.go.kr',
            DAEGU: 'dge.go.kr',
            INCHOEN: 'ice.go.kr',
            GWANGJU: 'gen.go.kr',
            DAEJEON: 'dje.go.kr',
            ULSAN: 'use.go.kr',
            SEJONG: 'sje.go.kr',
            GYEONGGI: 'ken.go.kr',
            GANGWON: 'kwe.go.kr',
            CHUNG_BUK: 'cbe.go.kr',
            CHUNK_NAM: 'cne.go.kr',
            JEON_BUK: 'jbe.go.kr',
            JEON_NAM: 'jne.go.kr',
            GYEONG_BUK: 'gbe.kr',
            GYEONG_NAM: 'gne.go.kr',
            JEJU: 'jje.go.kr'
        }
    }

    static get schoolType() {
        return {
            1: "KINDERGARTEN",
            2: "ELEMENTARY",
            3: "MIDDLE",
            4: "HIGH",
        };
    }

    static get mealType() {
        return {
            1: "조식",
            2: "중식",
            3: "석식"
        }
    }

    /**
     *
     * @param {string} eduCode       교육청 지역 (SEOUL, BUSAN, DAEGU...)
     * @param {string} schoolType    학교 유형 (유치원/초등학교/중학교/고등학교)
     * @param {string} schoolCode    학교 코드
     */
    constructor(eduCode, schoolType, schoolCode) {
        if (SchoolMeal.eduCode[eduCode] === undefined) {
            throw new Error("교육청 코드가 잘못되었습니다.");
        }
        if (SchoolMeal.schoolType[schoolType] === undefined) {
            throw new Error("학교 유형이 잘못되었습니다.");
        }
        this._code = eduCode;
        this._type = schoolType;
        this._schoolCode = schoolCode;

        this._cookie = new EduSession(SchoolMeal.eduCode, this._code);
    }

    getMonthlyMeal() {
        return new Promise(async (resolve) => {
            request.post("https://stu." + (SchoolMeal.eduCode[this._code] || SchoolMeal.eduCode.SEOUL) + "/sts_sci_md00_001.ws", {
                headers: {
                    Cookie: 'JSESSIONID=' + await this._cookie.getCookie()
                },
                body: {
                    schulCode: this._schoolCode,
                    schulCrseScCode: this._type
                },
                json: true
            }, (err, res, body) => {
                let lists = body.resultSVO.mthDietList;
                let date = [];
                let day = ['sun', 'mon', 'tue', 'wed', 'the', 'fri', 'sat'];
                for (let list of lists) {
                    for (let d of day) {
                        if (list[d] !== null) {
                            let meal = Meal.parseMonth(list[d]);
                            date[meal.getTime().getDate()] = meal;
                        }
                    }
                }
                resolve(date);
            });
        });
    }

    async getWeeklyMeal(searchDate) {
        let that = this;
        return new Promise(async (resolve) => {
            let date = [];
            for (let mealType = 1; mealType <= 3; mealType++) {
                await (new Promise(async (resolve2) => {
                    request.post("https://stu." + (SchoolMeal.eduCode[that._code] || SchoolMeal.eduCode.SEOUL) + "/sts_sci_md01_001.ws", {
                        headers: {
                            Cookie: 'JSESSIONID=' + await that._cookie.getCookie()
                        },
                        body: {
                            schulCode: that._schoolCode,
                            schulCrseScCode: that._type,
                            schYmd: searchDate.getFullYear() + "."
                                + (searchDate.getMonth() >= 10 ? searchDate.getMonth() : "0" + searchDate.getMonth()) + "."
                                + (searchDate.getDate() >= 10 ? searchDate.getDate() : "0" + searchDate.getDate()),
                            schMmealScCode: mealType
                        },
                        json: true
                    }, (err, res, body) => {
                        let lists = body.resultSVO.weekDietList;
                        let day = ['sun', 'mon', 'tue', 'wed', 'the', 'fri', 'sat'];
                        //console.log(require("util").inspect(lists[2], {showHidden: true, depth: null}))
                        for (let d of day) {
                            if (lists[2][d] !== null) {
                                let meal = Meal.parseWeek(lists[0][d], lists[2][d], body.resultSVO.schMmealScCode);
                                if (date.hasOwnProperty(meal.getTime().getDate())) {
                                    date[meal.getTime().getDate()].setString(mealType, meal.getString(mealType));
                                } else {
                                    date[meal.getTime().getDate()] = meal;
                                }
                            }
                        }
                        resolve2();
                    });
                }));
            }
            resolve(date);
        });
    }


}

module.exports = SchoolMeal;
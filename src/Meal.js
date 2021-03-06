/*
Copyright 2019 NLOG (박찬솔)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

class Meal {

    /**
     *
     * @param   {string}    str
     * @returns {Meal}
     */
    static parseMonth(str) {
       if (str === null || str === undefined) {
            throw new Error();
        }
        let date = new Date();
        let splited = str.split('<br />');
        date.setDate(splited.shift());
        date.setHours(0, 0, 0, 0);

        let mealString = '';
        let mealList = ['[조식]', '[중식]', '[석식]'];

        let meals = [];
        meals[mealList[0]] = [];
        meals[mealList[1]] = [];
        meals[mealList[2]] = [];
        if (mealList.includes(splited[0])) {
            mealString = splited.shift();
        } else {
            return new Meal(date, '', '', '');
        }

        let currentString = '';
        while ((currentString = splited.shift()) !== undefined) {
            if (mealList.includes(currentString)) {
                mealString = currentString;
                continue;
            }
            meals[mealString].push(currentString);
        }

        return new Meal(date, meals[mealList[0]].join("\n"), meals[mealList[1]].join("\n"), meals[mealList[2]].join("\n"));
    }

    /**
     *
     * @param   {string}    day
     * @param   {string}    str
     * @param   {int}       mealType
     * @returns {Meal}
     */
    static parseWeek(day, str, mealType) {
        if (str === null || str === undefined) {
            throw new Error();
        }
        let date = new Date(day.substr(0, 10));
        date.setHours(0, 0, 0, 0);

        let meals = [];
        for (let i = 1; i <= 3; i++) {
            meals[i] = '';
        }
        meals[mealType] = str.trim().split('<br />').join("\n");

        return new Meal(date, meals[1], meals[2], meals[3]);
    }

    /**
     *
     * @param {Date}    date        날짜
     * @param {String}  breakfast   조식
     * @param {String}  lunch       중식
     * @param {String}  dinner      석식
     */
    constructor(date, breakfast, lunch, dinner) {
        this._date = date;
        this._breakfast = breakfast;
        this._lunch = lunch;
        this._dinner = dinner;
    }

    getTimeString() {
        return this._date.getFullYear() + "."
        + (this._date.getMonth() >= 10 ? this._date.getMonth() : "0" + this._date.getMonth()) + "."
        + (this._date.getDate() >= 10 ? this._date.getDate() : "0" + this._date.getDate());
    }

    getTime() {
        return this._date;
    }

    setString(mealType, str) {
        if (mealType === 1) {
            this.setBreakfast(str);
        }
        if (mealType === 2) {
            this.setLunch(str);
        }
        if (mealType === 3) {
            this.setDinner(str);
        }
    }

    getString(mealType) {
        if (mealType === 1) {
            return this.getBreakfast();
        }
        if (mealType === 2) {
            return this.getLunch();
        }
        if (mealType === 3) {
            return this.getDinner();
        }
        return undefined;
    }

    getBreakfast() {
        return this._breakfast;
    }

    setBreakfast(str) {
        this._breakfast = str;
    }

    getLunch() {
        return this._lunch;
    }

    setLunch(str) {
        this._lunch = str;
    }

    getDinner() {
        return this._dinner;
    }

    setDinner(str) {
        this._dinner = str;
    }

}

module.exports = Meal;
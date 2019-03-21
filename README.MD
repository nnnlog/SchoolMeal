# SchoolMeal

* 나이스에서 학교 급식 정보를 받아와 제공해주는 API 입니다.

---

#### 설명

|   | SchoolMeal 생성자                 |
|---|-----------------------------------|
| 1 | 지역 이름 (SchoolMeal.eduCode)    |
| 2 | 학교 유형 (SchoolMeal.schoolType) |
| 3 | 학교 코드 (예시: "C100000394")    |

* SchooolMeal

|        | getMonthlyMeal                 | getWeeklyMeal                                |
|--------|--------------------------------|----------------------------------------------|
| 인자   | -                              | searchDate (Date Class)                      |
| 리턴값 | Promise                        | Promise                                      |
| 설명   | 한달 동안의 급식을 가져옵니다. | 전달된 날짜의 한주 동안의 급식을 가져옵니다. |

<br>
---
##### 예제

```js
const meal = require("schoolmeal");
let school = new meal(지역, 학교유형, 학교코드);

school.getMonthlyMeal().then(d => console.log(d));
school.getWeeklyMeal(new Date(2018, 3, 2)).then(d1 => console.log(d1));
```
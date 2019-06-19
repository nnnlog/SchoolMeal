const SchoolMeal = require("../src/SchoolMeal");
process.env.TZ = 'Asia/Seoul';

let meal = new SchoolMeal("BUSAN", 4, "C100000394");
meal.getMonthlyMeal(new Date(2019, 6, 19)).then(w_meal => {
    console.log(w_meal[19].getDinner()); //석식: 밥버거
});
meal.getWeeklyMeal(new Date(2019, 6, 19)).then(meals => {
    console.log(Object.values(meals)[4]); //석식: 밥버거
});
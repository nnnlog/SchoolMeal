const SchoolMeal = require("../src/SchoolMeal");
process.env.TZ = 'Asia/Seoul';

let meal = new SchoolMeal("BUSAN", 4, "C100000394");
meal.getMonthlyMeal(new Date(2019, 3, 21)).then(meals => {
    console.log(meals[15]);
});
meal.getWeeklyMeal(new Date(2019, 3, 21)).then(meals => {
    console.log(Object.values(meals)[2]);
});
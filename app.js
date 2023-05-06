let periods = [
    "Photography",
    "Chemistry",
    "Spanish",
    "Humanities",
    "CS",
    "Math",
];
let scheduleElement;
let schedule = new Map();

function createDay(dayName, categories) {
    let day = document.createElement("div");
    day.className = "day";

    if (categories.size == 0) {
        categories = new Map();
        periods.forEach((period) => {
            categories.set(period, []);
        });
    }

    // Add add to schedule
    schedule.set(dayName, new Map());
    categories.forEach((items, category) => {
        schedule.get(dayName).set(category, items);
    });

    let dayH2 = document.createElement("h2");
    dayH2.innerHTML = dayName;
    day.appendChild(dayH2);

    let categoriesElement = document.createElement("div");
    categoriesElement.className = "categories";

    categories.forEach((itemsContent, category) => {
        let categoryElement = document.createElement("div");
        categoryElement.className = "category";

        let categoryName = document.createElement("h3");
        categoryName.innerHTML = category;
        categoryName.onclick = categoryClicked;
        categoryElement.appendChild(categoryName);

        let items = document.createElement("ul");
        items.className = "items";

        itemsContent.forEach((itemContent) => {
            let item = document.createElement("li");
            item.className = "item deletable hoverable";
            item.innerHTML = itemContent;
            item.onclick = itemClicked;
            items.appendChild(item);
        });

        categoryElement.appendChild(items);

        categoriesElement.appendChild(categoryElement);
    });

    day.appendChild(categoriesElement);
    scheduleElement.appendChild(day);
}

function categoryClicked(element) {
    let items = element.target.parentElement.querySelector(".items");
    let item = document.createElement("li");
    item.className = "item";

    let inputBox = document.createElement("input");
    inputBox.type = "text";
    inputBox.onblur = (e) => {
        if (inputBox.value == "") item.remove();
    };
    inputBox.onkeydown = (e) => {
        if (e.key == "Enter") {
            addItem(e);
        }
    };
    item.appendChild(inputBox);

    items.appendChild(item);
    inputBox.select();
}

function saveSchedule() {
    let scheduleString = "";
    schedule.forEach((categories, day) => {
        scheduleString += day + ":";
        categories.forEach((items, category) => {
            scheduleString += category;
            items.forEach((item) => {
                scheduleString += "," + item;
            });
            scheduleString += "|";
        });
        scheduleString += ";";
    });
    localStorage.setItem("schedule", scheduleString);
}

function itemClicked(element) {
    if (element.target.tagName == "INPUT") return;

    let dayName =
        element.target.parentElement.parentElement.parentElement.parentElement.querySelector(
            "h2"
        ).innerHTML;
    let categoryName =
        element.target.parentElement.parentElement.querySelector(
            "h3"
        ).innerHTML;
    let itemContent = element.target.innerHTML;
    schedule
        .get(dayName)
        .get(categoryName)
        .splice(
            schedule.get(dayName).get(categoryName).indexOf(itemContent),
            1
        );
    saveSchedule();

    element.target.remove();
}

function addItem(element) {
    // Add to schedule
    let items = element.target.parentElement.parentElement;
    let item = document.createElement("li");
    item.className = "item deletable hoverable";
    item.innerHTML = element.target.value;
    item.onclick = itemClicked;
    items.appendChild(item);

    // Add to schedule
    let dayName =
        items.parentElement.parentElement.parentElement.querySelector(
            "h2"
        ).innerHTML;
    let categoryName = items.parentElement.querySelector("h3").innerHTML;
    schedule.get(dayName).get(categoryName).push(item.innerHTML);

    saveSchedule();

    element.target.parentElement.remove();
}

function addDay() {}

function loaded() {
    scheduleElement = document.getElementById("schedule");

    // Check if there is a schedule
    let scheduleString = localStorage.getItem("schedule");
    if (scheduleString != null) {
        // Array of days
        let days = scheduleString.split(";");
        days.pop();

        // Add each day to the schedule
        days.forEach((day) => {
            let colonIndex = day.indexOf(":");
            let dayName = day.substring(0, colonIndex);
            let categoriesArray = day.substring(colonIndex + 1).split("|");

            // Add each category to the day
            let categories = new Map();
            categoriesArray.forEach((category) => {
                if (!category.includes(",")) {
                    categories.set(category, []);
                } else {
                    let commaIndex = category.indexOf(",");
                    let categoryName = category.substring(0, commaIndex);
                    let items = category.substring(commaIndex + 1).split(",");
                    categories.set(categoryName, items);
                }
            });

            schedule.set(dayName, categories);
        });

        // Add each day to the schedule
        schedule.forEach((categories, day) => {
            createDay(day, categories);
        });
        return;
    }

    days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];

    days.forEach((day) => {
        createDay(day, new Map());
    });
}

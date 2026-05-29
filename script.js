// Developed by Ankita Sharma
const addBtn = document.querySelector("#addBtn");
const ul = document.querySelector("#taskList");
const taskInput = document.querySelector("#task");
const dateInput = document.querySelector("#date");
const timeInput = document.querySelector("#time");
const counter = document.querySelector("#counter");
loadTasks();
updateCounter();

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        addTask();
    }
});

function addTask() {

    let taskText = taskInput.value.trim();
    let dateVal = dateInput.value;
    let timeVal = timeInput.value;

    if (taskText === "") {
        taskInput.style.border = "1.5px solid #ff4d6d";
        taskInput.placeholder = "Please enter a task!";
        setTimeout(function() {
            taskInput.style.border = "";
            taskInput.placeholder = "Enter your task...";
        }, 2000);
        return;
    }

    let taskObj = {
        text: taskText,
        date: dateVal,
        time: timeVal,
        done: false
    };
    createTaskElement(taskObj);
    saveToLocalStorage();
    updateCounter();

    taskInput.value = "";
    dateInput.value = "";
    timeInput.value = "";
}

function createTaskElement(taskObj) {
    let emptyMsg = ul.querySelector(".empty-msg");
    if (emptyMsg) {
        emptyMsg.remove();
    }
    let item = document.createElement("li");
    
    if (taskObj.done) {
        item.classList.add("done");
    }

    let taskInfo = document.createElement("div");
    taskInfo.classList.add("task-info");

    let taskText = document.createElement("div");
    taskText.classList.add("task-text");
    taskText.innerText = taskObj.text;

    
    let taskMeta = document.createElement("div");
    taskMeta.classList.add("task-meta");

    let metaText = "";
    if (taskObj.date) metaText += "Date: " + taskObj.date;
    if (taskObj.date && taskObj.time) metaText += "  |  ";
    if (taskObj.time) metaText += "Time: " + taskObj.time;
    taskMeta.innerText = metaText;

    taskInfo.appendChild(taskText);
    taskInfo.appendChild(taskMeta);

    taskInfo.addEventListener("click", function() {
        item.classList.toggle("done");
        saveToLocalStorage();
        updateCounter();
    });

    // Create the Delete button
    let delBtn = document.createElement("button");
    delBtn.innerText = "Delete";
    delBtn.classList.add("del-btn");

    delBtn.addEventListener("click", function() {
        item.remove();
        if (ul.children.length === 0) {
            showEmptyMsg();
        }
        saveToLocalStorage();
        updateCounter();
    });

    item.appendChild(taskInfo);
    item.appendChild(delBtn);

    ul.appendChild(item);
}


function showEmptyMsg() {
    let li = document.createElement("li");
    li.classList.add("empty-msg");
    li.innerText = "You are all caught up!";
    ul.appendChild(li);
}

function updateCounter() {
    let allTasks = ul.querySelectorAll("li:not(.empty-msg)");
    let doneTasks = ul.querySelectorAll("li.done");
    let remaining = allTasks.length - doneTasks.length;

    if (allTasks.length === 0) {
        counter.innerText = "No tasks yet!";
    } else {
        counter.innerText = remaining + " task(s) remaining";
    }
}

function saveToLocalStorage() {
    let tasks = [];

    ul.querySelectorAll("li:not(.empty-msg)").forEach(function(item) {
        let text = item.querySelector(".task-text").innerText;
        let meta = item.querySelector(".task-meta").innerText;
        let done = item.classList.contains("done");

        let date = "";
        let time = "";
        if (meta.includes("Date:")) {
            date = meta.split("Date:")[1].split("|")[0].trim();
        }
        if (meta.includes("Time:")) {
            time = meta.split("Time:")[1].trim();
        }

        tasks.push({ text, date, time, done });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    let saved = localStorage.getItem("tasks");

    if (!saved) return;

    let tasks = JSON.parse(saved);

    if (tasks.length === 0) return;

    let emptyMsg = ul.querySelector(".empty-msg");
    if (emptyMsg) {
        emptyMsg.remove();
    }

    tasks.forEach(function(task) {
        createTaskElement(task);
    });
}

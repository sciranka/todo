"use strict";

var mainInput = document.getElementById("mainTextInput");
var submitInput = document.getElementById("submitInput");
var toDoListView = document.getElementById("toDoListView");
var alreadyDoneListView = document.getElementById("alreadyDoneListView");
var alreadyDoneHeading = document.getElementById("alreadyDoneHeading");
var mainContainer = document.getElementById("mainContainer");
var inputText = "";

var daysName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// main TO DO list
var toDoList = new Array();
var alreadyDoneList = new Array();

var toDoListName = "toDoList";
var alreadyDoneListName = "alreadyDoneList";

var isMyStorage = false;
if (window.localStorage) {
    console.log("local storage in use");
    isMyStorage = true;
    getFromLocal(toDoList, toDoListName);
    getFromLocal(alreadyDoneList, alreadyDoneListName);
}

// save to local storage help function
function saveToDoLocalHelp(arr, listName) {
    if (arr.length > 0) {
        localStorage.setItem(listName, JSON.stringify(arr));
    } else {
        localStorage.removeItem(listName);
    }
}

// Save arrays to local storage
function saveToDoLocal() {
    saveToDoLocalHelp(toDoList, toDoListName);
    saveToDoLocalHelp(alreadyDoneList, alreadyDoneListName);
}

// get and parse array from local storage
function getFromLocal(arr, elemName) {
    if (localStorage.getItem(elemName)) {
        var listFromLocal = JSON.parse(localStorage.getItem(elemName));
        if (listFromLocal.length > 0) {
            for (var i = 0; i < listFromLocal.length; i++) {
                var text = JSON.parse(localStorage.getItem(elemName))[i].text;
                var date = JSON.parse(localStorage.getItem(elemName))[i].date;
                var helpDate = new Date(date);
                arr.push(new ToDoItem(text, helpDate));
            }
        }
    }
}

// Main OBJECT ITEM
function ToDoItem(text, date) {
    this.text = text;
    this.date = date;
}

// INPUT TEXT LISTENER
mainInput.addEventListener("input", function (e) {
    inputText = this.value;
    if (inputText.length > 0) {
        setInputWidth(this, 80);
        setInputWidth(submitInput, 18);
    } else {
        setInputWidth(this, 100);
        setInputWidth(submitInput, 5);
    }
});

// Add item to TO DO LIST ARRAY
function addItem() {
    var d = new Date();
    toDoList.unshift(new ToDoItem(inputText, d));
    mainInput.value = "";
    setInputWidth(mainInput, 100);
    mainInput.focus();
    inputText = "";
    saveToDoLocal();
    drawToDoList();
}

// Setting width of element
function setInputWidth(element, inputWidth) {
    element.style.width = inputWidth + "%";
}

// IF ENTER IS PRESSED
window.addEventListener("keypress", function (e) {
    if (e.keyCode == 13 && inputText.length > 0) {
        addItem();
    }
});

// ADD BUTTON IS CLICKED
submitInput.addEventListener("click", function () {
    addItem();
});

function createItemContent(array, listName, i) {
    var helpItemVar = "";
    if (listName == toDoListName) {
        helpItemVar = "OK";
    } else {
        helpItemVar = "DO";
    }
    var itemContent = "\n        <div class=\"toDoList-Container\">\n            <div class=\"toDoList-content\">\n                <p class=\"toDoDate\">" + daysName[array[i].date.getDay()] + " - " + array[i].date.toLocaleDateString() + " - " + array[i].date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + "</p>\n                <p class=\"toDoText\">" + array[i].text + "</p>\n            </div>\n            <div class=\"toDoList-controlContainer\">\n                <div class=\"toDoList-controlItem danger\" id=\"" + listName + "_delete_" + i + "\">X</div>\n                <div class=\"toDoList-controlItem\" id=\"" + listName + "_done_" + i + "\">" + helpItemVar + "</div>\n            </div>\n        </div>\n    ";
    return itemContent;
}

// Draw TO DO list to VIEW
function drawToDoList() {
    clearListView(toDoListView);
    if (toDoList.length > 0) {
        var _loop = function _loop(i) {
            var listItem = document.createElement("li");

            listItem.innerHTML = createItemContent(toDoList, toDoListName, i);
            toDoListView.appendChild(listItem);

            // delete item Event Listener
            var deleteID = toDoListName + "_delete_" + i;
            document.getElementById(deleteID).addEventListener("click", function () {
                toDoList.splice(i, 1);
                drawToDoList();
                saveToDoLocal();
            });
            // done item Event Listener
            var doneId = toDoListName + "_done_" + i;
            document.getElementById(doneId).addEventListener("click", function () {
                alreadyDoneList.unshift(toDoList[i]);
                toDoList.splice(i, 1);
                drawToDoList();
                drawAlreadyDoneList();
                saveToDoLocal();
            });
        };

        for (var i = 0; i < toDoList.length; i++) {
            _loop(i);
        }
    } else {
        if (isMyStorage) {
            toDoListView.innerHTML = "<h3>Great, everything is done :)</h3>";
        } else {
            toDoListView.innerHTML = "<h3>Sorry, your browser does not support local storage :(</h3>";
        }
    }
}
// Drawing Already Done List
function drawAlreadyDoneList() {
    clearListView(alreadyDoneListView);
    if (alreadyDoneList.length > 0) {
        alreadyDoneHeading.style.display = "block";

        var _loop2 = function _loop2(i) {
            var listItem = document.createElement("li");

            listItem.innerHTML = createItemContent(alreadyDoneList, alreadyDoneListName, i);
            alreadyDoneListView.appendChild(listItem);

            // delete item Event Listener
            var deleteID = alreadyDoneListName + "_delete_" + i;
            document.getElementById(deleteID).addEventListener("click", function () {
                alreadyDoneList.splice(i, 1);
                drawAlreadyDoneList();
                saveToDoLocal();
            });
            // do item Event Listener
            var doneId = alreadyDoneListName + "_done_" + i;
            document.getElementById(doneId).addEventListener("click", function () {
                toDoList.unshift(alreadyDoneList[i]);
                alreadyDoneList.splice(i, 1);
                drawToDoList();
                drawAlreadyDoneList();
                saveToDoLocal();
            });
        };

        for (var i = 0; i < alreadyDoneList.length; i++) {
            _loop2(i);
        }
    } else {
        alreadyDoneHeading.style.display = "none";
    }
}

// Clear all TO DO in VIEW
function clearListView(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

// Initial draw of TO DO list to VIEW
drawToDoList();
drawAlreadyDoneList();
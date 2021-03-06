var taskIdCounter = 0;

var pageContentEl = document.querySelector("#page-content");
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var tasks = [];

var taskFormHandler = function (event) {
  event.preventDefault();
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;

  //check if input values are empty strings
  if (!taskNameInput || !taskTypeInput) {
    alert("You need to fill out the task form!");
    return false;
  }
  document.querySelector("input[name='task-name']").value = "";
  document.querySelector("select[name='task-type']").selectedIndex = 0;

  var isEdit = formEl.hasAttribute("data-task-id");
  //has data attribute, so get TaskID, call function.
  if (isEdit) {
    var taskID = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskID);
  } else { //no data attribute, so create object as normal before
    var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput,
      status: "to do"
    };
    createTaskEl(taskDataObj);
  }
}
var completeEditTask = function (taskName, taskType, taskID) {
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskID + "']");
  //set new values
  taskSelected.querySelector("h3.task-name").textContent = taskName
  taskSelected.querySelector("span.task-type").textContent = taskType;

  //loop through tasks array and task object with new content
  for (var i = 0; i < tasks.length, i++;) {
    if (tasks[i].id === parseInt(taskID)) {
      tasks[i].name = taskName;
      tasks[i].type = taskType;
    }
  }
  formEl.removeAttribute("data-task-id");
  document.querySelector("#save-task").textContent = "Add Task";
  saveTasks();
};

var createTaskEl = function (taskDataObj) {
  // create list item
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

  //add tas id as a custom attribute
  listItemEl.setAttribute("data-task-id", taskIdCounter);

  // create div to hold task info and add to list item
  var taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";
  taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
  listItemEl.appendChild(taskInfoEl);

  var taskActionEl = createTaskActions(taskIdCounter);
  listItemEl.appendChild(taskActionEl)

  switch (taskDataObj.status) {
    case "to do":
      taskActionEl.querySelector("select[name='status-change']").selectedIndex = 0;
      tasksToDoEl.append(listItemEl);
      break;
    case "in progress":
      taskActionEl.querySelector("select[name='status-change']").selectedIndex = 1;
      tasksInProgressEl.append(listItemEl);
      break;
    case "completed":
      taskActionEl.querySelector("select[name='status-change']").selectedIndex = 2;
      tasksCompletedEl.append(listItemEl);
      break;
    default:
      console.log("Something went wrong!");
  }

  taskDataObj.id = taskIdCounter;
  tasks.push(taskDataObj);

  saveTasks();

  //increase task counter for the next unique id
  taskIdCounter++;

};

var createTaskActions = function (taskID) {
  var actionContainerEl = document.createElement("div");
  actionContainerEl.className = "task-actions";

  //create edit button
  var editButtonEl = document.createElement("button");
  editButtonEl.textContent = "Edit";
  editButtonEl.className = "btn edit-btn";
  editButtonEl.setAttribute("data-task-id", taskID);
  actionContainerEl.appendChild(editButtonEl);

  //delete button

  var deleteButtonEl = document.createElement("button");
  deleteButtonEl.textContent = "Delete";
  deleteButtonEl.className = "btn delete-btn";
  deleteButtonEl.setAttribute("data-task-id", taskID);
  actionContainerEl.appendChild(deleteButtonEl);

  var statusSelectEl = document.createElement("select");
  statusSelectEl.setAttribute("name", "status-change");
  statusSelectEl.setAttribute("data-task-id", taskID);
  statusSelectEl.className = "select-status";
  actionContainerEl.appendChild(statusSelectEl);

  var statusChoices = ["To Do", "In Progress", "Completed"];
  for (var i = 0; i < statusChoices.length; i++) {
    //create option element
    var statusOptionEl = document.createElement("option");
    statusOptionEl.setAttribute("value", statusChoices[i]);
    statusOptionEl.textContent = statusChoices[i];

    //append to select
    statusSelectEl.appendChild(statusOptionEl);
  }

  return actionContainerEl;
};



var editTask = function (taskId) {
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  var taskName = taskSelected.querySelector("h3.task-name").textContent;
  var taskType = taskSelected.querySelector("span.task-type").textContent;
  document.querySelector("input[name='task-name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;
  formEl.setAttribute("data-task-id", taskId);
  formEl.querySelector("#save-task").textContent = "Save Task";
};

var deleteTask = function (taskID) {
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskID + "']");
  taskSelected.remove();
  var updatedTaskArr = [];
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id !== parseInt(taskID)) {
      updatedTaskArr.push(tasks[i]);
    }
  }
  tasks = updatedTaskArr;
  saveTasks();
};

var taskButtonHandler = function (event) {
  var targetEl = event.target;

  if (targetEl.matches(".edit-btn")) {
    var taskID = targetEl.getAttribute("data-task-id");
    editTask(taskID);
  }

  else if (targetEl.matches(".delete-btn")) {
    var taskID = targetEl.getAttribute("data-task-id");
    deleteTask(taskID);
  }
};

var taskStatusChangeHandler = function (event) {
  //get the task item's ID
  var taskID = event.target.getAttribute("data-task-id");
  var statusValue = event.target.value.toLowerCase();
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskID + "']");
  if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
  }
  else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
  }
  else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);
  };
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskID)) {
      tasks[i].status = statusValue;
    }
  }
  saveTasks();
};

var saveTasks = function () {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Get the task items from local storage
// Convert tasks from the string format back into an array of objects
// Iterate through a tasks array and create tasks elements on the page form it
var loadTasks = function () {
  var savedTasks = localStorage.getItem("tasks");
  if (!savedTasks) {
    return false;
  }
  console.log("Found saved tasks!")
  savedTasks = JSON.parse(savedTasks);
  for (var i = 0; i < savedTasks.length; i++) {
    createTaskEl(savedTasks[i]);
  }
};

formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("click", taskButtonHandler)
pageContentEl.addEventListener("change", taskStatusChangeHandler);

loadTasks();
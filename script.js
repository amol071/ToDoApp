$(document).ready(function () {
  const taskList = $("#task-list");

  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    taskList.empty();
    tasks.forEach((task, index) => {
      const li = $(`
        <li data-index="${index}" class="${task.completed ? "completed" : ""}">
          <div class="task-header">
            <span class="task-text">${task.text}</span>
            <div class="buttons">
              <button class="edit">Edit</button>
              <button class="delete">Delete</button>
              <button class="complete">${
                task.completed ? "Undo" : "Done"
              }</button>
            </div>
          </div>
          <small class="timestamp" data-time="${task.createdAt}">
            Created: ${new Date(task.createdAt).toLocaleString()}
          </small>
        </li>
      `);
      taskList.append(li);
    });
  }

  function saveTasks() {
    const tasks = [];
    $("#task-list li").each(function () {
      tasks.push({
        text: $(this).find(".task-text").text(),
        completed: $(this).hasClass("completed"),
        createdAt:
          $(this).find(".timestamp").data("time") || new Date().toISOString(),
      });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function toggleClearButton() {
    if ($("#task-list li").length === 0) {
      $("#clear-tasks").hide();
    } else {
      $("#clear-tasks").show();
    }
  }

  $("#add-task").click(function () {
    const taskText = $("#task-input").val().trim();

    if (taskText === "") {
      $("#task-input").addClass("error");
      $("#error-message").text("Task cannot be empty").show();
      return;
    }

    if (taskText.length < 2) {
      $("#task-input").addClass("error");
      $("#error-message").text("Task must be at least 2 characters").show();
      return;
    }

    $("#task-input").removeClass("error");
    $("#error-message").hide();

    const createdAt = new Date().toISOString();

    const taskHTML = `
      <li>
        <div class="task-header">
          <span class="task-text">${taskText}</span>
          <div class="buttons">
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
            <button class="complete">Done</button>
          </div>
        </div>
        <small class="timestamp" data-time="${createdAt}">
          Created: ${new Date(createdAt).toLocaleString()}
        </small>
      </li>
    `;

    $("#task-list").append(taskHTML);
    toggleClearButton();
    $("#task-input").val("");
    saveTasks();
  });

  $("#clear-tasks").click(function () {
    if (confirm("Are you sure you want to clear all tasks?")) {
      localStorage.removeItem("tasks");
      $("#task-list").empty();
      toggleClearButton();
    }
  });

  taskList.on("click", ".delete", function () {
    $(this).closest("li").remove();
    saveTasks();
    toggleClearButton();
  });

  taskList.on("click", ".edit", function () {
    const li = $(this).closest("li");
    const span = li.find(".task-text");
    const currentText = span.text();
    const input = $('<input type="text" class="edit-input">').val(currentText);
    span.replaceWith(input);
    input.focus();

    input.on("blur", function () {
      const newText = $(this).val().trim();
      if (newText) {
        $(this).replaceWith(`<span class="task-text">${newText}</span>`);
        saveTasks();
      } else {
        li.remove();
        saveTasks();
      }
    });
  });

  $("#task-input").on("input", function () {
    if ($(this).val().trim() !== "") {
      $(this).removeClass("error");
      $("#error-message").hide();
    }
  });

  taskList.on("click", ".complete", function () {
    const li = $(this).closest("li");
    li.toggleClass("completed");
    $(this).text(li.hasClass("completed") ? "Undo" : "Done");
    saveTasks();
  });

  loadTasks();
  toggleClearButton();
});

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#addTask");
  const taskName = document.querySelector("#taskName");
  const taskDesc = document.querySelector("#taskDesc");
  const taskList = document.querySelector("#taskList");
  const taskPlaceholder = document.querySelector("#taskPlaceholder");

  form.addEventListener("submit", addTask);
  taskList.addEventListener("click", deleteTask);
  taskList.addEventListener("click", doneTask);

  let userData = [];

  if (localStorage.getItem("tasks")) {
    userData = JSON.parse(localStorage.getItem("tasks"));
    userData.forEach(function (task) {
      renderTask(task);
      taskList.classList.remove("flex");
    });
  }

  checkTaskPlaceholder();

  function addTask(e) {
    e.preventDefault();

    const TASK_TITLE = taskName.value;
    const TASK_DESCRIPTION = taskDesc.value;

    const newTask = {
      id: Date.now(),
      title: TASK_TITLE,
      description: TASK_DESCRIPTION,
      done: false,
    };

    userData.push(newTask);
    saveToLS();

    renderTask(newTask);

    taskName.value = "";
    taskName.focus();
    taskDesc.value = "";

    taskList.classList.remove("flex");
    checkTaskPlaceholder();
  }

  function deleteTask(e) {
    if (e.target.dataset.action !== "delete") {
      return;
    } else {
      const parentNode = e.target.closest("li");
      const id = Number(parentNode.id);
      const index = userData.findIndex((task) => task.id === id);

      userData.splice(index, 1);

      saveToLS();

      parentNode.remove();

      checkTaskPlaceholder();
    }
  }

  function doneTask(e) {
    if (e.target.dataset.action !== "done") {
      return;
    } else {
      const parentNode = e.target.closest("li");
      const id = Number(parentNode.id);
      const task = userData.find((task) => task.id === id);

      task.done = !task.done;

      saveToLS();

      const taskTitle = parentNode.querySelector("h3");
      taskTitle.classList.toggle("line-through");
      parentNode.classList.toggle("opacity-50");
    }
  }

  function checkTaskPlaceholder() {
    if (userData.length === 0) {
      const taskPlaceholderHTML = `
            <li id="taskPlaceholder" class="h-fit w-fit text-center">
              <i class="icon-list text-8xl text-[#00BCD4]"></i>
              <p class="text-3xl text-[#A0A0A0]">Список дел пуст</p>
            </li>`;
      taskList.classList.add("flex");
      taskList.insertAdjacentHTML("afterbegin", taskPlaceholderHTML);
    } else {
      const taskPlaceholderEl = document.querySelector("#taskPlaceholder");
      taskPlaceholderEl ? taskPlaceholderEl.remove() : null;
    }
  }

  function saveToLS() {
    localStorage.setItem("tasks", JSON.stringify(userData));
  }

  function renderTask(task) {
    const taskTitleConditionClass = task.done
      ? "task-title line-through"
      : "task-title";
      const taskElConditionClass = task.done
      ? "opacity-50"
      : null;

    const taskHTML = `
        <li id="${task.id}" class="${taskElConditionClass} cursor-default mt-3 flex justify-between items-center p-4 rounded-3xl overflow-x-hidden h-fit bg-[#2E2E2E]">
            <div class="max-w-[80%] overflow-hidden">
                <h3 class="${taskTitleConditionClass} w-fit pb-1 text-lg border-b border-b-[#a0a0a06e]">${task.title}</h3>
                <p class="mt-3 text-[#A0A0A0]">${task.description}</p>
            </div>
            <div>
                <button type="button" data-action="delete" class="icon-cross cursor-pointer p-2 text-sm rounded-md bg-[#1E1E1E] text-[#F44336] opacity-60 hover:opacity-100"></button>
                <button type="button" data-action="done" class="icon-complete cursor-pointer p-2 text-sm rounded-md bg-[#1E1E1E] text-[#4CAF50] opacity-60 hover:opacity-100"></button>
            </div>
        </li>`;

    taskList.insertAdjacentHTML("beforeend", taskHTML);
  }
});

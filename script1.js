const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const total = document.getElementById("total");
const completed = document.getElementById("completed");
const clearCompleted = document.getElementById("clearCompleted");

let tasks = [];

try {
    const saved = JSON.parse(localStorage.getItem("todoTasks") || "[]");
    if (Array.isArray(saved)) {
        tasks = saved.filter(task =>
            task &&
            typeof task.text === "string" &&
            typeof task.done === "boolean" &&
            typeof task.id === "number"
        );
    }
} catch {
    tasks = [];
}

function saveTasks() {
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
}

function renderTasks() {
    taskList.replaceChildren();

    tasks.forEach(task => {
        const li = document.createElement("li");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.done;
        checkbox.setAttribute("aria-label", "Mark task completed");

        const text = document.createElement("span");
        text.textContent = task.text;
        if (task.done) text.classList.add("done");

        checkbox.addEventListener("change", () => {
            task.done = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete";

        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter(item => item.id !== task.id);
            saveTasks();
            renderTasks();
        });

        li.append(checkbox, text, deleteButton);
        taskList.appendChild(li);
    });

    total.textContent = `Total: ${tasks.length}`;
    completed.textContent =
        `Completed: ${tasks.filter(task => task.done).length}`;
}

taskForm.addEventListener("submit", event => {
    event.preventDefault();

    const text = taskInput.value.trim();
    if (!text) return;

    tasks.push({
        id: Date.now() + Math.random(),
        text,
        done: false
    });

    saveTasks();
    renderTasks();
    taskInput.value = "";
    taskInput.focus();
});

clearCompleted.addEventListener("click", () => {
    tasks = tasks.filter(task => !task.done);
    saveTasks();
    renderTasks();
});

renderTasks();
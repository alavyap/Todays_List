document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("task-input");
    const taskList = document.getElementById("task-list");
    const emptyImage = document.querySelector(".empty-image");
    const todaysContainer = document.querySelector(".todays-container");
    const progressBar = document.getElementById("progress");
    const progressNumber = document.getElementById("numbers");
    const form = document.querySelector(".input-area");
    const settingsBtn = document.getElementById("settings-btn");
    const settingsModalOverlay = document.getElementById("settings-modal-overlay");

    const DELETE_SETTING_KEY = "deleteCompletedAfterDelay";
    const DELETE_DELAY_MS = 2 * 60 * 1000;
    const deleteTimers = new Map();
    const isMainPage = Boolean(taskInput && taskList && form && settingsBtn && settingsModalOverlay);

    if (!isMainPage) {
        return;
    }

    const isAutoDeleteEnabled = () => localStorage.getItem(DELETE_SETTING_KEY) === "yes";

    const openSettingsModal = () => {
        settingsModalOverlay.classList.remove("hidden");
    };

    const closeSettingsModal = () => {
        settingsModalOverlay.classList.add("hidden");
    };

    const clearDeleteTimer = (taskId) => {
        const timerId = deleteTimers.get(taskId);
        if (timerId) {
            clearTimeout(timerId);
            deleteTimers.delete(taskId);
        }
    };

    const removeTask = (li, checkCompletion = true) => {
        clearDeleteTimer(li.dataset.taskId);
        li.remove();
        toggleEmptyState();
        updateProgress(checkCompletion);
        saveTasksToLocalStorage();
    };

    const scheduleTaskDeletion = (li) => {
        const taskId = li.dataset.taskId;

        clearDeleteTimer(taskId);

        if (!isAutoDeleteEnabled()) {
            return;
        }

        deleteTimers.set(taskId, window.setTimeout(() => {
            if (li.isConnected) {
                removeTask(li);
            } else {
                clearDeleteTimer(taskId);
            }
        }, DELETE_DELAY_MS));
    };

    const refreshDeletionSchedules = () => {
        const tasks = taskList.querySelectorAll("li");

        tasks.forEach((li) => {
            const checkbox = li.querySelector(".checkbox");

            if (checkbox.checked && isAutoDeleteEnabled()) {
                scheduleTaskDeletion(li);
            } else {
                clearDeleteTimer(li.dataset.taskId);
            }
        });
    };

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        addTask();
    });

    settingsBtn.addEventListener("click", openSettingsModal);
    settingsModalOverlay.addEventListener("click", (e) => {
        if (e.target === settingsModalOverlay) {
            closeSettingsModal();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !settingsModalOverlay.classList.contains("hidden")) {
            closeSettingsModal();
        }
    });

    window.addEventListener("message", (event) => {
        if (!event.data || typeof event.data.type !== "string") {
            return;
        }

        if (event.data.type === "close-settings-modal") {
            closeSettingsModal();
        }

        if (event.data.type === "settings-updated") {
            refreshDeletionSchedules();
        }
    });

    const toggleEmptyState = () => {
        emptyImage.style.display = taskList.children.length === 0 ? "block" : "none";
        todaysContainer.style.width = taskList.children.length > 0 ? "100%" : "50%";
    };

    const updateProgress = (checkCompletion = true) => {
        const totalTasks = taskList.children.length;
        const completedTasks = taskList.querySelectorAll(".checkbox:checked").length;

        progressBar.style.width = totalTasks > 0
            ? `${(completedTasks / totalTasks) * 100}%`
            : "0%";

        progressNumber.textContent = `${completedTasks}/${totalTasks}`;

        if (checkCompletion && totalTasks > 0 && completedTasks === totalTasks) {
            Confetti();
        }
    };

    const saveTasksToLocalStorage = () => {
        const tasks = Array.from(taskList.querySelectorAll("li")).map(li => ({
            id: li.dataset.taskId,
            text: li.querySelector("span").textContent,
            completed: li.querySelector(".checkbox").checked
        }));
        localStorage.setItem("tasks", JSON.stringify(tasks));
    };

    const loadTasksFromLocalStorage = () => {
        const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        savedTasks.forEach(({ id, text, completed }) =>
            addTask(text, completed, false, id)
        );
        toggleEmptyState();
        updateProgress();
        refreshDeletionSchedules();
    };

    const addTask = (text, completed = false, checkCompletion = true, taskId = crypto.randomUUID()) => {
        let taskText = text || taskInput.value.trim();
        if (!taskText) return;
        const MAX_LENGTH = 100;

        if (taskText.length > MAX_LENGTH) {
            taskText = taskText.substring(0, MAX_LENGTH);
        }

        const li = document.createElement("li");
        li.dataset.taskId = taskId;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("checkbox");
        checkbox.checked = completed;

        const span = document.createElement("span");
        span.textContent = taskText;

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("task-buttons");
        buttonContainer.innerHTML = `
            <button class="edit-btn"><i class="fas fa-edit"></i></button>
            <button class="delete-btn"><i class="fas fa-trash-alt"></i></button>
        `;

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(buttonContainer);

        const editBtn = buttonContainer.querySelector(".edit-btn");

        if (completed) {
            li.classList.add("completed");
            editBtn.style.opacity = "0.5";
            editBtn.style.pointerEvents = "none";
        }

        checkbox.addEventListener("change", () => {
            const isChecked = checkbox.checked;

            li.classList.toggle("completed", isChecked);
            editBtn.style.opacity = isChecked ? "0.5" : "1";
            editBtn.style.pointerEvents = isChecked ? "none" : "auto";

            if (isChecked) {
                scheduleTaskDeletion(li);
            } else {
                clearDeleteTimer(taskId);
            }

            updateProgress();
            saveTasksToLocalStorage();
        });

        editBtn.addEventListener("click", () => {
            if (!checkbox.checked) {
                taskInput.value = span.textContent;
                removeTask(li, false);
            }
        });

        buttonContainer.querySelector(".delete-btn").addEventListener("click", () => {
            removeTask(li);
        });

        taskList.appendChild(li);

        if (completed) {
            scheduleTaskDeletion(li);
        }

        taskInput.value = "";
        toggleEmptyState();
        updateProgress(checkCompletion);
        saveTasksToLocalStorage();
    };

    if (!localStorage.getItem(DELETE_SETTING_KEY)) {
        localStorage.setItem(DELETE_SETTING_KEY, "no");
    }

    loadTasksFromLocalStorage();
});


// ✅ SAFER CONFETTI
const Confetti = () => {
    if (typeof confetti !== "function") return;

    const count = 200;
    const defaults = { origin: { y: 0.7 } };

    function fire(ratio, opts) {
        confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * ratio),
        });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
};

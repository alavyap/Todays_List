
// Ensures the DOM is fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("task-input");
    const addTaskBtn = document.getElementById("add-task-btn");
    const taskList = document.getElementById("task-list");
    const emptyImage = document.querySelector(".empty-image");
    const todaysContainer = document.querySelector(".todays-container");


    // Progess Bar Functionality
    const progressBar = document.getElementById("progress");
    const progessNumber = document.getElementById("numbers");






    // Toggle the visibility of the empty image based on the number of tasks
    const toggleEmptyImage = () => {
        emptyImage.style.display = taskList.children.length === 0 ? "block" : "none";
        todaysContainer.style.width = taskList.children.length > 0 ? "100%" : "50%";
    }


    // Update Progress Bar Functionality
    const updateProgess = (checkCompletion = true) => {
        const totalTasks = taskList.children.length;
        const completedTasks = taskList.querySelectorAll(".checkbox:checked").length;
        progressBar.style.width = totalTasks > 0 ? `${(completedTasks / totalTasks) * 100}%` : "0%";
        progessNumber.textContent = `${completedTasks}/${totalTasks}`;

        // confetti animation when all tasks are completed
        if (checkCompletion && totalTasks > 0 && completedTasks === totalTasks) {
            Confetti();
        }

    };


    const saveTasksToLocalStorage = () => {
        
    };

    // Function to add a new task to the list
    const addTask = (text, completed = false, checkCompletion = true) => {


        const taskText = text || taskInput.value.trim();
        if (!taskText) {return}; // Prevent adding empty tasks
        
        const li = document.createElement("li");
        li.innerHTML = `
        <input type="checkbox" class="checkbox" ${completed ? "checked" : ""}>
        <span>${taskText}</span>
        <div class="task-buttons">
            <button class="edit-btn"><i class="fas fa-edit"></i></button>
            <button class="delete-btn"><i class="fas fa-trash-alt"></i></button>
        </div>
        `;
        const checkbox = li.querySelector(".checkbox");
        const editBtn = li.querySelector(".edit-btn");

        if (completed){
            li.classList.add("completed");
            editBtn.disabled = true; // Disable the edit button for completed tasks
            editBtn.style.opacity = "0.5";
            editBtn.style.pointerEvents = "none";
        }

        checkbox.addEventListener("change", () => {
            const isChecked = checkbox.checked;
            li.classList.toggle("completed", isChecked);
            editBtn.disabled = isChecked; // Disable the edit button when the task is completed
            editBtn.style.opacity = isChecked ? "0.5" : "1";
            editBtn.style.pointerEvents = isChecked ? "none" : "auto";
            updateProgess();
        });

        //Editing a task when the edit button is clicked
        editBtn.addEventListener("click", () => {
            if(!checkbox.checked){
                taskInput.value = li.querySelector("span").textContent; // Set the input field to the current task text
            li.remove(); // Remove the task from the list
            toggleEmptyImage(); // Update the visibility of the empty image
            updateProgess(false); // Update the progress bar without checking for completion
            }
        });
        // Deleting a task when the delete button is clicked
        li.querySelector(".delete-btn").addEventListener("click", () => {
            li.remove();
            toggleEmptyImage(); // Update the visibility of the empty image
        });


        taskList.appendChild(li);
        taskInput.value = ""; // Clear the input field after adding a task
        toggleEmptyImage(); // Update the visibility of the empty image
        updateProgess(checkCompletion); // Update the progress bar

    };

    // Event listener for the "Add Task" button
    addTaskBtn.addEventListener("click", () => addTask());
    taskInput.addEventListener("keydown", (e) => {
        if (e.key == "Enter"){
            e.preventDefault(); // Prevent the default form submission behavior
            addTask();
        }
    });
});



// Confetti Functionality
const Confetti = () => {
    const count = 200,
  defaults = {
    origin: { y: 0.7 },
  };

function fire(particleRatio, opts) {
  confetti(
    Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio),
    })
  );
}

fire(0.25, {
  spread: 26,
  startVelocity: 55,
});

fire(0.2, {
  spread: 60,
});

fire(0.35, {
  spread: 100,
  decay: 0.91,
  scalar: 0.8,
});

fire(0.1, {
  spread: 120,
  startVelocity: 25,
  decay: 0.92,
  scalar: 1.2,
});

fire(0.1, {
  spread: 120,
  startVelocity: 45,
});
}
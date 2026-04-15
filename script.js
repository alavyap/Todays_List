
// Ensures the DOM is fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("task-input");
    const addTaskBtn = document.getElementById("add-task-btn");
    const taskList = document.getElementById("task-list");
    const emptyImage = document.querySelector(".empty-image");
    const todaysContainer = document.querySelector(".todays-container");

    // Toggle the visibility of the empty image based on the number of tasks
    const toggleEmptyImage = () => {
        emptyImage.style.display = taskList.children.length === 0 ? "block" : "none";
        todaysContainer.style.display = taskList.children.length > 0 ? "100%" : "50%";
    }

    // Function to add a new task to the list
    const addTask = (text, completed = false) => {


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
            editBtn.style.poninterEvents = "none";
        }

        checkbox.addEventListener("change", () => {
            const isChecked = checkbox.checked;
            li.classList.toggle("completed", isChecked);
            editBtn.disabled = isChecked; // Disable the edit button when the task is completed
            editBtn.style.opacity = isChecked ? "0.5" : "1";
            editBtn.style.pointerEvents = isChecked ? "none" : "auto";
        });

        //Editing a task when the edit button is clicked
        li.querySelector(".edit-btn").addEventListener("click", () => {
            if(!checkbox.checked){
                taskInput.value = li.querySelector("span").textContent; // Set the input field to the current task text
            li.remove(); // Remove the task from the list
            toggleEmptyImage(); // Update the visibility of the empty image
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
        
    };

    // Event listener for the "Add Task" button
    addTaskBtn.addEventListener("click", () => addTask());
    taskInput.addEventListener("keypress", (e) => {
        if (e.key == "Enter"){
            e.preventDefault(); // Prevent the default form submission behavior
            addTask();
        }
    });
});
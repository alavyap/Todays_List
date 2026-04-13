
// Ensures the DOM is fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("task-input");
    const addTaskBtn = document.getElementById("add-task-btn");
    const taskList = document.getElementById("task-list");
    const emptyImage = document.querySelector(".empty-image");

    // Toggle the visibility of the empty image based on the number of tasks
    const toggleEmptyImage = () => {
        emptyImage.style.display = taskList.children.length === 0 ? "block" : "none";
    }

    // Function to add a new task to the list
    const addTask = (event) => {

        event.preventDefault(); // Prevent form submission if the button is inside a form

        const tastkText = taskInput.value.trim();
        
        if (!tastkText) return; // Prevent adding empty tasks
        
        const li = document.createElement("li");
        li.innerHTML = `
        <input type="checkbox" class="checkbox">
        <span>${tastkText}</span>
        <div class="task-buttons">
            <button class="edit-btn"><i class="fas fa-edit"></i></button>
            <button class="delete-btn"><i class="fas fa-trash-alt"></i></button>
        </div>
        `;

        taskList.appendChild(li);

        taskInput.value = ""; // Clear the input field after adding a task

        toggleEmptyImage(); // Update the visibility of the empty image
        
    };

    // Event listener for the "Add Task" button
    addTaskBtn.addEventListener("click", addTask);
    taskInput.addEventListener("keypress", (e) => {
        if (e.key == "Enter"){
            addTask(e);
        }
    });
});
const form = document.getElementById('todo-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const count = document.getElementById('task-count');
const filters = document.querySelectorAll('.filter');

// Load saved tasks from the browser
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Save tasks and update the page
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    showTasks();
}

// Display tasks based on the selected filter
function showTasks() {
    list.innerHTML = '';

    const visibleTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    visibleTasks.forEach(task => {
        const item = document.createElement('li');
        const checkbox = document.createElement('input');
        const text = document.createElement('span');
        const deleteBtn = document.createElement('button');

        item.className = task.completed ? 'completed' : '';
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        text.textContent = task.text;
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete';

        // Mark a task as completed
        checkbox.addEventListener('change', () => {
            task.completed = checkbox.checked;
            saveTasks();
        });

        // Delete a task
        deleteBtn.addEventListener('click', () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
        });

        item.append(checkbox, text, deleteBtn);
        list.appendChild(item);
    });

    const remaining = tasks.filter(task => !task.completed).length;
    count.textContent = `${remaining} task${remaining !== 1 ? 's' : ''} left`;
}

// Add a new task
form.addEventListener('submit', event => {
    event.preventDefault();

    const text = input.value.trim();
    if (!text) return;

    tasks.push({
        id: Date.now(),
        text: text,
        completed: false
    });

    input.value = '';
    saveTasks();
});

// Filter tasks
filters.forEach(button => {
    button.addEventListener('click', () => {
        currentFilter = button.dataset.filter;

        filters.forEach(filter => filter.classList.remove('active'));
        button.classList.add('active');

        showTasks();
    });
});

showTasks();

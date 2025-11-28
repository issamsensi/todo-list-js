const displayTasks = document.getElementById('tasks');
const displayPending = document.getElementById('pending');
const displayCompleted = document.getElementById('completed');
const taskInput = document.getElementById('task');
const clearBtn = document.querySelector('.clear');
const display = document.querySelector('.display');
const form = document.querySelector('.form');

let tasksList = [];
let currentFilter = 'all'; 
let lastFocusedId = null;

function escapeHTML(str){
    if (!str) return '';
    return str.replace(/[&<>"']/g, function (c) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[c];
    });
}

function render(){
    const filtered = tasksList.filter(t => {
        if (currentFilter === 'all') return true;
        if (currentFilter === 'pending') return t.pending && !t.completed;
        if (currentFilter === 'completed') return t.completed;
    });

    if(filtered.length === 0){
        display.innerHTML = `<p class="no-tasks">No tasks found</p>`;
        return;
    }

    display.innerHTML = filtered.map(t => `
        <div class="task-item ${t.completed ? 'completed' : 'pending'}" data-id="${t.id}" tabindex="0">
            <label class="task-checkbox">
                <span class="task-text">${escapeHTML(t.task)}</span>
                <input type="checkbox" class="check" ${t.completed ? 'checked' : ''} data-id="${t.id}">
            </label>
        </div>
    `).join('');
    saveTasks();
    updateCounts();
    setActiveTab(currentFilter);
    restoreFocus();
}

function updateCounts(){
    const total = tasksList.length;
    const pendingCount = tasksList.filter(t => t.pending && !t.completed).length;
    const completedCount = tasksList.filter(t => t.completed).length;
    displayTasks.textContent = `Tasks (${total})`;
    displayPending.textContent = `Pending (${pendingCount})`;
    displayCompleted.textContent = `Completed (${completedCount})`;
}

function saveTasks(){
    try{
        if(tasksList.length === 0){
            localStorage.removeItem('todo-tasks');
        } else {
            localStorage.setItem('todo-tasks', JSON.stringify(tasksList));
        }
    }catch(e){
        console.warn('Local storage not available', e);
    }
}

function loadTasks(){
    try{
        const raw = localStorage.getItem('todo-tasks');
        if(!raw) return;
        const parsed = JSON.parse(raw);
        if(Array.isArray(parsed)){
            tasksList = parsed.map(t => ({
                id: t.id || Date.now() + Math.random(),
                task: t.task || '',
                pending: (typeof t.pending === 'boolean') ? t.pending : !t.completed,
                completed: !!t.completed
            }));
        }
    }catch(e){
        console.warn('Error loading tasks', e);
    }
}

function savePrefs(){
    try{
        const prefs = { filter: currentFilter, focusedId: lastFocusedId };
        localStorage.setItem('todo-prefs', JSON.stringify(prefs));
    }catch(e){ console.warn('Failed to save prefs', e); }
}

function loadPrefs(){
    try{
        const raw = localStorage.getItem('todo-prefs');
        if(!raw) return;
        const parsed = JSON.parse(raw);
        if(parsed.filter) currentFilter = parsed.filter;
        if(parsed.focusedId) lastFocusedId = parsed.focusedId;
    }catch(e){ console.warn('Failed to load prefs', e); }
}

function restoreFocus(){
    if(!lastFocusedId) return;
    const el = document.querySelector(`.task-item[data-id="${lastFocusedId}"]`);
    if(el) el.focus();
}

form.addEventListener('submit', e => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if(!text) return; 

    const newTask = {
        id: Date.now(),
        task: text,
        pending: true,
        completed: false
    };
    tasksList.push(newTask);
    taskInput.value = '';
    render();
});

function setActiveTab(tab){
    [displayTasks, displayPending, displayCompleted].forEach(el => el.classList.remove('active'));
    if(tab === 'all') displayTasks.classList.add('active');
    if(tab === 'pending') displayPending.classList.add('active');
    if(tab === 'completed') displayCompleted.classList.add('active');
}

displayTasks.addEventListener('click', () => { currentFilter = 'all'; setActiveTab('all'); savePrefs(); render(); });
displayPending.addEventListener('click', () => { currentFilter = 'pending'; setActiveTab('pending'); savePrefs(); render(); });
displayCompleted.addEventListener('click', () => { currentFilter = 'completed'; setActiveTab('completed'); savePrefs(); render(); });

clearBtn.addEventListener('click', () => {
    if(!confirm('Clear all tasks?')) return;
    tasksList = [];
    try { localStorage.removeItem('todo-tasks'); } catch(e) {}
    render();
});


display.addEventListener('change', e => {
    const target = e.target;
    if(target.classList.contains('check')){
        const id = Number(target.getAttribute('data-id'));
        const index = tasksList.findIndex(t => t.id === id);
        if(index === -1) return;
        tasksList[index].completed = target.checked;
        tasksList[index].pending = !target.checked;
        render();
        savePrefs();
    }
});

display.addEventListener('focusin', e => {
    const item = e.target.closest && e.target.closest('.task-item');
    if(item){
        lastFocusedId = item.getAttribute('data-id');
        savePrefs();
    }
});

document.addEventListener('keydown', e => {
    const key = e.key.toLowerCase();
    const active = document.activeElement;
    const item = active.closest && active.closest('.task-item');
    if(!item) return;
    const id = Number(item.getAttribute('data-id'));
    const index = tasksList.findIndex(t => t.id === id);
    if(index === -1) return;
    if(key === 'u'){
        tasksList[index].completed = !tasksList[index].completed;
        tasksList[index].pending = !tasksList[index].completed;
        render();
        const newItem = document.querySelector(`.task-item[data-id="${id}"]`);
        if(newItem) newItem.focus();
    } else if(key === 'd'){
        if(confirm('Delete this task?')){
            tasksList.splice(index, 1);
            lastFocusedId = null;
            savePrefs();
            render();
        }
    }
});

loadTasks();
loadPrefs();
setActiveTab(currentFilter);
render();

# ToDo List (JS)

Welcome to **ToDo List (JS)** — a small, keyboard-friendly todo list demo built with plain HTML, CSS, and JavaScript.

## 🚀 Project Overview
This project demonstrates a compact, keyboard-first todo list application that keeps data in the browser using `localStorage`. Tasks support filtering (All/Pending/Completed), keyboard operations, and persistence across reloads.

## 🌟 Features
- Add tasks with the input (press Enter to add)
- Keyboard-first operation:
  - Tab through tasks to focus them
  - Press `U` to toggle completion of the focused task
  - Press `D` to delete the focused task
- Click checkboxes to complete/uncomplete tasks
- Filter tasks by Tasks / Pending / Completed, with counts
- Tasks and UI preferences (filter & focused task) are persisted in `localStorage`
- Clear all tasks button removes tasks and their local storage

## 🛠️ Technologies Used
- HTML, CSS, JavaScript

## 📦 Project Structure
```
index.html      # Main page with input and task list
main.js         # App logic: rendering, persistence, keyboard handlers
style.css       # UI styles and layout
```

## 📸 Screenshots
[screen](todolist.png)
u
## ✨ How to Use
1. Open `index.html` in a browser (or serve the folder with a simple static server):
```bash
cd "todo list js"
python3 -m http.server 8000
# open http://localhost:8000/
```
2. Type a task in the input and press Enter to add it.
3. Click the checkbox to mark a task as completed (or press `U` when the task has focus).
4. Tab through tasks and press `D` to delete a focused task.
5. Use the `Clear` button at the top to remove all tasks (clears `localStorage`).

## ⚙️ Local storage and Data
- Tasks are saved to `localStorage` under `todo-tasks` as an array of objects.
- UI preferences (active filter and last focused task) are saved under `todo-prefs` as `{ filter, focusedId }`.
- Clearing the app via the `Clear` button removes `todo-tasks` from `localStorage`.

## Notes & Suggestions
- Accessibility: Add ARIA labels and keyboard navigation improvements (arrow keys) for better accessibility.
- Editing tasks: Implement an inline edit mode to update tasks in place.
- Sorting & Priority: Add fields for due dates and priority; allow drag-and-drop ordering.
- Export/Import: Add JSON export/import to save and restore tasks or move to another device.
- Undo: Add a soft delete with undo option when a task is removed.

## 👤 Author
**ISSAM SENSI**

---
© 2025 [issamsensi](https://github.com/issamsensi)

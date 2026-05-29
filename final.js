// Storage Key //
const STORAGE_KEY = "To-Do-List-Final-Project"

// DOM //
const toDoInput = document.getElementById("to-do-input");
const addBtn = document.getElementById("addBtn");
const clearBtn = document.getElementById("clearBtn")
const toDoList = document.getElementById("toDoList");
const toDoCount = document.getElementById("toDoCount");

// Load items from localStorage //
function loadToDo() {
const raw = localStorage.getItem(STORAGE_KEY);
return raw ? JSON.parse(raw) : [];
}

// Save items to localStorage //
function saveToDo(toDo) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toDo));
}

// Render To-Do list to page //
// function renderToDo() {
//     const toDo = loadToDo();
function renderToDo() {
    const toDo = loadToDo();

    toDoCount.textContent =
        toDo.length === 0
            ? "No items To-Do yet"
            : toDo.length === 1
            ? "1 To-Do item saved"
            : `${toDo.length} To-Do item saved`;

    if (toDo.length === 0) {
        toDoList.innerHTML =
            '<div class="empty-state"> 📝 No items on your To-Do list yet. Add your first item above! </div>';
        return;
    }

    toDoList.innerHTML = toDo.map(item => `
        <div class="toDo-card" data-id="${item.id}">

            <input 
                type="checkbox" 
                ${item.completed ? "checked" : ""}
                onchange="toggleComplete(${item.id})"
            >

            <div class="toDo-content">

                ${item.isEditing ? `
                    <input 
                        class="edit-input"
                        type="text"
                        value="${escapeHTML(item.text)}"
                        id="edit-${item.id}"
                    >
                ` : `
                    <p class="toDo-text ${item.completed ? "done" : ""}">
                        ${escapeHTML(item.text)}
                    </p>
                `}


            </div>

            ${item.isEditing ? `
                <button onclick="saveEdit(${item.id})">✔</button>
                <button onclick="cancelEdit(${item.id})">✖</button>
            ` : `
                <button onclick="editToDo(${item.id})">✎</button>
                <button onclick="deleteToDo(${item.id})">🗑</button>
            `}

        </div>
    `).join("");
}


// Check box //
function toggleComplete(id) {
    const toDo = loadToDo();

    const updated = toDo.map(item => {
        if (item.id === id) {
            return { ...item, completed: !item.completed };
        }
        return item;
    });

    saveToDo(updated);
    renderToDo();
}

// Create a To-Do item //
function addToDo() {
    const text = toDoInput.value.trim();
    if (text === "") {toDoInput.focus();
        toDoInput.placeholder = "Please write something!";
        return;
    }
    const newToDo = {
        id: Date.now(), 
        text: text,
        createdAt: new Date().toLocaleDateString("en-CA", {
            year: "numeric", month: "short", day: "numeric"
        }),
        completed: false,
        isEditing: false
    };
     const toDo = loadToDo();
    toDo.unshift(newToDo);
    saveToDo(toDo);
    toDoInput.value = "";
    toDoInput.placeholder = "Write your To-Do list item here...";
    renderToDo();
}

// // Edit a to-do item //
function editToDo(id) {
    const toDo = loadToDo();

    const updated = toDo.map(item =>
        item.id === id
            ? { ...item, isEditing: true }
            : item
    );

    saveToDo(updated);
    renderToDo();
}     

function saveEdit(id) {
    const input = document.getElementById(`edit-${id}`);
    const newText = input.value.trim();

    if (newText === "") return;

    const toDo = loadToDo();

    const updated = toDo.map(item =>
        item.id === id
            ? { ...item, text: newText, isEditing: false }
            : item
    );

    saveToDo(updated);
    renderToDo();
}

function cancelEdit(id) {
    const toDo = loadToDo();

    const updated = toDo.map(item =>
        item.id === id
            ? { ...item, isEditing: false }
            : item
    );

    saveToDo(updated);
    renderToDo();
}

// Delete a to-do item //
function deleteToDo(id) {
    const toDo = loadToDo();
    const updated = toDo.filter(item => item.id !== id);
    saveToDo(updated);
    renderToDo();
}

function clearAllToDo() {
    if (toDo_confirm()) {
        localStorage.removeItem(STORAGE_KEY);
        renderToDo();
    }
}
function toDo_confirm() {
    const toDo = loadToDo();
    if (toDo.length === 0) return false;
    return confirm(`Delete all ${toDo.length} To-Do list items? This cannot be undone.`);
}

// Connect Btn's & Action //
addBtn.addEventListener("click", addToDo);
clearBtn.addEventListener("click", clearAllToDo);

// Allows enter instead of clicking //
toDoInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addToDo();
    }
});

// Prevent XSS //
function escapeHTML(str) {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

renderToDo();
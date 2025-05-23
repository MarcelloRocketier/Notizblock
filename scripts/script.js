/**
 * The main notepad object that contains arrays for notes, trash, and archive.
 * @type {Object}
 * @property {Object[]} notes - The active notes.
 * @property {Object[]} trash - The notes in the trash.
 * @property {Object[]} archive - The archived notes.
 */
let notizblock = {
    notes: [],
    trash: [],
    archive: []
};

/**
 * Initializes the application.
 * Retrieves stored data from localStorage and renders all sections.
 * @returns {void}
 */
function init() {
    getFromLocalStorage();
    renderAll();
}

/**
 * Saves the current state of the notepad to localStorage.
 * @returns {void}
 */
function saveToLocalStorage() {
    localStorage.setItem("notizblock", JSON.stringify(notizblock));
}

/**
 * Retrieves the stored notepad data from localStorage and updates the notizblock object.
 * @returns {void}
 */
function getFromLocalStorage() {
    let storedData = JSON.parse(localStorage.getItem("notizblock"));
    if (storedData) {
        notizblock = storedData;
    }
}

/**
 * Renders all sections: active notes, archive, and trash.
 * @returns {void}
 */
function renderAll() {
    renderNotes();
    renderArchive();
    renderTrash();
}

/**
 * Renders all active notes into the element with id "content".
 * @returns {void}
 */
function renderNotes() {
    let contentRef = document.getElementById('content');
    contentRef.innerHTML = "";
    notizblock.notes.forEach((note, index) => {
        contentRef.innerHTML += getNoteTemplate(note, index);
    });
}

/**
 * Renders all archived notes into the element with id "archive_content".
 * @returns {void}
 */
function renderArchive() {
    let archiveRef = document.getElementById('archive_content');
    archiveRef.innerHTML = "";
    notizblock.archive.forEach((note, index) => {
        archiveRef.innerHTML += getArchivedNoteTemplate(note, index);
    });
}

/**
 * Renders all trashed notes into the element with id "trash_content".
 * @returns {void}
 */
function renderTrash() {
    let trashRef = document.getElementById('trash_content');
    trashRef.innerHTML = "";
    notizblock.trash.forEach((note, index) => {
        trashRef.innerHTML += getTrashNoteTemplate(note, index);
    });
}

/**
 * Returns the HTML template for an active note.
 *
 * @param {Object} note - The note object containing title and content.
 * @param {number} index - The index of the note in the active notes array.
 * @returns {string} HTML string representing the note.
 */
function getNoteTemplate(note, index) {
    return `
        <div class="note">
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <div class="note-actions">
                <button onclick="moveToTrash(${index})">🗑️</button>
                <button onclick="moveToArchive(${index})">📁</button>
            </div>
        </div>
    `;
}

/**
 * Returns the HTML template for an archived note.
 *
 * @param {Object} note - The archived note object.
 * @param {number} index - The index of the note in the archive array.
 * @returns {string} HTML string representing the archived note.
 */
function getArchivedNoteTemplate(note, index) {
    return `
        <div class="note">
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <div class="note-actions">
                <button onclick="restoreFromArchive(${index})">🔄</button>
                <button onclick="moveToTrashFromArchive(${index})">🗑️</button>
            </div>
        </div>
    `;
}

/**
 * Returns the HTML template for a trashed note.
 *
 * @param {Object} note - The trashed note object.
 * @param {number} index - The index of the note in the trash array.
 * @returns {string} HTML string representing the trashed note.
 */
function getTrashNoteTemplate(note, index) {
    return `
        <div class="note">
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <div class="note-actions">
                <button onclick="deleteTrash(${index})">❌</button>
            </div>
        </div>
    `;
}

/**
 * Adds a new note based on user input.
 * Stores the note in the active notes array and updates localStorage.
 * @returns {void}
 */
function addNote() {
    let titleInput = document.getElementById('title_input').value.trim();
    let contentInput = document.getElementById('note_input').value.trim();

    if (titleInput && contentInput) {
        notizblock.notes.push({ title: titleInput, content: contentInput });
        saveToLocalStorage();
        renderNotes();
    }

    document.getElementById('title_input').value = "";
    document.getElementById('note_input').value = "";
}

/**
 * Moves a note from the active notes to the trash.
 *
 * @param {number} index - The index of the note to be trashed.
 * @returns {void}
 */
function moveToTrash(index) {
    notizblock.trash.push(notizblock.notes[index]);
    notizblock.notes.splice(index, 1);
    saveToLocalStorage();
    renderAll();
}

/**
 * Moves a note from the archive to the trash.
 *
 * @param {number} index - The index of the archived note to be trashed.
 * @returns {void}
 */
function moveToTrashFromArchive(index) {
    notizblock.trash.push(notizblock.archive[index]);
    notizblock.archive.splice(index, 1);
    saveToLocalStorage();
    renderAll();
}

/**
 * Permanently deletes a note from the trash.
 *
 * @param {number} index - The index of the note to be deleted.
 * @returns {void}
 */
function deleteTrash(index) {
    notizblock.trash.splice(index, 1);
    saveToLocalStorage();
    renderTrash();
}

/**
 * Moves a note from the active notes to the archive.
 *
 * @param {number} index - The index of the note to be archived.
 * @returns {void}
 */
function moveToArchive(index) {
    notizblock.archive.push(notizblock.notes[index]);
    notizblock.notes.splice(index, 1);
    saveToLocalStorage();
    renderAll();
}

/**
 * Restores a note from the archive to the active notes.
 *
 * @param {number} index - The index of the note to be restored.
 * @returns {void}
 */
function restoreFromArchive(index) {
    notizblock.notes.push(notizblock.archive[index]);
    notizblock.archive.splice(index, 1);
    saveToLocalStorage();
    renderAll();
}

/* ------------------------------ */
/* Functions for Toggle & Darkmode */
/* ------------------------------ */

/**
 * Sets up the toggle for the cart (especially useful on mobile devices).
 * @returns {void}
 */
function setupCartToggle() {
    const cartEl = document.querySelector(".cart");
    const toggleBtn = document.getElementById("cart-toggle");
    toggleBtn.onclick = () => {
        cartEl.classList.toggle("open");
    };
}

/**
 * Initializes dark mode functionality.
 * Reads the dark mode status from localStorage and sets up the toggle.
 * @returns {void}
 */
function setupDarkmode() {
    const toggleBtn = document.getElementById("darkmode-toggle");
    const savedMode = localStorage.getItem("darkmode");

    if (savedMode === "on") {
        document.body.classList.add("darkmode");
    }

    toggleBtn.onclick = () => {
        document.body.classList.toggle("darkmode");
        const isDark = document.body.classList.contains("darkmode");
        localStorage.setItem("darkmode", isDark ? "on" : "off");
    };
}

/* ------------------------------ */
/* Helper Functions (Refactoring) */
/* ------------------------------ */

/**
 * Sorts an array of items based on the given sort value.
 *
 * @param {Array<Object>} items - The items to sort.
 * @param {string} sortValue - The sort criteria ("price-asc", "price-desc", "name-asc", "name-desc").
 * @returns {Array<Object>} The sorted items.
 */
function sortItems(items, sortValue) {
    switch (sortValue) {
        case "price-asc":
            return items.sort((a, b) => a.price - b.price);
        case "price-desc":
            return items.sort((a, b) => b.price - a.price);
        case "name-asc":
            return items.sort((a, b) => a.name.localeCompare(b.name));
        case "name-desc":
            return items.sort((a, b) => b.name.localeCompare(a.name));
        default:
            return items;
    }
}

/**
 * Generates the HTML for the order summary.
 *
 * @param {string} name - The customer's name.
 * @param {string} address - The customer's address.
 * @param {string} note - An optional note.
 * @param {Array<Object>} cart - The current cart array.
 * @returns {string} The HTML string for the order summary.
 */
function getOrderSummaryHTML(name, address, note, cart) {
    const summary = cart.map(item =>
        `${item.name} x ${item.quantity} = ${(item.price * item.quantity).toFixed(2)} €`
    ).join("<br>");
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return `
        <strong>Name:</strong> ${name}<br>
        <strong>Address:</strong> ${address}<br><br>
        <strong>Order:</strong><br>${summary}<br><br>
        <strong>Total:</strong> ${total.toFixed(2)} €<br>
        <strong>Note:</strong> ${note || "-"}
    `;
}

/**
 * Sets up the event listener for the sort dropdown.
 * @returns {void}
 */
function setupSortListener() {
    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
        sortSelect.onchange = () => {
            const activeFilterBtn = document.querySelector("#filter-buttons button.active");
            const activeCategory = activeFilterBtn ? activeFilterBtn.textContent : "Alle";
            renderMenu(activeCategory);
        };
    }
}

/* ------------------------------ */
/* Initialization */
/* ------------------------------ */

/**
 * Initializes the application on page load, setting up filters, menu, cart, and dark mode.
 * @returns {void}
 */
function initApp() {
    renderFilters();
    renderMenu();
    renderCart();

    const submitBtn = document.getElementById("submit-order");
    if (submitBtn) submitBtn.onclick = submitOrder;

    const orderBtn = document.getElementById("order-button");
    if (orderBtn) orderBtn.onclick = handleOrder;

    setupSortListener();
    setupCartToggle();
    setupDarkmode();
}

// Expose functions to global scope for inline HTML usage
window.closeOrderModal = closeOrderModal;
window.addToCart = addToCart;
window.changeQuantity = changeQuantity;
window.removeFromCart = removeFromCart;

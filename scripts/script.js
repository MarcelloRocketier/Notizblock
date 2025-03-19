let notizblock = {
    notes: [],
    trash: [],
    archive: []
};

function init() {
    getFromLocalStorage();
    renderAll();
}

function saveToLocalStorage() {
    localStorage.setItem("notizblock", JSON.stringify(notizblock));
}

function getFromLocalStorage() {
    let storedData = JSON.parse(localStorage.getItem("notizblock"));
    if (storedData) {
        notizblock = storedData;
    }
}

function renderAll() {
    renderNotes();
    renderArchive();
    renderTrash();
}

function renderNotes() {
    let contentRef = document.getElementById('content');
    contentRef.innerHTML = "";
    notizblock.notes.forEach((note, index) => {
        contentRef.innerHTML += getNoteTemplate(note, index);
    });
}

function renderArchive() {
    let archiveRef = document.getElementById('archive_content');
    archiveRef.innerHTML = "";
    notizblock.archive.forEach((note, index) => {
        archiveRef.innerHTML += getArchivedNoteTemplate(note, index);
    });
}

function renderTrash() {
    let trashRef = document.getElementById('trash_content');
    trashRef.innerHTML = "";
    notizblock.trash.forEach((note, index) => {
        trashRef.innerHTML += getTrashNoteTemplate(note, index);
    });
}

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

function moveToTrash(index) {
    notizblock.trash.push(notizblock.notes[index]);
    notizblock.notes.splice(index, 1);
    saveToLocalStorage();
    renderAll();
}

function moveToTrashFromArchive(index) {
    notizblock.trash.push(notizblock.archive[index]);
    notizblock.archive.splice(index, 1);
    saveToLocalStorage();
    renderAll();
}

function deleteTrash(index) {
    notizblock.trash.splice(index, 1);
    saveToLocalStorage();
    renderTrash();
}

function moveToArchive(index) {
    notizblock.archive.push(notizblock.notes[index]);
    notizblock.notes.splice(index, 1);
    saveToLocalStorage();
    renderAll();
}

function restoreFromArchive(index) {
    notizblock.notes.push(notizblock.archive[index]);
    notizblock.archive.splice(index, 1);
    saveToLocalStorage();
    renderAll();
}

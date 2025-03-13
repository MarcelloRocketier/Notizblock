let notesTitles = [];
let notes = [];

let archiveNotesTitles = [];  
let archiveNotes = [];

let trashNotesTitles = [];
let trashNotes = [];

function init() {
    getFromLocalStorage();
    renderNotes();
    renderArchive();
    renderTrashNotes();
}

function saveToLocalStorage() {
    localStorage.setItem("notesTitles", JSON.stringify(notesTitles));
    localStorage.setItem("notes", JSON.stringify(notes));
    localStorage.setItem("trashNotesTitles", JSON.stringify(trashNotesTitles));
    localStorage.setItem("trashNotes", JSON.stringify(trashNotes));
}

function getFromLocalStorage() {
    notesTitles = JSON.parse(localStorage.getItem("notesTitles")) || [];
    notes = JSON.parse(localStorage.getItem("notes")) || [];
    trashNotesTitles = JSON.parse(localStorage.getItem("trashNotesTitles")) || [];
    trashNotes = JSON.parse(localStorage.getItem("trashNotes")) || [];
}

function renderNotes() {
    let contentRef = document.getElementById('content');
    contentRef.innerHTML = "";
    for (let i = 0; i < notes.length; i++) {
        contentRef.innerHTML += getNoteTemplate(i);
    }
}

function renderTrashNotes() {
    let trashContentRef = document.getElementById('trash_content');
    trashContentRef.innerHTML = "";
    for (let i = 0; i < trashNotes.length; i++) {
        trashContentRef.innerHTML += getTrashNoteTemplate(i);
    }
}

function getNoteTemplate(index) {
    return `
        <div class="note">
            <h3>${notesTitles[index]}</h3>
            <p>${notes[index]}</p>
            <button class="btn" onclick="moveToTrash(${index})">X</button>
        </div>
    `;
}

function getTrashNoteTemplate(index) {
    return `
        <div class="note">
            <h3>${trashNotesTitles[index]}</h3>
            <p>${trashNotes[index]}</p>
            <button class="btn" onclick="deleteTrash(${index})">X</button>
        </div>
    `;
}

function addNote() {
    let titleInput = document.getElementById('title_input').value.trim();
    let contentInput = document.getElementById('note_input').value.trim();

    if (titleInput && contentInput) {
        notesTitles.push(titleInput);
        notes.push(contentInput);
        saveToLocalStorage();
        renderNotes();
    }

    document.getElementById('title_input').value = "";
    document.getElementById('note_input').value = "";
}

function moveToTrash(index) {
    trashNotesTitles.push(notesTitles[index]);
    trashNotes.push(notes[index]);
    notesTitles.splice(index, 1);
    notes.splice(index, 1);
    saveToLocalStorage();
    renderNotes();
    renderTrashNotes();
}

function deleteTrash(index) {
    trashNotesTitles.splice(index, 1);
    trashNotes.splice(index, 1);
    saveToLocalStorage();
    renderTrashNotes();
}

function moveToArchive(indexNote) {
    let archivedNote = notes.splice(indexNote, 1)[0]; 
    let archivedTitle = notesTitles.splice(indexNote, 1)[0];

    archiveNotes.push(archivedNote);
    archiveNotesTitles.push(archivedTitle);

    renderNotes();
    renderArchive();
}

function restoreFromArchive(indexArchive) {
    let restoredNote = archiveNotes.splice(indexArchive, 1)[0];
    let restoredTitle = archiveNotesTitles.splice(indexArchive, 1)[0];

    notes.push(restoredNote);
    notesTitles.push(restoredTitle);

    renderNotes();
    renderArchive();
}

function getNoteTemplate(indexNote) {
    return `
        <div class="note-card">
            <h3>${notesTitles[indexNote]}</h3>
            <p>${notes[indexNote]}</p>
            <div class="note-actions">
                <button onclick="moveToTrash(${indexNote})">🗑️</button>
                <button onclick="moveToArchive(${indexNote})">📁</button>
            </div>
        </div>
    `;
}

function renderArchive() {
    let archiveRef = document.getElementById('archive_content');
    archiveRef.innerHTML = "";

    for (let indexArchive = 0; indexArchive < archiveNotes.length; indexArchive++) {
        archiveRef.innerHTML += `
            <div class="note-card">
                <h3>${archiveNotesTitles[indexArchive]}</h3>
                <p>${archiveNotes[indexArchive]}</p>
                <div class="note-actions">
                    <button onclick="restoreFromArchive(${indexArchive})">🔄</button>
                    <button onclick="moveToTrashFromArchive(${indexArchive})">🗑️</button>
                </div>
            </div>
        `;
    }
}

function moveToTrashFromArchive(indexArchive) {
    let trashNote = archiveNotes.splice(indexArchive, 1)[0];
    let trashTitle = archiveNotesTitles.splice(indexArchive, 1)[0];

    trashNotes.push(trashNote);
    trashNotesTitles.push(trashTitle);

    renderArchive();
    renderTrashNotes();
}

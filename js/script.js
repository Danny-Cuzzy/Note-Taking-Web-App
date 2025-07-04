const createNote = document.getElementById('createNote');
const titleList = document.getElementById('titleList');
const form = document.getElementById('form');
const titleInput = document.getElementById('titleInput');
const noteInput = document.getElementById('noteInput');
const archiveBtn = document.getElementById('archiveBtn');
const deleteBtn = document.getElementById('deleteBtn');

let modal = document.getElementById("myModal");
let span = document.getElementsByClassName("close")[0];

let currentNoteIndex = null;
let showArchived = false;

// Modal functionality
createNote.onclick = function() {
  modal.style.display = "block";
}

// Close the modal when the user clicks on <span> (x)
span.onclick = function() {
  modal.style.display = "none";
};

// Close the modal when the user clicks anywhere outside of the modal
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  };
};


// Load notes from localStorage
function getNotes() {
  return JSON.parse(localStorage.getItem("notes")) || [];
}

function saveNotes(notes) {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function addText() {
  const notes = getNotes();
  titleList.innerHTML = "";
  

  notes.forEach((note, index) => {
    if (!note.archived || showArchived) {
      let li = document.createElement("li");
      li.innerHTML = `
        <button class="buttonList ${note.archived ? 'archived' : ''}">${note.title}</button>
      `;

      // View Note
      li.querySelector('.buttonList').addEventListener('click', (e) => {
        e.preventDefault();
        currentNoteIndex = index;
        const previousItems = form.querySelectorAll("textarea");
        previousItems.forEach(el => el.remove());

        const textarea = document.createElement("textarea");
        textarea.value = note.content;
        textarea.addEventListener('input', () => {
          note.content = textarea.value;
          saveNotes(notes);
        });
        form.appendChild(textarea);
      });

      titleList.appendChild(li);

    }
  });
}

// Add a new note
function addNote() {
  event.preventDefault();
  const title = titleInput.value.trim();
  const content = noteInput.value.trim();
  if (title === "" || content === "") return;

  const notes = getNotes();
  notes.push({ title, content, archived: false });
  saveNotes(notes);

  titleInput.value = "";
  noteInput.value = "";

  addText();
}

// Toggle showing archived notes
function toggleArchived(e) {
  e.preventDefault();
  showArchived = !showArchived;
  e.target.textContent = showArchived ? "Hide Archived Notes" : "Show Archived Notes";
  addText();
}

// Handle Archive/Unarchive with global button
archiveBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (currentNoteIndex !== null) {
    const notes = getNotes();
    notes[currentNoteIndex].archived = !notes[currentNoteIndex].archived;
    saveNotes(notes);
    currentNoteIndex = null;
    const textarea = form.querySelector("textarea");
    if (textarea) textarea.remove();
    addText();
  } else {
    alert('Select a note to archive/unarchive.');
  }
});


// Handle Delete with global button
deleteBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (currentNoteIndex !== null) {
    const notes = getNotes();
    if (confirm("Are you sure you want to delete this note?")) {
      notes.splice(currentNoteIndex, 1);
      saveNotes(notes);
      currentNoteIndex = null;
      const textarea = form.querySelector("textarea");
      if (textarea) textarea.remove();
      addText();
    }
  } else {
    alert('Select a note to delete.');
  }
});

addText();


let noteTitle;
let noteText;
let saveButton;
let newButton;
let notesAll;

if (window.location.pathname === '/notes') {
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveButton = document.querySelector('.save-note');
  newButton = document.querySelector('.new-note');
  notesAll = document.querySelectorAll('.list-container .list-group');
}


const show = (elem) => {
  elem.style.display = 'inline';
};


const hide = (elem) => {
  elem.style.display = 'none';
};


let currentNote = {};

const getAllNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });


const rendercurrentNote = () => {
  hide(saveButton);

  if (currentNote.id) {
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = currentNote.title;
    noteText.value = currentNote.text;
  } else {
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  };
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    rendercurrentNote();
  });
};




const handleNoteView = (e) => {
  e.preventDefault();
  currentNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  rendercurrentNote();
};


const handleNewNoteView = (e) => {
  currentNote = {};
  rendercurrentNote();
};

const handleRenderSaveBtn = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveButton);
  } else {
    show(saveButton);
  }
};


const rendernotesAll = async (notes) => {
  let jsonNotes = await notes.json();
  if (window.location.pathname === '/notes') {
    notesAll.forEach((el) => (el.innerHTML = ''));
  }

  let notesAllItems = [];


  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);

    liEl.append(spanEl);

    

    return liEl;
  };

  if (jsonNotes.length === 0) {
    notesAllItems.push(createLi('No notes', false));
  }

  jsonNotes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);

    notesAllItems.push(li);
  });

  if (window.location.pathname === '/notes') {
    notesAllItems.forEach((note) => notesAll[0].append(note));
  }
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => getAllNotes().then(rendernotesAll);

if (window.location.pathname === '/notes') {
  saveButton.addEventListener('click', handleNoteSave);
  newButton.addEventListener('click', handleNewNoteView);
  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteText.addEventListener('keyup', handleRenderSaveBtn);
}

getAndRenderNotes();

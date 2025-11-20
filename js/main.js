window.onload = () => {
  'use strict';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
  }

  scrollToEnd();

  loadFromLocalStorage();

  document.addEventListener('keydown', handleKeyPress);

  const fileInput = document.querySelector('input');

  let loadedFilename = '';

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    const reader = new FileReader();

    const input = document.querySelector('pre.input');
    const filename = document.querySelector('span.filename');

    reader.addEventListener('load', () => {
      loadedFilename = file.name;

      filename.innerText = loadedFilename;

      input.innerText = reader.result;
    });

    if (file) {
      reader.readAsText(file);
    }
  });

  const newAction = document.querySelector('#new-action');

  newAction.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    const input = document.querySelector('pre.input');
    const filename = document.querySelector('span.filename');

    loadedFilename = '';

    input.innerText = '';

    filename.innerText = '';

    saveToLocalStorage();
  });

  const loadAction = document.querySelector('#load-action');

  loadAction.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    fileInput.click();
  });

  const saveAction = document.querySelector('#save-action');

  saveAction.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    const input = document.querySelector('pre.input');

    const link = document.createElement('a');

    link.setAttribute('download', loadedFilename || `${currentTimestamp()}.txt`);
    link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(input.innerText));
    link.click();
  });

  const copyAction = document.querySelector('#copy-action');

  copyAction.addEventListener('click', (event) => {
    event.preventDefault();

    const input = document.querySelector('pre.input');

    navigator.clipboard.writeText(input.innerText);
  });
};

function handleKeyPress(e) {
  e.preventDefault();

  scrollToEnd();

  const input = document.querySelector('pre.input');
  const currentText = input.innerText;

  switch(e.key) {
    case 'Alt':
    case 'ArrowDown':
    case 'ArrowLeft':
    case 'ArrowRight':
    case 'ArrowUp':
    case 'CapsLock':
    case 'Control':
    case 'Delete':
    case 'End':
    case 'Escape':
    case 'F1':
    case 'F2':
    case 'F3':
    case 'F4':
    case 'F5':
    case 'F6':
    case 'F7':
    case 'F8':
    case 'F9':
    case 'F10':
    case 'F11':
    case 'F12':
    case 'Home':
    case 'Insert':
    case 'Meta':
    case 'OS':
    case 'PageUp':
    case 'PageDown':
    case 'PrintScreen':
    case 'Shift':
    case 'WakeUp':
      return;

    case 'Backspace':
      input.innerText = input.innerText.substring(0, input.innerText.length - 1);
      break;

    case 'Enter':
      input.innerText = currentText + '\n';
      break;

    default:
      input.innerText = currentText + e.key;
      break;
  }

  saveToLocalStorage();

  const cursor = document.querySelector('pre.cursor');

  cursor.classList.remove('blink');
  cursor.clientWidth;
  cursor.classList.add('blink');
}

function scrollToEnd() {
  window.scrollTo(0, document.body.scrollHeight);
}

function loadFromLocalStorage() {
  const input = document.querySelector('pre.input');
  const filename = document.querySelector('span.filename');

  filename.innerText = localStorage.getItem('filename') || '';

  input.innerText = localStorage.getItem('input') || '';
}

function saveToLocalStorage() {
  const input = document.querySelector('pre.input');
  const filename = document.querySelector('span.filename');

  localStorage.setItem('filename', filename.innerText || '');
  localStorage.setItem('input', input.innerText || '');
}

function currentTimestamp() {
  const date = new Date();
  const isoString = date.toISOString();

  const timestamp = isoString.substring(0, 19).replace(/[-:T]/g, '');

  return timestamp;
}

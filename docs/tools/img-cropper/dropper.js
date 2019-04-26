const dropArea = document.querySelector('.drop');
const imgContainer = document.querySelector('.src-img-container');
const origImg = document.querySelector('.src-img-container img');

function onDragEnter(e) {
  dropArea.setAttribute('drag-over', '');

  window.addEventListener('dragend', function onDragEnd(e) {
    window.removeEventListener('dragend');
    dropArea.removeAttribute('drag-over');
  });

  e.stopPropagation();
  e.preventDefault();
}

function onDragOver(e) {
  e.stopPropagation();
  e.preventDefault();
}

function onDragLeave(e) {
  if (e.target == dropArea || !dropArea.contains(e.target)) {
    dropArea.removeAttribute('drag-over');
  }


  e.stopPropagation();
  e.preventDefault();
}

function onDrop(e) {
  dropArea.removeAttribute('drag-over');

  e.stopPropagation();
  e.preventDefault();

  const dt = e.dataTransfer;
  const url = dt.getData('URL');
  if (url) {
    updateSrc(url);
  } else if (dt.files) {
    [...dt.files]
      .filter(f => f.type.startsWith('image/'))
      .filter((f, i) => i == 0)
      .forEach(f => {
        readImg(f);
      });
  }

  return false;
}

function updateSrc(src) {
  origImg.src = src;
  window.dispatchEvent(new CustomEvent('img-change'));
}

function readImg(file) {
  const reader = new FileReader();
  reader.onload = function(){
    const dataUrl = reader.result;
    updateSrc(dataUrl);
  };
  reader.readAsDataURL(file);
}

dropArea.addEventListener('dragenter', onDragEnter, true);
dropArea.addEventListener('dragover', onDragOver, true);
dropArea.addEventListener('dragleave', onDragLeave, true);
dropArea.addEventListener('drop', onDrop, true);

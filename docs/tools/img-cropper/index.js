import './dragger.js';
import './dropper.js';
import {prepareImageAnimation} from '../../../dist/animations.mjs';

const imgContainer = document.querySelector('.src-img-container');
const origImg = document.querySelector('.target');
const imgCrop = document.querySelector('.crop');
const sizer = document.querySelector('.sizer');
const croppedImg = document.querySelector('.crop img');
let selectedWidth = 96;
let renderedWidth = "96px";
let useSelectedWidth = true;
let coords = {};

function getWidth() {
  if (useSelectedWidth) {
    return `${selectedWidth}px`;
  }

  return renderedWidth;
}

function updateImgCropWidth() {
  imgCrop.style.width = getWidth();
}

function updateGeneratedAmpCode(width, height, transform) {
  const cssCode = `
amp-img img {
  transform: var(--img-transform);
  transform-origin: top left;
}`.slice(1);

  const htmlCode = `
<amp-img layout="responsive" width="${width}" height="${height}"
  src="…"
  style="width: ${getWidth()}; --img-transform: ${transform}">
</amp-img>`.slice(1);

  document.querySelector('.amp-markup .css').textContent = cssCode;
  document.querySelector('.amp-markup .html').textContent = htmlCode;
}


function updateGeneratedHtmlCode(paddingBottom, transform) {
  const cssCode = `
.crop {
  position: relative;
  overflow: hidden;
}

.crop > img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-origin: top left;
}`.slice(1);

  const htmlCode = `
<div class="crop" style="width: ${getWidth()}">
  <div style="padding-bottom: ${paddingBottom}"></div>
  <img src="…" style="transform: ${transform}">
</div>`.slice(1);

  document.querySelector('.html-markup .css').textContent = cssCode;
  document.querySelector('.html-markup .html').textContent = htmlCode;
}

function updateSelection() {
  const {
    top,
    left,
    width,
    height,
  } = coords;

  const origRect = origImg.getBoundingClientRect();
  const widthRatio = origRect.width / width;
  const heightRatio = origRect.height / height;
  const aspectRatio = 100 * (height / width);

  const yDelta = top / origRect.height;
  const yTranslate = 100 * yDelta;
  const xDelta = left / origRect.width;
  const xTranslate = 100 * xDelta;

  const paddingBottom = `${aspectRatio.toFixed(4)}%`;
  const scale = `scale(${widthRatio.toFixed(4)}, ${heightRatio.toFixed(4)})`;
  const translate = `translate(-${xTranslate.toFixed(4)}%, -${yTranslate.toFixed(4)}%)`;
  const transform = `${scale} ${translate}`;

  sizer.style.paddingBottom = paddingBottom;
  croppedImg.style.transform = transform;
  selectedWidth = width;

  updateGeneratedHtmlCode(paddingBottom, transform);
  updateGeneratedAmpCode(width, height, transform);
  updateImgCropWidth();
}

window.addEventListener('area-selected', event => {
  croppedImg.src = origImg.src;
  coords = event.detail;
  updateSelection();
});

window.adjustWidth = function(newWidth) {
  renderedWidth = newWidth;
  updateSelection();
};

window.useSelectedWidth = function(value) {
  useSelectedWidth = value;
  updateSelection();
};

window.playAnimation = function() {
  const animation = prepareImageAnimation({
    srcImg: croppedImg,
    srcCropRect: imgCrop.getBoundingClientRect(),
    targetImg: origImg,
    styles: {
      animationDuration: '1000ms',
    },
  });

  imgContainer.style.visibility = 'hidden';
  croppedImg.style.visibility = 'hidden';
  animation.applyAnimation();
  requestAnimationFrame(() => {
    setTimeout(() => {
      setTimeout(() => {
        imgContainer.style.visibility = 'visible';
        croppedImg.style.visibility = 'visible';
        animation.cleanupAnimation();
      }, 1000);
    });
  });
};

window.updateOutputFormat = function(event) {
  const isAmp = event.target.id == 'ampHtml';
  const query = isAmp ? '?output=amp' : '';
  const url = location.origin + location.pathname + query;
  history.replaceState({}, '', url);
}

const ampOutput = location.search.includes('output=amp');
if (ampOutput) {
  document.querySelector('#ampHtml').checked = true;
}
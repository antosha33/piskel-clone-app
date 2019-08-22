import { getCtx } from '../utils/utils';


export default class Frames {
  constructor(size) {
    this.canvasSize = size;
    this.addFrame();
    this.drawPreview();
    this.frameManager();
  }

  set cnvSize(newSize) {
    this.canvasSize = newSize;
  }

  drawPreview(el, fromLocal = true) {
    const canv = document.getElementById('canvas-overlay');
    const frameContainer = document.getElementById('frame-container');
    const preview = frameContainer.children[frameContainer.children.length - 1].children[0];
    let ctxpreview;
    if (el) {
      ctxpreview = el.children[0].getContext('2d');
    } else {
      ctxpreview = preview.getContext('2d');
    }
    const newframeButton = document.getElementById('new-frame');
    const moveListener = () => {
      ctxpreview.clearRect(0, 0, this.canvasSize, this.canvasSize);
      ctxpreview.drawImage(canv, 0, 0);
    };
    const clickListener = () => {
      ctxpreview.clearRect(0, 0, this.canvasSize, this.canvasSize);
      ctxpreview.drawImage(canv, 0, 0);
    };
    const mousedownListener = () => {
      ctxpreview.clearRect(0, 0, this.canvasSize, this.canvasSize);
      ctxpreview.drawImage(canv, 0, 0);
    };


    canv.addEventListener('mousemove', moveListener);
    canv.addEventListener('click', clickListener);
    canv.addEventListener('mousedown', mousedownListener);


    frameContainer.addEventListener('mousedown', () => {
      canv.removeEventListener('mousemove', moveListener);
      canv.removeEventListener('click', clickListener);
      canv.removeEventListener('mousedown', mousedownListener);
    });

    newframeButton.addEventListener('click', () => {
      canv.removeEventListener('mousemove', moveListener);
      canv.removeEventListener('click', clickListener);
      canv.removeEventListener('mousedown', mousedownListener);
    });

    if (localStorage.getItem('currentState') && fromLocal) {
      canv.removeEventListener('mousemove', moveListener);
      canv.removeEventListener('click', clickListener);
      canv.removeEventListener('mousedown', mousedownListener);
    }
  }

  frameManager() {
    const frames = document.getElementById('frame-container');
    frames.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete')) {
        const canv = e.target.parentNode.parentNode.children[0];
        const ctx = canv.getContext('2d');
        this.delFrame(frames, canv, ctx, e);
      } else if (e.target.classList.contains('copy')) {
        this.copyFrame(frames, e);
      }
    });
    frames.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('drag')) {
        e.target.parentNode.parentNode.setAttribute('draggable', 'true');
        this.dragFrame();
      }
    });
  }

  addFrame() {
    const newframeButton = document.getElementById('new-frame');
    const mainCanvas = document.getElementById('canvas-overlay');
    const mainCtx = mainCanvas.getContext('2d');
    newframeButton.addEventListener('click', () => {
      const frameContainer = document.getElementById('frame-container');
      const arrOfFrames = Array.from(frameContainer.children);
      const frame = document.createElement('div');
      frame.setAttribute('class', 'preview-canvas canvas-preview-item');
      frame.innerHTML = `<canvas width="${this.canvasSize}" height="${this.canvasSize}"></canvas>
      <div class="frame-manager">
        <div class="delete"></div>
        <div class="copy"></div>
        <div class="drag"></div>
      </div>`;
      frameContainer.appendChild(frame);
      mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
      this.stateIsChanged = true;
      this.activeFrame(frame, arrOfFrames, false);
      this.framePicker();
    });
  }

  delFrame(frames, canv, ctx, e) {
    const arr = Array.from(frames.children);
    if (arr.length > 1) {
      arr.forEach((it, index) => {
        if (it === e.target.parentNode.parentNode) {
          let ind;
          if (index === frames.children.length - 1) {
            ind = index - 1;
          } else {
            ind = index + 1;
          }
          it.remove();
          this.activeFrame(arr[ind], arr, false);
        }
      });
    }
  }

  framePicker() {
    const frames = document.getElementById('frame-container');
    const arr = Array.from(frames.children);
    frames.addEventListener('click', (e) => {
      if (e.target.parentNode.classList.contains('preview-canvas')) {
        this.activeFrame(e.target.parentNode, arr, false);
      }
    });
  }

  activeFrame(el, frames, fromLocal = true) {
    const { ctx } = getCtx('canvas-overlay');
    const prevCtx = el.children[0];
    if (prevCtx.tagName === 'CANVAS') {
      frames.forEach((it) => {
        /* eslint no-param-reassign: ["error", { "props": false }] */
        it.style.borderColor = 'grey';
      });
      el.style.borderColor = 'yellow';
      ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);
      ctx.drawImage(prevCtx, 0, 0);
      this.drawPreview(el, fromLocal);
    }
  }

  copyFrame(frames, e) {
    const arr = Array.from(frames.children);
    arr.reduce((el, current, index) => {
      if (current === e.target.parentNode.parentNode) {
        const frameCanv = e.target.parentNode.parentNode;
        const copy = frameCanv.cloneNode(true);
        const canvForCopy = e.target.parentNode.parentNode.children[0];
        const ctxCopy = copy.children[0].getContext('2d');
        ctxCopy.drawImage(canvForCopy, 0, 0);
        frames.insertBefore(copy, frames.children[index + 1]);
        this.activeFrame(copy, arr, false);
      }
      return el;
    }, 0);
    this.framePicker();
  }

  dragFrame() {
    const frames = document.getElementsByClassName('canvas-preview-item');
    const arr = Array.from(frames);
    let dragStartCanv = null;
    function handleDragStart(ev) {
      ev.dataTransfer.effectAllowed = 'move';
      ev.target.style.opacity = '0.2';
      [dragStartCanv] = [ev.target.children[0]];
    }

    function handleDragOver(evt) {
      evt.preventDefault();
    }

    function handleDragEnter(evt) {
      evt.stopPropagation();
    }

    function handleDragLeave() {
    }

    const handleDrop = (evt) => {
      evt.preventDefault();
      if (evt.target.parentNode.children[0].tagName === 'CANVAS' || evt.target.parentNode.children[0].tagName === 'DIV') {
        const canvForRaplace = evt.target.parentNode.children[0].tagName === 'CANVAS' ? evt.target.parentNode.children[0] : evt.target.parentNode.parentNode.children[0];
        const ctx = canvForRaplace.getContext('2d');
        const tempCanvas = document.createElement('canvas');
        tempCanvas.setAttribute('width', this.canvasSize);
        tempCanvas.setAttribute('height', this.canvasSize);
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.drawImage(canvForRaplace, 0, 0);
        ctx.clearRect(0, 0, canvForRaplace.width, canvForRaplace.height);
        ctx.drawImage(dragStartCanv, 0, 0);
        const dragStartCtx = dragStartCanv.getContext('2d');
        const mainOverlay = document.getElementById('canvas-overlay');
        const ctxMain = mainOverlay.getContext('2d');
        ctxMain.clearRect(0, 0, mainOverlay.width, mainOverlay.height);
        ctxMain.drawImage(dragStartCanv, 0, 0);
        dragStartCtx.clearRect(0, 0, dragStartCanv.width, dragStartCanv.height);
        dragStartCtx.drawImage(tempCanvas, 0, 0);
        evt.target.parentNode.parentNode.setAttribute('draggable', 'false');
        dragStartCanv.parentNode.setAttribute('draggable', 'false');
        this.activeFrame(evt.target.parentNode, arr, false);
      }
    };

    function handleDragEnd(ev) {
      ev.stopPropagation();
      ev.target.style.opacity = '1';
    }

    Array.prototype.forEach.call(frames, (el) => {
      el.addEventListener('dragstart', handleDragStart);
      el.addEventListener('dragenter', handleDragEnter);
      el.addEventListener('dragover', handleDragOver);
      el.addEventListener('dragleave', handleDragLeave);
      el.addEventListener('drop', handleDrop);
      el.addEventListener('dragend', handleDragEnd);
    });
  }
}

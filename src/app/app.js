import LZW from '../assets/animation/LZWEncoder';
import Neu from '../assets/animation/NeuQuant';
import b64 from '../assets/animation/base64';
import Tools from './tools/tools';


export default class App {
  constructor() {
    this.frames = [];
    this.canvasSize = '32'
    this.stateIsChanged = false;
    App.startAnimation();
    this.frameManager();
    App.fullScreen();
    this.state = localStorage.getItem('currentState');
    this.flag = false;
    App.exportToGif();
    this.tools = new Tools();
    this.drawPreview();
  }

  drawPreview() {
    console.log(this.tools.size);
    const canv = document.getElementById('canvas-overlay');
    const frameContainer = document.getElementById('frame-container');
    const preview = frameContainer.children[frameContainer.children.length - 1].children[0];
    const ctxpreview = preview.getContext('2d');
    const newframeButton = document.getElementById('new-frame');
    ctxpreview.clearRect(0, 0,this.canvasSize,this.canvasSize);
    const moveListener = () => {
      ctxpreview.clearRect(0, 0,this.canvasSize, this.canvasSize);
      ctxpreview.drawImage(canv, 0, 0);
    }
    const clickListener = () => {
      ctxpreview.clearRect(0, 0, this.canvasSize, this.canvasSize);
      ctxpreview.drawImage(canv, 0, 0);
    }
    const mousedownListener = () => {
      ctxpreview.clearRect(0, 0, this.canvasSize, this.canvasSize);
      ctxpreview.drawImage(canv, 0, 0);
    }
    canv.addEventListener('mousemove', moveListener);
    canv.addEventListener('click', clickListener);
    canv.addEventListener('mousedown', mousedownListener);

    newframeButton.addEventListener('click', () => {
      canv.removeEventListener('mousemove', moveListener);
      canv.removeEventListener('click', clickListener);
      canv.removeEventListener('mousedown', mousedownListener);
    });
    frameContainer.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('drag')) {
        canv.removeEventListener('mousemove', moveListener);
        canv.removeEventListener('click', clickListener);
        canv.removeEventListener('mousedown', mousedownListener);
        this.drawPreview();
      }
    });
    if (this.state !== null && this.flag === false) {
      canv.removeEventListener('mousemove', moveListener);
      canv.removeEventListener('click', clickListener);
      canv.removeEventListener('mousedown', mousedownListener);
    }
  }

  addFrame() {
    const newframeButton = document.getElementById('new-frame');
    const frameContainer = document.getElementById('frame-container');
    const mainCanvas = document.getElementById('canvas-overlay');
    const mainCtx = mainCanvas.getContext('2d');
    newframeButton.addEventListener('click', () => {
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
      this.drawPreview(true);
    });
  }

  static startAnimation() {
    let i = 0;
    const framesElement = document.getElementById('frame-container').children;
    function animate() {
      setInterval(() => {
        const arrayFrames = Array.from(framesElement);
        const canv = arrayFrames[i % arrayFrames.length].children[0];
        const animationCanvas = document.getElementById('animation-canvas');
        const animationCanvasCtx = animationCanvas.getContext('2d');
        animationCanvasCtx.clearRect(0, 0, 704, 704);
        animationCanvasCtx.drawImage(canv, 0, 0);
        i += 1;
      }, 1000 / 5);
    }
    animate();
  }

  frameManager() {
    const frames = document.getElementById('frame-container');
    const canv = document.getElementById('canvas-overlay');
    const ctx = canv.getContext('2d');
    frames.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete')) {
        this.delFrame(frames, canv, ctx, e);
      } else if (e.target.classList.contains('copy')) {
        this.copyFrame(frames, e);
      }
    });
    frames.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('drag')) {
        e.target.parentNode.parentNode.setAttribute('draggable', 'true');
        App.dragFrame();
      }
    });
  }

  delFrame(frames, canv, ctx, e) {
    const arr = Array.from(frames.children);
    if (arr.length > 1) {
      arr.reduce((el, current, index) => {
        if (current === e.target.parentNode.parentNode) {
          const frameCanv = arr[index - 1].children[0];
          ctx.clearRect(0, 0, canv.width, canv.height);
          ctx.drawImage(frameCanv, 0, 0);
        }
        e.target.parentNode.parentNode.remove();
        return el;
      });
      this.drawPreview();
    } else if (arr.length === 1) {
      const frameCanv = arr[0].children[0];
      const frameCtx = frameCanv.getContext('2d');
      ctx.clearRect(0, 0, canv.width, canv.height);
      frameCtx.clearRect(0, 0, frameCanv.width, frameCanv.height);
      this.drawPreview();
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
      }
      this.drawPreview();
      return el;
    }, 0);
  }

  static dragFrame() {
    const frames = document.getElementsByClassName('canvas-preview-item');
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

    function handleDrop(evt) {
      evt.preventDefault();
      if (evt.target.parentNode.children[0].tagName === 'CANVAS' || evt.target.parentNode.children[0].tagName === 'DIV') {
        const canvForRaplace = evt.target.parentNode.children[0].tagName === 'CANVAS' ? evt.target.parentNode.children[0] : evt.target.parentNode.parentNode.children[0];
        const ctx = canvForRaplace.getContext('2d');
        const tempCanvas = document.createElement('canvas');
        tempCanvas.setAttribute('width', '704px');
        tempCanvas.setAttribute('height', '704px');
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
      }
    }

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

  static fullScreen() {
    const fullScreen = document.getElementById('fullscreen');
    fullScreen.addEventListener('click', () => {
      const animationCanvas = document.getElementById('animation-canvas');
      animationCanvas.style.transform = 'scale(1)';
      animationCanvas.style.position = 'relative';
      animationCanvas.style.display = 'block';
      animationCanvas.style.margin = 'auto';
      animationCanvas.style.top = '0';
      animationCanvas.style.left = '0';
      animationCanvas.parentNode.requestFullscreen();
      animationCanvas.parentNode.style.backgroundColor = 'white';

      function onfullscreenchange() {
        if (!document.fullscreenElement) {
          animationCanvas.style.transform = 'scale(0.25)';
          animationCanvas.style.position = 'absolute';
          animationCanvas.style.display = 'block';
          animationCanvas.style.top = '-262px';
          animationCanvas.style.left = '-260px';
          animationCanvas.parentNode.style.backgroundColor = 'grey';
        }
      }
      window.addEventListener('fullscreenchange', onfullscreenchange);
    });
  }

  static exportToGif() {
    const exportToGif = document.getElementById('export');
    exportToGif.addEventListener('click', () => {
      const framesElement = document.getElementById('frame-container').children;
      const arrayFrames = Array.from(framesElement);
      function backgroundToWhite(canv) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.setAttribute('width', '704px');
        tempCanvas.setAttribute('height', '704px');
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.fillStyle = 'white';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.drawImage(canv, 0, 0);
        return tempCtx;
      }
      const somm = new GIFEncoder();
      somm.setRepeat(0);
      somm.setDelay(500);
      somm.start();
      arrayFrames.forEach((el) => {
        somm.addFrame(backgroundToWhite(el.children[0]));
      });
      somm.finish();
      somm.download('download.gif');
    });
  }

  saveToLocalStorage() {
    const addtols = document.getElementById('addstorage');
    addtols.addEventListener('click', () => {
      localStorage.clear();
      const objToLocal = {};
      objToLocal.color = this.color;
      objToLocal.secondaryColor = this.secondaryColor;
      objToLocal.frames = [];
      const framesElement = document.getElementById('frame-container').children;
      const arrayFrames = Array.from(framesElement);
      arrayFrames.forEach((el) => {
        objToLocal.frames.push(el.children[0].toDataURL());
      });
      localStorage.setItem('currentState', JSON.stringify(objToLocal));
    });
    App.clearStorage();
  }

  restoreFromLocalStorage() {
    const frames = document.getElementById('frame-container');
    if (this.state !== null) {
      const stateObject = JSON.parse(this.state);
      const colors = document.getElementById('colors-container');
      if (stateObject.color) {
        this.color = stateObject.color;
        colors.children[0].value = this.color;
      }
      if (stateObject.secondaryColor) {
        this.secondaryColor = stateObject.secondaryColor;
        colors.children[1].value = this.secondaryColor;
      }
      if (stateObject.frames.length) {
        let i = 0;
        stateObject.frames.forEach((el) => {
          const frame = document.createElement('div');
          const canv = frames.children[i].children[0];
          const ctx = canv.getContext('2d');
          const img = new Image();
          img.src = el;
          img.onload = function load() {
            ctx.drawImage(img, 0, 0);
          };
          i += 1;
          frame.setAttribute('class', 'preview-canvas canvas-preview-item');
          frame.innerHTML = `<canvas width="704px" height="704px"></canvas>
            <div class="frame-manager">
            <div class="delete"></div>
            <div class="copy"></div>
            <div class="drag"></div>
            </div>`;
          frames.appendChild(frame);
        });
        this.flag = true;
        this.drawPreview();
      }
    }
  }

  static clearStorage() {
    const strg = document.getElementById('clearstorage');
    strg.addEventListener('click', () => {
      localStorage.clear();
    });
  }

  canvasSizeSwitcer() {
    const switcher = document.getElementById('size-switcher');
    const canvas = document.getElementById('canvas-overlay');
    const frameContainer = document.getElementById('frame-container');
    const preview = frameContainer.children[frameContainer.children.length - 1].children[0];
    switcher.addEventListener('click', (e) => {
      switch (e.target.getAttribute('data')) {
        case '32':
          this.canvasSize = '32';
          Array.from(e.target.parentNode.children).forEach((it) => {
            it.classList.remove('active');
          });
          e.target.classList.add('active');
          preview.setAttribute('width', this.canvasSize);
          preview.setAttribute('height', this.canvasSize);
          this.tools.sizeValue='32';
          break;
        case '64':
          this.canvasSize = '64';
          Array.from(e.target.parentNode.children).forEach((it) => {
            it.classList.remove('active');
          });
          e.target.classList.add('active');
          preview.setAttribute('width', this.canvasSize);
          preview.setAttribute('height', this.canvasSize);
          this.tools.sizeValue='64';
          break;
        case '128':
          this.canvasSize = '128';
          Array.from(e.target.parentNode.children).forEach((it) => {
            it.classList.remove('active');
          });
          e.target.classList.add('active');
          preview.setAttribute('width', this.canvasSize);
          preview.setAttribute('height', this.canvasSize);
          this.tools.sizeValue='128';
          break;
        default:
      }
      canvas.setAttribute('width', this.canvasSize);
      canvas.setAttribute('height', this.canvasSize);
      // ctxpreview.setAttribute('width', this.canvasSize);
      // ctxpreview.setAttribute('height', this.canvasSize);
      this.drawPreview();
    });
  }
}

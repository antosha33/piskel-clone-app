import LZW from '../assets/animation/LZWEncoder';
import Neu from '../assets/animation/NeuQuant';
import b64 from '../assets/animation/base64';
import Tools from './tools/tools';
import Frames from './frames/frames';


export default class App {
  constructor() {
    this.frames = [];
    this.canvasSize = '32';
    this.stateIsChanged = false;
    App.startAnimation();
    App.fullScreen();
    this.state = localStorage.getItem('currentState');
    this.flag = false;
    App.exportToGif();
    this.tools = new Tools();
    this.frames = new Frames(this.canvasSize);
    this.saveToLocalStorage();
    this.restoreFromLocalStorage();
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


  saveToLocalStorage() {
    const addtols = document.getElementById('addstorage');
    addtols.addEventListener('click', () => {
      localStorage.clear();
      const objToLocal = {};
      objToLocal.color = this.color;
      objToLocal.secondaryColor = this.secondaryColor;
      objToLocal.frames = [];
      objToLocal.size = this.canvasSize;
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
          frame.innerHTML = `<canvas width=${stateObject.size} height=${stateObject.size}></canvas>
            <div class="frame-manager">
            <div class="delete"></div>
            <div class="copy"></div>
            <div class="drag"></div>
            </div>`;
          frames.appendChild(frame);
        });
        this.flag = true;
        const arr = Array.from(frames.children)
        this.frames.activeFrame(arr[i], arr, false);
      }
    }
  }

  static clearStorage() {
    const strg = document.getElementById('clearstorage');
    strg.addEventListener('click', () => {
      localStorage.clear();
    });
  }

  static reset() {
    const frameContainer = document.getElementById('frame-container');
    const preview = Array.from(frameContainer.children);
    for (let i = 1; i < preview.length; i += 1) {
      preview[i].remove();
    }
  }

  canvasSizeSwitcer() {
    const switcher = document.getElementById('size-switcher');
    const canvas = document.getElementById('canvas-overlay');
    const animationCanvas = document.getElementById('animation-canvas');
    const frameContainer = document.getElementById('frame-container');
    const preview = frameContainer.children[frameContainer.children.length - 1].children[0];
    function setSize(elem, size) {
      elem.setAttribute('width', size);
      elem.setAttribute('height', size);
    }
    switcher.addEventListener('click', (e) => {
      switch (e.target.getAttribute('data')) {
        case '32':
          this.canvasSize = '32';
          this.frames.cnvSize = '32';
          Array.from(e.target.parentNode.children).forEach((it) => {
            it.classList.remove('active');
          });
          e.target.classList.add('active');
          setSize(preview, this.canvasSize);
          setSize(animationCanvas, this.canvasSize);
          this.tools.sizeValue = '32';
          App.reset();
          break;
        case '64':
          this.canvasSize = '64';
          this.frames.cnvSize = '64';
          Array.from(e.target.parentNode.children).forEach((it) => {
            it.classList.remove('active');
          });
          e.target.classList.add('active');
          setSize(preview, this.canvasSize);
          setSize(animationCanvas, this.canvasSize);
          this.tools.sizeValue = '64';
          App.reset();
          break;
        case '128':
          this.canvasSize = '128';
          this.frames.cnvSize = '128';
          Array.from(e.target.parentNode.children).forEach((it) => {
            it.classList.remove('active');
          });
          e.target.classList.add('active');
          setSize(preview, this.canvasSize);
          setSize(animationCanvas, this.canvasSize);
          this.tools.sizeValue = '128';
          App.reset();
          break;
        default:
      }
      setSize(canvas, this.canvasSize);
      this.frames.drawPreview();
    });
  }

  static exportToGif() {
    const exportToGif = document.getElementById('export');
    const backgroundToWhite = (canv) => {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.setAttribute('width', 500);
      tempCanvas.setAttribute('height', 500);
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.imageSmoothingEnabled = false;
      tempCtx.fillStyle = 'white';
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      tempCtx.drawImage(canv, 0, 0, 500, 500);

      return tempCtx;
    };
    exportToGif.addEventListener('click', () => {
      const framesElement = document.getElementById('frame-container').children;
      const arrayFrames = Array.from(framesElement);
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
          animationCanvas.style.display = 'block';
          animationCanvas.parentNode.style.backgroundColor = 'grey';
        }
      }
      window.addEventListener('fullscreenchange', onfullscreenchange);
    });
  }
}

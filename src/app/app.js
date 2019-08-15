import LZW from '../assets/animation/LZWEncoder.js';
import Neu from '../assets/animation/NeuQuant.js';
import b64 from '../assets/animation/base64.js';

import {
  getCoord,
  rgbToHex,
  getCtx,
} from './utils';

export default class App {
  constructor() {
    this.currentTool = 'pen';
    this.toolSize = '1';
    this.canvasSize = '32';
    this.color = '#000000';
    this.offsetX = null;
    this.offsetY = null;
    this.secondaryColor = '#000000';
    this.frames = [];
    this.stateIsChanged = false;
    App.startAnimation();
    this.frameManager();
    App.fullScreen();
    this.state = localStorage.getItem('currentState');
    this.flag = false;
    App.exportToGif();
  }


  toolPicker() {
    const tools = document.getElementById('tools');
    const child = Array.from(tools.children);
    function setCurrentTool(e) {
      const tool = e.target.getAttribute('id') || false;
      function setTool() {
        child.forEach((element) => {
          if (element.classList.contains('active')) {
            element.classList.remove('active');
          }
        });
        e.target.classList.add('active');
      }
      switch (tool) {
        case 'pen':
          this.currentTool = 'pen';
          setTool();
          this.drawPen();
          break;
        case 'color-select':
          this.currentTool = 'color-select';
          setTool();
          this.colorPicker();
          break;
        case 'paint-bucket':
          this.currentTool = 'paint-bucket';
          setTool();
          this.paintBucket();
          break;
        case 'eraser':
          this.currentTool = 'eraser';
          setTool();
          this.eraser();
          break;
        default:
      }
      console.log(this.currentTool);
    }
    tools.addEventListener('click', setCurrentTool.bind(this));
  }


  // hoverToMove() {
  //   const cursor = document.getElementById('cursor');
  //   const canv = document.getElementById('canvas-overlay');
  //   const previousRect = {
  //     x: 0,
  //     y: 0,
  //   };
  //   const lastCoordinate = {
  //     x: 0,
  //     y: 0,
  //   };
  //   canv.addEventListener('mousemove', (e) => {
  //     if ((previousRect.x === 0 || previousRect.Y === 0)
  //     || Math.abs(lastCoordinate.x - e.offsetX / this.toolSize) > 0.5
  //     || Math.abs(lastCoordinate.y - e.offsetY / this.toolSize) > 0.5) {
  //       if (this.currentTool !== 'color-select' && this.currentTool !== 'paint-bucket') {
  //         lastCoordinate.x = Math.abs(e.offsetX / this.toolSize);
  //         lastCoordinate.y = Math.abs(e.offsetY / this.toolSize);
  //         cursor.style.left = `${e.offsetX - this.toolSize / 2}px`;
  //         cursor.style.top = `${e.offsetY - this.toolSize / 2}px`;
  //         cursor.style.display = 'block';
  //         this.offsetX = e.offsetX;
  //         this.offsetY = e.offsetY;
  //         previousRect.x = e.offsetX;
  //         previousRect.y = e.offsetY;
  //       }
  //     }
  //   });
  //   canv.addEventListener('mouseleave', () => {
  //     previousRect.x = 0;
  //     previousRect.y = 0;
  //   });
  // }


  sizePicker() {
    const scope = this;
    const sizeElem = document.getElementById('tool-size');
    const child = Array.from(sizeElem.children);
    function setCurrentSize(e) {
      const size = e.target.getAttribute('data') || false;
      function setSize() {
        const cursor = document.getElementById('cursor');
        cursor.style.width = `${scope.toolSize}px`;
        cursor.style.height = `${scope.toolSize}px`;
        child.forEach((element) => {
          if (element.classList.contains('active')) {
            element.classList.remove('active');
          }
        });
        e.target.classList.add('active');
      }
      switch (size) {
        case 'one':
          scope.toolSize = '1';
          setSize();
          break;
        case 'two':
          scope.toolSize = '2';
          setSize();
          break;
        case 'three':
          scope.toolSize = '3';
          setSize();
          break;
        case 'four':
          scope.toolSize = '4';
          setSize();
          break;
        default:
      }
    }
    sizeElem.addEventListener('click', setCurrentSize);
  }


  drawPen() {

    const canvcontainer = document.getElementById('canvas-container');
    const { ctx } = getCtx('canvas-overlay');
    // const cursor = document.getElementById('cursor');
    // const current = this;
    let isMouseDown = false;
    function draw(elem) {
      if (isMouseDown && this.currentTool === 'pen') {
        const { x, y } = getCoord(elem);
        ctx.fillStyle = this.color;
        ctx.fillRect(x, y,
          this.toolSize, this.toolSize);
      }
    }
    const drawBind = draw.bind(this);
    canvcontainer.addEventListener('mousemove', draw.bind(this));
    canvcontainer.addEventListener('mousedown', (e) => {
      isMouseDown = true;
      drawBind(e);
    });
    canvcontainer.addEventListener('mouseup', () => {
      isMouseDown = false;
    });
    canvcontainer.addEventListener('mouseleave', () => {
      isMouseDown = false;
    });
  }
  //   function draw() {
  //     if (isMouseDown && this.currentTool === 'pen') {
  //       ctx.fillStyle = this.color;
  //       ctx.fillRect(this.offsetX - this.toolSize / 2,
  //         this.offsetY - this.toolSize / 2,
  //         this.toolSize, this.toolSize);
  //     }
  //   }
  //   const drawBind = draw.bind(current);
  //   cursor.addEventListener('mousedown', () => {
  //     isMouseDown = true;
  //     draw.call(current);
  //     canv.addEventListener('mousemove', drawBind);
  //   });
  //   cursor.addEventListener('mouseup', () => {
  //     isMouseDown = false;
  //   });
  //   canvcontainer.addEventListener('mouseleave', () => {
  //     isMouseDown = false;
  //     canv.removeEventListener('mousemove', drawBind);
  //   });
  //   this.drawPreview();
  // }

  eraser() {
    const canvContainer = document.getElementById('canvas-container');
    const { ctx } = getCtx('canvas-overlay');
    let isMouseDown = true;
    function erase(e) {
      const { x, y } = getCoord(e);
      if (isMouseDown && this.currentTool === 'eraser') {
        ctx.fillStyle = this.color;
        ctx.clearRect(x,
          y,
          this.toolSize, this.toolSize);
      }
    }
    if (this.currentTool === 'eraser') {
      const eraseBind = erase.bind(this);
      canvContainer.addEventListener('mousemove', erase.bind(this));
      canvContainer.addEventListener('mousedown', (e) => {
        isMouseDown = true;
        eraseBind(e);
      });
      canvContainer.addEventListener('mouseup', () => {
        isMouseDown = false;
      });
      canvContainer.addEventListener('mouseleave', () => {
        isMouseDown = false;
      });
    }
  }

  colorPicker() {
    if (this.currentTool === 'color-select') {
      const canvContainer = document.getElementById('canvas-container');
      const { ctx } = getCtx('canvas-overlay');
      const colors = document.getElementById('colors-container');
      const cursor = document.getElementById('cursor');
      cursor.style.display = 'none';
      canvContainer.addEventListener('click', (e) => {
        const { x, y } = getCoord(e);
        const color = ctx.getImageData(x, y, 1, 1).data;
        console.log(color);
        this.color = `#${(`000000${rgbToHex(color[0], color[1], color[2])}`).slice(-6)}`;
        colors.children[0].value = this.color;
      });
    }
  }

  colorPallete() {
    const scope = this;
    const colors = document.getElementById('colors-container');
    colors.addEventListener('click', (e) => {
      if (e.target.classList.contains('primary')) {
        e.target.addEventListener('change', () => {
          scope.color = e.target.value;
        });
      } else if (e.target.classList.contains('secondary')) {
        e.target.addEventListener('change', () => {
          scope.secondaryColor = e.target.value;
        });
      } else if (e.target.classList.contains('swap')) {
        const tempColor = this.secondaryColor;
        this.secondaryColor = this.color;
        this.color = tempColor;
        e.target.parentNode.children[0].value = this.color;
        e.target.parentNode.children[1].value = this.secondaryColor;
      }
    });
  }

  drawPreview() {
    const canv = document.getElementById('canvas-overlay');
    const frameContainer = document.getElementById('frame-container');
    const preview = frameContainer.children[frameContainer.children.length - 1].children[0];
    const ctxpreview = preview.getContext('2d');
    const newframeButton = document.getElementById('new-frame');

    function moveListener() {
      ctxpreview.clearRect(0, 0, 704, 704);
      ctxpreview.drawImage(canv, 0, 0);
    }
    function clickListener() {
      ctxpreview.clearRect(0, 0, 704, 704);
      ctxpreview.drawImage(canv, 0, 0);
    }
    function mousedownListener() {
      ctxpreview.clearRect(0, 0, 704, 704);
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
      frame.innerHTML = `<canvas width="704px" height="704px"></canvas>
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

  paintBucket() {
    const canvContainer = document.getElementById('canvas-overlay');
    const { ctx } = getCtx('canvas-overlay');
    document.getElementById('cursor').style.display = 'none';

    canvContainer.addEventListener('click', (e) => {
      if (this.currentTool === 'paint-bucket') {
        const { x, y } = getCoord(e);
        const contexts = {};
        const drawingAreaWidth = this.canvasSize;
        const drawingAreaHeight = this.canvasSize;
        const curColor = hexToRgb(this.color);
        if (curColor.r === 0 && curColor.g === 0 && curColor.b === 0) curColor.b = 1;
        contexts.drawing = ctx;
        contexts.outline = ctx;
        const outlineLayerData = contexts.drawing.getImageData(0, 0, drawingAreaWidth, drawingAreaHeight);
        const colorLayerData = contexts.drawing.getImageData(0, 0, drawingAreaWidth, drawingAreaHeight);

        function hexToRgb(hex) {
          if (hex.substr(0, 1) === '#') hex = hex.substr(1);
          let r; let g; let
            b;
          r = hex.substr(0, 2);
          g = hex.substr(2, 2);
          b = hex.substr(4, 2);
          r = parseInt(r, 16);
          g = parseInt(g, 16);
          b = parseInt(b, 16);
          return { r, g, b };
        }

        function matchOutlineColor(r, g, b, a) {
          return (r + g + b < 100 && a === 255);
        }

        function matchStartColor(pixelPos, startR, startG, startB) {
          let r = outlineLayerData.data[pixelPos];
          let g = outlineLayerData.data[pixelPos + 1];
          let b = outlineLayerData.data[pixelPos + 2];
          const a = outlineLayerData.data[pixelPos + 3];
          if (matchOutlineColor(r, g, b, a)) {
            return false;
          }
          r = colorLayerData.data[pixelPos];
          g = colorLayerData.data[pixelPos + 1];
          b = colorLayerData.data[pixelPos + 2];
          if (r === startR && g === startG && b === startB) {
            return true;
          }
          if (r === curColor.r && g === curColor.g && b === curColor.b) {
            return false;
          }
          return (Math.abs(r - startR) + Math.abs(g - startG) + Math.abs(b - startB) < 255);
        }

        function colorPixel(pixelPos, r, g, b, a) {
          colorLayerData.data[pixelPos] = r;
          colorLayerData.data[pixelPos + 1] = g;
          colorLayerData.data[pixelPos + 2] = b;
          colorLayerData.data[pixelPos + 3] = a !== undefined ? a : 255;
        }

        function floodFill(startX, startY, startR, startG, startB) {
          let newPos;
          let x;
          let y;
          let pixelPos;
          let reachLeft;
          let reachRight;
          const drawingBoundLeft = 0;
          const drawingBoundTop = 0;
          const drawingBoundRight = drawingAreaWidth - 1;
          const drawingBoundBottom = drawingAreaHeight - 1;
          const pixelStack = [[startX, startY]];
          while (pixelStack.length) {
            newPos = pixelStack.pop();
            [x, y] = [newPos[0], newPos[1]];
            pixelPos = (y * drawingAreaWidth + x) * 4;
            while (y >= drawingBoundTop && matchStartColor(pixelPos, startR, startG, startB)) {
              y -= 1;
              pixelPos -= drawingAreaWidth * 4;
            }
            pixelPos += drawingAreaWidth * 4;
            y += 1;
            reachLeft = false;
            reachRight = false;
            while (y <= drawingBoundBottom && matchStartColor(pixelPos, startR, startG, startB)) {
              y += 1;
              colorPixel(pixelPos, curColor.r, curColor.g, curColor.b);
              if (x > drawingBoundLeft) {
                if (matchStartColor(pixelPos - 4, startR, startG, startB)) {
                  if (!reachLeft) {
                    pixelStack.push([x - 1, y]);
                    reachLeft = true;
                  }
                } else if (reachLeft) {
                  reachLeft = false;
                }
              }

              if (x < drawingBoundRight) {
                if (matchStartColor(pixelPos + 4, startR, startG, startB)) {
                  if (!reachRight) {
                    pixelStack.push([x + 1, y]);
                    reachRight = true;
                  }
                } else if (reachRight) {
                  reachRight = false;
                }
              }

              pixelPos += drawingAreaWidth * 4;
            }
          }
        }

        function paintAt(startX, startY) {
          const pixelPos = (startY * drawingAreaWidth + startX) * 4;

          const r = colorLayerData.data[pixelPos];
          const g = colorLayerData.data[pixelPos + 1];
          const b = colorLayerData.data[pixelPos + 2];
          const a = colorLayerData.data[pixelPos + 3];

          if ((r === curColor.r && g === curColor.g && b === curColor.b)) {
            return;
          }
          if (matchOutlineColor(r, g, b, a)) {
            return;
          }
          floodFill(startX, startY, r, g, b);
        }

        paintAt(x, y);
        contexts.drawing.putImageData(colorLayerData, 0, 0, 0, 0, drawingAreaWidth, drawingAreaHeight);
      }




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

  sizeSwitcer() {
    const switcher = document.getElementById('size-switcher');
    const canvas = document.getElementById('canvas-overlay');
    switcher.addEventListener('click', (e) => {
      switch (e.target.getAttribute('data')) {
        case '32':
          this.canvasSize = '32';
          Array.from(e.target.parentNode.children).forEach((it) => {
            it.classList.remove('active');
          });
          e.target.classList.add('active');
          break;
        case '64':
          this.canvasSize = '64';
          Array.from(e.target.parentNode.children).forEach((it) => {
            it.classList.remove('active');
          });
          e.target.classList.add('active');
          break;
        case '128':
          this.canvasSize = '128';
          Array.from(e.target.parentNode.children).forEach((it) => {
            it.classList.remove('active');
          });
          e.target.classList.add('active');
          break;
        default:
      }
      canvas.setAttribute('width', this.canvasSize);
      canvas.setAttribute('height', this.canvasSize);
    });
  }
}

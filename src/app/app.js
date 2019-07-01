import Gif from '../assets/gif.js';
import LZW from '../assets/animation/LZWEncoder.js';
import Neu from '../assets/animation/NeuQuant.js';
import b64 from '../assets/animation/base64.js';
// import {GIFEncoder} from '../assets/animation/GIFEncoder.js';

export default class App {
  constructor() {
    this.currentTool = 'pen';
    this.toolSize = '24';
    this.color = '#000000';
    this.offsetX = null;
    this.offsetY = null;
    this.secondaryColor = '#000000';
    this.frames = [];
    this.stateIsChanged = false;
    App.startAnimation();
    this.frameManager();
    App.fullScreen();
  }


  toolPicker() {
    const tools = document.getElementById('tools');
    const scope = this;
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
          scope.currentTool = 'pen';
          setTool();
          scope.drawPen();
          break;
        case 'color-select':
          scope.currentTool = 'color-select';
          setTool();
          scope.colorPicker();
          break;
        case 'paint-bucket':
          scope.currentTool = 'paint-bucket';
          setTool();
          scope.paintBucket();
          break;
        case 'eraser':
          scope.currentTool = 'eraser';
          setTool();
          scope.eraser();
          break;
      }
    }
    tools.addEventListener('click', setCurrentTool);

  }


  hoverToMove() {
    const cursor = document.getElementById('cursor');
    const canv = document.getElementById('canvas-overlay');
    const previousRect = {
      x: 0,
      y: 0,
    };
    const lastCoordinate = {
      x: 0,
      y: 0,
    };
    canv.addEventListener('mousemove', (e) => {
      if ((previousRect.x === 0 || previousRect.Y === 0) || Math.abs(lastCoordinate.x - e.offsetX / this.toolSize) > 0.5 || Math.abs(lastCoordinate.y - e.offsetY / this.toolSize) > 0.5) {
        if (this.currentTool !== 'color-select' && this.currentTool !== 'paint-bucket') {
          lastCoordinate.x = Math.abs(e.offsetX / this.toolSize);
          lastCoordinate.y = Math.abs(e.offsetY / this.toolSize);
          cursor.style.left = `${e.offsetX - this.toolSize / 2}px`;
          cursor.style.top = `${e.offsetY - this.toolSize / 2}px`;
          cursor.style.display = 'block';
          this.offsetX = e.offsetX;
          this.offsetY = e.offsetY;
          previousRect.x = e.offsetX;
          previousRect.y = e.offsetY;
        }
      }
    });
    canv.addEventListener('mouseleave', (e) => {
      previousRect.x = 0;
      previousRect.y = 0;
    });
  }


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
          scope.toolSize = '24';
          setSize();
          break;
        case 'two':
          scope.toolSize = '30';
          setSize();
          break;
        case 'three':
          scope.toolSize = '36';
          setSize();
          break;
        case 'four':
          scope.toolSize = '40';
          setSize();
          break;
      }
    }
    sizeElem.addEventListener('click', setCurrentSize);
  }


  drawPen() {
    const canv = document.getElementById('canvas-overlay');
    const canvcontainer = document.getElementById('canvas-container');
    const ctx = canv.getContext('2d');
    const cursor = document.getElementById('cursor');
    const current = this;
    let isMouseDown = false;
    function draw() {
      if (isMouseDown && this.currentTool === 'pen') {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.offsetX - this.toolSize / 2,
          this.offsetY - this.toolSize / 2,
          this.toolSize, this.toolSize);
      }
    }
    const drawBind = draw.bind(current);
    cursor.addEventListener('mousedown', () => {
      isMouseDown = true;
      draw.call(current);
      canv.addEventListener('mousemove', drawBind);
    });
    cursor.addEventListener('mouseup', () => {
      isMouseDown = false;
    });
    canvcontainer.addEventListener('mouseleave', () => {
      isMouseDown = false;
      canv.removeEventListener('mousemove', drawBind);
    });
    this.drawPreview();
  }

  eraser() {
    const canv = document.getElementById('canvas-overlay');
    const ctx = canv.getContext('2d');
    const cursor = document.getElementById('cursor');
    let isMouseDown = false;
    const current = this;
    function erase() {
      if (isMouseDown && this.currentTool === 'eraser') {
        ctx.fillStyle = this.color;
        ctx.clearRect(this.offsetX - this.toolSize / 2,
          this.offsetY - this.toolSize / 2,
          this.toolSize, this.toolSize);
      }
    }
    const eraseBind = erase.bind(current);
    cursor.addEventListener('mousedown', () => {
      isMouseDown = true;
      erase.call(current);
      canv.addEventListener('mousemove', eraseBind);
    });
    cursor.addEventListener('mouseup', () => {
      isMouseDown = false;
    });
  }

  colorPicker() {
    function rgbToHex(r, g, b) {
      return ((r << 16) | (g << 8) | b).toString(16);
    }
    if (this.currentTool === 'color-select') {
      const scope = this;
      const canv = document.getElementById('canvas-overlay');
      const colors = document.getElementById('colors-container');
      const ctx = canv.getContext('2d');
      const cursor = document.getElementById('cursor');
      cursor.style.display = 'none';
      canv.addEventListener('click', (e) => {
        const color = ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data;
        scope.color = "#" + ("000000" + rgbToHex(color[0], color[1], color[2])).slice(-6);;
        colors.children[0].value = scope.color;
      });
    }
  }

  colorPallete() {
    const scope = this;
    const colors = document.getElementById('colors-container');
    colors.addEventListener('click', (e)=>{
      if (e.target.classList.contains('primary')) {
        e.target.addEventListener('change', (e)=> {
          scope.color = e.target.value;
        });
      } else if (e.target.classList.contains('secondary')) {
        e.target.addEventListener('change', (e)=> {
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
    function moveListener(){
      ctxpreview.clearRect(0, 0, 704, 704);
      ctxpreview.drawImage(canv, 0, 0);
    }
    function clickListener(){
      ctxpreview.clearRect(0, 0, 704, 704);
      ctxpreview.drawImage(canv, 0, 0);
    }
    function mousedownListener(){
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
      if(e.target.classList.contains('drag')){
      canv.removeEventListener('mousemove', moveListener);
      canv.removeEventListener('click', clickListener);
      canv.removeEventListener('mousedown', mousedownListener);
      }
    });
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
    let i=0;
    let j=0;
    const framesElement = document.getElementById('frame-container').children;
    function animate(){
      setInterval(function(){
        const arrayFrames = Array.from(framesElement);
        const canv = arrayFrames[i%arrayFrames.length].children[0];
        const animationCanvas = document.getElementById('animation-canvas');
        const animationCanvasCtx = animationCanvas.getContext('2d');
        animationCanvasCtx.clearRect(0,0,704,704)
        animationCanvasCtx.drawImage(canv, 0, 0);
        i++;
      },1000 / 5);
    }
    animate();
  }

  frameManager() {
    const frames = document.getElementById('frame-container');
    const canv = document.getElementById('canvas-overlay');
    const ctx = canv.getContext('2d');
    frames.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete')) {
        this.delFrame(frames,canv,ctx,e);
      } else if(e.target.classList.contains('copy')){
        this.copyFrame(frames,e);
      }
    });
    frames.addEventListener('mousedown', (e) => {
      if(e.target.classList.contains('drag')){
        e.target.parentNode.parentNode.setAttribute('draggable','true');
        this.dragFrame();
        }
    });

  }

  delFrame(frames,canv,ctx,e){
    const arr = Array.from(frames.children);
    if (arr.length > 1){
      arr.reduce((el,current, index) => {
        if( current === e.target.parentNode.parentNode) {
          const frameCanv = arr[index-1].children[0];
          ctx.clearRect(0,0,canv.width, canv.height);
          ctx.drawImage(frameCanv, 0,0);
        }
        e.target.parentNode.parentNode.remove();
      });
      this.drawPreview();
    } else if(arr.length === 1){
       const frameCanv = arr[0].children[0];
      const frameCtx = frameCanv.getContext('2d');
      ctx.clearRect(0,0,canv.width, canv.height);
      frameCtx.clearRect(0,0,frameCanv.width, frameCanv.height);
      this.drawPreview();
    }
  }

  copyFrame(frames,e){
    const arr = Array.from(frames.children);
      arr.reduce((el,current, index) => {
        if( current === e.target.parentNode.parentNode) {
          const frameCanv = e.target.parentNode.parentNode;
          const copy = frameCanv.cloneNode(true);
          const canvForCopy = e.target.parentNode.parentNode.children[0];
          const ctxCopy = copy.children[0].getContext('2d');
          ctxCopy.drawImage(canvForCopy,0,0);
          frames.insertBefore(copy,frames.children[index+1]);
        }
        this.drawPreview();
      },0);
  }

  dragFrame() {
    const frames = document.getElementsByClassName('canvas-preview-item');
    let dragStartCanv = null;
    let clinetX = [];
    function handleDragStart(ev) {
      ev.dataTransfer.effectAllowed='move';
      ev.target.style.opacity = "0.2";
      dragStartCanv = ev.target.children[0];
      }
  
    function handleDragOver(evt) {
      evt.preventDefault();
    }
  
    function handleDragEnter(evt) {
      evt.stopPropagation();
      if(evt.target.parentNode.children[0].tagName === 'CANVAS' || 'DIV'){     
      }
    }
  
    function handleDragLeave(ev) {
    }
  
    function handleDrop(evt) {
      evt.preventDefault();
      if(evt.target.parentNode.children[0].tagName === 'CANVAS'){
        const canvForRaplace = evt.target.parentNode.children[0];
        const ctx = canvForRaplace.getContext('2d');
        const tempCanvas = document.createElement('canvas');
        tempCanvas.setAttribute('width', '704px');
        tempCanvas.setAttribute('height', '704px');
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.drawImage(canvForRaplace, 0, 0);
        ctx.clearRect(0,0,canvForRaplace.width,canvForRaplace.height);
        ctx.drawImage(dragStartCanv, 0, 0);
        const dragStartCtx = dragStartCanv.getContext('2d');
        dragStartCtx.clearRect(0,0,dragStartCanv.width,dragStartCanv.height);
        dragStartCtx.drawImage(tempCanvas, 0,0);
        evt.target.parentNode.parentNode.setAttribute('draggable','false');
        dragStartCanv.parentNode.setAttribute('draggable','false');
      }
    }
  
    function handleDragEnd(ev) {
      ev.stopPropagation();
      ev.target.style.opacity = "1";
    }

    Array.prototype.forEach.call(frames, (el) => {
      el.addEventListener('dragstart', handleDragStart);
      el.addEventListener('dragenter', handleDragEnter);
      el.addEventListener('dragover', handleDragOver);
      el.addEventListener('dragleave', handleDragLeave);
      el.addEventListener('drop', handleDrop);
      el.addEventListener('dragend', handleDragEnd);
    })
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

    const onfullscreenchange =  function(e){
      if(!document.fullscreenElement){
        animationCanvas.style.transform = 'scale(0.25)';
        animationCanvas.style.position = 'absolute';
        animationCanvas.style.display = 'block';
        animationCanvas.style.top = '-262px';
        animationCanvas.style.left = '-260px';
        animationCanvas.parentNode.style.backgroundColor = 'grey';
      }
    }

    window.addEventListener("fullscreenchange", onfullscreenchange);
    })
  }

  exportToGif(){
    const exportToGif = document.getElementById('export');
    exportToGif.addEventListener('click', () => {
       const framesElement = document.getElementById('frame-container').children;
      const arrayFrames = Array.from(framesElement);
        const backgroundToWhite = function (canv){
          const tempCanvas = document.createElement('canvas');
          tempCanvas.setAttribute('width', '704px');
          tempCanvas.setAttribute('height', '704px');
          const tempCtx = tempCanvas.getContext('2d');
          tempCtx.fillStyle = 'white';
          tempCtx.fillRect(0,0, tempCanvas.width, tempCanvas.height);
          tempCtx.drawImage(canv,0,0);
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
       somm.download("download.gif");
    })
  }
  paintBucket(){
    if(this.currentTool === 'paint-bucket'){
      const canv = document.getElementById('canvas-overlay');
      const ctx = canv.getContext('2d');
      document.getElementById('cursor').style.display='none';
      canv.addEventListener('click', (e) => {
        
          let contexts = {},
              drawingAreaWidth = 704,
              drawingAreaHeight = 704,    
              colorLayerData,
              outlineLayerData;
            let curColor = hexToRgb(this.color);
            if(curColor.r === 0, curColor.g === 0, curColor.b === 0) curColor.b = 1;
            contexts.drawing = ctx;
            contexts.outline = ctx;
            outlineLayerData = contexts.drawing.getImageData(0, 0, drawingAreaWidth, drawingAreaHeight);
            colorLayerData = contexts.drawing.getImageData(0, 0, drawingAreaWidth, drawingAreaHeight);
         
            function hexToRgb(hex){
              if (hex.substr(0, 1) == '#') hex = hex.substr(1);   
              let r, g, b;
              r = hex.substr(0, 2);
              g = hex.substr(2, 2);
              b = hex.substr(4, 2);
              r = parseInt(r, 16);
              g = parseInt(g, 16);
              b = parseInt(b, 16);
              return {r: r, g: g, b: b};
            };

            function matchOutlineColor(r, g, b, a) {
              return (r + g + b < 100 && a === 255);
            };
        
            function matchStartColor (pixelPos, startR, startG, startB) {
              let r = outlineLayerData.data[pixelPos],
                g = outlineLayerData.data[pixelPos + 1],
                b = outlineLayerData.data[pixelPos + 2],
                a = outlineLayerData.data[pixelPos + 3];
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
            };
        
            function colorPixel(pixelPos, r, g, b, a) {        
              colorLayerData.data[pixelPos] = r;
              colorLayerData.data[pixelPos + 1] = g;
              colorLayerData.data[pixelPos + 2] = b;
              colorLayerData.data[pixelPos + 3] = a !== undefined ? a : 255;
            };
        
            function floodFill(startX, startY, startR, startG, startB) {
              let newPos,
                x,
                y,
                pixelPos,
                reachLeft,
                reachRight,
                drawingBoundLeft = 0,
                drawingBoundTop = 0,
                drawingBoundRight = drawingAreaWidth - 1,
                drawingBoundBottom = drawingAreaHeight - 1,
                pixelStack = [[startX, startY]];
              while (pixelStack.length) {
                newPos = pixelStack.pop();
                x = newPos[0];
                y = newPos[1];
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
            };
        
            function paintAt(startX, startY) {                
              let pixelPos = (startY * drawingAreaWidth + startX) * 4,
              
                r = colorLayerData.data[pixelPos],
                g = colorLayerData.data[pixelPos + 1],
                b = colorLayerData.data[pixelPos + 2],
                a = colorLayerData.data[pixelPos + 3];

              if ((r === curColor.r && g === curColor.g && b === curColor.b) && (r !== 0 && g !== 0 && b !== 0)) {
               return;
              }      
              if (matchOutlineColor(r, g, b, a)) {
                return;
              }        
              floodFill(startX, startY, r, g, b);
            };

          paintAt(e.offsetX, e.offsetY);
          contexts.drawing.putImageData(colorLayerData, 0, 0, 0, 0, drawingAreaWidth, drawingAreaHeight);
  
      });
    }
  }

}
import Frames from './frames.js';
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
    this.previewFrame = new Frames();
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
        if (this.currentTool !== 'color-select') {
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

      this.stateIsChanged =false;
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
    this.previewFrame.drawPreview();
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

  // drawPreview(isNew) {

  // }

  addFrame() {
    const newframeButton = document.getElementById('new-frame');
    const frameContainer = document.getElementById('frame-container');
    const mainCanvas = document.getElementById('canvas-overlay');
    const mainCtx = mainCanvas.getContext('2d');
    newframeButton.addEventListener('click', () => {
      const frame = document.createElement('div');
      frame.setAttribute('class', 'preview-canvas');
      frame.innerHTML = '<canvas width="704px" height="704px"></canvas>';
      frameContainer.appendChild(frame);
      mainCtx.clearRect(0,0, mainCanvas.width, mainCanvas.height);
      this.stateIsChanged = true;
      this.previewFrame = new Frames();
      this.previewFrame.drawPreview();
    });
  }

  static startAnimation() {
    function animate(){
     const frames =  Array.from(animationFrames.children);   
    setInterval(function(){
      frames[j%2].style.zIndex = ++i;
      ++j;
    },200);
    }
    animate();
  }

}
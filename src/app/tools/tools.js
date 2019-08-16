import {
  getCoord,
  getCtx,
  hexToRgb,
  drawLine,
  rgbToHex,
} from '../utils';

import {
  toolPicker,
} from './toolPicker';

export default class Tools {
  constructor() {
    this.currentTool = 'pen';
    this.toolSize = 1;
    this.canvasSize = '32';
    this.color = '#000000';
    this.offsetX = null;
    this.offsetY = null;
    this.secondaryColor = '#000000';
    this.frames = [];
    this.stateIsChanged = false;
    this.flag = false;
    this.drawPen();
    this.sizePicker();
    this.colorPallete();
    toolPicker.call(this);
  }
  set sizeValue(value){
    this.canvasSize = value;
  }
  drawPen() {

    const canvcontainer = document.getElementById('canvas-container');
    const { ctx } = getCtx('canvas-overlay');
    let isMouseDown = false;
    let x;
    let y;
    const draw = (elem) => {
      if (isMouseDown && this.currentTool === 'pen') {
        const color = hexToRgb(this.color);
        const x1 = getCoord(elem).x;
        const y1 = getCoord(elem).y;
        drawLine(x, y, x1, y1, color, ctx, this.toolSize);
        x = x1;
        y = y1;
      }
    };
    canvcontainer.addEventListener('mousemove', draw);
    canvcontainer.addEventListener('mousedown', (e) => {
      isMouseDown = true;
      x = getCoord(e).x;
      y = getCoord(e).y;
    });
    canvcontainer.addEventListener('mouseup', () => {
      isMouseDown = false;
    });
    canvcontainer.addEventListener('mouseleave', () => {
      isMouseDown = false;
    });
  }

  sizePicker() {
    const sizeElem = document.getElementById('tool-size');
    const child = Array.from(sizeElem.children);
    const setCurrentSize = (e) => {
      const size = e.target.getAttribute('data') || false;
      const setSize = () => {
        const cursor = document.getElementById('cursor');
        cursor.style.width = `${this.toolSize}px`;
        cursor.style.height = `${this.toolSize}px`;
        child.forEach((element) => {
          if (element.classList.contains('active')) {
            element.classList.remove('active');
          }
        });
        e.target.classList.add('active');
      };
      switch (size) {
        case 'one':
          this.toolSize = '1';
          setSize();
          break;
        case 'two':
          this.toolSize = '2';
          setSize();
          break;
        case 'three':
          this.toolSize = '3';
          setSize();
          break;
        case 'four':
          this.toolSize = '4';
          setSize();
          break;
        default:
      }
    };
    sizeElem.addEventListener('click', setCurrentSize);
  }

  paintBucket() {
    const canvContainer = document.getElementById('canvas-overlay');
    canvContainer.addEventListener('click', (e) => {
      const { ctx } = getCtx('canvas-overlay');
      document.getElementById('cursor').style.display = 'none';
      const { x, y } = getCoord(e);
      const contexts = {};
      const drawingAreaWidth = this.canvasSize;
      const drawingAreaHeight = this.canvasSize;
      const curColor = hexToRgb(this.color);
      if (curColor.r === 0 && curColor.g === 0 && curColor.b === 0) curColor.b = 1;
      contexts.drawing = ctx;
      contexts.outline = ctx;
      const outlineLayerData = contexts.drawing.getImageData(0, 0,
        drawingAreaWidth, drawingAreaHeight);
      const colorLayerData = contexts.drawing.getImageData(0, 0,
        drawingAreaWidth, drawingAreaHeight);
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

        if ((r === curColor.r && g === curColor.g && b === curColor.b)
          && (r === 0 && g === 0 && b === 0)) {
          return;
        }
        if (matchOutlineColor(r, g, b, a)) {
          return;
        }
        floodFill(startX, startY, r, g, b);
      }
      if (this.currentTool === 'paint-bucket') {
        paintAt(x, y);
        contexts.drawing.putImageData(colorLayerData, 0, 0, 0, 0,
          drawingAreaWidth, drawingAreaHeight);
      }
    });
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

  eraser() {
    const canvContainer = document.getElementById('canvas-container');
    const { ctx } = getCtx('canvas-overlay');
    let isMouseDown = false;
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
}

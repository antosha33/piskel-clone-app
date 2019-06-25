export default class App {
  constructor() {
    this.currentTool = 'pen';
    this.toolSize = '32';
    this.color = 'black';
  }

  hoverToMove() {
    const canv = document.getElementById('canvas-overlay');
    const ctx = canv.getContext('2d');
    const previousRect = {
      x: 0,
      y: 0,
    };
    canv.addEventListener('mousemove', (e) => {
      console.log(e.offsetX % 8)
      if (e.offsetX % 32 === 0 || e.offsetY % 32 === 0) {
        // ctx.clearRect(previousRect.x, previousRect.y, this.toolSize, this.toolSize);
        // ctx.fillStyle = 'rgba(156, 156, 156, 0.4)';
        ctx.fillRect(e.offsetX,
          e.offsetY,
          this.toolSize, this.toolSize);
        previousRect.x = e.offsetX;
        previousRect.y = e.offsetY;
      }
    });
    canv.addEventListener('mouseleave', () => {
      ctx.clearRect(previousRect.x, previousRect.y, this.toolSize, this.toolSize);
    });
    // canv.addEventListener('mousedown', () => {
    //   canv.setAttribute("style", "z-index:-1");
    //   this.drawPen(canv, previousRect);
    // });
  }

  drawPen(canv, previousRect) {
    const mainLayer = document.getElementById('canvas-drawing');
    const ctx = mainLayer.getContext('2d');
    // mainLayer.addEventListener('mousedown', (e) => {
    //   ctx.fillStyle = this.color;
    //   ctx.fillRect(e.offsetX,
    //     e.offsetY,
    //     this.toolSize, this.toolSize);
    //     mainLayer.addEventListener('mousemove', (e) => {
    //       ctx.fillStyle = this.color;
    //       ctx.fillRect(e.offsetX,
    //         e.offsetY,
    //         this.toolSize, this.toolSize);
    //     });
    // });
    // mainLayer.addEventListener('mouseup', (e) => {
    //   canv.setAttribute("style", "z-index:10");
    // });
  }
}

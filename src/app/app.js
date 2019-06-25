export default class App {
    constructor() {
        this.currentTool = 'pen';
        this.toolSize = '32';
    }

    hoverToMove() {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const lastPosition = {
            x: 0,
            y: 0,
        }
        const previousRect = {
            x: 0,
            y: 0,
        }
        canvas.addEventListener('mousemove', (e) => {
                console.log(e.offsetX/this.toolSize);
                ctx.clearRect(previousRect.x, previousRect.y,  this.toolSize,  this.toolSize);
                ctx.fillStyle = 'rgba(156, 156, 156, 0.4)';
                ctx.fillRect(e.offsetX-this.toolSize/2 ,e.offsetY-this.toolSize/2, this.toolSize, this.toolSize);
                previousRect.x = e.offsetX-this.toolSize/2;
                previousRect.y = e.offsetY-this.toolSize/2;
            });
        canvas.addEventListener('mouseleave', (e) => {
            ctx.clearRect(previousRect.x, previousRect.y,  this.toolSize,  this.toolSize);
        });
    }
}
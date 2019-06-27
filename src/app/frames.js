export default class Frames {
  constructor() {

  }

  drawPreview(){
    const canv = document.getElementById('canvas-overlay');
    const frameContainer = document.getElementById('frame-container');
    const preview = frameContainer.children[frameContainer.children.length - 1].children[0];
    const ctxpreview = preview.getContext('2d');
    // if(isNew){
    //   canv.removeEventListener('mousemove', moveListener);
    //   canv.removeEventListener('click', clickListener);
    //   canv.removeEventListener('mousedown', mousedownListener);
    // }
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
  }

}
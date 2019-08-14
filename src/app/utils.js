function getCoord(elem) {
  const canv = document.getElementById('canvas-overlay');
  const canvWidth = +getComputedStyle(canv).width.slice(0, -2);
  const canvasK = canvWidth / canv.width;
  const x = Math.floor(elem.offsetX / canvasK);
  const y = Math.floor(elem.offsetY / canvasK);
  return {
    x,
    y,
  };
}

function rgbToHex(r, g, b) {
  return ((r << 16) | (g << 8) | b).toString(16);
}

function getCtx(id) {
  const canv = document.getElementById(id);
  const ctx = canv.getContext('2d');
  return {
    canv, ctx,
  }
}

export {
  getCoord,
  rgbToHex,
  getCtx
};
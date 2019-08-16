function drawLine(x1, y1, x2, y2, color, ctx, toolSize) {
  function setPixel(rgb, x, y) {
    const imgData = ctx.createImageData(toolSize, toolSize);
    const rgbKeys = Object.keys(rgb);
    for (let i = 0; i < imgData.data.length; i += 1) {
      imgData.data[i] = rgb[rgbKeys[i % 4]];
    }
    ctx.putImageData(imgData, x, y);
  }
  const delX = Math.abs(x2 - x1);
  const delY = Math.abs(y2 - y1);
  const signForX = x1 < x2 ? 1 : -1;
  const signForY = y1 < y2 ? 1 : -1;

  let error = delX - delY;
  setPixel(color, x2, y2, ctx);

  while (x1 !== x2 || y1 !== y2) {
    setPixel(color, x1, y1, ctx);
    const error2 = error * 2;
    if (error2 > -delY) {
      error -= delY;
      x1 += signForX;
    }
    if (error2 < delX) {
      error += delX;
      y1 += signForY;
    }
  }
}

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


function hexToRgb(hex) {
  if (hex.substr(0, 1) === '#') hex = hex.substr(1);

  let r;
  let g;
  let b;

  r = hex.substr(0, 2);
  g = hex.substr(2, 2);
  b = hex.substr(4, 2);

  r = parseInt(r, 16);
  g = parseInt(g, 16);
  b = parseInt(b, 16);
  const a = 255;

  return {
    r, g, b, a,
  };
}


function getCtx(id) {
  const canv = document.getElementById(id);
  const ctx = canv.getContext('2d');
  return {
    canv, ctx,
  };
}

export {
  getCoord,
  rgbToHex,
  getCtx,
  drawLine,
  hexToRgb,
};

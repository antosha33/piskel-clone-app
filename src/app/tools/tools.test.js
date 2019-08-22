import Tools from './tools';

document.body.innerHTML = `
    <body>
    <div class="container">
        <div class="menu">
            <div class="tools" id="tools">
                <div class="tool-size" id="tool-size">
                    <div data="one" class="size one active"></div>
                    <div data="two" class="size two"></div>
                    <div data="three" class="size three"></div>
                        <div data="four" class="size four"></div>
                </div>
                <div class="pen active" id="pen"></div>
                <div class="color-select" id="color-select"></div>
                <div class="paint-bucket" id="paint-bucket"></div>
                <div class="eraser" id="eraser"></div>
                <div class="circle" id="circle"></div>
                <div class="line" id="line"></div>
                <div class="rotate" id="rotate"></div>
                <div class="move" id="move"></div>
                <div class="colors">
                    <div class="colors-container" id="colors-container">
                            <input class="primary" type="color">
                            <input class="secondary" type="color">
                            <p class="swap"></p>
                    </div>
                </div>
            </div>
            <div class="frames">
                <div class="preview" id="frame-container">
                    <div class="preview-canvas canvas-preview-item" data="test">
                      <canvas width="32" height="32" id="preview-canvas"></canvas>
                      <div class="frame-manager">
                        <div class="delete" id="delete"></div>
                        <div class="copy"></div>
                        <div class="drag"></div>
                      </div>
                    </div>
                  </div>
                  <div class="new-frame" id="new-frame">Add frame</div>
            </div>
        </div>
        <div class="palette">
            <div class="canvas-container" id="canvas-container">
                <div class="cursor" id="cursor"></div>
                <canvas id="canvas-overlay" class="canvas-overlay" height="32" width="32" style="z-index: 1;"></canvas>
                <canvas id="additional-canvas" class="additional-canvas" width="32" height="32" style="z-index: -1;"></canvas>
            </div>
          </div>
        <div class="animation" id="animation">
          <div class="animation-container" id="animation-frames">
                <div class="preview-canvas first">
                        <canvas width="32" height="32" id="animation-canvas"></canvas>                
                </div>
                <div class="fullscreen" id="fullscreen">Full Screen</div>
                <div class="export" id="export">Export to Gif</div>
                <div class="export" id="addstorage">Add to Storage</div>
                <div class="export" id="clearstorage">Clear Storage</div>
                <div class="size-switcher" id="size-switcher">
                    <div class="size active" data="32">32x32</div>
                    <div class="size" data="64">64x64</div>
                    <div class="size" data="128">128x128</div>
                </div>
          </div>
        </div>
    </div>
    </body>
    `;

describe('colorPicker', () => {
  it('should not set tools.color as color of current pixel if canvas is empty', () => {
    const tools = new Tools();
    const currentColor = tools.color;
    tools.currentTool = 'color-select';
    tools.colorPicker();
    const aim = document.getElementById('canvas-overlay');
    const ev = new Event('click');
    aim.dispatchEvent(ev);
    expect(tools.color).toBe(currentColor);
  });
});

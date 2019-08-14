import './assets/main.sass';
import App from './app/App.js';


const app = new App();
app.drawPen();
app.sizePicker();
app.toolPicker();
app.drawPen();
app.colorPallete();
app.addFrame();
app.restoreFromLocalStorage();
app.saveToLocalStorage();
app.sizeSwitcer();

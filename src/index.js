import './assets/main.sass';
import App from './app/app';


const app = new App();
app.addFrame();
app.restoreFromLocalStorage();
app.saveToLocalStorage();
app.canvasSizeSwitcer();

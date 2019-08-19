import './assets/main.sass';
import App from './app/app';


const app = new App();
app.restoreFromLocalStorage();
app.saveToLocalStorage();
app.canvasSizeSwitcer();

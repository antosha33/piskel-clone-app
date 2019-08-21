import './assets/main.sass';
import './assets/landing.sass';
import App from './app/app';


const app = new App();
app.canvasSizeSwitcer();

const create = document.getElementById('create');
const lp = document.getElementById('landing');
create.addEventListener('click', ()=>{
  lp.style.display = 'none';
})

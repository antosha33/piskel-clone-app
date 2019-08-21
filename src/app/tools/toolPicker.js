function toolPicker() {
  const tools = document.getElementById('tools');
  const child = Array.from(tools.children);
  function setCurrentTool(e) {
    const tool = e.target.getAttribute('id') || false;
    function setTool() {
      child.forEach((element) => {
        if (element.classList.contains('active')) {
          element.classList.remove('active');
        }
      });
      e.target.classList.add('active');
    }
    switch (tool) {
      case 'pen':
        this.currentTool = 'pen';
        setTool();
        this.drawPen();
        break;
      case 'color-select':
        this.currentTool = 'color-select';
        setTool();
        this.colorPicker();
        break;
      case 'paint-bucket':
        this.currentTool = 'paint-bucket';
        setTool();
        this.paintBucket();
        break;
      case 'eraser':
        this.currentTool = 'eraser';
        setTool();
        this.eraser();
        break;
      case 'circle':
        this.currentTool = 'circle';
        setTool();
        this.drawCircle();
        break;
      case 'line':
        this.currentTool = 'line';
        setTool();
        this.drawLine();
        break;
      default:
    }
  }
  tools.addEventListener('click', setCurrentTool.bind(this));
}

export {
  toolPicker,
};

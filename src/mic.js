class Mic {
  constructor(canvas, dev) {
    this.canvas = canvas;
    if (!dev) dev = new p5.AudioIn(this.showError);
    this.dev = dev;
    this.dev.start();
    this.state = getAudioContext().state;
  }
  
  getLevel(smoothig) {
    return mic.dev.getLevel(smoothig);
  }

  isAudioRunning() {
    if (getAudioContext().state !== "running") {
      if (this.canvas) this.canvas.mousePressed(this.startAudio);
      this.showGestureMsg();
      return false;
    } else if (this.state !== "running") {
      this.state = "running";
      background(0);
    }
    return true;
  }

  startAudio() {
    if (getAudioContext().state !== "running") {
      getAudioContext().resume();
      this.dev.start();
    } else if (this.canvas) {
      this.canvas.mousePressed(false);
    }
  }

  showGestureMsg() {
    background(0);
    textSize(40);
    textAlign(CENTER);
    fill(62, 62, 66);
    text("click or touch to \nstart microphone", 
         width / 2,
         height / 2);
  }

  showError() {
    textSize(40);
    textAlign(CENTER);
    fill(62, 62, 66);
    text("microphone could not \nbe started", 
         width / 2, 
         height / 2);
  }
}

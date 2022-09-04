// function preload(){
//   sound = loadSound('assets/Damscray_DancingTiger.mp3');
// }

function setup(){
  let cnv = createCanvas(windowWidth, windowHeight);
  frameRate(40);
  //cnv.mouseClicked(startPlay);
  fft = new p5.FFT();
  mic = new Mic(cnv);
  fft.setInput(mic.dev);
  //sound.amp(0.2);
}

function draw(){
  background(220);
  if (!mic.is_audio_running()) return;
  let spectrum = fft.analyze();
  noStroke();
  fill(255, 0, 255);
  for (let i = 0; i< spectrum.length; i++){
    let x = map(i, 0, spectrum.length, 0, width);
    let h = -height + map(spectrum[i], 0, 255, height, 0);
    rect(x, height, width / spectrum.length, h )
  }

  // let waveform = fft.waveform();
  // noFill();
  // beginShape();
  // stroke(20);
  // for (let i = 0; i < waveform.length; i++){
  //   let x = map(i, 0, waveform.length, 0, width);
  //   let y = map( waveform[i], -1, 1, 0, height);
  //   vertex(x,y);
  // }
  // endShape();

  text('tap to play', 20, 20);
}

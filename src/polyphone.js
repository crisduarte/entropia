// let polySynth;

// function setup() {
//   let cnv = createCanvas(100, 100);
//   cnv.mousePressed(playSynth);
//   background(220);
//   text('click to play', 20, 20);

//   polySynth = new p5.PolySynth();
// }

// function playSynth() {
//   userStartAudio();

//   // note duration (in seconds)
//   let dur = 0.1;

//   // time from now (in seconds)
//   let time = 0;

//   // velocity (volume, from 0 to 1)
//   let vel = 0.1;

//   // notes can overlap with each other
//   polySynth.play('G2', vel * 2, 0, 30 * dur);
//   polySynth.play('C6', vel, time += 1/4, dur);
//   polySynth.play('A6', vel / 4, time += 1/4, dur);
//   //polySynth.play('G3', vel, time += 1/4, dur);
// }

let polySynth = new p5.PolySynth();
let ms = new p5.MonoSynth();
let pitches = ['G', 'D', 'C', 'A'];
let octaves = [2, 3, 4];

function setup() {
  let cnv = createCanvas(100, 100);
  cnv.mousePressed(playChord);
  background(220);
  text('tap to play', 20, 20);
  ms.triggerAttack('A2', 0.3);
}

function playChord() {
  //userStartAudio();
  //ms.noteAttack('A2', 0.3);
  // play a chord: multiple notes at the same time
  ms.triggerAttack('A2', 0.3);
  for (let i = 0; i < 8; i++) {
    let note = random(pitches) + random(octaves);
    polySynth.noteAttack(note, 0.1);
  }
}

function mouseReleased() {
  // release all voices
  polySynth.noteRelease();
}
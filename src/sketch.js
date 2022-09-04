/*
entropia version 0.1
*/

let mic;
let pca1;
let pca2;
let render;
let prob = 0.0;
let angle;

function levelToProb(level, prob) {
  prob = (prob * 10 + map(level, 0.002, 0.1, 0, 1)) / 11;
  return prob;
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  //p = createP();
  //p.style("color", "#FFFFFF");
  pixelDensity(1);
  frameRate(60);
  background(0);
  angle = TWO_PI / 360;
  // new microphone
  mic = new Mic(canvas);
  // initial conf
  let conf = PCAconf.makeConf([ceil(width/8), floor(width/8)]);

  // // SQR4
  // pca2 = new PCA_SQR4(conf);
  
  // GKL4
  pca1 = new PCA_GKL4(conf);
  
  // ZQL4
  // pca = new PCA_ZQL4(conf);
  
  // render
  // gray palette
  // [color("#525252"), color("#FFFFFF"), color("#CFCFCF"), color("#ADADAD")]
  render1 = new PCARender(
    [color("#FF2A1B"), color("#FFF8EC"), 
     color("#000000"), color("#837F62")],
    width, height
  );
}

function draw() {
  //background(0, 5);
  // start audio
  if (!mic.isAudioRunning()) return;
  // compute noise
  let level = mic.getLevel();
  //print(prob);
  prob = levelToProb(level, prob);
  //p.html(prob);
  //
  pca1.step([0.25, 0.25, prob, prob]);
  let fct1 = 1;
  let fct2 = TWO_PI / 360;
  if (prob > 0.25) {
    fct1 = 1 + prob;
    fct2 = TWO_PI / 120;
  } else if (prob > 0.1) {
    fct1 = 1 + prob;
    fct2 = TWO_PI / 240;    
  }
  //
  angle += fct2;
  //
  render1.draw(
    pca1,
    fct1 * -0.1 * width, //x
    height / 2, //y
    (1 + fct1 * 0.2) * width, // w
    (i) => { 
      return sin(fct2) * (i - pca1.length / 2) * 
        (1 + 0.2) * width / pca1.length 
    }, //cfn
    (1 + fct1 * 0.2) * width * (pca1.length - 1) / pca1.length / 2, //xa
    0, //ya
    angle //a
  );
  
  // render1.draw(
  //   pca1,
  //   0, //x
  //   0, //y
  //   width, // w
  //   (i) => { return width / pca1.length }, //cfn
  //   0, //xa
  //   0, //ya
  //   0 //a
  // );
  // copy(0, 0, width, height, 0, width / pca1.length, width, height);
}

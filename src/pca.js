
class PCA_Rule {
  constructor(k, rule) {
    this.k = k;
    this.rule = [];
    this.update_rule(rule);
  }

  update_rule(rule) {
    let k1 = this.k - 1;
    if (rule.length != int(k1 * pow(this.k, 2) + k1 * this.k + k1) + 1)
      throw("invalid rule length");
    for (let i = 0; i < this.k; i++) {
      this.rule.push([]);
      for (let j = 0; j < this.k; j++) {
        this.rule[i].push([]);
        for (let k = 0; k < this.k; k++) {
          let pos = rule.length - int(i * pow(this.k, 2) + j * this.k + k);
          this.rule[i][j][k] = int(rule.charAt(pos - 1));
          if (this.rule[i][j][k] >= this.k) 
            throw("invalid rule state");
        }
      }
    }
  }
  
  transition(s1, s2, s3) {
    return this.rule[s1][s2][s3];
  }
}

/*
############
*/
class PCAconf {
  static makeConf(runs) {
    let conf = [];
    for (let i = 0; i < runs.length; i++)
      conf = conf.concat(new Array(runs[i]).fill(i));
    return shuffle(conf);
  }

  constructor(k, cells) {
    this.k = k;
    this.cells = [...cells];
  }
  
  countState(s) {
    let n = 0;
    for (let i = 0; i < this.cells.length; i++)
      n += this.cells[i] == s;
    return n;
  }
}

/*
############
*/
class PCA {
  constructor(k, rule, conf) {
    this.t = 0;
    this.k = k;
    this.rule = new PCA_Rule(k, rule);
    this.length = conf.length;
    this.steps = [new PCAconf(k, conf), new PCAconf(k, conf)];
  }
  
  getPreviousStep() {
    return this.steps[(this.t + this.steps.length - 1) % this.steps.length];
  }
  
  getCurrentStep() {
    return this.steps[this.t % this.steps.length];
  }
  
  step(probs) {
    let cur = this.getCurrentStep();
    let pre = this.getPreviousStep();
    // avoid states vanishing
    if (pre.countState(0) < 20) probs[0] = 0.0;
    if (pre.countState(1) < 20) probs[1] = 0.0;
    for (let i = 0; i < cur.cells.length; i++) {
      cur.cells[i] = this.applyNoise(
        this.rule.transition(
          pre.cells.at(i - 1), 
          pre.cells.at(i), 
          pre.cells.at((i + 1) % pre.cells.length)
        ), 
        probs,
        i
      );
    }
    // update time tick
    this.t++;
    return this;
  }
  
  applyNoise(s, probs, i) {
    let p = probs[s];
    if (p > 0.0) {
      let toss = noise(this.t * 0.01, i * 0.1, p * 0.1) * 0.5;//random();
      if (toss < p) return floor(random(this.k));
    }
    return s;
  }
}

/*
############
*/

class PCARender {
  constructor(colors, w, h) {
    this.colors = colors;
    this.weight = w;
    this.height = h;
    this.canvas = createGraphics(w, h);
  }
  
  draw(pca, x, y, w, cfn, xa, ya, a) {
    this.canvas.push();
    let cur = pca.getCurrentStep();
    this.canvas.background(0, 5);
    this.canvas.noStroke();
    this.canvas.translate(x + xa, y + ya);
    if (a) this.canvas.rotate(a);
    this.canvas.translate(-xa, -ya);
    for (let s = 0; s < pca.k; s++) {
      this.canvas.fill(this.colors[s]);
      for (let i = 0; i < pca.length; i++) {
        if (cur.cells[i] != s) continue;
        this.canvas.ellipse(
          i * w / pca.length, 
          0, 
          cfn(i), 
          cfn(i)
        );
      }
    }
    this.canvas.pop();
    image(this.canvas, 0, 0);
  }
}

/*
############
*/
class PCA_GKL4 extends PCA {
  constructor(conf) {
    super(4, "2212221213130000221222121313333322122212131333330020002013130000", conf);
  }
}

class PCA_ZQL4 extends PCA {
  constructor(conf) {
    //2222222011110310222222203333031022121112111103102220222000000310
    super(4, "2222221213100000222222121310333322122212131011112220002013100000", conf);
  }
}

class PCA_SQR4 extends PCA {
  constructor(conf) {
    //3330333012120000323033301212222211121113121222223330333012120000
    super(4, "2212321233333030221222121111303022122212111130300020003033333030", conf);
  }
}

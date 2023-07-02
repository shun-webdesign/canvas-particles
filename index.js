window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(cb) {setTimeout(cb, 17);};

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const NUM = 250;
  const LIFEMAX = 400;
  const particles = [];
  let W = canvas.clientWidth;
  let H = canvas.clientHeight;

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  function resizeCanvas() {
    // canvas要素のクライアントサイズを取得
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    W = canvas.clientWidth;
    H = canvas.clientHeight;
  }
  
  class Particle {
    constructor(x, y) {
      this.x = x || 0;
      this.y = y || 0;
      this.radius = 250;
      this.startLife = Math.ceil(LIFEMAX * Math.random());
      this.life = this.startLife;
      this.v = {
        x: Math.random() * 10 - 5,
        y: Math.random() * 10 - 5,
      };
      this.color = {
        r: Math.floor(Math.random() * 255),
        g: Math.floor(Math.random() * 255),
        b: Math.floor(Math.random() * 255),
        a: 1,
      };
    }
  
    render() {
      this.updateParams();
      this.updatePosition();
      this.wrapPosition();
      this.draw();
    }
  
    draw() {
      ctx.beginPath();
      ctx.fillStyle = this.gradient();
      ctx.arc(this.x, this.y, this.radius, Math.PI * 2, false);
      ctx.fill();
      ctx.closePath();
    }
  
    updateParams() {
      const ratio = this.life / this.startLife;
      this.color.a = 1 - ratio;
      this.radius = 30 / ratio;
      if (this.radius > 300) this.radius = 300;
      this.life -= 1;
      if (this.life === 0) this.initialize();
    }
  
    updatePosition() {
      this.x += this.v.x;
      this.y += this.v.y;
    }
  
    wrapPosition() {
      if (this.x < 0) this.x = W;
      if (this.x > W) this.x = 0;
      if (this.y < 0) this.y = H;
      if (this.y > H) this.y = 0;
    }
  
    gradient() {
      const col = `${this.color.r}, ${this.color.g}, ${this.color.b}`;
      const g = ctx.createRadialGradient(
        this.x,
        this.y,
        0,
        this.x,
        this.y,
        this.radius
      );
      g.addColorStop(0, `rgba(${col}, ${this.color.a * 1})`);
      g.addColorStop(0.5, `rgba(${col}, ${this.color.a * 0.2})`);
      g.addColorStop(1, `rgba(${col}, ${this.color.a * 0})`);
      return g;
    }
  
    initialize() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.startLife = Math.ceil(LIFEMAX * Math.random());
      this.life = this.startLife;
      this.v = {
        x: Math.random() * 10 - 5,
        y: Math.random() * 10 - 5,
      };
      this.color = {
        r: Math.floor(Math.random() * 255),
        g: Math.floor(Math.random() * 255),
        b: Math.floor(Math.random()
        * 255),
        a: 1,
      };
    }
  }
  
  for (let i = 0; i < NUM; i++) {
    const positionX = Math.random() * W;
    const positionY = Math.random() * H;
    const particle = new Particle(positionX, positionY);
    particles.push(particle);
  }
  
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "color-dodge";
  
    particles.forEach((particle) => {
      particle.render();
    });
  
    requestAnimationFrame(render);
  }
  
  // Start the rendering process
  render();
  
  // Resize canvas when the window is resized
  window.addEventListener("resize", resizeCanvas);
  
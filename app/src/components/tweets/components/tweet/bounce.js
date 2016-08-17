;(function(){

  var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');

  var colors = [
    'rgba(26, 188, 156, 0.5)',
    'rgba(46, 204, 113, 0.5)',
    'rgba(52, 152, 219, 0.5)',
    'rgba(155, 89, 182, 0.5)',
    'rgba(52, 73, 94, 0.5)',
    'rgba(22, 160, 133, 0.5)',
    'rgba(39, 174, 96, 0.5)',
    'rgba(41, 128, 185, 0.5)',
    'rgba(142, 68, 173, 0.5)',
    'rgba(142, 68, 173, 0.5)',
    'rgba(44, 62, 80, 0.5)',
    'rgba(241, 196, 15, 0.5)',
    'rgba(230, 126, 34, 0.5)',
    'rgba(231, 76, 60, 0.5)',
    'rgba(149, 165, 166, 0.5)',
    'rgba(241, 196, 15, 0.5)',
    'rgba(211, 84, 0, 0.5)',
    'rgba(192, 57, 43, 0.5)',
    'rgba(127, 140, 141, 0.5)',
    'rgba(189, 195, 199, 0.5)'
  ];

  var particles = [],
    minSize = 10,
    maxSize = 45,
    minSpeed = 20,
    maxSpeed = 45,
    maxParticles = 5000,
    run;

  var winWidth  = window.innerWidth,
    winHeight = window.innerHeight;

  var _init = function() {
    canvas.width = winWidth;
    canvas.height = winHeight;
    create_particle(0, maxSize, maxSize);
    run = setInterval( run_animation, 33);
  };

  var create_particle = function( i, x, y ) {
    particles[i] = {
      x : x,
      y : y,
      ySpeed : (!i) ? maxSpeed : Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed,
      xSpeed : (!i) ? maxSpeed : Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed,
      color : colors[Math.floor( Math.random() * colors.length)],
      size : (!i) ? maxSize : Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize,
    }

    $('.count').html( particles.length );
  };

  var draw_particle = function( item ) {
    ctx.beginPath();
    ctx.arc(item.x, item.y, item.size, 0, 2*Math.PI, false );
    ctx.fillStyle = item.color;
    ctx.fill();
  };

  var move_particle = function( i ) {

    var old = particles[i],
      np = ( particles.length < maxParticles && !i ) ? true : false;

    if ( old.x > winWidth - old.size ) {
      if (np) {
        create_particle( particles.length, winWidth - old.size, old.y );
      };
      old.xSpeed = old.xSpeed * -1;
    };

    if ( old.x < 0 ) {
      if (np) {
        create_particle( particles.length, 1, old.y );
      };
      old.xSpeed = old.xSpeed * -1;
    };

    if ( old.y >= winHeight - old.size ) {
      if (np) {
        create_particle( particles.length, old.x, winHeight - old.size );
      };
      old.ySpeed = old.ySpeed * -1;
    };

    if ( old.y <= 0 ) {
      if (np) {
        create_particle( particles.length, old.x, 1 );
      };
      old.ySpeed = old.ySpeed * -1;
    };

    particles[i] = {
      x : old.x + old.xSpeed,
      y : old.y + old.ySpeed,
      ySpeed : old.ySpeed,
      xSpeed : old.xSpeed,
      color : old.color,
      size : old.size,
    }

  };

  var move_all_particles = function() {
    for (var i = particles.length - 1; i >= 0; i--) {
      move_particle(i);
    };
  };

  var draw_all_particles = function() {
    for (var i = particles.length - 1; i >= 0; i--) {
      draw_particle( particles[i] );
    };
  };

  var clearCanvas = function(){
    ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
  }

  var run_animation = function() {
    clearCanvas();
    move_all_particles();
    draw_all_particles();
  };

  _init();

})();
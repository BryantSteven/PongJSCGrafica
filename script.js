console.clear();

(function (window, document, THREE){
  
  var WIDTH = 1500,
      HEIGHT = 500,
      VIEW_ANGLE = 40,
      ASPECT = WIDTH / HEIGHT,
      NEAR = 0.1,
      FAR = 10000,
      FIELD_WIDTH = 1200,
      FIELD_LENGTH = 3000,
      BALL_RADIUS = 100,
      PADDLE_WIDTH = 500,
      PADDLE_HEIGHT = 10,
      
     
     
      container, renderer, camera, mainLight,
      scene, ball, paddle1, paddle2, field, running;
      
  
  function startBallMovement() {
    var direction = Math.random() > 0.5 ? -1 : 1;
    ball.$velocity = {
      x: 0,
      z: direction * 20
    };
    ball.$stopped = false;
  }
  
  
  function processBallMovement() {
    if(!ball.$velocity) {
      startBallMovement();
    }
    
    if(ball.$stopped) {
      return;
    }
    
    updateBallPosition();
    
    if(isSideCollision()) {
      ball.$velocity.x *= -1; 
    }
    
    if(isPaddle1Collision()) {
      hitBallBack(paddle1);
    }
    
    if(isPaddle2Collision()) {
      hitBallBack(paddle2);
    }
    
  }
  
  function isPastPaddle1() {
    return ball.position.z > paddle1.position.z + 100;
  }
  
  function isPastPaddle2() {
    return ball.position.z < paddle2.position.z - 100;
  }
  
  function updateBallPosition() {
    var ballPos = ball.position;
    
    //Ball position
    ballPos.x += ball.$velocity.x;
    ballPos.z += ball.$velocity.z;
    
  }
  
  function isSideCollision() {
    var ballX = ball.position.x,
        halfFieldWidth = FIELD_WIDTH / 2;
    return ballX - BALL_RADIUS < -halfFieldWidth || ballX + BALL_RADIUS > halfFieldWidth;
  }
  
  function hitBallBack(paddle) {
    ball.$velocity.x = (ball.position.x - paddle.position.x) / 5; 
    ball.$velocity.z *= -1;
  }
  
  function isPaddle2Collision() {
    return ball.position.z - BALL_RADIUS <= paddle2.position.z && 
        isBallAlignedWithPaddle(paddle2);
  }
  
  function isPaddle1Collision() {
    return ball.position.z + BALL_RADIUS >= paddle1.position.z && 
        isBallAlignedWithPaddle(paddle1);
  }
  
  function isBallAlignedWithPaddle(paddle) {
    var halfPaddleWidth = PADDLE_WIDTH / 2,
        paddleX = paddle.position.x,
        ballX = ball.position.x;
    return ballX > paddleX - halfPaddleWidth && 
        ballX < paddleX + halfPaddleWidth;
  }
  

  
  function stopBall(){ 
    ball.$stopped = true;
  }
  

  
  function startRender(){
    running = true;
    render();  
  }
  
  function stopRender() {
    running = false;
  }
  
  function render() {
    if(running) {
      requestAnimationFrame(render);
      
      processBallMovement();
      
      
      renderer.render(scene, camera);
    }
  }
  
  function reset() {
    ball.position.set(0,0,0);
    ball.$velocity = null;
  }
  
  function init() {
    container = document.getElementById('container');
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(0x000000, 1);
    container.appendChild(renderer.domElement);
    
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    camera.position.set(0, 5000, FIELD_LENGTH / 2 + 500);
    
    scene = new THREE.Scene();
    scene.add(camera);
    
    var fieldGeometry = new THREE.CubeGeometry(FIELD_WIDTH, 5, FIELD_LENGTH, 1, 1, 1),
        fieldMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff });
    field = new THREE.Mesh(fieldGeometry, fieldMaterial);
    field.position.set(0, -50, 0);
    
    scene.add(field);
    paddle1 = addPaddle();
    paddle1.position.z = FIELD_LENGTH / 2;
    paddle2 = addPaddle();
    paddle2.position.z = -FIELD_LENGTH / 2;
    
    var ballGeometry = new THREE.SphereGeometry(BALL_RADIUS, 16, 16),
        ballMaterial = new THREE.MeshLambertMaterial({ color: 0xCC0000 });
    ball = new THREE.Mesh(ballGeometry, ballMaterial);
    scene.add(ball);
    
    camera.lookAt(ball.position);
    
    mainLight = new THREE.HemisphereLight(0xFFFFFF, 0x003300);
    scene.add(mainLight);
    
    camera.lookAt(ball.position);
      
  
    startRender();
    
    renderer.domElement.addEventListener('mousemove', containerMouseMove);
    renderer.domElement.style.cursor = 'none';
  }
  
  function addPaddle() {
    var paddleGeometry = new THREE.CubeGeometry(PADDLE_WIDTH, PADDLE_HEIGHT, 10, 1, 1, 1),
        paddleMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 }),
        paddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
    scene.add(paddle);
    return paddle;
  }
  
  
  init();
})(window, window.document, window.THREE);
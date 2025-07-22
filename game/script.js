let camera, scene, renderer, controls;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
let bullets = [];
let zombies = [];
let clock = new THREE.Clock();
let inCar = false;
let car;
let questionIndex = 0;

const questions = [
  { q: '¿Cuál es la capital de España?', a: 'madrid' },
  { q: '2 + 2 = ?', a: '4' },
  { q: 'Nombre del planeta rojo', a: 'marte' },
  { q: '¿Cuántos días tiene una semana?', a: '7' },
  { q: '¿En qué continente está Brasil?', a: 'américa' }
];

function init() {
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
  controls = new THREE.PointerLockControls(camera, document.body);
  document.getElementById('startButton').addEventListener('click', () => {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('crosshair').classList.remove('hidden');
    controls.lock();
  });
  scene.add(controls.getObject());
  camera.position.y = 1.6;

  const plane = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshBasicMaterial({ color: 0x707070 }));
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  createCar();
  spawnZombie();

  window.addEventListener('resize', onWindowResize);
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
  document.addEventListener('click', shoot, false);
  document.getElementById('submitAnswer').addEventListener('click', checkAnswer);
  animate();
}

function createCar() {
  const body = new THREE.BoxGeometry(2, 1, 4);
  const mat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  car = new THREE.Mesh(body, mat);
  car.position.set(-5, 0.5, 5);
  scene.add(car);
}

function spawnZombie() {
  const g = new THREE.BoxGeometry(1, 2, 1);
  const m = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const z = new THREE.Mesh(g, m);
  z.position.set(Math.random() * 20 - 10, 1, Math.random() * -20);
  scene.add(z);
  zombies.push(z);
}

function shoot() {
  if (document.pointerLockElement !== document.body || inCar) return;
  const geometry = new THREE.SphereGeometry(0.1, 8, 8);
  const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const bullet = new THREE.Mesh(geometry, material);
  bullet.position.copy(camera.position);
  const dir = new THREE.Vector3();
  camera.getWorldDirection(dir);
  bullet.userData.velocity = dir.clone().multiplyScalar(50);
  bullets.push(bullet);
  scene.add(bullet);
}

function onKeyDown(event) {
  switch (event.key.toLowerCase()) {
    case 'w': moveForward = true; break;
    case 's': moveBackward = true; break;
    case 'a': moveLeft = true; break;
    case 'd': moveRight = true; break;
    case 'e':
      if (!inCar && camera.position.distanceTo(car.position) < 3) {
        inCar = true;
        controls.unlock();
        document.getElementById('crosshair').classList.add('hidden');
      } else if (inCar) {
        inCar = false;
        controls.lock();
        document.getElementById('crosshair').classList.remove('hidden');
      }
      break;
    case 'q':
      askQuestion();
      break;
  }
}

function onKeyUp(event) {
  switch (event.key.toLowerCase()) {
    case 'w': moveForward = false; break;
    case 's': moveBackward = false; break;
    case 'a': moveLeft = false; break;
    case 'd': moveRight = false; break;
  }
}

function askQuestion() {
  const box = document.getElementById('questionBox');
  box.classList.remove('hidden');
  document.getElementById('questionText').textContent = questions[questionIndex].q;
}

function checkAnswer() {
  const input = document.getElementById('answerInput');
  const feedback = document.getElementById('feedback');
  if (input.value.trim().toLowerCase() === questions[questionIndex].a) {
    feedback.textContent = '¡Correcto! Nueva arma desbloqueada.';
    questionIndex = (questionIndex + 1) % questions.length;
  } else {
    feedback.textContent = 'Inténtalo de nuevo';
  }
  input.value = '';
}

function updatePlayer(delta) {
  const speed = 5;
  if (moveForward) controls.moveForward(speed * delta);
  if (moveBackward) controls.moveForward(-speed * delta);
  if (moveLeft) controls.moveRight(-speed * delta);
  if (moveRight) controls.moveRight(speed * delta);
}

function updateCar(delta) {
  const speed = 10;
  const rotSpeed = 2;
  if (moveForward) car.translateZ(-speed * delta);
  if (moveBackward) car.translateZ(speed * delta);
  if (moveLeft) car.rotation.y += rotSpeed * delta;
  if (moveRight) car.rotation.y -= rotSpeed * delta;
  camera.position.set(car.position.x, car.position.y + 1, car.position.z);
  camera.rotation.copy(car.rotation);
}

function updateBullets(delta) {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.position.addScaledVector(b.userData.velocity, delta);
    if (b.position.length() > 200) {
      scene.remove(b);
      bullets.splice(i, 1);
      continue;
    }
    for (let j = zombies.length - 1; j >= 0; j--) {
      if (b.position.distanceTo(zombies[j].position) < 1) {
        scene.remove(zombies[j]);
        zombies.splice(j, 1);
        scene.remove(b);
        bullets.splice(i, 1);
        spawnZombie();
        break;
      }
    }
  }
}

function updateZombies(delta) {
  zombies.forEach(z => {
    const dir = new THREE.Vector3();
    dir.subVectors(camera.position, z.position).normalize();
    z.position.addScaledVector(dir, delta * 1.5);
  });
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  if (inCar) {
    updateCar(delta);
  } else {
    updatePlayer(delta);
  }
  updateBullets(delta);
  updateZombies(delta);
  renderer.render(scene, camera);
}

init();

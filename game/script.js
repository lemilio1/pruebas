let camera, scene, renderer, controls;
let objects = [];
let questionIndex = 0;
const questions = [
  { q: '¿Cuál es la capital de España?', a: 'madrid' },
  { q: '2 + 2 = ?', a: '4' },
  { q: 'Nombre del planeta rojo', a: 'marte' }
];

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // suelo
  const geometry = new THREE.PlaneGeometry(100, 100);
  const material = new THREE.MeshBasicMaterial({ color: 0x555555 });
  const plane = new THREE.Mesh(geometry, material);
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  // controles estilo FPS
  controls = new THREE.PointerLockControls(camera, document.body);
  const startButton = document.getElementById('startButton');
  startButton.addEventListener('click', () => {
    document.getElementById('menu').style.display = 'none';
    controls.lock();
  });

  scene.add(controls.getObject());
  camera.position.y = 1.6;

  spawnZombie();

  window.addEventListener('resize', onWindowResize);
  animate();
}

function spawnZombie() {
  const geometry = new THREE.BoxGeometry(1, 2, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const zombie = new THREE.Mesh(geometry, material);
  zombie.position.set(5, 1, -5);
  scene.add(zombie);
  objects.push(zombie);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
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
    feedback.textContent = '¡Correcto! Has ganado un arma nueva.';
    questionIndex = (questionIndex + 1) % questions.length;
  } else {
    feedback.textContent = 'Inténtalo de nuevo';
  }
  input.value = '';
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

init();

document.getElementById('submitAnswer').addEventListener('click', checkAnswer);
document.addEventListener('keydown', (e) => {
  if (e.key === 'q') {
    askQuestion();
  }
});

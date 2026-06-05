import './style.css';
import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xb7e4a8);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.z = 8;

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialias: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);

scene.add(new THREE.AmbientLight(0xffffff, 1));

const light = new THREE.PointLight(0xffffff, 2);
light.position.set(5, 5, 5);
scene.add(light);

const audio = new Audio('/o.mp3');
audio.loop = true;

const objects = [];

function createObject(geometry, x, y, z) {
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);

  mesh.spin = { x: 0, y: 0, z: 0 };

  scene.add(mesh);
  objects.push(mesh);
}

createObject(new THREE.BoxGeometry(1.5, 1.5, 1.5), -4, 1, 0);
createObject(new THREE.ConeGeometry(1, 1.8, 3), -1.5, -1, 0);
createObject(new THREE.OctahedronGeometry(1.2), 1.5, 1, 0);
createObject(new THREE.TorusGeometry(0.9, 0.3, 16, 100), 4, -1, 0);
createObject(new THREE.IcosahedronGeometry(1.1), 0, 2.5, -2);

const upload = document.getElementById('textureUpload');
const defaultButton = document.getElementById('defaultButton');

function startWithTexture(texturePath) {
  new THREE.TextureLoader().load(texturePath, function (texture) {
    texture.colorSpace = THREE.SRGBColorSpace;

    objects.forEach((obj) => {
      obj.material.map = texture;
      obj.material.color.set(0xffffff);
      obj.material.needsUpdate = true;

      obj.spin = {
        x: Math.random() * 0.12 + 0.03,
        y: Math.random() * 0.12 + 0.03,
        z: Math.random() * 0.12 + 0.03,
      };

      obj.pauseTimer = Math.random() * 120;
      obj.isPaused = false;
    });

    audio.currentTime = 0;
    audio.play().catch((error) => {
      console.error('Audio failed to play:', error);
    });
  });
}

upload.addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const imageURL = URL.createObjectURL(file);
  startWithTexture(imageURL);
});

defaultButton.addEventListener('click', function () {
  startWithTexture('/texture.JPG');
});

function animate() {
  requestAnimationFrame(animate);

  objects.forEach((obj) => {
    if (!obj.pauseTimer) obj.pauseTimer = Math.random() * 120;

    obj.pauseTimer--;

    if (obj.pauseTimer <= 0) {
      obj.isPaused = !obj.isPaused;

      if (obj.isPaused) {
        obj.pauseTimer = Math.random() * 80 + 30;
      } else {
        obj.spin.x = Math.random() * 0.18 - 0.09;
        obj.spin.y = Math.random() * 0.18 - 0.09;
        obj.spin.z = Math.random() * 0.18 - 0.09;
        obj.pauseTimer = Math.random() * 120 + 40;
      }
    }

    if (!obj.isPaused) {
      obj.rotation.x += obj.spin.x;
      obj.rotation.y += obj.spin.y;
      obj.rotation.z += obj.spin.z;
    }
  });

  renderer.render(scene, camera);
}

animate();
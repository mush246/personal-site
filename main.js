

import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const container = document.getElementById('canvas-container');
const w = 400;
const h = 400;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(w, h);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
container.replaceChildren(renderer.domElement);
// gia na kanei apply to cursor kai sto canvas real bravo gemi
Object.defineProperty(renderer.domElement.style, 'cursor', {
  get: () => 'url(cursor.png), auto', 
  set: () => {}, 
  configurable: true
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.rotateSpeed = 0.6;
controls.enablePan = false;
controls.enableZoom = false;

// mh to vgaleis kanei pio dark ta sides auto
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

// front kai back light idia
const frontLight = new THREE.DirectionalLight(0xffffff, 2.2);
frontLight.position.set(0, 0, 5);
scene.add(frontLight);

const backLight = new THREE.DirectionalLight(0xffffff, 2.2);
backLight.position.set(0, 0, -5);
scene.add(backLight);

const modelGroup = new THREE.Group();
scene.add(modelGroup);

const loader = new OBJLoader();

loader.load(
  '/3dpixelatedlogo.obj',
  function (object) {
    // xrwmata kai arwmata
    object.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: 0xd1bbf7,   
          roughness: 0.9,     
          metalness: 0.0,     
          flatShading: true,  
        });
      }
    });

    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    object.position.sub(center);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2.9 / maxDim;
    modelGroup.scale.set(scale, scale, scale);

    modelGroup.add(object);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

window.addEventListener('resize', () => {
  camera.aspect = 1;
  camera.updateProjectionMatrix();
  renderer.setSize(400, 400);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  // vlakia gia na mhn stamataei to autorotation akoma kai me drag
  const delta = clock.getDelta();
  modelGroup.rotation.y += delta * -0.8;

  controls.update();
  renderer.render(scene, camera);
}
animate();
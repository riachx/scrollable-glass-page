import './style.css';

import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { createTorusMaterial, createCubeMaterial } from './materials.js';

/* Scene, camera, renderer */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

/* Setup renderer and camera */
function setupRenderer() {9
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.set(0, 5, 20);
}

/* Window resize handler */
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

/* Setup lights */
function setupLights() {
  const pointLight = new THREE.PointLight(0xffffff);
  pointLight.position.set(0, 0, 0);

  const ambientLight = new THREE.AmbientLight(0xffffff);
  ambientLight.position.set(5, 5, 5);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(20, 20, 5);

  scene.add(pointLight, ambientLight, directionalLight);
}

/* Create torus */
function createTorus() {
  const torusGeometry = new THREE.TorusKnotGeometry(13, 4, 100, 100);
  const torusMaterial = createTorusMaterial();

  const torus = new THREE.Mesh(torusGeometry, torusMaterial);
  torus.position.set(0, 42, 0);
  scene.add(torus);
  return torus;
}

/* Load environment and model */
function loadEnvironment() {
  new RGBELoader()
    .load('/assets/warehouse.hdr', function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      
      const fbxLoader = new FBXLoader();
      fbxLoader.load('/assets/models/chamfercube.fbx', function (fbx) {
        fbx.name = 'Cube_fbx';
        fbx.position.set(0, 0, 10);
        fbx.scale.set(0.035, 0.035, 0.035);
        fbx.rotation.set(90, 120, 90);
        
        const cubeMaterial = createCubeMaterial();
        
        fbx.traverse((child) => {
          if (child.isMesh) {
            
            child.material = cubeMaterial;
            child.material.envMap = texture;
            child.material.needsUpdate = true;
          }
        });
        
        scene.add(fbx);
      }, undefined, function (error) {
        console.error(error);
      });
    });
}

/* Load font and create text */
function loadFont() {
  const fontLoader = new FontLoader();

  fontLoader.load('/assets/fonts/Poppins_ExtraBold.json', function (font) {
    const smallTextConfig = {
      size: 3,
      height: 0.001,
      font: font,
    };

    const largeTextConfig = {
      size: 6.5,
      height: 0.001,
      font: font,
    };

    /* Create text geometries */
    const textExplore = new TextGeometry('Explore', { ...smallTextConfig });
    const textNew = new TextGeometry('New', { ...smallTextConfig });
    const textIdeas = new TextGeometry('Ideas.', { ...smallTextConfig });
    const textExpand = new TextGeometry('Expand', { ...largeTextConfig });
    const textYour = new TextGeometry('Your', { ...largeTextConfig });
    const textHorizons = new TextGeometry('Horizons.', { ...largeTextConfig });

    const textMaterial = new THREE.MeshPhysicalMaterial({ color: 0xd7dbde });
    
    /* Create text meshes */
    const textMesh1 = new THREE.Mesh(textExplore, textMaterial);
    const textMesh2 = new THREE.Mesh(textNew, textMaterial);
    const textMesh3 = new THREE.Mesh(textIdeas, textMaterial);
    const textMesh4 = new THREE.Mesh(textExpand, textMaterial);
    const textMesh5 = new THREE.Mesh(textYour, textMaterial);
    const textMesh6 = new THREE.Mesh(textHorizons, textMaterial);

    /* Position text meshes */
    textMesh1.position.set(-7, 2.8, 6);
    textMesh2.position.set(-3.7, -2, 6);
    textMesh3.position.set(-5.2, -6.5, 6);
    textMesh4.position.set(-15, 50, 4);
    textMesh5.position.set(-10, 40, 4);
    textMesh6.position.set(-18, 30, 4);

    scene.add(textMesh1, textMesh2, textMesh3, textMesh4, textMesh5, textMesh6);
  });
}

/* Camera movement */
function moveCamera() {
  const scrollTop = document.body.getBoundingClientRect().top;
  
  camera.position.z = scrollTop * -0.01 + 20;
  camera.position.x = scrollTop * -0.0002;
  camera.position.y = scrollTop * -0.02;
}

/* Animation loop */
function animate(torus) {
  requestAnimationFrame(() => animate(torus));
  
  /* Rotate torus */
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.01;
  torus.rotation.z += 0.01;

  /* Rotate cube if loaded */
  const fbxObject = scene.getObjectByName('Cube_fbx');
  if (fbxObject) {
    fbxObject.rotation.x += 0.01;
  }
	
  renderer.render(scene, camera);
}

/* Initialize application */
function init() {
  setupRenderer();
  setupLights();
  
  const torus = createTorus();
  loadEnvironment();
  loadFont();
  
  window.addEventListener('resize', onWindowResize);
  onWindowResize();
  
  document.body.onscroll = moveCamera;
  camera.position.set(0, 50, 50);
  moveCamera();
  
  renderer.render(scene, camera);
  animate(torus);
}

/* Start application */
init();


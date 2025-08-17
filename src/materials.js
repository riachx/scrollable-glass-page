import { MeshTransmissionMaterial } from './MeshTransmissionMaterial.js';

/* Material Factories */
function createTorusMaterial() {
  return Object.assign(new MeshTransmissionMaterial(8), {
    clearcoatRoughness: 0,
    transmission: 0.95,
    chromaticAberration: 0.2,
    roughness: 0.3,
    thickness: 7,
    ior: 1.2,
    envMapIntensity: 50,
    bloomstrength: 50,
    distortion: 0.3,
    distortionScale: 0.1,
  });
}

function createCubeMaterial() {
  return Object.assign(new MeshTransmissionMaterial(8), {
    clearcoatRoughness: 0,
    transmission: 1,
    chromaticAberration: 0.03,
    anisotropy: 0.1,
    roughness: 0,
    thickness: 3,
    ior: 1.5,
    envMapIntensity: 7,
    distortion: 0,
    distortionScale: 0.5,
    temporalDistortion: 0.0,
  });
}

export { createTorusMaterial, createCubeMaterial };
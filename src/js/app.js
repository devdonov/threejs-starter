import * as THREE from 'three';

import fragment from './shader/fragment.glsl'
import vertex from './shader/vertex.glsl'

import { TimelineMax } from 'gsap';

let OrbitControls = require('three-orbit-controls')(THREE);

class Sketch {
  constructor(options) {
    this.scene = new THREE.Scene();

    this.container = options.dom;
    this.width = this.container.width;
    this.height = this.container.height;
    
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xeeeeee, 1);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
    );

    {
      const frustumSize = 1;
      let aspect = 1;
      this.camera = new THREE.OrthographicCamera( frustumSize / -2, frustumSize / 2, frustumSize / 2, frustumSize / -2, -1000, 1000 )
    }

    this.camera.position.set(0, 0, 2);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.time = 0;

    this.isPlaying = true;

    // bind methods
    this.render = this.render.bind(this);

    // call methods
    this.addObjects();
    this.resize();
    this.render();
    this.setupResize();
  }

  addObjects() {
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable"
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: "f", value: 0 },
        resolution: { type: "v4", value: new THREE.Vector4() },
        uvRate1: {
          value: new THREE.Vector2(1, 1)
        }
      },
      vertexShader: vertex,
      fragmentShader: fragment
    });

    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.plane);
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    const aspect = this.camera.aspect = this.width / this.height;

    this.imageAspect = 853 / 1280;
    const rAspect = this.height / this.width;
    let a1, a2;

    if (rAspect > this.imageAspect) {
      [a1, a2] = [aspect * this.imageAspect, 1];
    } else {
      [a1, a2] = [1, rAspect / this.imageAspect];
    }

    this.material.uniforms.resolution.value.x = this.width;
    this.material.uniforms.resolution.value.y = this.height;
    this.material.uniforms.resolution.value.z = a1;
    this.material.uniforms.resolution.value.w = a2;

    this.camera.updateProjectionMatrix()
  }

  render() {
    if (!this.isPlaying) return;

    this.time += 0.05;
    this.material.uniforms.time.value = this.time;
    requestAnimationFrame(this.render);
    this.renderer.render(this.scene, this.camera);
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this))
  }

  stop() {
    this.isPlaying = false;
  }

  play() {
    if(!this.isPlaying) {
      this.render();
      this.isPlaying = true;
    }
  }

}

new Sketch({
  dom: document.getElementById("container")
})

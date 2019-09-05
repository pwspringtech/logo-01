import React, { Component } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";

class App extends Component {
  componentDidMount() {
    this.sceneSetup();
    // this.lighting();
    this.addObjects();
    this.animate();
  }

  sceneSetup = () => {
    this.scene = new THREE.Scene();
    // this.scene.background = new THREE.Color(0xffffff); // white background
    this.scene.background = new THREE.Color(0x000000); // black background

    this.camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.z = 7;

    this.controls = new OrbitControls(this.camera, this.el);
    this.controls.enableZoom = true;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      gammaOutput: true,
      gammaFactor: 2.2
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.mount.appendChild(this.renderer.domElement);
    window.addEventListener("resize", this.handleWindowResize);
  };

  lighting = () => {
    // Blue back
    RectAreaLightUniformsLib.init();
    this.rectLight1 = new THREE.RectAreaLight(0x0030ff, 1, 5, 50);
    this.rectLight1.position.set(0, 0, -10);
    this.rectLight1.lookAt(0, 0, 0);
    this.scene.add(this.rectLight1);

    // Blue 2
    this.rectLight2 = new THREE.RectAreaLight(0x0030ff, 1, 5, 50);
    this.rectLight2.position.x = -9;
    this.rectLight2.position.z = 3;
    this.rectLight2.lookAt(0, 0, 0);
    this.scene.add(this.rectLight2);

    // Red
    this.rectLight3 = new THREE.RectAreaLight(0xfb3f3f, 1, 5, 50);
    this.rectLight3.position.x = 8;
    this.rectLight3.position.z = 3;
    this.rectLight3.lookAt(0, 0, 0);
    this.scene.add(this.rectLight3);

    // Green
    this.rectLight4 = new THREE.RectAreaLight(0x18ff00, 1, 5, 50);
    this.rectLight4.position.x = -8;
    this.rectLight4.position.z = -6;
    this.rectLight4.lookAt(0, 0, 0);
    this.scene.add(this.rectLight4);

    //Green 2
    this.rectLight5 = new THREE.RectAreaLight(0x18ff00, 1, 10, 50);
    this.rectLight5.position.set(0, 0, 10);
    this.rectLight5.lookAt(0, 0, 0);
    this.scene.add(this.rectLight5);

    // Red 2
    this.rectLight6 = new THREE.RectAreaLight(0xfb3f3f, 1, 15, 50);
    this.rectLight6.position.x = -10;
    this.rectLight6.position.z = 10;
    this.rectLight6.lookAt(0, 0, 0);
    this.scene.add(this.rectLight6);

    // GLTF Loader
    const gltfLoader = new GLTFLoader();
    const gltfLoader2 = new GLTFLoader();

    const onLoad = gltf => {
      console.log(gltf);
      this.frame = gltf.scene.children[0];
      this.frame.traverse(o => {
        if (o.isMesh) {
          o.material = new THREE.MeshStandardMaterial({
            // envMapIntensity: 5,
            // color: 0xfddf73,
            color: 0xffffff,
            metalness: 0.5,
            roughness: 0.2
          });
        }
      });
      this.scene.add(this.frame);
    };

    const onLoad2 = gltf => {
      console.log(gltf);
      this.type = gltf.scene.children[0];
      this.type.traverse(o => {
        if (o.isMesh) {
          o.material = new THREE.MeshStandardMaterial({
            color: 0xfddf73,
            // color: 0xffffff,
            metalness: 0.5,
            roughness: 0
          });
        }
      });
      this.scene.add(this.type);
    };

    const onProgress = () => {};

    const onError = errorMessage => {
      console.log(errorMessage);
    };

    gltfLoader.load(
      "/AppAge-Icon.glb",
      gltf => {
        onLoad(gltf);
      },
      onProgress,
      onError
    );

    gltfLoader2.load(
      "/AppAge-3D.glb",
      gltf => {
        onLoad2(gltf);
      },
      onProgress,
      onError
    );
  };

  animate = () => {
    requestAnimationFrame(this.animate);
    if (this.frame && this.type) {
      // this.frame.rotation.y += 0.005;
      // this.type.rotation.y += 0.005;
    }

    // console.log(renderer.info.render.calls);
    this.renderer.render(this.scene, this.camera);
  };

  handleWindowResize = () => {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
    window.cancelAnimationFrame(this.requestID);
    this.controls.dispose();
  }

  render() {
    return <div ref={el => (this.mount = el)} />;
  }
}

export default App;

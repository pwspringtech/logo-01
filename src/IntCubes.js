import React, { Component } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";

class IntCubes extends Component {
  componentDidMount() {
    this.INTERSECTED = undefined;
    this.radius = 100;
    this.theta = 0;
    this.sceneSetup();
    this.animate();
  }

  sceneSetup = () => {
    this.mouse = new THREE.Vector2();
    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    this.scene.add(light);
    this.loadModels();
    const geometry = new THREE.BoxBufferGeometry(20, 20, 20);
    for (var i = 0; i < 2000; i++) {
      let object = new THREE.Mesh(
        geometry,
        new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff })
      );
      object.position.x = Math.random() * 800 - 400;
      object.position.y = Math.random() * 800 - 400;
      object.position.z = Math.random() * 800 - 400;
      object.rotation.x = Math.random() * 2 * Math.PI;
      object.rotation.y = Math.random() * 2 * Math.PI;
      object.rotation.z = Math.random() * 2 * Math.PI;
      object.scale.x = Math.random() + 0.5;
      object.scale.y = Math.random() + 0.5;
      object.scale.z = Math.random() + 0.5;
      this.scene.add(object);
    }
    this.raycaster = new THREE.Raycaster();
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.mount.appendChild(this.renderer.domElement);
    document.addEventListener("mousemove", this.onDocumentMouseMove, false);
    //
    window.addEventListener("resize", this.onWindowResize, false);
  };

  loadModels = () => {
    // GLTF Loader
    const gltfLoader = new GLTFLoader();
    const gltfLoader2 = new GLTFLoader();

    const onLoad = gltf => {
      console.log(gltf);
      this.frame = gltf.scene.children[0];
      this.frame.traverse(o => {
        if (o.isMesh) {
          o.material = new THREE.MeshStandardMaterial({
            color: 0xfddf73,
            metalness: 0.7,
            roughness: 0.3
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
            metalness: 0.7,
            roughness: 0.1
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
      "/AppAge-3D.glb",
      gltf => {
        onLoad(gltf);
      },
      onProgress,
      onError
    );
    gltfLoader2.load(
      "/AppAge-Icon.glb",
      gltf => {
        onLoad2(gltf);
      },
      onProgress,
      onError
    );
  };

  onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };
  onDocumentMouseMove = event => {
    event.preventDefault();
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  };
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
    window.cancelAnimationFrame(this.requestID);
    this.controls.dispose();
  }
  animate = () => {
    requestAnimationFrame(this.animate);
    ///this.theta += 0.1;
    //this.camera.position.x = this.radius * Math.sin( THREE.Math.degToRad( this.theta ) );
    //this.camera.position.y = this.radius * Math.sin( THREE.Math.degToRad( this.theta ) );
    //this.camera.position.z = this.radius * Math.cos( THREE.Math.degToRad( this.theta ) );
    //this.camera.lookAt( this.scene.position );
    //this.camera.updateMatrixWorld();
    this.raycaster.setFromCamera(this.mouse, this.camera);
    let intersects = this.raycaster.intersectObjects(this.scene.children);
    if (intersects.length > 0) {
      if (this.INTERSECTED != intersects[0].object) {
        if (this.INTERSECTED)
          this.INTERSECTED.material.emissive.setHex(
            this.INTERSECTED.currentHex
          );
        this.INTERSECTED = intersects[0].object;
        this.INTERSECTED.currentHex = this.INTERSECTED.material.emissive.getHex();
        this.INTERSECTED.material.emissive.setHex(0xff0000);
        console.log(this.INTERSECTED);
      }
    } else {
      if (this.INTERSECTED)
        this.INTERSECTED.material.emissive.setHex(this.INTERSECTED.currentHex);
      this.INTERSECTED = null;
    }
    this.renderer.render(this.scene, this.camera);
  };

  render() {
    return <div ref={el => (this.mount = el)} />;
  }
}

export default IntCubes;

import React, { Component } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';


class App extends Component {
  componentDidMount() {
    this.sceneSetup();
    this.lighting();
    this.addObjects();
    this.animate();
  }

  sceneSetup = () => {
    this.scene = new THREE.Scene();
    // this.scene.background = new THREE.Color(0xffffff); // white background
    this.scene.background = new THREE.Color(0x000000); // black background

    // ** Fog - exponentially denser further away from camera
    this.scene.fog = new THREE.FogExp2( 0x000104, 0.01 );


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

    // Directional Light
    // const light = new THREE.DirectionalLight(0xffffff, 3.0);
    // light.position.set(5, 5, 5);
    // this.scene.add(light);

    // Ambient Light
    // const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    // this.scene.add(ambientLight);


    // *** add softbox ***
    RectAreaLightUniformsLib.init();
		this.rectLight1 = new THREE.RectAreaLight( 0x0030ff, 3, 10, 10 );
		this.rectLight1.position.set( 0, 7, -10 );
    this.rectLight1.lookAt( 0, 0, 0 );

    // ***  turn on helper to make light visible ***
    // const helper = new THREE.RectAreaLightHelper( this.rectLight1 );
    // this.rectLight1.add( helper ); 

		this.scene.add( this.rectLight1 );


    //Green
    const pointLight = new THREE.PointLight(0x1bc236, 1);
    pointLight.position.x = 8;
    pointLight.position.z = 3;
    this.scene.add(pointLight);

    //Red
    const pointLight2 = new THREE.PointLight(0xfb3f3f, 1);
    pointLight2.position.x = -8;
    pointLight2.position.z = 3;
    this.scene.add(pointLight2);

    //Blue
    const pointLight3 = new THREE.PointLight(0x0000ff, 1);
    pointLight3.position.y = 8;
    pointLight3.position.z = 3;
    this.scene.add(pointLight3);

    //Cyan
    const pointLight4 = new THREE.PointLight(0x00f6ff, 1);
    pointLight4.position.y = -8;
    pointLight4.position.z = 3;
    this.scene.add(pointLight4);
  };

  addObjects = () => {

    

    // ** Add Stars **

  const starsGeometry = new THREE.Geometry();
  for ( let i = 0; i < 100000; i ++ ) {
	  let star = new THREE.Vector3();
	  star.x = THREE.Math.randFloatSpread( 500 );
	  star.y = THREE.Math.randFloatSpread( 500 );
	  star.z = THREE.Math.randFloatSpread( 500 );
	  starsGeometry.vertices.push( star );
  }
  const starsMaterial = new THREE.PointsMaterial( {size: 0.1} );
  const starField = new THREE.Points( starsGeometry, starsMaterial );
  this.scene.add( starField );

    // GLTF Loader

    const gltfLoader = new GLTFLoader();
    const gltfLoader2 = new GLTFLoader();

    const onLoad = gltf => {
      console.log(gltf);
      this.frame = gltf.scene.children[0];
      this.frame.traverse ( ( o ) => {
          if ( o.isMesh ) {
              o.material = new THREE.MeshStandardMaterial({color: 0xfddf73, metalness: 0.7, roughness: 0.3});
          }
      });
      this.scene.add(this.frame);
    };

    const onLoad2 = gltf => {
      console.log(gltf);
      this.type = gltf.scene.children[0];
      this.type.traverse ( ( o ) => {
        if ( o.isMesh ) {
            o.material = new THREE.MeshStandardMaterial({color: 0xfddf73, metalness: 0.7, roughness: 0.3});
        }
          });
      this.scene.add(this.type);
    };

    const onProgress = () => {};

    const onError = errorMessage => {
      console.log(errorMessage);
    };

    gltfLoader.load(
      "/AppAge-stacked-Frame.glb",
      gltf => {
        onLoad(gltf);
      },
      onProgress,
      onError
    );
    gltfLoader2.load(
      "/AppAge-stacked-Type.glb",
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
      // frame.rotation.x += 0.01;
      this.frame.rotation.y += 0.005;
      this.type.rotation.y += 0.005;
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

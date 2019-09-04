import React, { Component } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';


class IntCubes extends Component {
    componentDidMount() {
        this.INTERSECTED = undefined;
        this.radius = 100;
        this.theta = 0;
        this.sceneSetup();
        this.animate();

    }

    // eslint-disable-next-line max-statements
    sceneSetup = () => {
        this.mouse = new THREE.Vector2();
         // Load Camera Perspektive
        this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 20000 );
        this.camera.position.set( 1, 1, 20 );
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0xf0f0f0 );
        const light = new THREE.DirectionalLight( 0xffffff, 1 );
        light.position.set( 1, 1, 1 ).normalize();
        this.scene.add( light );
        this.controls = new OrbitControls(this.camera, this.el);
        this.controls.enableZoom = true;
        this.loadGLTF();
        const geometry = new THREE.BoxBufferGeometry( 20, 20, 20 );
        for ( var i = 0; i < 100; i ++ ) {
            let object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
            object.position.x = Math.random() * 800 - 400;
            object.position.y = Math.random() * 800 - 400;
            object.position.z = Math.random() * 800 - 400;
            object.rotation.x = Math.random() * 2 * Math.PI;
            object.rotation.y = Math.random() * 2 * Math.PI;
            object.rotation.z = Math.random() * 2 * Math.PI;
            object.scale.x = Math.random() + 0.5;
            object.scale.y = Math.random() + 0.5;
            object.scale.z = Math.random() + 0.5;
            this.scene.add( object );
        }
        this.raycaster = new THREE.Raycaster();
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        this.mount.appendChild(this.renderer.domElement);
        document.addEventListener( 'mousemove', this.onDocumentMouseMove, false );
        //
        window.addEventListener( 'resize', this.onWindowResize, false );
    }

    loadGLTF = () => {

        // GLTF Loader
        const gltfLoader = new GLTFLoader();

        const onLoad = gltf => {
            gltf.position.x = 0;
            gltf.position.y = 0;
            gltf.position.z = -200;
            this.scene.add(gltf)
        };

        const onProgress = () => {};

        const onError = errorMessage => {
            console.log(errorMessage);
        };

        gltfLoader.load(
            "https://threejs.org/examples/models/gltf/Flamingo.glb",
            gltf => {
                onLoad(gltf.scene);
            },
            onProgress,
            onError
        );
    }

    onWindowResize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }
    onDocumentMouseMove = ( event ) => {
        event.preventDefault();
        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.handleWindowResize);
        window.cancelAnimationFrame(this.requestID);
        // this.controls.dispose();
    }
    animate = () => {
        requestAnimationFrame(this.animate);
        ///this.theta += 0.1;
        //this.camera.position.x = this.radius * Math.sin( THREE.Math.degToRad( this.theta ) );
        //this.camera.position.y = this.radius * Math.sin( THREE.Math.degToRad( this.theta ) );
        //this.camera.position.z = this.radius * Math.cos( THREE.Math.degToRad( this.theta ) );
        //this.camera.lookAt( this.scene.position );
        //this.camera.updateMatrixWorld();
        this.raycaster.setFromCamera( this.mouse, this.camera );
        let intersects = this.raycaster.intersectObjects( this.scene.children, true );
        if ( intersects.length > 0 ) {
            if ( this.INTERSECTED != intersects[ 0 ].object ) {
                if ( this.INTERSECTED ) this.INTERSECTED.material.emissive.setHex( this.INTERSECTED.currentHex );
                this.INTERSECTED = intersects[ 0 ].object;
                this.INTERSECTED.currentHex = this.INTERSECTED.material.emissive.getHex();
                this.INTERSECTED.material.emissive.setHex( 0xff0000 );
                console.log(this.INTERSECTED)
            }
        } else {
            if ( this.INTERSECTED ) this.INTERSECTED.material.emissive.setHex( this.INTERSECTED.currentHex );
            this.INTERSECTED = null;
        }
        this.renderer.render( this.scene, this.camera );

    }

    render() {
        return <div ref={el => (this.mount = el)} />;
    }
}

export default IntCubes

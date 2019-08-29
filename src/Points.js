import React, { Component } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

var renderer, scene, camera, stats;
var particles;
var PARTICLE_SIZE = 20;
var raycaster, intersects;
var mouse, INTERSECTED;

class Points extends Component {
  componentDidMount() {
    this.sceneSetup();
    this.animate();
  }

  sceneSetup = () => {

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
    this.camera.position.z = 250;
    //
    var vertices = new THREE.BoxGeometry( 200, 200, 200, 16, 16, 16 ).vertices;
    var positions = new Float32Array( vertices.length * 3 );
    var colors = new Float32Array( vertices.length * 3 );
    var sizes = new Float32Array( vertices.length );
    var vertex;
    var color = new THREE.Color();
    for ( var i = 0, l = vertices.length; i < l; i ++ ) {
        vertex = vertices[ i ];
        vertex.toArray( positions, i * 3 );
        color.setHSL( 0.01 + 0.1 * ( i / l ), 1.0, 0.5 );
        color.toArray( colors, i * 3 );
        sizes[ i ] = PARTICLE_SIZE * 0.5;
    }

    this.geometry = new THREE.BufferGeometry();
    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
    geometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );
    
    //
    this.material = new THREE.ShaderMaterial( {
        uniforms: {
            color: { value: new THREE.Color( 0xffffff ) },
            pointTexture: { value: new THREE.TextureLoader().load( "textures/sprites/disc.png" ) }
        },
        vertexShader: document.getElementById( 'vertexshader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
        alphaTest: 0.9
    } );
    //
    this.particles = new THREE.Points( this.geometry, this.material );
    this.scene.add( this.particles );

    //
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.mount.appendChild(this.renderer.domElement);
    
    //
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    
    //
    window.addEventListener( 'resize', this.handleWindowResize, false );
    document.addEventListener( 'mousemove', this.handleDocumentMouseMove, false );
  };

  handleDocumentMouseMove( event ) {
    event.preventDefault();
    this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }

  animate = () => {
    requestAnimationFrame(this.animate);
    
    this.particles.rotation.x += 0.0005;
    this.particles.rotation.y += 0.001;
    var geometry = this.particles.geometry;
    var attributes = geometry.attributes;
    this.raycaster.setFromCamera( this.mouse, this.camera );
    let intersects = raycaster.intersectObject( this.particles );
    if ( intersects.length > 0 ) {
        if ( INTERSECTED != intersects[ 0 ].index ) {
            attributes.size.array[ INTERSECTED ] = PARTICLE_SIZE;
            INTERSECTED = intersects[ 0 ].index;
            attributes.size.array[ INTERSECTED ] = PARTICLE_SIZE * 1.25;
            attributes.size.needsUpdate = true;
        }
    } else if ( INTERSECTED !== null ) {
        attributes.size.array[ INTERSECTED ] = PARTICLE_SIZE;
        attributes.size.needsUpdate = true;
        INTERSECTED = null;

    }
    //   // console.log(renderer.info.render.calls); //add right above the render call
    this.renderer.render(this.scene, this.camera);
  };

  handleWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
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

export default Points;

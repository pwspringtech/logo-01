import React, { Component } from "react";
import * as THREE from "three";

const SEPARATION = 100;
const AMOUNTX = 50;
const AMOUNTY = 50;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let particles;
let count;
let mouseX = 0;
let mouseY = 0;

class PointWaves extends Component {

  componentDidMount() {
    this.sceneSetup();
    this.animate();
  }

  sceneSetup = () => {

    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    this.camera.position.z = 1000;
    this.scene = new THREE.Scene();

    // let numParticles = AMOUNTX * AMOUNTY;
    // let positions = new Float32Array( numParticles * 3 );
    // let scales = new Float32Array( numParticles );
    // let i = 0;
    // let j = 0;
    // console.log(positions)
    // for ( let ix = 0; ix < AMOUNTX; ix ++ ) {
    //   for ( let iy = 0; iy < AMOUNTY; iy ++ ) {
    //     positions[ i ] = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 ); // x
    //     positions[ i + 1 ] = 0; // y
    //     positions[ i + 2 ] = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 ); // z
    //     i += 3;
    //     j ++;
    //   }
    // }
    
    // this.geometry = new THREE.BufferGeometry();
    // this.geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    // this.geometry.addAttribute( 'scale', new THREE.BufferAttribute( scales, 1 ) );
    this.material = new THREE.ShaderMaterial( {
      uniforms: {
        color: { value: new THREE.Color( 0xffffff ) },
      },
      vertexShader: document.getElementById( 'vertexshader' ).textContent,
      fragmentShader: document.getElementById( 'fragmentshader' ).textContent
    } );
    
    this.geometry = new THREE.BufferGeometry();
    let vertices = new Float32Array( [
      -1.0, -1.0,  1.0,
       1.0, -1.0,  1.0,
       1.0,  1.0,  1.0,
       1.0,  1.0,  1.0,
      -1.0,  1.0,  1.0,
      -1.0, -1.0,  1.0
    ] );
    let scales = new Float32Array( [
      1,
      1,
      1,
      1,
      1,
      1
    ] );
    this.geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    this.geometry.addAttribute( 'scale', new THREE.Float32BufferAttribute( scales, 1 ) );
    this.particles = new THREE.Points( this.geometry, this.material );
    this.scene.add( this.particles );

    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );

    this.mount.appendChild(this.renderer.domElement);
    window.addEventListener("resize", this.handleWindowResize);
  };

  animate = () => {
    requestAnimationFrame(this.animate);
    this.camera.position.x += ( mouseX - this.camera.position.x ) * .05;
		this.camera.position.y += ( - mouseY - this.camera.position.y ) * .05;
		this.camera.lookAt( this.scene.position );
		let positions = this.particles.geometry.attributes.position.array;
		let scales = this.particles.geometry.attributes.scale.array;
    let i = 0;
    let j = 0;
    for ( var ix = 0; ix < AMOUNTX; ix ++ ) {
      for ( var iy = 0; iy < AMOUNTY; iy ++ ) {
        positions[ i + 1 ] = ( Math.sin( ( ix + count ) * 0.3 ) * 50 ) +
                ( Math.sin( ( iy + count ) * 0.5 ) * 50 );
        scales[ j ] = ( Math.sin( ( ix + count ) * 0.3 ) + 1 ) * 8 +
                ( Math.sin( ( iy + count ) * 0.5 ) + 1 ) * 8;
        i += 3;
        j ++;
      }
    }
    this.particles.geometry.attributes.position.needsUpdate = true;
    this.particles.geometry.attributes.scale.needsUpdate = true;
    this.renderer.render( this.scene, this.camera );
    count += 0.1;
  };

  handleWindowResize = () => {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
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

export default PointWaves;

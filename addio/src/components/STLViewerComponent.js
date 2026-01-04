import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import styles from "./STLViewerComponent.module.css";


const gridsize = 10
const grids = 100

const STLViewerComponent = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // 1. Skapa scen
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // 2. Skapa kamera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(10, 10 ,10);
    camera.lookAt(0, 0, 0);

    // 3. Skapa renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    



    // lägga till en grid

    const grid = new THREE.GridHelper(gridsize, grids);
    const light = new THREE.AmbientLight(0xffffff, 0.8);

    scene.add(grid);
    scene.add(light);



    const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    };
    animate();


    return () => {
    if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
    }
    renderer.dispose();
    };

  }, []);

  return (
    <div className={styles.mainContainer} ref={containerRef}>
      {}
    </div>
  );
};

export default STLViewerComponent;
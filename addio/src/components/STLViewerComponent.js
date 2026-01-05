import React, { useRef, useEffect, useCallback } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import styles from "./STLViewerComponent.module.css";

const GRID_SIZE = 350;
const GRID_DIVS = 350;
const TARGET_FILL = 0.7;

    
const MAX_X = 350;
const MAX_Y = 350;
const MAX_Z = 350;

function dominantNormalByArea(geometry) {
  const pos = geometry.getAttribute("position");
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  const ab = new THREE.Vector3();
  const ac = new THREE.Vector3();
  const n = new THREE.Vector3();





  const buckets = new Map();
  const q = 20;

  for (let i = 0; i < pos.count; i += 3) {
    a.fromBufferAttribute(pos, i);
    b.fromBufferAttribute(pos, i + 1);
    c.fromBufferAttribute(pos, i + 2);

    ab.subVectors(b, a);
    ac.subVectors(c, a);

    n.crossVectors(ab, ac);
    const area2 = n.length();
    if (area2 === 0) continue;

    const normal = n.clone().multiplyScalar(1 / area2);
    const area = area2 * 0.5;

    const kx = Math.round(normal.x * q);
    const ky = Math.round(normal.y * q);
    const kz = Math.round(normal.z * q);
    const key = `${kx},${ky},${kz}`;

    const entry = buckets.get(key) || {
      areaSum: 0,
      normalSum: new THREE.Vector3(),
    };

    entry.areaSum += area;
    entry.normalSum.addScaledVector(normal, area);
    buckets.set(key, entry);
  }

  let best = null;
  for (const entry of buckets.values()) {
    if (!best || entry.areaSum > best.areaSum) best = entry;
  }

  if (!best) return new THREE.Vector3(0, 1, 0);
  return best.normalSum.normalize();
}

function frameCameraToObject(camera, object) {
  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  const maxSize = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI / 180);
  let dist = (maxSize / 2) / Math.tan(fov / 2);
  dist *= 1.4;

  camera.position.set(center.x + dist, center.y + dist, center.z + dist);
  camera.lookAt(center);
  camera.near = Math.max(dist / 100, 0.001);
  camera.far = dist * 100;
  camera.updateProjectionMatrix();
}

function disposeMesh(mesh) {
  if (!mesh) return;
  mesh.geometry?.dispose();
  if (Array.isArray(mesh.material)) mesh.material.forEach((m) => m.dispose());
  else mesh.material?.dispose();
}

const STLViewerComponent = ({
  file, // ✅ kommer från parent
  onFileChange, // (file: File) => void
  onFileNameChange, // (name: string) => void
}) => {
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);

  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const currentMeshRef = useRef(null);

  // Initiera threejs EN gång
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      5000
    );
    camera.position.set(12, 9, 9);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    scene.add(new THREE.GridHelper(GRID_SIZE, GRID_DIVS));

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dir1 = new THREE.DirectionalLight(0xffffff, 0.8);
    dir1.position.set(10, 20, 10);
    scene.add(dir1);
    const dir2 = new THREE.DirectionalLight(0xffffff, 0.4);
    dir2.position.set(-10, 15, -10);
    scene.add(dir2);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minPolarAngle = Math.PI * 0.15;
    controls.maxPolarAngle = Math.PI * 0.85;
    controls.minDistance = 2;
    controls.maxDistance = 200;
    controlsRef.current = controls;

    let rafId = 0;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const c = containerRef.current;
      const r = rendererRef.current;
      const cam = cameraRef.current;
      if (!c || !r || !cam) return;

      const w = c.clientWidth;
      const h = c.clientHeight;
      r.setSize(w, h);
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafId);

      if (currentMeshRef.current) {
        scene.remove(currentMeshRef.current);
        disposeMesh(currentMeshRef.current);
        currentMeshRef.current = null;
      }

      controls.dispose();
      renderer.dispose();
      container.innerHTML = "";
    };
  }, []);

  const addSTL = useCallback((pickedFile) => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!scene || !camera || !controls || !pickedFile) return;

    // ta bort gammal
    if (currentMeshRef.current) {
      scene.remove(currentMeshRef.current);
      disposeMesh(currentMeshRef.current);
      currentMeshRef.current = null;
    }

    const loader = new STLLoader();
    const reader = new FileReader();
reader.onload = () => {
  const geometry = loader.parse(reader.result);

  geometry.computeBoundingBox();

  // ✅ IF-SATS: kontrollera maxstorlek (mm)
  const size = new THREE.Vector3();
  geometry.boundingBox.getSize(size);

  if (size.x > MAX_X || size.y > MAX_Y || size.z > MAX_Z) {
    alert(
      `STL-filen är för stor!\n` +
      `Max: 350 × 3500 × 350 mm\n` +
      `Din: ${size.x.toFixed(1)} × ${size.y.toFixed(1)} × ${size.z.toFixed(1)} mm`
    );
    return; // ❌ stoppa uppladdning
  }

  // ✅ fortsätt bara om STL är OK
  geometry.computeVertexNormals();
  geometry.center();


      const material = new THREE.MeshStandardMaterial({
        color: 0x888888,
        metalness: 0.15,
        roughness: 0.7,
      });

      const mesh = new THREE.Mesh(geometry, material);

      const dn = dominantNormalByArea(geometry);
      mesh.quaternion.setFromUnitVectors(dn, new THREE.Vector3(0, -1, 0));

      // skala till grid
      const preBox = new THREE.Box3().setFromObject(mesh);
      const preSize = new THREE.Vector3();
      preBox.getSize(preSize);
      const maxDim = Math.max(preSize.x, preSize.y, preSize.z);
      const target = GRID_SIZE * TARGET_FILL;
      const s = maxDim > 0 ? target / maxDim : 1;
      mesh.scale.setScalar(s);

      // placera på marken
      const box = new THREE.Box3().setFromObject(mesh);
      mesh.position.y -= box.min.y;

      scene.add(mesh);
      currentMeshRef.current = mesh;

      frameCameraToObject(camera, mesh);

      const center = new THREE.Vector3();
      box.getCenter(center);
      controls.target.copy(center);
      controls.update();
    };

    reader.readAsArrayBuffer(pickedFile);
  }, []);

  useEffect(() => {
    if (file) addSTL(file);
  }, [file, addSTL]);

  const handlePick = (picked) => {
    if (!picked) return;
    onFileChange?.(picked);
    onFileNameChange?.(picked.name);
    addSTL(picked);
  };

  return (
    <div className={styles.wrapper}>
        
      <input
        ref={fileInputRef}
        type="file"
        accept=".stl"
        style={{ display: "none" }}
        onChange={(e) => {
          const picked = e.target.files?.[0];
          handlePick(picked);
          e.target.value = "";
        }}
      />
      <div
        className={styles.mainContainer}
        ref={containerRef}
        role="button"
        tabIndex={0}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
        }}
      />
    </div>
  );
};

export default STLViewerComponent;

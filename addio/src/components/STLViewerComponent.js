import React, { useRef, useEffect, useCallback } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import styles from "./STLViewerComponent.module.css";

const GRID_SIZE = 350; // ✅ 350 mm x 350 mm
const GRID_DIVS = 35;  // ✅ 10 mm per ruta (350/35)

const MAX_X = 350;
const MAX_Y = 350;
const MAX_Z = 350;

// Hitta dominant normal (störst sammanlagd area) genom att bucket:a normaler
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
  dist *= 1.6;

  camera.position.set(center.x + dist, center.y + dist, center.z + dist);
  camera.lookAt(center);

  camera.near = Math.max(dist / 100, 0.1);
  camera.far = dist * 100;
  camera.updateProjectionMatrix();
}

function disposeMesh(mesh) {
  if (!mesh) return;
  mesh.geometry?.dispose();
  if (Array.isArray(mesh.material)) mesh.material.forEach((m) => m.dispose());
  else mesh.material?.dispose();
}

const STLViewerComponent = ({ file, onFileChange, onFileNameChange }) => {
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);

  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);

  const currentMeshRef = useRef(null);
  const gridRef = useRef(null);

  // ✅ för att ignorera gamla FileReader-onload om man väljer ny fil snabbt
  const loadTokenRef = useRef(0);

  const resetCurrentSTL = useCallback(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (currentMeshRef.current) {
      scene.remove(currentMeshRef.current);
      disposeMesh(currentMeshRef.current);
      currentMeshRef.current = null;
    }

    // Extra säkerhet: rensa render lists (GPU draw-call cache)
    rendererRef.current?.renderLists?.dispose();
  }, []);

  // Initiera Three.js en gång
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
    camera.position.set(500, 400, 400);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ✅ 350×350 mm grid
    const grid = new THREE.GridHelper(GRID_SIZE, GRID_DIVS);
    scene.add(grid);
    gridRef.current = grid;

    scene.add(new THREE.AmbientLight(0xffffff, 0.75));
    const dir1 = new THREE.DirectionalLight(0xffffff, 0.85);
    dir1.position.set(600, 900, 600);
    scene.add(dir1);

    const dir2 = new THREE.DirectionalLight(0xffffff, 0.35);
    dir2.position.set(-600, 700, -600);
    scene.add(dir2);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minPolarAngle = Math.PI * 0.15;
    controls.maxPolarAngle = Math.PI * 0.85;
    controls.minDistance = 50;
    controls.maxDistance = 3000;
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

      if (gridRef.current) {
        scene.remove(gridRef.current);
        gridRef.current = null;
      }

      controls.dispose();
      renderer.dispose();
      container.innerHTML = "";
    };
  }, []);

  const addSTL = useCallback(
    (pickedFile) => {
      const scene = sceneRef.current;
      const camera = cameraRef.current;
      const controls = controlsRef.current;
      if (!scene || !camera || !controls || !pickedFile) return;

      // ✅ rensa ALLTID tidigare STL direkt
      resetCurrentSTL();

      // ✅ ny token för denna load
      const myToken = ++loadTokenRef.current;

      const loader = new STLLoader();
      const reader = new FileReader();

      reader.onload = () => {
        // ✅ ignorera om en nyare load redan startat
        if (myToken !== loadTokenRef.current) return;

        const geometry = loader.parse(reader.result);

        geometry.computeBoundingBox();
        const size = new THREE.Vector3();
        geometry.boundingBox.getSize(size);

        // ✅ validera storlek (mm)
        if (size.x > MAX_X || size.y > MAX_Y || size.z > MAX_Z) {
          alert(
            `STL-filen är för stor!\n` +
              `Max: ${MAX_X} × ${MAX_Y} × ${MAX_Z} mm\n` +
              `Din: ${size.x.toFixed(1)} × ${size.y.toFixed(1)} × ${size.z.toFixed(1)} mm`
          );

          // ✅ rensa + nolla parent state
          resetCurrentSTL();
          onFileChange?.(null);
          onFileNameChange?.("");
          return;
        }

        geometry.computeVertexNormals();

        const material = new THREE.MeshStandardMaterial({
          color: 0x888888,
          metalness: 0.15,
          roughness: 0.7,
        });

        const mesh = new THREE.Mesh(geometry, material);

        // ✅ Lägg modellen på ytan med mest area:
        // - dominant normal = normal för största face-klustret
        // - rotera så den pekar NERÅT (0,-1,0) => den ytan hamnar mot "golvet"
        const dn = dominantNormalByArea(geometry);
        mesh.quaternion.setFromUnitVectors(dn, new THREE.Vector3(0, -1, 0));

        // ✅ Centrera runt origo (för bättre controlls/camera) – INGEN skalning
        // (Vill du inte flytta modellen alls: ta bort detta)
        geometry.center();

        // ✅ Ställ på marken (y=0)
        const box = new THREE.Box3().setFromObject(mesh);
        mesh.position.y -= box.min.y;

        scene.add(mesh);
        currentMeshRef.current = mesh;

        frameCameraToObject(camera, mesh);

        const target = new THREE.Vector3();
        new THREE.Box3().setFromObject(mesh).getCenter(target);
        controls.target.copy(target);
        controls.update();
      };

      reader.readAsArrayBuffer(pickedFile);
    },
    [onFileChange, onFileNameChange, resetCurrentSTL]
  );

  // Om parent uppdaterar file
  useEffect(() => {
    if (file) addSTL(file);
  }, [file, addSTL]);

  const handlePick = (picked) => {
    if (!picked) return;

    // ✅ rensa direkt när man väljer ny fil
    resetCurrentSTL();

    onFileChange?.(picked);
    onFileNameChange?.(picked.name);

    // ✅ visa direkt
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
          e.target.value = ""; // ✅ så samma fil kan väljas igen
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

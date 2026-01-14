import React, { useRef, useEffect, useCallback, useState } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import styles from "./STLViewerComponent.module.css";

const GRID_SIZE = 350;
const GRID_DIVS = 35;

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

    const entry = buckets.get(key) || { areaSum: 0, normalSum: new THREE.Vector3() };
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

const STLViewerComponent = ({
  file,
  url,
  fileName,
  locked = false,
  showBadge = true,
  showClear = true,
  onClear,
  onFileChange,
  onFileNameChange,
}) => {
  const containerRef = useRef(null);

  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);

  const currentMeshRef = useRef(null);
  const gridRef = useRef(null);

  const loadTokenRef = useRef(0);
  const [badge, setBadge] = useState({ name: "", dims: null });

  const resetCurrentSTL = useCallback(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (currentMeshRef.current) {
      scene.remove(currentMeshRef.current);
      disposeMesh(currentMeshRef.current);
      currentMeshRef.current = null;
    }

    rendererRef.current?.renderLists?.dispose();
    setBadge({ name: "", dims: null });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf6f6f6);

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
    controls.maxDistance = 500;
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

  const placeAndShow = useCallback(
    (geometry, nameForBadge) => {
      const scene = sceneRef.current;
      const camera = cameraRef.current;
      const controls = controlsRef.current;
      if (!scene || !camera || !controls) return;

      resetCurrentSTL();

      geometry.computeBoundingBox();
      const size = new THREE.Vector3();
      geometry.boundingBox.getSize(size);

      if (size.x > MAX_X || size.y > MAX_Y || size.z > MAX_Z) {
        alert(
          `STL-filen är för stor!\n` +
            `Max: ${MAX_X} × ${MAX_Y} × ${MAX_Z} mm\n` +
            `Din: ${size.x.toFixed(1)} × ${size.y.toFixed(1)} × ${size.z.toFixed(1)} mm`
        );
        onFileChange?.(null);
        onFileNameChange?.("");
        return;
      }

      setBadge({
        name: nameForBadge || "",
        dims: { x: size.x, y: size.y, z: size.z },
      });

      geometry.computeVertexNormals();

      const material = new THREE.MeshStandardMaterial({
        color: 0x666666,
        metalness: 0.12,
        roughness: 0.8,
      });

      const mesh = new THREE.Mesh(geometry, material);

      const dn = dominantNormalByArea(geometry);
      mesh.quaternion.setFromUnitVectors(dn, new THREE.Vector3(0, -1, 0));

      geometry.center();

      const box = new THREE.Box3().setFromObject(mesh);
      mesh.position.y -= box.min.y; // ✅ står på grid

      scene.add(mesh);
      currentMeshRef.current = mesh;

      frameCameraToObject(camera, mesh);

      const target = new THREE.Vector3();
      new THREE.Box3().setFromObject(mesh).getCenter(target);
      controls.target.copy(target);
      controls.update();
    },
    [onFileChange, onFileNameChange, resetCurrentSTL]
  );

  const addSTLFromFile = useCallback(
    (pickedFile) => {
      if (!pickedFile) return;
      const myToken = ++loadTokenRef.current;

      const loader = new STLLoader();
      const reader = new FileReader();

      reader.onload = () => {
        if (myToken !== loadTokenRef.current) return;
        const geometry = loader.parse(reader.result);
        placeAndShow(geometry, pickedFile.name);
      };

      reader.readAsArrayBuffer(pickedFile);
    },
    [placeAndShow]
  );

  const addSTLFromUrl = useCallback(
    (stlUrl, badgeName) => {
      if (!stlUrl) return;
      const myToken = ++loadTokenRef.current;

      const loader = new STLLoader();
      loader.load(
        stlUrl,
        (geometry) => {
          if (myToken !== loadTokenRef.current) return;
          placeAndShow(geometry, badgeName || "modell.stl");
        },
        undefined,
        (err) => {
          console.error(err);
          alert("Kunde inte ladda STL från URL.");
        }
      );
    },
    [placeAndShow]
  );

  useEffect(() => {
    if (file) addSTLFromFile(file);
  }, [file, addSTLFromFile]);

  useEffect(() => {
    if (url) addSTLFromUrl(url, fileName);
  }, [url, fileName, addSTLFromUrl]);

  const handleClear = () => {
    resetCurrentSTL();
    onFileChange?.(null);
    onFileNameChange?.("");
    onClear?.();
  };

  const hasModel = Boolean(file || url || badge.name);

  return (
    <div className={styles.wrapper}>
      <div className={styles.viewerWrap}>
        <div className={styles.mainContainer} ref={containerRef} role="presentation" />

        {showBadge && badge.name && (
          <div className={styles.fileBadge}>
            <div className={styles.fileName}>{badge.name}</div>
            {badge.dims && (
              <div className={styles.fileDims}>
                {badge.dims.x.toFixed(1)} × {badge.dims.y.toFixed(1)} × {badge.dims.z.toFixed(1)} mm
              </div>
            )}
          </div>
        )}

        {showClear && hasModel && !locked && (
          <button type="button" className={styles.clearBtn} onClick={handleClear} aria-label="Ta bort fil">
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default STLViewerComponent;

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

export default function ModelPreview({ url, ext }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!url || !mountRef.current) return;
    const mount = mountRef.current;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#F6F8FA");

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // Ortho camera (we'll set frustum AFTER we know model size)
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100000);

    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const dir = new THREE.DirectionalLight(0xffffff, 0.6);
    dir.position.set(200, 300, 500);
    scene.add(dir);

    const material = new THREE.MeshStandardMaterial({
      color: 0x4294ff,
      roughness: 0.5,
      metalness: 0.05,
    });

    let object3d = null;
    let fittedMaxDim = null; // remember so resize keeps correct view

    const render = () => renderer.render(scene, camera);

    const applyCameraView = (maxDim) => {
      fittedMaxDim = maxDim;

      const w = mount.clientWidth;
      const h = mount.clientHeight;
      const aspect = w / h;

      const margin = 1.3;
      const half = (maxDim * margin) / 2;

      // Keep model fully visible respecting aspect ratio
      if (aspect >= 1) {
        camera.top = half;
        camera.bottom = -half;
        camera.right = half * aspect;
        camera.left = -half * aspect;
      } else {
        camera.right = half;
        camera.left = -half;
        camera.top = half / aspect;
        camera.bottom = -half / aspect;
      }

      // SIDE + 45° DOWN (pick one)
      const d = maxDim * 2;

      // Front + 45° down:
      // camera.position.set(0, d, d);

      // Right side + 45° down:
      camera.position.set(d, d, 0);

      camera.lookAt(0, 0, 0);
      camera.near = 0.1;
      camera.far = 100000;
      camera.updateProjectionMatrix();
    };

    const centerAndFit = (obj) => {
      const box = new THREE.Box3().setFromObject(obj);
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);

      // center model
      obj.position.sub(center);

      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      applyCameraView(maxDim);
    };

    const handleResize = () => {
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      if (fittedMaxDim) {
        applyCameraView(fittedMaxDim); // <-- keep your angled view on resize
      }
      render();
    };

    const load = () => {
      const e = (ext || "").toLowerCase();

      if (e === "stl") {
        const loader = new STLLoader();
        loader.load(
          url,
          (geometry) => {
            geometry.computeVertexNormals();
            const mesh = new THREE.Mesh(geometry, material);
            object3d = mesh;
            scene.add(mesh);
            centerAndFit(mesh);
            render();
          },
          undefined,
          (err) => console.error("STL load error:", err)
        );
        return;
      }

      if (e === "obj") {
        const loader = new OBJLoader();
        loader.load(
          url,
          (obj) => {
            obj.traverse((child) => {
              if (child.isMesh) child.material = material;
            });
            object3d = obj;
            scene.add(obj);
            centerAndFit(obj);
            render();
          },
          undefined,
          (err) => console.error("OBJ load error:", err)
        );
        return;
      }

      console.warn("Unsupported for preview (needs conversion):", e);
    };

    load();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (object3d) scene.remove(object3d);
      renderer.dispose();
      if (renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [url, ext]);

  return <div ref={mountRef} style={{ width: "120px", height: "120px" }} />;
}

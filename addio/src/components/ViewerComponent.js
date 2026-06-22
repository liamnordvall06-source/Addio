import React, { useMemo } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls, Grid, Environment } from '@react-three/drei'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { Box3, Matrix4, Vector3 } from 'three'
import modelUrl from '../assets/test.stl'
import styles from "./ViewerComponent.module.css";

const STLModel = () => {
  const geometry = useLoader(STLLoader, modelUrl)

  const { centeredGeometry, positionY } = useMemo(() => {
    const centered = geometry.clone()
    centered.computeVertexNormals()

    const box = new Box3().setFromBufferAttribute(centered.attributes.position)
    const center = box.getCenter(new Vector3())
    centered.translate(center.multiplyScalar(-1))

    const rotated = centered.clone()
    rotated.applyMatrix4(new Matrix4().makeRotationX(-Math.PI / 2))

    const rotatedBox = new Box3().setFromBufferAttribute(rotated.attributes.position)
    const offsetY = -rotatedBox.min.y * 0.05

    return { centeredGeometry: centered, positionY: offsetY }
  }, [geometry])

  return (
    <mesh geometry={centeredGeometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, positionY, 0]} scale={[0.05, 0.05, 0.05]}>
      <meshPhysicalMaterial
        color="#272727"
        metalness={0.05}
        roughness={0.8}
        clearcoat={0.0}
        clearcoatRoughness={0.0}
        reflectivity={0.1}
      />
    </mesh>
  )
}

const ViewerComponent = () => {
  return (
    <div className={styles.viewerContainer}>
      <Canvas className={styles.viewerCanvas} camera={{ position: [4, 4, 4], fov: 45 }}>
        <color attach="background" args={["#f2f2f2"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 5]} intensity={1} />
        <directionalLight position={[-5, 4, -3]} intensity={0.8} />
        <hemisphereLight skyColor="#ffffff" groundColor="#888888" intensity={0.3} />
        <Environment preset="city" />
        <STLModel />
        <Grid position={[0, 0, 0]} args={[40, 40]} cellColor="#d9d9d9" sectionColor="#c7c7c7" />
        <OrbitControls enablePan={true} enableZoom={true} target={[0, 0.05, 0]} />
      </Canvas>
    </div>
  )
}

export default ViewerComponent

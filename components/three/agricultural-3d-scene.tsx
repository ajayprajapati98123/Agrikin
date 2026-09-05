"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export const Agricultural3DScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webGlSupported, setWebGlSupported] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch (e) {
      setWebGlSupported(false);
      return;
    }

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a381e, 0.015);

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 8, 24);
    camera.lookAt(0, 2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Ambient & Sunlight
    const ambientLight = new THREE.AmbientLight(0xdcfce7, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfef08a, 2.5);
    sunLight.position.set(20, 30, -20);
    sunLight.castShadow = true;
    scene.add(sunLight);

    // Warm Morning Sun Sphere in Horizon
    const sunGeo = new THREE.SphereGeometry(6, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xfde047 });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    sunMesh.position.set(15, 20, -50);
    scene.add(sunMesh);

    // Rolling Green Agricultural Terrain
    const terrainGeo = new THREE.PlaneGeometry(80, 80, 48, 48);
    terrainGeo.rotateX(-Math.PI / 2);

    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      // Undulating terraced hills
      const y = Math.sin(x * 0.12) * Math.cos(z * 0.12) * 2.2 - Math.exp(-((x * x + z * z) / 200)) * 1.5;
      pos.setY(i, y);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x15803d,
      roughness: 0.8,
      metalness: 0.1,
      flatShading: true,
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.receiveShadow = true;
    scene.add(terrain);

    // River Stream in the Valley
    const waterGeo = new THREE.PlaneGeometry(16, 80, 16, 32);
    waterGeo.rotateX(-Math.PI / 2);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.75,
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.position.set(-6, -0.6, 0);
    scene.add(water);

    // Swaying Crop Stalks (Instanced Meshes for Performance)
    const cropCount = 600;
    const cropBladeGeo = new THREE.ConeGeometry(0.15, 2.2, 4);
    const cropBladeMat = new THREE.MeshStandardMaterial({
      color: 0x86efac,
      roughness: 0.6,
    });
    const instancedCrops = new THREE.InstancedMesh(cropBladeGeo, cropBladeMat, cropCount);

    const dummy = new THREE.Object3D();
    for (let i = 0; i < cropCount; i++) {
      const rx = (Math.random() - 0.5) * 50;
      const rz = (Math.random() - 0.5) * 50;
      if (rx > -12 && rx < 0) continue; // Avoid water channel
      dummy.position.set(rx, 0.8, rz);
      dummy.rotation.y = Math.random() * Math.PI * 2;
      dummy.rotation.z = (Math.random() - 0.5) * 0.2;
      dummy.scale.set(1, 0.8 + Math.random() * 0.5, 1);
      dummy.updateMatrix();
      instancedCrops.setMatrixAt(i, dummy.matrix);
    }
    instancedCrops.castShadow = true;
    scene.add(instancedCrops);

    // Floating Atmospheric Pollen / Spores Particles
    const particleCount = 200;
    const particlesGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 40;
      particlePositions[i + 1] = Math.random() * 14;
      particlePositions[i + 2] = (Math.random() - 0.5) * 40;
    }

    particlesGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particlesMat = new THREE.PointsMaterial({
      color: 0xfef08a,
      size: 0.25,
      transparent: true,
      opacity: 0.8,
    });
    const particleSystem = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particleSystem);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Subtle crop swaying
      instancedCrops.rotation.z = Math.sin(elapsedTime * 2) * 0.04;
      instancedCrops.rotation.x = Math.cos(elapsedTime * 1.5) * 0.03;

      // Gentle river oscillation
      water.position.y = -0.6 + Math.sin(elapsedTime * 1.5) * 0.05;

      // Floating pollen movement
      const posArray = particleSystem.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        posArray[i] += Math.sin(elapsedTime + i) * 0.01;
        if (posArray[i] > 14) posArray[i] = 1;
      }
      particleSystem.geometry.attributes.position.needsUpdate = true;

      // Subtle camera pan with cursor/time
      camera.position.x = Math.sin(elapsedTime * 0.2) * 1.5;
      camera.lookAt(0, 2, 0);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[460px] lg:min-h-[580px] overflow-hidden rounded-3xl">
      {webGlSupported ? (
        <div ref={mountRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" />
      ) : (
        /* Lightweight High-Quality Fallback for low-power devices */
        <div className="w-full h-full absolute inset-0 bg-gradient-to-b from-[#083344] via-[#0B4052] to-[#041E27] flex items-center justify-center p-8">
          <div className="text-center text-cyan-100">
            <div className="text-5xl mb-4">🌾⛰️☀️</div>
            <h4 className="text-xl font-bold">Natural Agricultural Basin</h4>
            <p className="text-xs text-cyan-300 mt-2 max-w-sm mx-auto">
              Optimized 2D canvas active for reduced power mode.
            </p>
          </div>
        </div>
      )}

      {/* Atmospheric Sunrise Gradient Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#041E27] via-transparent to-transparent opacity-80" />
      <div className="absolute top-4 right-4 pointer-events-none bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[11px] text-cyan-200 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        Interactive 3D Agro-Biome
      </div>
    </div>
  );
};

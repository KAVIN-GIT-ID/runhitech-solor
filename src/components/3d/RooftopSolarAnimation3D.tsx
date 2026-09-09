import { useEffect, useRef } from "react";
import * as THREE from "three";

interface RooftopSolarAnimation3DProps {
  className?: string;
  height?: string | number;
}

export default function RooftopSolarAnimation3D({
  className = "",
  height = "440px",
}: RooftopSolarAnimation3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── 1. Scene & Camera Setup (Perfect Centered Framing) ──
    const scene = new THREE.Scene();
    const width = mount.clientWidth || 500;
    const heightPx = mount.clientHeight || 440;

    const isMobile = width < 600;
    const isLowEnd =
      isMobile ||
      (typeof navigator !== "undefined" &&
        ((navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
          ((navigator as unknown as { deviceMemory?: number }).deviceMemory &&
            (navigator as unknown as { deviceMemory?: number }).deviceMemory! <= 4)));

    // Camera framed so the whole scene (House + Panels + Sun + Rays) is completely visible
    const camera = new THREE.PerspectiveCamera(isMobile ? 48 : 40, width / heightPx, 0.1, 100);
    camera.position.set(isMobile ? 0.1 : 0.6, isMobile ? 2.6 : 2.2, isMobile ? 6.8 : 5.8);
    camera.lookAt(0, isMobile ? 0.4 : 0.3, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isLowEnd,
      powerPreference: isLowEnd ? "low-power" : "default",
      precision: isLowEnd ? "mediump" : "highp",
    });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(isLowEnd ? 1 : Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0); // 100% Transparent
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.domElement.style.touchAction = "pan-y";
    renderer.domElement.style.pointerEvents = "none";
    mount.appendChild(renderer.domElement);

    // Main World Group (Centered)
    const worldGroup = new THREE.Group();
    worldGroup.position.set(isMobile ? 0 : -0.2, isMobile ? -0.3 : -0.2, 0);
    worldGroup.rotation.y = -0.35;
    scene.add(worldGroup);

    // ── 2. Premium Photorealistic Materials (Matching About Page Quality) ──
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
      metalness: 0.05,
    });

    const darkAccentMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.4,
      metalness: 0.2,
    });

    const woodTrimMat = new THREE.MeshStandardMaterial({
      color: 0xd97706, // Warm architectural cedar wood
      roughness: 0.5,
      metalness: 0.1,
    });

    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a, // Premium slate dark charcoal roof
      roughness: 0.35,
      metalness: 0.3,
    });

    const windowGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
      roughness: 0.08,
      metalness: 0.2,
      emissive: 0x0284c7,
      emissiveIntensity: 0.5,
    });

    // Solar Panel Materials (Same high fidelity as Solar3DAbout)
    const solarFrameMat = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      metalness: 0.92,
      roughness: 0.18,
    });

    const solarCellMat = new THREE.MeshStandardMaterial({
      color: 0x081f3d, // Deep crystal monocrystalline blue
      roughness: 0.1,
      metalness: 0.88,
    });

    const busbarMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.98,
      roughness: 0.08,
    });

    const solarGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.32,
      roughness: 0.04,
      metalness: 0.15,
      clearcoat: 1.0,
      reflectivity: 0.95,
    });

    // ── 3. High-End Modern Architectural Home Structure ──
    const house = new THREE.Group();
    worldGroup.add(house);

    // Foundation platform
    const baseMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.7 });
    const base = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.14, 2.8), baseMat);
    base.position.y = -1.1;
    house.add(base);

    // Ground floor body
    const mainBody = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.2, 2.2), wallMat);
    mainBody.position.set(0, -0.45, 0);
    house.add(mainBody);

    // Architectural wood entrance panel
    const woodFeature = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.22, 2.22), woodTrimMat);
    woodFeature.position.set(-0.95, -0.45, 0);
    house.add(woodFeature);

    // Modern glass entrance door
    const door = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.9), windowGlassMat);
    door.position.set(-0.2, -0.6, 1.11);
    house.add(door);

    // Ground floor panoramic window
    const windowMain = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.65), windowGlassMat);
    windowMain.position.set(0.7, -0.45, 1.11);
    house.add(windowMain);

    // Upper Floor Section
    const upperBody = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.0, 2.0), wallMat);
    upperBody.position.set(0.1, 0.65, -0.1);
    house.add(upperBody);

    const upperWindow = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.55), windowGlassMat);
    upperWindow.position.set(0.4, 0.65, 0.91);
    house.add(upperWindow);

    // Contemporary Slanted Pitched Rooftop
    const roofLeft = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 2.4), roofMat);
    roofLeft.position.set(-0.65, 1.45, -0.1);
    roofLeft.rotation.z = Math.PI / 7.5; // ~24 deg tilt
    house.add(roofLeft);

    const roofRight = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 2.4), roofMat);
    roofRight.position.set(0.65, 1.45, -0.1);
    roofRight.rotation.z = -Math.PI / 7.5;
    house.add(roofRight);

    // ── 4. Precision Photorealistic Rooftop Solar Panels ──
    const createPanel = (pW = 0.55, pH = 0.95) => {
      const p = new THREE.Group();
      const thick = 0.025;

      // Anodized Silver Frame
      const frame = new THREE.Mesh(new THREE.BoxGeometry(pW, thick, pH), solarFrameMat);
      p.add(frame);

      // Deep Monocrystalline Silicon Cells (3x6 half-cut cells)
      const cols = 3;
      const rows = 6;
      const margin = 0.015;
      const gridW = pW - 0.04;
      const gridH = pH - 0.04;
      const cW = (gridW - margin * (cols - 1)) / cols;
      const cH = (gridH - margin * (rows - 1)) / rows;
      const cellGeo = new THREE.PlaneGeometry(cW, cH);

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const cell = new THREE.Mesh(cellGeo, solarCellMat);
          cell.rotation.x = -Math.PI / 2;
          const x = -gridW / 2 + cW / 2 + c * (cW + margin);
          const z = -gridH / 2 + cH / 2 + r * (cH + margin);
          cell.position.set(x, thick / 2 + 0.002, z);
          p.add(cell);
        }

        // Silver Busbar line
        const colCenterX = -gridW / 2 + cW / 2 + c * (cW + margin);
        const bb = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.001, gridH), busbarMat);
        bb.position.set(colCenterX, thick / 2 + 0.004, 0);
        p.add(bb);
      }

      // Specular Glass Sheet
      const glass = new THREE.Mesh(new THREE.PlaneGeometry(pW - 0.02, pH - 0.02), solarGlassMat);
      glass.rotation.x = -Math.PI / 2;
      glass.position.y = thick / 2 + 0.006;
      p.add(glass);

      return p;
    };

    // 4 Solar Panels mounted on the Sunny South Roof Slope (roofRight)
    const panelCoords = [
      { x: 0.42, y: 1.56, z: -0.58 },
      { x: 0.42, y: 1.56, z: 0.42 },
      { x: 0.98, y: 1.34, z: -0.58 },
      { x: 0.98, y: 1.34, z: 0.42 },
    ];

    panelCoords.forEach((coord) => {
      const p = createPanel(0.52, 0.92);
      p.position.set(coord.x, coord.y, coord.z);
      p.rotation.z = -Math.PI / 7.5;
      house.add(p);
    });

    // ── 5. Radiant 3D Sun (Fully visible within top-right canvas) ──
    const sunGroup = new THREE.Group();
    // Positioned safely inside the camera view
    sunGroup.position.set(2.2, 2.5, 0.5);
    scene.add(sunGroup);

    // Glowing Sun Core Sphere
    const sunCoreMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const sunCore = new THREE.Mesh(new THREE.SphereGeometry(0.32, 24, 24), sunCoreMat);
    sunGroup.add(sunCore);

    // Breathing Corona Halo
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.35,
    });
    const corona = new THREE.Mesh(new THREE.SphereGeometry(0.52, 24, 24), coronaMat);
    sunGroup.add(corona);

    // Outer Radiant Glow Disc
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.16,
      side: THREE.DoubleSide,
    });
    const halo = new THREE.Mesh(new THREE.CircleGeometry(0.95, 32), haloMat);
    halo.lookAt(camera.position);
    sunGroup.add(halo);

    // ── 6. Animated Sunlight Photon Energy Beams ──
    const rayCount = 36;
    const rayGeo = new THREE.SphereGeometry(0.028, 8, 8);
    const rayMat = new THREE.MeshBasicMaterial({
      color: 0xfde047,
      transparent: true,
      opacity: 0.85,
    });

    const sunPos = new THREE.Vector3(2.2, 2.5, 0.5);
    const rays: { mesh: THREE.Mesh; targetIdx: number; progress: number; speed: number }[] = [];

    for (let i = 0; i < rayCount; i++) {
      const mesh = new THREE.Mesh(rayGeo, rayMat);
      scene.add(mesh);
      rays.push({
        mesh,
        targetIdx: i % panelCoords.length,
        progress: Math.random(),
        speed: 0.012 + Math.random() * 0.016,
      });
    }

    // ── 7. Clean Green Electricity Generated Energy Flow ──
    const electricCount = 24;
    const electricGeo = new THREE.SphereGeometry(0.026, 6, 6);
    const electricMat = new THREE.MeshBasicMaterial({
      color: 0x10b981, // Emerald Clean Power
      transparent: true,
      opacity: 0.85,
    });

    const electricPulses: { mesh: THREE.Mesh; progress: number; speed: number }[] = [];
    for (let i = 0; i < electricCount; i++) {
      const mesh = new THREE.Mesh(electricGeo, electricMat);
      house.add(mesh);
      electricPulses.push({
        mesh,
        progress: Math.random(),
        speed: 0.01 + Math.random() * 0.015,
      });
    }

    // ── 8. Professional Lighting ──
    const amb = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(amb);

    const sunLight = new THREE.DirectionalLight(0xffedd5, 3.6);
    sunLight.position.copy(sunPos);
    scene.add(sunLight);

    const skyLight = new THREE.DirectionalLight(0x0284c7, 1.5);
    skyLight.position.set(-4, -1, 3);
    scene.add(skyLight);

    // Warm Interior Light
    const interiorLight = new THREE.PointLight(0xfef08a, 1.6, 5);
    interiorLight.position.set(0, 0, 0);
    house.add(interiorLight);

    // ── 9. Mouse Parallax Orbit ──
    let targetY = -0.35;
    let targetX = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetY = -0.35 + x * 0.6;
      targetX = y * 0.3;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // ── 10. Animation Loop ──
    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Gentle floating bob
      worldGroup.position.y = -0.2 + Math.sin(elapsed * 1.3) * 0.06;

      // Mouse parallax follow
      worldGroup.rotation.y += (targetY - worldGroup.rotation.y) * 0.05;
      worldGroup.rotation.x += (targetX - worldGroup.rotation.x) * 0.05;

      // Sun breathing flare
      const pulse = 1 + Math.sin(elapsed * 2.2) * 0.08;
      corona.scale.setScalar(pulse);
      halo.scale.setScalar(1 + Math.sin(elapsed * 1.6) * 0.05);
      halo.lookAt(camera.position);

      // Animate Sunlight Beams (Sun -> Solar Panels)
      rays.forEach((r) => {
        r.progress += r.speed;
        if (r.progress > 1) r.progress = 0;

        const targetCoord = panelCoords[r.targetIdx];
        const targetWorldPos = new THREE.Vector3(targetCoord.x, targetCoord.y, targetCoord.z);
        targetWorldPos.applyMatrix4(worldGroup.matrixWorld);

        r.mesh.position.lerpVectors(sunPos, targetWorldPos, r.progress);
        const mat = r.mesh.material as THREE.MeshBasicMaterial;
        mat.opacity = Math.sin(r.progress * Math.PI) * 0.9;
      });

      // Animate Clean Electricity Flow into the House
      electricPulses.forEach((ep, idx) => {
        ep.progress += ep.speed;
        if (ep.progress > 1) ep.progress = 0;

        const startY = 1.45;
        const endY = -0.5;
        const currentY = THREE.MathUtils.lerp(startY, endY, ep.progress);
        const currentX = 0.7 + Math.sin(ep.progress * Math.PI * 2 + idx) * 0.12;
        const currentZ = 0.5 + Math.cos(ep.progress * Math.PI * 2 + idx) * 0.12;

        ep.mesh.position.set(currentX, currentY, currentZ);
      });

      // Windows glow pulse with electricity
      windowGlassMat.emissiveIntensity = 0.4 + Math.sin(elapsed * 3.0) * 0.15;

      renderer.render(scene, camera);
    };

    // Pause rendering when offscreen to preserve Safari/WebKit 60fps smoothness
    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(mount);

    const safeAnimate = () => {
      frameId = requestAnimationFrame(safeAnimate);
      if (isVisible) {
        animate();
      }
    };

    safeAnimate();

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      renderer.dispose();
      wallMat.dispose();
      darkAccentMat.dispose();
      woodTrimMat.dispose();
      roofMat.dispose();
      windowGlassMat.dispose();
      solarFrameMat.dispose();
      solarCellMat.dispose();
      busbarMat.dispose();
      solarGlassMat.dispose();
      baseMat.dispose();
      sunCoreMat.dispose();
      coronaMat.dispose();
      haloMat.dispose();
      rayGeo.dispose();
      rayMat.dispose();
      electricGeo.dispose();
      electricMat.dispose();

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ height, touchAction: "pan-y" }}
      className={`w-full relative pointer-events-none select-none touch-pan-y ${className}`}
    />
  );
}

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface Solar3DSubsidyProps {
  className?: string;
  height?: string | number;
}

export default function Solar3DSubsidy({ className = "", height = "380px" }: Solar3DSubsidyProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── 1. Scene Setup ──
    const scene = new THREE.Scene();
    const width = mount.clientWidth || 480;
    const heightPx = mount.clientHeight || 380;

    const camera = new THREE.PerspectiveCamera(42, width / heightPx, 0.1, 100);
    camera.position.set(0, 1.2, 4.6);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.domElement.style.touchAction = "pan-y";
    renderer.domElement.style.pointerEvents = "none";
    mount.appendChild(renderer.domElement);

    const mainGroup = new THREE.Group();
    mainGroup.rotation.x = 0.35;
    mainGroup.rotation.y = -0.4;
    scene.add(mainGroup);

    // ── 2. Materials ──
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      metalness: 0.9,
      roughness: 0.2,
    });

    const cellMat = new THREE.MeshStandardMaterial({
      color: 0x081f3d,
      roughness: 0.1,
      metalness: 0.88,
    });

    const busbarMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.98,
      roughness: 0.08,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.3,
      roughness: 0.04,
      metalness: 0.15,
      clearcoat: 1.0,
    });

    // ── 3. Modern Architectural Roof Plane ──
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b, // Modern slate dark roof
      roughness: 0.6,
      metalness: 0.2,
    });
    const roofPlane = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.8, 0.1), roofMat);
    roofPlane.position.set(0, 0, -0.15);
    mainGroup.add(roofPlane);

    // Architectural roof ridge line
    const ridgeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 });
    const ridge = new THREE.Mesh(new THREE.BoxGeometry(3.64, 0.12, 0.16), ridgeMat);
    ridge.position.set(0, 1.4, -0.12);
    mainGroup.add(ridge);

    // Mounting Strut Rails on roof
    const railMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.85, roughness: 0.3 });
    [-0.6, 0.6].forEach((y) => {
      const r = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.04, 0.08), railMat);
      r.position.set(0, y, -0.05);
      mainGroup.add(r);
    });

    // ── 4. Two Residential PM Surya Ghar Solar Panels Mounted On Roof ──
    const createResidentialPanel = () => {
      const p = new THREE.Group();
      const pW = 1.4;
      const pH = 2.2;
      const thickness = 0.05;

      const frame = new THREE.Mesh(new THREE.BoxGeometry(pW, pH, thickness), frameMat);
      p.add(frame);

      const cols = 4;
      const rows = 8;
      const margin = 0.016;
      const gridW = pW - 0.06;
      const gridH = pH - 0.06;
      const cW = (gridW - margin * (cols - 1)) / cols;
      const cH = (gridH - margin * (rows - 1)) / rows;
      const cellGeo = new THREE.PlaneGeometry(cW, cH);

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const cell = new THREE.Mesh(cellGeo, cellMat);
          const x = -gridW / 2 + cW / 2 + c * (cW + margin);
          const y = gridH / 2 - cH / 2 - r * (cH + margin);
          cell.position.set(x, y, thickness / 2 + 0.003);
          p.add(cell);
        }
        const colCenterX = -gridW / 2 + cW / 2 + c * (cW + margin);
        const bb = new THREE.Mesh(new THREE.BoxGeometry(0.004, gridH, 0.001), busbarMat);
        bb.position.set(colCenterX, 0, thickness / 2 + 0.005);
        p.add(bb);
      }

      const glass = new THREE.Mesh(new THREE.PlaneGeometry(pW - 0.04, pH - 0.04), glassMat);
      glass.position.z = thickness / 2 + 0.007;
      p.add(glass);

      return p;
    };

    const panel1 = createResidentialPanel();
    panel1.position.set(-0.76, 0, 0.04);
    mainGroup.add(panel1);

    const panel2 = createResidentialPanel();
    panel2.position.set(0.76, 0, 0.04);
    mainGroup.add(panel2);

    // ── 5. Clean Green Subsidy & Golden Sunlight Sparkles ──
    const sparkCount = 35;
    const sparkGeo = new THREE.SphereGeometry(0.025, 8, 8);
    const greenSparkMat = new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.85 });
    const amberSparkMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.85 });
    const sparks: { mesh: THREE.Mesh; angle: number; radius: number; speedY: number }[] = [];

    for (let i = 0; i < sparkCount; i++) {
      const mat = i % 2 === 0 ? greenSparkMat : amberSparkMat;
      const sp = new THREE.Mesh(sparkGeo, mat);
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.2 + Math.random() * 1.3;
      sp.position.set(Math.cos(angle) * radius, (Math.random() - 0.5) * 2.2, Math.sin(angle) * radius);
      mainGroup.add(sp);
      sparks.push({ mesh: sp, angle, radius, speedY: 0.008 + Math.random() * 0.015 });
    }

    // ── 6. Lighting ──
    const amb = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(amb);

    const sun = new THREE.DirectionalLight(0xffedd5, 3.4);
    sun.position.set(5, 6, 5);
    scene.add(sun);

    const sky = new THREE.DirectionalLight(0x0ea5e9, 1.5);
    sky.position.set(-4, -1, 3);
    scene.add(sky);

    // ── 7. Mouse Parallax ──
    let targetY = -0.4;
    let targetX = 0.35;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetY = -0.4 + x * 0.7;
      targetX = 0.35 + y * 0.4;
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

    // ── 8. Animation Loop ──
    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      mainGroup.position.y = Math.sin(elapsed * 1.4) * 0.08;

      mainGroup.rotation.y += (targetY - mainGroup.rotation.y) * 0.06;
      mainGroup.rotation.x += (targetX - mainGroup.rotation.x) * 0.06;

      sparks.forEach((sp) => {
        sp.mesh.position.y += sp.speedY;
        if (sp.mesh.position.y > 1.8) {
          sp.mesh.position.y = -1.4;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      frameMat.dispose();
      cellMat.dispose();
      busbarMat.dispose();
      glassMat.dispose();
      roofMat.dispose();
      ridgeMat.dispose();
      railMat.dispose();
      sparkGeo.dispose();
      greenSparkMat.dispose();
      amberSparkMat.dispose();
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

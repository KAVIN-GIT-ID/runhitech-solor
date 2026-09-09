import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RotateCw, Sun, Zap, Shield, Sparkles, Layers } from "lucide-react";

interface SolarPanel3DProps {
  className?: string;
  height?: string | number;
  autoRotate?: boolean;
  interactive?: boolean;
  showDetails?: boolean;
  title?: string;
  badge?: string;
}

export default function SolarPanel3D({
  className = "",
  height = "380px",
  autoRotate = true,
  interactive = true,
  showDetails = true,
  title = "Tier-1 Mono-PERC 550W Module",
  badge = "3D Interactive Model"
}: SolarPanel3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(autoRotate);
  const [solarEfficiency] = useState("22.8%");
  const [sunGlint, setSunGlint] = useState(true);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── 1. Scene Setup ──
    const scene = new THREE.Scene();
    const width = mount.clientWidth || 400;
    const heightPx = mount.clientHeight || 380;

    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 100);
    camera.position.set(0, 1.6, 4.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.domElement.style.touchAction = "pan-y";
    mount.appendChild(renderer.domElement);

    // ── 2. Solar Panel Group ──
    const panelGroup = new THREE.Group();
    // Default initial tilt angle (like rooftop mounting)
    panelGroup.rotation.x = 0.45;
    panelGroup.rotation.y = -0.35;
    scene.add(panelGroup);

    // Dimensions
    const panelWidth = 2.4;
    const panelHeight = 3.6;
    const panelThickness = 0.08;
    const frameBorder = 0.07;

    // A. Outer Anodized Aluminum Frame
    const frameMaterial = new THREE.MeshStandardMaterial({
      color: 0xd1d5db, // silver aluminum
      metalness: 0.9,
      roughness: 0.25,
    });

    // Outer box
    const outerFrameGeo = new THREE.BoxGeometry(panelWidth, panelHeight, panelThickness);
    const outerFrame = new THREE.Mesh(outerFrameGeo, frameMaterial);
    outerFrame.castShadow = true;
    outerFrame.receiveShadow = true;
    panelGroup.add(outerFrame);

    // B. Backsheet (white / black composite backing)
    const backsheetGeo = new THREE.PlaneGeometry(panelWidth - frameBorder * 1.5, panelHeight - frameBorder * 1.5);
    const backsheetMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a, // dark high-efficiency backing
      roughness: 0.7,
      metalness: 0.1,
    });
    const backsheet = new THREE.Mesh(backsheetGeo, backsheetMat);
    backsheet.position.z = panelThickness / 2 + 0.002;
    panelGroup.add(backsheet);

    // C. Photovoltaic Solar Cells (6 columns x 10 rows = 60 Half-cut cells)
    const cols = 6;
    const rows = 10;
    const cellMarginX = 0.025;
    const cellMarginY = 0.025;
    const cellAreaWidth = panelWidth - frameBorder * 2;
    const cellAreaHeight = panelHeight - frameBorder * 2;
    const cellW = (cellAreaWidth - cellMarginX * (cols - 1)) / cols;
    const cellH = (cellAreaHeight - cellMarginY * (rows - 1)) / rows;

    // High quality Monocrystalline Silicon Texture / Material
    const cellMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a2246, // deep monocrystalline blue
      roughness: 0.12,
      metalness: 0.85,
    });

    const cellGeo = new THREE.PlaneGeometry(cellW, cellH);

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const cell = new THREE.Mesh(cellGeo, cellMaterial);
        const posX = -cellAreaWidth / 2 + cellW / 2 + c * (cellW + cellMarginX);
        const posY = cellAreaHeight / 2 - cellH / 2 - r * (cellH + cellMarginY);
        cell.position.set(posX, posY, panelThickness / 2 + 0.005);
        panelGroup.add(cell);
      }
    }

    // D. Silver Multi-Busbar (MBB) Lines
    const busbarMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.98,
      roughness: 0.1,
    });

    for (let c = 0; c < cols; c++) {
      // 3 busbar wires per cell column
      for (let b = 0; b < 3; b++) {
        const colCenterX = -cellAreaWidth / 2 + cellW / 2 + c * (cellW + cellMarginX);
        const busbarX = colCenterX + (b - 1) * (cellW * 0.3);
        const busbarGeo = new THREE.BoxGeometry(0.006, cellAreaHeight, 0.002);
        const busbar = new THREE.Mesh(busbarGeo, busbarMat);
        busbar.position.set(busbarX, 0, panelThickness / 2 + 0.007);
        panelGroup.add(busbar);
      }
    }

    // E. Anti-Reflective ARC Tempered Glass Layer (Glossy top)
    const glassGeo = new THREE.PlaneGeometry(panelWidth - frameBorder * 1.2, panelHeight - frameBorder * 1.2);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.28,
      roughness: 0.05,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 0.9,
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.z = panelThickness / 2 + 0.009;
    panelGroup.add(glass);

    // F. Mounting Rail Structure (Underneath the panel)
    const railMat = new THREE.MeshStandardMaterial({
      color: 0x64748b, // Galvanized steel
      metalness: 0.85,
      roughness: 0.4,
    });

    // 2 Horizontal mounting rails
    const railGeo = new THREE.BoxGeometry(panelWidth * 1.1, 0.06, 0.12);
    const rail1 = new THREE.Mesh(railGeo, railMat);
    rail1.position.set(0, panelHeight * 0.25, -panelThickness / 2 - 0.06);
    panelGroup.add(rail1);

    const rail2 = new THREE.Mesh(railGeo, railMat);
    rail2.position.set(0, -panelHeight * 0.25, -panelThickness / 2 - 0.06);
    panelGroup.add(rail2);

    // Tilt Leg Brackets
    const legGeo = new THREE.CylinderGeometry(0.025, 0.025, 1.2, 12);
    const leg1 = new THREE.Mesh(legGeo, railMat);
    leg1.rotation.x = Math.PI / 4;
    leg1.position.set(-panelWidth * 0.35, panelHeight * 0.2, -0.5);
    panelGroup.add(leg1);

    const leg2 = new THREE.Mesh(legGeo, railMat);
    leg2.rotation.x = Math.PI / 4;
    leg2.position.set(panelWidth * 0.35, panelHeight * 0.2, -0.5);
    panelGroup.add(leg2);

    // ── 3. Solar Photon Energy Particles ──
    const particleCount = 45;
    const particleGeo = new THREE.SphereGeometry(0.025, 8, 8);
    const particleMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.75,
    });

    const particles: { mesh: THREE.Mesh; startY: number; speed: number }[] = [];
    const particlesGroup = new THREE.Group();
    panelGroup.add(particlesGroup);

    for (let i = 0; i < particleCount; i++) {
      const p = new THREE.Mesh(particleGeo, particleMat);
      const startX = (Math.random() - 0.5) * (panelWidth * 0.9);
      const startY = (Math.random() - 0.5) * (panelHeight * 0.9);
      const startZ = 0.3 + Math.random() * 1.5;
      p.position.set(startX, startY, startZ);
      particlesGroup.add(p);
      particles.push({ mesh: p, startY, speed: 0.015 + Math.random() * 0.02 });
    }

    // ── 4. Lighting ──
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    // Sun directional light (casting realistic golden sun glint)
    const sunLight = new THREE.DirectionalLight(0xffedd5, 3.2);
    sunLight.position.set(4, 5, 4);
    sunLight.castShadow = true;
    scene.add(sunLight);

    // Blue sky bounce light
    const skyLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    skyLight.position.set(-4, -2, 2);
    scene.add(skyLight);

    // Warm golden point light
    const flareLight = new THREE.PointLight(0xf59e0b, 1.8, 10);
    flareLight.position.set(2, 2.5, 3);
    scene.add(flareLight);

    // ── 5. Mouse Interaction / Orbit Controls ──
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationY = -0.35;
    let targetRotationX = 0.45;

    const handleMouseDown = (e: MouseEvent) => {
      if (!interactive) return;
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !interactive) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.008;

      // Limit X pitch rotation so it doesn't flip upside down
      targetRotationX = Math.max(-0.6, Math.min(1.2, targetRotationX));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    // Touch support for mobile — allowing smooth vertical scroll without scroll-lock
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (!interactive || e.touches.length === 0) return;
      isDragging = true;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      previousMousePosition = { x: touchStartX, y: touchStartY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !interactive || e.touches.length === 0) return;
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const deltaX = currentX - previousMousePosition.x;
      const deltaY = currentY - previousMousePosition.y;

      // Only perform 3D model rotation if horizontal movement exceeds vertical movement
      if (Math.abs(currentX - touchStartX) > Math.abs(currentY - touchStartY)) {
        targetRotationY += deltaX * 0.008;
        targetRotationX += deltaY * 0.004;
        targetRotationX = Math.max(-0.6, Math.min(1.2, targetRotationX));
      }

      previousMousePosition = { x: currentX, y: currentY };
    };

    const handleTouchEnd = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    domElement.addEventListener("touchstart", handleTouchStart, { passive: true });
    domElement.addEventListener("touchmove", handleTouchMove, { passive: true });
    domElement.addEventListener("touchend", handleTouchEnd, { passive: true });
    domElement.addEventListener("touchcancel", handleTouchEnd, { passive: true });

    // ── 6. Resize handler ──
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // ── 7. Animation Loop ──
    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Auto rotation when not dragging
      if (isRotating && !isDragging) {
        targetRotationY += 0.005;
        // Subtle floating bob
        panelGroup.position.y = Math.sin(elapsed * 1.2) * 0.08;
      }

      // Smooth damping interpolation
      panelGroup.rotation.y += (targetRotationY - panelGroup.rotation.y) * 0.08;
      panelGroup.rotation.x += (targetRotationX - panelGroup.rotation.x) * 0.08;

      // Animate solar photon particles falling into the panel
      particles.forEach((p) => {
        p.mesh.position.z -= p.speed;
        if (p.mesh.position.z <= 0.05) {
          p.mesh.position.z = 1.2 + Math.random() * 0.6;
          p.mesh.position.x = (Math.random() - 0.5) * (panelWidth * 0.85);
          p.mesh.position.y = (Math.random() - 0.5) * (panelHeight * 0.85);
        }
      });

      // Sun glint oscillation
      if (sunGlint) {
        flareLight.position.x = Math.sin(elapsed * 0.8) * 3;
        flareLight.position.y = 2.5 + Math.cos(elapsed * 0.8) * 1;
      }

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

    // ── 8. Cleanup ──
    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      domElement.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      domElement.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("resize", handleResize);

      renderer.dispose();
      outerFrameGeo.dispose();
      frameMaterial.dispose();
      backsheetGeo.dispose();
      backsheetMat.dispose();
      cellGeo.dispose();
      cellMaterial.dispose();
      glassGeo.dispose();
      glassMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [isRotating, sunGlint, interactive]);

  return (
    <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-blue-950 text-white border border-blue-500/20 shadow-2xl ${className}`}>
      
      {/* Background Solar Grid Aesthetic */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />

      {/* Top Header Controls / Info */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-[10px] font-mono font-bold uppercase tracking-wider text-blue-300 backdrop-blur-md flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
            {badge}
          </span>
          <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[10px] font-mono font-bold text-emerald-300 backdrop-blur-md items-center gap-1">
            <Zap className="w-3 h-3" />
            {solarEfficiency} Yield
          </span>
        </div>

        {/* Action Toggle Buttons */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => setIsRotating((prev) => !prev)}
            title={isRotating ? "Pause 3D rotation" : "Enable 3D rotation"}
            className={`p-2 rounded-xl border backdrop-blur-md transition-all duration-300 ${
              isRotating
                ? "bg-blue-600/40 border-blue-400/50 text-white shadow-lg shadow-blue-500/20"
                : "bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white"
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRotating ? "animate-spin" : ""}`} style={{ animationDuration: "6s" }} />
          </button>
          
          <button
            onClick={() => setSunGlint((prev) => !prev)}
            title="Toggle Sun Glint"
            className={`p-2 rounded-xl border backdrop-blur-md transition-all duration-300 ${
              sunGlint
                ? "bg-amber-500/30 border-amber-400/50 text-amber-300 shadow-lg shadow-amber-500/20"
                : "bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white"
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3D Canvas Mount */}
      <div
        ref={mountRef}
        style={{ height, touchAction: "pan-y" }}
        className="w-full cursor-grab active:cursor-grabbing select-none touch-pan-y"
      />

      {/* Drag & Tilt Hint */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
          <span className="font-medium text-slate-300">Drag to rotate in 3D</span>
        </div>

        {showDetails && (
          <div className="hidden sm:flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 font-mono text-[10px] text-slate-300">
            <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-blue-400" /> 30-Yr Linear Guarantee</span>
            <span className="flex items-center gap-1"><Layers className="w-3 h-3 text-amber-400" /> Mono-PERC 144-Cell</span>
          </div>
        )}
      </div>

      {/* Bottom Title Bar if requested */}
      {title && (
        <div className="p-4 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              {title}
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Anti-reflective ARC glass • Anodized Silver Frame • Multi-Busbar (MBB) Silicon Cells
            </p>
          </div>
          <a
            href="#calculator"
            className="hidden md:inline-flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md transition-all active:scale-95 whitespace-nowrap"
          >
            Calculate ROI
          </a>
        </div>
      )}
    </div>
  );
}

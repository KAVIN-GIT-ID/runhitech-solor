import { useEffect, useRef } from "react";

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const activeCanvas = canvas;
    const activeCtx = ctx;

    let animationFrameId: number;

    const resizeCanvas = () => {
      activeCanvas.width = window.innerWidth;
      activeCanvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class Particle {
      x!: number;
      y!: number;
      size!: number;
      speedX!: number;
      speedY!: number;
      opacity!: number;
      color!: string;

      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * activeCanvas.width;
        this.y = Math.random() * activeCanvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.22;
        this.speedY = (Math.random() - 0.5) * 0.22;
        this.opacity = Math.random() * 0.25 + 0.05;
        // Half particles Solar Indigo blue, half Sunset Amber
        this.color = Math.random() > 0.45 ? "rgba(30, 58, 138, " : "rgba(217, 119, 6, ";
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (
          this.x < 0 ||
          this.x > activeCanvas.width ||
          this.y < 0 ||
          this.y > activeCanvas.height
        ) {
          this.reset();
        }
      }
      draw() {
        activeCtx.beginPath();
        activeCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        activeCtx.fillStyle = `${this.color}${this.opacity})`;
        activeCtx.fill();
      }
    }

    let particles: Particle[] = [];
    const particleCount = Math.min(45, Math.floor(window.innerWidth / 28));
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      activeCtx.clearRect(0, 0, activeCanvas.width, activeCanvas.height);
      
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      // Draw connections in a soft solar indigo color
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            activeCtx.beginPath();
            activeCtx.moveTo(particles[i].x, particles[i].y);
            activeCtx.lineTo(particles[j].x, particles[j].y);
            activeCtx.strokeStyle = `rgba(30, 58, 138, ${0.035 * (1 - dist / 150)})`;
            activeCtx.lineWidth = 0.5;
            activeCtx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="particles"
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
}

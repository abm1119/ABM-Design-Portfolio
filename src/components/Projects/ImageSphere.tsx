import { useEffect, useRef, useState } from 'react';
import styles from './ImageSphere.module.css';

interface ImageSphereProps {
  images: string[];
  title: string;
}

interface Point {
  x: number;
  y: number;
  z: number;
  screenX: number;
  screenY: number;
  scale: number;
  img?: HTMLImageElement;
  imgIndex: number;
  lat: number;
  lon: number;
  distance: number;
  pulsePhase: number;
  rotationX: number;
  rotationY: number;
}

export default function ImageSphere({ images, title }: ImageSphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const rotationRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const [selectedImage, setSelectedImage] = useState<{ src: string; index: number } | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const autoRotateRef = useRef(isAutoRotating);
  const pointsRef = useRef<Point[]>([]);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(null);
  const [showControls, setShowControls] = useState(false);
  const controlTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const sphereRadiusRef = useRef(0);
  const timeRef = useRef(0);

  useEffect(() => {
    autoRotateRef.current = isAutoRotating;
  }, [isAutoRotating]);

  // Auto-hide controls after inactivity
  useEffect(() => {
    const resetTimeout = () => {
      if (controlTimeoutRef.current) clearTimeout(controlTimeoutRef.current);
      setShowControls(true);
      controlTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3500);
    };

    window.addEventListener('mousemove', resetTimeout);
    return () => {
      window.removeEventListener('mousemove', resetTimeout);
      if (controlTimeoutRef.current) clearTimeout(controlTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: false });
    if (!ctx) return;

    const images_loaded: HTMLImageElement[] = [];
    let loaded = 0;

    // Load images
    images.forEach((src, index) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        images_loaded[index] = img;
        loaded++;
      };
      img.onerror = () => {
        loaded++;
      };
      img.src = src;
    });

    const animate = () => {
      if (loaded < images.length) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      timeRef.current += 0.016; // ~60fps

      // Set canvas size with high DPI support
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;

      const centerX = width / 2;
      const centerY = height / 2;

      // Smooth auto-rotation with organic variation
      velocityRef.current.x = 0.00065 + Math.sin(timeRef.current * 0.25) * 0.00012;
      velocityRef.current.y = 0.0001 + Math.cos(timeRef.current * 0.22) * 0.00008;

      // Enhanced damping for silky motion
      velocityRef.current.x *= 0.938;
      velocityRef.current.y *= 0.938;

      rotationRef.current.y += velocityRef.current.x;
      rotationRef.current.x += velocityRef.current.y;

      // Clamp X rotation
      rotationRef.current.x = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, rotationRef.current.x));

      // Artistic background gradient
      const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height));
      bgGradient.addColorStop(0, 'rgba(252, 252, 253, 0.5)');
      bgGradient.addColorStop(0.5, 'rgba(248, 250, 252, 0.55)');
      bgGradient.addColorStop(1, 'rgba(242, 248, 252, 0.6)');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Add subtle noise texture for artistic feel
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * 2;
        data[i + 3] = noise; // Alpha channel for texture
      }
      ctx.putImageData(imageData, 0, 0);

      // Draw sphere
      const sphereRadius = (Math.min(width, height) / 2.35) * zoomLevel;
      sphereRadiusRef.current = sphereRadius;

      // Create accurate sphere points
      const points: Point[] = [];
      const loadedImages = images_loaded.filter(i => i);
      const imageCount = loadedImages.length;

      // Golden ratio distribution
      const goldenRatio = (1 + Math.sqrt(5)) / 2;

      for (let i = 0; i < imageCount; i++) {
        if (!images_loaded[i]) continue;

        // Fibonacci sphere algorithm
        const theta = Math.acos(1 - (2 * i) / imageCount);
        const phi = 2 * Math.PI * i / goldenRatio + rotationRef.current.y;

        const x = sphereRadius * Math.sin(theta) * Math.cos(phi);
        const y = sphereRadius * Math.cos(theta);
        const z = sphereRadius * Math.sin(theta) * Math.sin(phi);

        const y2 = y * Math.cos(rotationRef.current.x) - z * Math.sin(rotationRef.current.x);
        const z2 = y * Math.sin(rotationRef.current.x) + z * Math.cos(rotationRef.current.x);

        // Improved perspective scaling for larger, more consistent images
        const perspectiveScale = (z2 + sphereRadius * 1.4) / (2.8 * sphereRadius);
        const scale = Math.max(0.35, Math.min(1, perspectiveScale * 0.85 + 0.15));
        const distance = z2;

        // Pulse effect
        const pulsePhase = Math.sin(timeRef.current * 1.8 + i * 0.3) * 0.06;

        // 3D rotation for artistic effect
        const rotX = Math.sin(timeRef.current * 0.4 + i * 0.5) * 0.06;
        const rotY = Math.cos(timeRef.current * 0.35 + i * 0.6) * 0.06;

        points.push({
          x,
          y: y2,
          z: z2,
          screenX: centerX + x * (1 + scale * 0.1),
          screenY: centerY + y2 * (1 + scale * 0.1),
          scale,
          img: images_loaded[i],
          imgIndex: i,
          lat: theta,
          lon: phi,
          distance,
          pulsePhase,
          rotationX: rotX,
          rotationY: rotY,
        });
      }

      // Sort by Z depth
      points.sort((a, b) => a.distance - b.distance);
      pointsRef.current = points;

      // Draw images with professional styling
      points.forEach((point) => {
        if (!point.img) return;

        // Larger image sizes
        const baseSize = Math.max(68, 110 * point.scale);
        const hoverScale = hoveredImageIndex === point.imgIndex ? 1.2 : 1;
        const boxSize = baseSize * (1 + point.pulsePhase * 0.08) * hoverScale;

        const x = point.screenX - boxSize / 2;
        const y = point.screenY - boxSize / 2;
        const isHovered = hoveredImageIndex === point.imgIndex;

        ctx.save();

        // Apply 3D transforms for artistic effect
        ctx.translate(point.screenX, point.screenY);
        if (isHovered) {
          ctx.rotate(point.rotationX * 0.25);
          ctx.transform(1, point.rotationY * 0.08, 0, 1, 0, 0);
        }
        ctx.translate(-point.screenX, -point.screenY);

        // Professional shadow and glow
        const shadowBlur = (16 + (isHovered ? 28 : 0)) * point.scale;
        const shadowOffset = isHovered ? 5 : 2;

        ctx.shadowColor = isHovered
          ? `rgba(100, 160, 255, ${0.5 + 0.3 * point.scale})`
          : `rgba(150, 180, 220, ${0.2 + 0.15 * point.scale})`;
        ctx.shadowBlur = shadowBlur;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = shadowOffset;

        // Opacity
        ctx.globalAlpha = 0.72 + 0.28 * point.scale;

        // Draw rounded rectangle with larger radius
        const radius = 14 * point.scale;
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + boxSize - radius, y);
        ctx.quadraticCurveTo(x + boxSize, y, x + boxSize, y + radius);
        ctx.lineTo(x + boxSize, y + boxSize - radius);
        ctx.quadraticCurveTo(x + boxSize, y + boxSize, x + boxSize - radius, y + boxSize);
        ctx.lineTo(x + radius, y + boxSize);
        ctx.quadraticCurveTo(x, y + boxSize, x, y + boxSize - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.clip();

        // Draw image with better rendering
        ctx.filter = isHovered ? 'brightness(1.1) contrast(1.05)' : 'brightness(0.95) contrast(1)';
        ctx.drawImage(point.img, x, y, boxSize, boxSize);
        ctx.filter = 'none';

        ctx.restore();

        // Professional border with depth
        ctx.save();
        ctx.globalAlpha = isHovered ? 0.9 : 0.5 + 0.25 * point.scale;
        ctx.strokeStyle = isHovered
          ? `rgba(80, 150, 255, 1)`
          : `rgba(130, 170, 220, ${0.3 + 0.35 * point.scale})`;
        ctx.lineWidth = Math.max(isHovered ? 3 : 1.2, 1.5 * point.scale);

        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + boxSize - radius, y);
        ctx.quadraticCurveTo(x + boxSize, y, x + boxSize, y + radius);
        ctx.lineTo(x + boxSize, y + boxSize - radius);
        ctx.quadraticCurveTo(x + boxSize, y + boxSize, x + boxSize - radius, y + boxSize);
        ctx.lineTo(x + radius, y + boxSize);
        ctx.quadraticCurveTo(x, y + boxSize, x, y + boxSize - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.stroke();

        // Animated index label with artistic styling
        if (isHovered) {
          ctx.save();
          ctx.globalAlpha = 0.92;
          ctx.fillStyle = 'rgba(255, 255, 255, 1)';
          ctx.font = `800 ${Math.max(14, 16 * point.scale)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowColor = 'rgba(80, 150, 255, 0.5)';
          ctx.shadowBlur = 12;
          ctx.shadowOffsetY = 2;
          ctx.fillText(String(point.imgIndex + 1), point.screenX, point.screenY);
          ctx.restore();
        }

        ctx.restore();
      });

      // Draw artistic title
      ctx.save();
      ctx.fillStyle = 'rgba(35, 45, 60, 0.97)';
      ctx.font = '600 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 2;
      ctx.fillText(title, centerX, height - 52);
      ctx.restore();

      // Dynamic status info with artistic styling
      ctx.save();
      const infoPulse = Math.sin(timeRef.current * 1.2) * 0.08;
      ctx.fillStyle = `rgba(90, 120, 160, ${0.8 + infoPulse * 0.15})`;
      ctx.font = '500 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.05)';
      ctx.shadowBlur = 3;

      let infoText = '';
      if (hoveredImageIndex !== null) {
        infoText = `◆ ${hoveredImageIndex + 1} of ${images.length} — Click to view full resolution`;
      } else {
        infoText = '✦ Auto-rotating • Scroll to zoom • Space to pause';
      }

      ctx.fillText(infoText, centerX, height - 18);
      ctx.restore();

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      lastMouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      // Improved hover detection
      const hovered = pointsRef.current.find(point => {
        const baseSize = Math.max(68, 110 * point.scale);
        const boxSize = baseSize;
        const x = point.screenX - boxSize / 2;
        const y = point.screenY - boxSize / 2;
        return (
          lastMouseRef.current.x >= x &&
          lastMouseRef.current.x <= x + boxSize &&
          lastMouseRef.current.y >= y &&
          lastMouseRef.current.y <= y + boxSize
        );
      });

      setHoveredImageIndex(hovered ? hovered.imgIndex : null);
    };

    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Check if clicked on an image
      const clicked = pointsRef.current.find(point => {
        const baseSize = Math.max(68, 110 * point.scale);
        const boxSize = baseSize;
        const x = point.screenX - boxSize / 2;
        const y = point.screenY - boxSize / 2;
        return (
          clickX >= x &&
          clickX <= x + boxSize &&
          clickY >= y &&
          clickY <= y + boxSize
        );
      });

      if (clicked) {
        setSelectedImage({
          src: clicked.img!.src,
          index: clicked.imgIndex,
        });
      }
    };

    const handleMouseLeave = () => {
      setHoveredImageIndex(null);
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomSpeed = 0.1;
      const newZoom = Math.max(0.55, Math.min(2.0, zoomLevel + (e.deltaY > 0 ? -zoomSpeed : zoomSpeed)));
      setZoomLevel(newZoom);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedImage) {
        setSelectedImage(null);
      }
      if (e.key === ' ') {
        e.preventDefault();
        setIsAutoRotating(!isAutoRotating);
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [images, title, zoomLevel, hoveredImageIndex]);

  return (
    <>
      <div className={styles.sphereContainer}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
        />

        {/* Professional control panel */}
        <div className={`${styles.controlPanel} ${showControls ? styles.visible : ''}`}>
          <div className={styles.controlContent}>
            <div className={styles.infoSection}>
              <span className={styles.statusText}>
                ◉ ROTATING
              </span>
              <span className={styles.zoomText}>
                {(zoomLevel * 100).toFixed(0)}%
              </span>
            </div>

            <div className={styles.buttonGroup}>
              <button
                className={styles.autoRotateToggle}
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                title="Toggle auto-rotation (Space)"
              >
                {isAutoRotating ? '⏸ PAUSE' : '▶ PLAY'}
              </button>
              <button
                className={styles.resetButton}
                onClick={() => setZoomLevel(1)}
                title="Reset zoom (R)"
              >
                ⟲ RESET
              </button>
            </div>
          </div>
        </div>

        {/* Artistic tooltip */}
        {hoveredImageIndex !== null && (
          <div className={styles.smartTooltip}>
            <span className={styles.tooltipIcon}>◆</span>
            <span className={styles.tooltipNumber}>{hoveredImageIndex + 1}</span>
            <span className={styles.tooltipTotal}>/ {images.length}</span>
            <span className={styles.clickPrompt}>✦ Click to view</span>
          </div>
        )}
      </div>

      {/* Professional full-screen viewer */}
      {selectedImage && (
        <div className={styles.fullscreenViewer}>
          <div className={styles.backdrop} onClick={() => setSelectedImage(null)} />
          <div className={styles.imageWrapper}>
            <button
              className={styles.closeBtn}
              onClick={() => setSelectedImage(null)}
              title="Close (Esc)"
            >
              ✕
            </button>
            <img
              src={selectedImage.src}
              alt="Full view"
              className={styles.fullscreenImage}
            />
            <div className={styles.imageCounter}>
              <span className={styles.counterIcon}>◇</span>
              {selectedImage.index + 1} / {images.length}
            </div>

            {/* Navigation */}
            <button
              className={styles.navPrev}
              onClick={() => {
                const newIndex = (selectedImage.index - 1 + images.length) % images.length;
                setSelectedImage({ src: images[newIndex], index: newIndex });
              }}
              title="Previous (← or A)"
            >
              ‹
            </button>
            <button
              className={styles.navNext}
              onClick={() => {
                const newIndex = (selectedImage.index + 1) % images.length;
                setSelectedImage({ src: images[newIndex], index: newIndex });
              }}
              title="Next (→ or D)"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </>
  );
}

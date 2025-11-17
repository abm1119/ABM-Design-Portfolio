import { useState, useRef, useEffect } from 'react';
import styles from './DraggableGallery.module.css';

interface DraggableImage {
  id: string;
  src: string;
  x: number;
  y: number;
  z: number;
  isSelected: boolean;
  isDragging: boolean;
  startX?: number;
  startY?: number;
}

interface DraggableGalleryProps {
  images: string[];
}

export default function DraggableGallery({ images }: DraggableGalleryProps) {
  const [draggableImages, setDraggableImages] = useState<DraggableImage[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zIndex, setZIndex] = useState(10);
  const [gridView, setGridView] = useState(true);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  useEffect(() => {
    // Initialize draggable images with random positions in grid view
    const initialized = images.map((src, index) => ({
      id: `img-${index}`,
      src,
      x: (index % 3) * 200,
      y: Math.floor(index / 3) * 200,
      z: index,
      isSelected: false,
      isDragging: false,
    }));
    setDraggableImages(initialized);
  }, [images]);

  const handleMouseDown = (
    id: string,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;

    setZIndex((prev) => prev + 1);

    setDraggableImages((prev) =>
      prev.map((img) => {
        if (img.id === id) {
          return {
            ...img,
            isSelected: true,
            isDragging: true,
            startX,
            startY,
            z: zIndex,
          };
        }
        return { ...img, isSelected: false };
      })
    );
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gridView) return;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    setDraggableImages((prev) =>
      prev.map((img) => {
        if (img.isDragging && img.startX !== undefined && img.startY !== undefined) {
          return {
            ...img,
            x: Math.max(0, Math.min(rect.width - 120, img.x + (currentX - img.startX))),
            y: Math.max(0, Math.min(rect.height - 120, img.y + (currentY - img.startY))),
            startX: currentX,
            startY: currentY,
          };
        }
        return img;
      })
    );
  };

  const handleMouseUp = () => {
    setDraggableImages((prev) =>
      prev.map((img) => ({
        ...img,
        isDragging: false,
        startX: undefined,
        startY: undefined,
      }))
    );
  };

  const toggleView = () => {
    if (!gridView) {
      // Reset to grid when switching from free view
      const initialized = images.map((src, index) => ({
        id: `img-${index}`,
        src,
        x: (index % 3) * 200,
        y: Math.floor(index / 3) * 200,
        z: index,
        isSelected: false,
        isDragging: false,
      }));
      setDraggableImages(initialized);
    }
    setGridView(!gridView);
  };

  return (
    <div className={styles.galleryWrapper}>
      <div className={styles.header}>
        <h3>Interactive Gallery</h3>
        <button
          className={styles.viewToggle}
          onClick={toggleView}
          title={gridView ? 'Switch to Free Layout' : 'Switch to Grid'}
        >
          {gridView ? '🎨 Free Mode' : '📋 Grid'}
        </button>
      </div>

      <div
        ref={containerRef}
        className={`${styles.gallery} ${gridView ? styles.freeLayout : styles.gridLayout}`}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {draggableImages.map((img) => (
          <div
            key={img.id}
            className={`${styles.imageWrapper} ${img.isSelected ? styles.selected : ''} ${
              img.isDragging ? styles.dragging : ''
            }`}
            style={
              gridView
                ? {
                    position: 'absolute',
                    left: `${img.x}px`,
                    top: `${img.y}px`,
                    zIndex: img.z,
                  }
                : {}
            }
            onMouseDown={(e) => handleMouseDown(img.id, e)}
          >
            <div className={styles.imageContainer}>
              <img
                src={img.src}
                alt={img.id}
                draggable={false}
                className={styles.image}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!img.isDragging) {
                    setFullscreenImage(img.src);
                  }
                }}
              />
              <div className={styles.imageOverlay}>
                <span className={styles.dragHint}>
                  {gridView ? '↔ Drag • Click to view' : '📌 Click to view'}
                </span>
              </div>
            </div>
            </div>
            ))}
            </div>

            <div className={styles.info}>
            <p>
            {gridView
            ? '✨ Drag any image around freely on the canvas'
            : '📊 Organized grid view - Click "Free Mode" to rearrange'}
            </p>
            </div>

            {/* Full-screen image viewer */}
            {fullscreenImage && (
            <div className={styles.fullscreenViewer}>
            <div className={styles.backdrop} onClick={() => setFullscreenImage(null)} />
            <div className={styles.imageWrapper}>
            <button
              className={styles.closeBtn}
              onClick={() => setFullscreenImage(null)}
              title="Close (Esc)"
            >
              ✕
            </button>
            <img
              src={fullscreenImage}
              alt="Full view"
              className={styles.fullscreenImage}
            />
            </div>
            </div>
            )}
            </div>
            );
            }

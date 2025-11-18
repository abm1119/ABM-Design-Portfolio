import { useState, useEffect } from 'react';
import ImageSphere from './ImageSphere';
import styles from './ProjectDetail.module.css';

interface ProjectDetailProps {
  project: {
    id: string;
    title: string;
    category: string;
    description: string;
    fullDescription: string;
    images: string[];
    tags: string[];
    stats: {
      projects: number;
      duration: string;
      clients: string;
    };
  };
  onClose: () => void;
}

export default function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState<'sphere' | 'details' | 'lightbox'>('sphere');
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const contentElement = document.querySelector(`.${styles.content}`);
      if (contentElement) {
        contentElement.addEventListener('scroll', handleScroll);
        return () => contentElement.removeEventListener('scroll', handleScroll);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleScroll = (e: Event) => {
    const content = e.target as HTMLElement;
    if (!content) return;
    const scrollHeight = content.scrollHeight - content.clientHeight;
    const progress = scrollHeight > 0 ? (content.scrollTop / scrollHeight) * 100 : 0;
    setScrollProgress(progress);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setShowLightbox(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setShowLightbox(false);
    document.body.style.overflow = 'hidden';
  };

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % project.images.length);
  };

  const prevImage = () => {
    setLightboxIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showLightbox) return;
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLightbox]);

  return (
    <>
      <div className={styles.modal}>
        <div className={styles.backdrop} onClick={onClose} />
        
        <div className={styles.content}>
          {/* Scroll Progress Bar */}
          <div className={styles.progressBar} style={{ width: `${scrollProgress}%` }} />

          {/* Header Controls */}
          <div className={styles.headerControls}>
            <button 
              className={`${styles.iconButton} ${isFavorite ? styles.active : ''}`}
              onClick={() => setIsFavorite(!isFavorite)}
              title="Add to favorites"
            >
              <svg width={24} height={24} viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>

            <button 
              className={styles.iconButton}
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
              }}
              title="Share project"
            >
              <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </button>

            <button className={styles.closeButton} onClick={onClose} title="Close (Esc)">
              <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Animated Background */}
          <div className={styles.animatedBg} />

          {/* Main Content */}
          <div className={styles.mainContent}>
            {/* Hero Section */}
            <div className={styles.heroSection}>
              <div className={styles.heroContent}>
                <div className={styles.categoryBadge}>{project.category}</div>
                <h1 className={styles.heroTitle}>{project.title}</h1>
                <p className={styles.heroDescription}>{project.description}</p>
                
                <div className={styles.tagCloud}>
                  {project.tags.map((tag) => (
                    <span key={tag} className={styles.tagBadge}>
                      <span className={styles.tagDot}></span>
                      {tag}
                    </span>
                  ))}
                </div>

                <div className={styles.statsBar}>
                  <div className={styles.statItem}>
                    <span className={styles.statNumber}>{project.stats.projects}</span>
                    <span className={styles.statLabel}>Projects</span>
                  </div>
                  <div className={styles.statDivider}></div>
                  <div className={styles.statItem}>
                    <span className={styles.statNumber}>{project.stats.duration}</span>
                    <span className={styles.statLabel}>Duration</span>
                  </div>
                  <div className={styles.statDivider}></div>
                  <div className={styles.statItem}>
                    <span className={styles.statNumber}>{project.stats.clients}</span>
                    <span className={styles.statLabel}>Clients</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className={styles.tabsContainer}>
              <div className={styles.tabs}>
                {['sphere', 'details', 'lightbox'].map((tab) => (
                  <button
                    key={tab}
                    className={`${styles.tabButton} ${activeTab === tab ? styles.active : ''}`}
                    onClick={() => setActiveTab(tab as 'sphere' | 'details' | 'lightbox')}
                  >
                    <span className={styles.tabIcon}>
                      {tab === 'sphere' && '🎆'}
                      {tab === 'details' && '📋'}
                      {tab === 'lightbox' && '🖼️'}
                    </span>
                    <span className={styles.tabLabel}>
                      {tab === 'sphere' && '3D View'}
                      {tab === 'details' && 'Details'}
                      {tab === 'lightbox' && 'Lightbox'}
                    </span>
                  </button>
                ))}
              </div>
              <div className={styles.tabIndicator} />
            </div>

            {/* Tab Content */}
            <div className={styles.tabContent}>
              {activeTab === 'sphere' && (
                <div className={`${styles.tabPane} ${styles.sphereSection}`}>
                  <ImageSphere images={project.images} title={project.title} />
                </div>
              )}

              {activeTab === 'details' && (
                <div className={`${styles.tabPane} ${styles.detailsSection}`}>
                  <div className={styles.descriptionBox}>
                    <h2>Project Overview</h2>
                    <p>{project.fullDescription}</p>
                  </div>

                  <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                      <div className={styles.statIcon}>📊</div>
                      <div className={styles.statLabel}>Total Projects</div>
                      <div className={styles.statValue}>{project.stats.projects}</div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statIcon}>⏱️</div>
                      <div className={styles.statLabel}>Duration</div>
                      <div className={styles.statValue}>{project.stats.duration}</div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statIcon}>🤝</div>
                      <div className={styles.statLabel}>Clients</div>
                      <div className={styles.statValue}>{project.stats.clients}</div>
                    </div>
                  </div>

                  <div className={styles.skillsSection}>
                    <h3>Technologies & Skills</h3>
                    <div className={styles.skillList}>
                      {project.tags.map((tag, index) => (
                        <span key={tag} className={styles.skillItem} style={{ animationDelay: `${index * 0.05}s` }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className={styles.galleryPreview}>
                    <h3>Gallery Preview</h3>
                    <div className={styles.imageGrid}>
                      {project.images.slice(0, 8).map((img, index) => (
                        <div 
                          key={index} 
                          className={styles.previewImageCard}
                          onClick={() => openLightbox(index)}
                        >
                          <img src={img} alt={`${project.title} ${index + 1}`} />
                          <div className={styles.imageOverlay}>
                            <svg width={32} height={32} viewBox="0 0 24 24" fill="currentColor">
                              <path d="M8 5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H8z" />
                              <circle cx="12" cy="13" r="3" fill="white" />
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'lightbox' && (
                <div className={`${styles.tabPane} ${styles.lightboxSection}`}>
                  <div className={styles.lightboxContainer}>
                    <div className={styles.lightboxGrid}>
                      {project.images.map((img, index) => (
                        <div
                          key={index}
                          className={styles.lightboxItem}
                          onClick={() => openLightbox(index)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && openLightbox(index)}
                        >
                          <img src={img} alt={`${project.title} ${index + 1}`} />
                          <div className={styles.lightboxItemOverlay}>
                            <span className={styles.itemNumber}>{index + 1}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {showLightbox && (
        <div className={styles.lightboxModal}>
          <div className={styles.lightboxBackdrop} onClick={closeLightbox} />
          
          <div className={styles.lightboxContent}>
            <button className={styles.lightboxClose} onClick={closeLightbox}>
              <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <button className={styles.lightboxPrev} onClick={prevImage} title="Previous (←)">
              <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            <div className={styles.lightboxImage}>
              <img 
                src={project.images[lightboxIndex]} 
                alt={`${project.title} ${lightboxIndex + 1}`}
              />
            </div>

            <button className={styles.lightboxNext} onClick={nextImage} title="Next (→)">
              <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>

            <div className={styles.lightboxInfo}>
              <div className={styles.lightboxCounter}>
                {lightboxIndex + 1} / {project.images.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

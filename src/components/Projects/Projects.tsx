import { useEffect, useRef, useState } from 'react';
import ArrowRightIcon from '../icons/ArrowRightIcon';
import styles from './Projects.module.css';
import { projects } from '../../data/projects';
import ProjectDetail from './ProjectDetail';

export default function Projects() {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const [headerVisible, setHeaderVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[0] | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const headerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      headerObserver.observe(sectionRef.current);
    }

    const itemObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = itemRefs.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1) {
              setVisibleItems((prev) => new Set(prev).add(index));
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    itemRefs.current.forEach((ref) => {
      if (ref) itemObserver.observe(ref);
    });

    return () => {
      headerObserver.disconnect();
      itemObserver.disconnect();
    };
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  return (
    <>
      <section id="projects" className={`${styles.projects} section-padding`} ref={sectionRef}>
        <div className="container">
          <div className={styles.showcaseTitle}>
            <h2 className={`heading-lg ${styles.workShowcase} ${headerVisible ? styles.titleVisible : ''}`}>
              My Creative <span className="gradient-text">Work Showcase</span>
            </h2>
          </div>

          <div className={styles.projectsList}>
            {projects.map((project, index) => (
              <div
                key={project.id}
                ref={(el) => { itemRefs.current[index] = el; }}
                className={`${styles.projectItem} ${visibleItems.has(index) ? styles.visible : ''}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className={`${styles.itemContent} ${hoveredIndex === index ? styles.hovered : ''}`}
                  onClick={() => setSelectedProject(project)}
                >
                  <div className={styles.itemHeader}>
                    <div className={styles.titleSection}>
                      <h3 className={`heading-sm ${styles.projectTitle}`}>{project.title}</h3>
                      <span className={`label ${styles.category}`}>{project.category}</span>
                    </div>
                    <div className={styles.arrow}>
                      <ArrowRightIcon width={24} height={24} color="currentColor" />
                    </div>
                  </div>

                  <p className={`body-md ${styles.projectDescription}`}>{project.description}</p>

                  <div className={styles.projectMeta}>
                    <div className={styles.stats}>
                      <span className={styles.stat}>
                        <span className={styles.statLabel}>Projects:</span>
                        <span className={styles.statValue}>{project.stats.projects}</span>
                      </span>
                      <span className={styles.divider}>•</span>
                      <span className={styles.stat}>
                        <span className={styles.statLabel}>Duration:</span>
                        <span className={styles.statValue}>{project.stats.duration}</span>
                      </span>
                    </div>

                    <div className={styles.tags}>
                      {project.tags.map((tag) => (
                        <span key={tag} className={styles.tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={styles.itemLine}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedProject && (
        <ProjectDetail 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
}

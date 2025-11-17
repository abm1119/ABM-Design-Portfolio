import { useEffect, useRef, useState } from 'react';
import styles from './Summary.module.css';

export default function Summary() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className={`${styles.summary} section-padding`} ref={sectionRef}>
      <div className={styles.backgroundDecor}></div>
      
      <div className="container">
        <div className={styles.summaryContent}>
          <div className={`${styles.mainContent} ${isVisible ? styles.visible : ''}`}>
            <span className={`label ${styles.sectionLabel}`}>About Me</span>
            <h2 className="heading-lg" style={{ marginBottom: 'var(--spacing-md)' }}>
              Crafting Digital <span className="gradient-text">Experiences</span>
            </h2>
            <p className={`body-lg ${styles.description}`}>
              A creative and detail-focused UI/UX Designer, Graphic Designer, and Front-End Developer who blends 
              aesthetics with functionality. I love turning ideas into clean, visually striking, and user-friendly 
              digital experiences.
            </p>
            <p className={`body-lg ${styles.description}`}>
              With over 5 years of experience working on branding, design systems, and full web interfaces, I've 
              helped startups and businesses shape their online identity through thoughtful design and modern 
              front-end development.
            </p>
            
            <div className={styles.philosophy}>
              <div className={styles.quoteIcon}>"</div>
              <p className={styles.philosophyText}>
                Make it clear, make it beautiful, and make it work.
              </p>
            </div>
          </div>

          <div className={`${styles.statsGrid} ${isVisible ? styles.visible : ''}`}>
            <div className={`${styles.statCard} ${styles.stat1}`}>
              <div className={styles.statGlow}></div>
              <span className={`heading-xl gradient-text ${styles.statNumber}`}>5+</span>
              <span className={`body-sm ${styles.statLabel}`}>Years Experience</span>
            </div>
            <div className={`${styles.statCard} ${styles.stat2}`}>
              <div className={styles.statGlow}></div>
              <span className={`heading-xl gradient-text ${styles.statNumber}`}>100+</span>
              <span className={`body-sm ${styles.statLabel}`}>Global Clients</span>
            </div>
            <div className={`${styles.statCard} ${styles.stat3}`}>
              <div className={styles.statGlow}></div>
              <span className={`heading-xl gradient-text ${styles.statNumber}`}>200+</span>
              <span className={`body-sm ${styles.statLabel}`}>Projects Delivered</span>
            </div>
            <div className={`${styles.statCard} ${styles.stat4}`}>
              <div className={styles.statGlow}></div>
              <span className={`heading-xl gradient-text ${styles.statNumber}`}>3</span>
              <span className={`body-sm ${styles.statLabel}`}>Certifications</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
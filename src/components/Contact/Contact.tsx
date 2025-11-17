import { useEffect, useRef, useState } from 'react';
import styles from './Contact.module.css';

export default function Contact() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
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

  const handleCardMouseEnter = (cardId: string) => {
    setHoveredCard(cardId);
  };

  const handleCardMouseLeave = () => {
    setHoveredCard(null);
  };

  return (
    <section id="contact" className={`${styles.contact} section-padding`} ref={sectionRef}>
      <div className={styles.backgroundDecor}></div>
      <div className={styles.floatingElements}>
        <div className={styles.floatingElement}></div>
        <div className={styles.floatingElement}></div>
        <div className={styles.floatingElement}></div>
      </div>
      
      <div className="container">
        <div className={`${styles.contactContent} ${isVisible ? styles.visible : ''}`}>
          <span className={`label ${styles.sectionLabel}`}>
            <span className={styles.labelIcon}>✨</span>
            Get In Touch
            <span className={styles.labelIcon}>✨</span>
          </span>
          <h2 className={`heading-lg ${styles.title}`}>
            Let's Create Something <span className="gradient-text">Extraordinary</span>
          </h2>
          <p className={`body-lg ${styles.subtitle}`}>
            I'm always excited to discuss new projects, share creative ideas, or explore opportunities to bring your vision to life. Connect with me and let's build something remarkable together.
          </p>

          <div className={styles.contactGrid}>
            <a 
              href="mailto:basitmemon67@gmail.com" 
              className={`${styles.contactCard} ${styles.emailCard} glass-card ${hoveredCard === 'email' ? styles.cardActive : ''}`}
              onMouseEnter={() => handleCardMouseEnter('email')}
              onMouseLeave={handleCardMouseLeave}
            >
              <div className={styles.cardGlow}></div>
              <div className={styles.iconWrapper}>
                <svg className={styles.contactIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <span className={`body-md ${styles.contactText}`}>basitmemon67@gmail.com</span>
              <span className={styles.cardLabel}>Email Me</span>
            </a>

            <a 
              href="tel:+923160360531" 
              className={`${styles.contactCard} ${styles.phoneCard} glass-card ${hoveredCard === 'phone' ? styles.cardActive : ''}`}
              onMouseEnter={() => handleCardMouseEnter('phone')}
              onMouseLeave={handleCardMouseLeave}
            >
              <div className={styles.cardGlow}></div>
              <div className={styles.iconWrapper}>
                <svg className={styles.contactIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <span className={`body-md ${styles.contactText}`}>+92 316 0360531</span>
              <span className={styles.cardLabel}>Call Me</span>
            </a>

            <div 
              className={`${styles.contactCard} ${styles.locationCard} glass-card ${hoveredCard === 'location' ? styles.cardActive : ''}`}
              onMouseEnter={() => handleCardMouseEnter('location')}
              onMouseLeave={handleCardMouseLeave}
            >
              <div className={styles.cardGlow}></div>
              <div className={styles.iconWrapper}>
                <svg className={styles.contactIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <span className={`body-md ${styles.contactText}`}>Karachi, Pakistan</span>
              <span className={styles.cardLabel}>Visit Me</span>
            </div>
          </div>

          <div className={styles.cta}>
            <button className="btn-primary" onClick={() => window.location.href = 'mailto:basitmemon67@gmail.com'}>
              <span>✉ Send Email</span>
            </button>
            <button className="btn-secondary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <span>↑ Back to Top</span>
            </button>
          </div>

          <div className={styles.footer}>
            <p className="body-sm">
              Made with <span className={styles.love}>❤</span> by Abdul Basit - 
              <a 
                href="https://www.engrabm.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.footerLink}
                title="Visit www.engrabm.com"
              >
                ABM
              </a>
            </p>
            <p className={styles.visitLink}>
              <a 
                href="https://www.engrabm.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.websiteLink}
              >
                www.engrabm.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
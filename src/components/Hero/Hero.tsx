import styles from './Hero.module.css';
import AbmLogoIcon from '../icons/AbmLogoIcon';

export default function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={styles.hero}>
      <div className={styles.gradientMesh}></div>
      <div className={styles.orb1}></div>
      <div className={styles.orb2}></div>
      <div className={styles.orb3}></div>
      
      <div className={`container ${styles.heroContent}`}>
        <div className={styles.heroLeft}>
          <div className={styles.labelWrapper}>
            <span className={styles.sparkle}>✦</span>
            <span className={`label ${styles.label}`}>Creative Technologist</span>
            <span className={styles.sparkle}>✦</span>
          </div>
          
          <h1 className={`heading-display ${styles.title}`}>
            Abdul Basit
            <br />
            <span className="gradient-text">Memon</span>
          </h1>
          
          <p className={`body-xl ${styles.subtitle}`}>
            UI/UX & Graphic Designer — Front-End Developer
          </p>
          
          <div className={styles.location}>
            <div className={styles.locationDot}></div>
            <span className="body-md">Karachi, Pakistan</span>
          </div>
          
          <div className={styles.cta}>
            <button className="btn-primary" onClick={() => scrollToSection('contact')}>
              <span>Get In Touch</span>
            </button>
            <button className="btn-secondary" onClick={() => scrollToSection('projects')}>
              <span>View Projects</span>
            </button>
          </div>
        </div>

        <div className={styles.heroRight}>
          <div className={styles.logoContainer}>
            <div className={styles.logoGlow}></div>
            <AbmLogoIcon />
          </div>
        </div>
      </div>

      <div className={styles.scrollIndicator}>
        <div className={styles.scrollLine}></div>
        <span className={styles.scrollText}>Scroll</span>
      </div>
    </section>
  );
}
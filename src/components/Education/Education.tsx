import { useEffect, useRef, useState } from 'react';
import styles from './Education.module.css';

const certifications = [
  {
    title: 'Basic Elements of Design: Design Principles and Software Overview',
    provider: 'Coursera',
    date: 'Mar 2023'
  },
  {
    title: 'Graphic Design Fundamentals',
    provider: 'GFX Mentor (YouTube)',
    date: '2022'
  },
  {
    title: 'Branding & Advanced Design',
    provider: 'Rajeev Mehta (YouTube)',
    date: '2022'
  }
];

const coursework = [
  'UI/UX Design',
  'Web Development',
  'Human-Computer Interaction',
  'Software Engineering',
  'Machine Learning'
];

export default function Education() {
  const [headerVisible, setHeaderVisible] = useState(false);
  const [columnsVisible, setColumnsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const headerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const contentObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setColumnsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      headerObserver.observe(sectionRef.current);
    }

    if (contentRef.current) {
      contentObserver.observe(contentRef.current);
    }

    return () => {
      headerObserver.disconnect();
      contentObserver.disconnect();
    };
  }, []);

  return (
    <section className={`${styles.education} section-padding`} ref={sectionRef}>
      <div className="container">
        <div className={`${styles.header} ${headerVisible ? styles.visible : ''}`}>
          <span className={`label ${styles.sectionLabel}`}>Academic Background</span>
          <h2 className="heading-lg">
            Education & <span className="gradient-text">Certifications</span>
          </h2>
          <p className={`body-lg ${styles.subtitle}`}>
            Continuous learning through formal education and professional development
          </p>
        </div>

        <div className={styles.content} ref={contentRef}>
          <div className={`${styles.column} ${columnsVisible ? styles.visible : ''}`}>
            <h3 className={`heading-md ${styles.columnTitle}`}>Education</h3>
            <div className={`glass-card ${styles.degreeCard}`}>
              <h4 className={`heading-sm ${styles.degreeTitle}`}>
                Bachelor of Engineering in Computer Systems Engineering
              </h4>
              <p className={`body-md ${styles.university}`}>Sukkur IBA University</p>
              <span className={`body-sm ${styles.period}`}>Oct 2021 – Jun 2025</span>
              
              <div className={styles.coursework}>
                <p className={`body-sm ${styles.courseworkTitle}`}>Relevant Coursework:</p>
                <div className={styles.courseworkList}>
                  {coursework.map((course) => (
                    <span key={course} className={styles.courseworkItem}>
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.column} ${columnsVisible ? styles.visible : ''}`}>
            <h3 className={`heading-md ${styles.columnTitle}`}>Certifications</h3>
            <div className={styles.certList}>
              {certifications.map((cert) => (
                <div key={cert.title} className={`glass-card ${styles.certCard}`}>
                  <h4 className={`heading-sm ${styles.certTitle}`}>{cert.title}</h4>
                  <p className={`body-md ${styles.certProvider}`}>{cert.provider}</p>
                  <span className={styles.certDate}>{cert.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
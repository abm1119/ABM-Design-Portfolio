import { useEffect, useRef, useState } from 'react';
import styles from './Experience.module.css';

const projects = [
  {
    company: 'ABM Design Ltd',
    role: 'Lead Designer & Founder',
    period: 'Jan 2019 – Present',
    description: 'Founded a creative studio serving 100+ clients globally. Developed full branding kits, digital visuals, and UI layouts. Specialized in emotional design, storytelling, and building strong visual systems for businesses.'
  },
  {
    company: 'IEEE Sukkur Subsection',
    role: 'Graphic & Brand Designer',
    period: 'May 2022 – Jun 2023',
    description: 'Designed conference themes, digital posters, and certificates while ensuring IEEE branding standards. Contributed to multiple technical events with creative concepts and visuals.'
  },
  {
    company: 'Computer Systems Engineering Department, Sukkur IBA University',
    role: 'Visual Designer',
    period: 'May 2021 – Dec 2022',
    description: 'Created departmental branding and event visuals. Designed admission posters that attracted over 200 students in Fall 2022, helping increase department visibility.'
  }
];

export default function Experience() {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const [headerVisible, setHeaderVisible] = useState(false);
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

  return (
    <section id="experience" className={`${styles.experience} section-padding`} ref={sectionRef}>
      <div className="container">
        <h2 className="heading-lg" style={{ marginBottom: '3rem', textAlign: 'center' }}>
          My <span className="gradient-text">Creative Work Timeline</span>
        </h2>
        <div className={`${styles.header} ${headerVisible ? styles.visible : ''}`}>
          <span className={`label ${styles.sectionLabel}`}>Career Journey</span>
          <h2 className="heading-lg">
            Professional <span className="gradient-text">Experience</span>
          </h2>
          <p className={`body-lg ${styles.subtitle}`}>
            A timeline of my creative and technical journey across design and development
          </p>
        </div>

        <div className={styles.timeline}>
          {projects.map((project, index) => (
            <div
              key={project.company}
              ref={(el) => { itemRefs.current[index] = el; }}
              className={`${styles.timelineItem} ${visibleItems.has(index) ? styles.visible : ''}`}
            >
              <div className={`glass-card ${styles.experienceCard}`}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitle}>
                    <h3 className={`heading-sm ${styles.company}`}>{project.company}</h3>
                    <p className={`body-md ${styles.role}`}>{project.role}</p>
                  </div>
                  <span className={`body-sm ${styles.period}`}>{project.period}</span>
                </div>
                <p className={`body-md ${styles.description}`}>{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
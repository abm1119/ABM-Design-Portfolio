import { useEffect, useRef, useState } from 'react';
import styles from './Skills.module.css';

const skillCategories = [
  {
    title: 'UI/UX Design',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M9 3v18M3 9h18M3 15h18"/>
      </svg>
    ),
    skills: ['Figma', 'Wireframing', 'Prototyping', 'Design Systems', 'Responsive Layouts', 'User Research']
  },
  {
    title: 'Design & Branding',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    ),
    skills: ['Logo Design', 'Brand Identity', 'Typography', 'Social Media Design', 'Visual Storytelling', 'Color Psychology']
  },
  {
    title: 'Front-End Development',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Responsive UI', 'Interactive Design']
  },
  {
    title: 'Design Software',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
      </svg>
    ),
    skills: ['Adobe Illustrator', 'Photoshop', 'Figma', 'Canva', 'Miro', 'CapCut']
  },
  {
    title: 'AI & Productivity Tools',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    skills: ['ChatGPT', 'Gemini', 'Midjourney', 'Canva Magic Studio', 'Notion AI']
  },
  {
    title: 'Creative Focus',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14,2 14,8 20,8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
    skills: ['Design Thinking', 'Emotional Design', 'Blogging', 'Content Creation', 'Portfolio Presentation']
  }
];

export default function Skills() {
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
    <section className={`${styles.skills} section-padding`} ref={sectionRef}>
      <div className="container">
        <div className={`${styles.header} ${headerVisible ? styles.visible : ''}`}>
          <span className={`label ${styles.sectionLabel}`}>Expertise</span>
          <h2 className="heading-lg">
            Skills & <span className="gradient-text">Technologies</span>
          </h2>
          <p className={`body-lg ${styles.subtitle}`}>
            A comprehensive toolkit spanning design, development, and creative technologies
          </p>
        </div>

        <div className={styles.skillsGrid}>
          {skillCategories.map((category, index) => (
            <div
              key={category.title}
              ref={(el) => { itemRefs.current[index] = el; }}
              className={`${styles.skillCategory} ${visibleItems.has(index) ? styles.visible : ''}`}
            >
              <div className={`glass-card ${styles.categoryCard}`}>
                <div className={styles.categoryHeader}>
                  <div className={styles.categoryIcon}>{category.icon}</div>
                  <h3 className={`heading-sm ${styles.categoryTitle}`}>{category.title}</h3>
                </div>
                <div className={styles.skillTags}>
                  {category.skills.map((skill) => (
                    <span key={skill} className={styles.skillTag}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
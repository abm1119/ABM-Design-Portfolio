import { useEffect, useRef, useState } from 'react';
import QuoteIcon from '../icons/QuoteIcon';
import StarIcon from '../icons/StarIcon';
import styles from './Testimonials.module.css';

const testimonials = [
  {
    name: 'Sabir Mamtaz',
    position: 'Owner of True Testing Service and Educationist',
    avatar: 'https://i.pravatar.cc/150?img=12',
    testimonial: 'Abdul Basit\'s design expertise transformed our testing service platform. His attention to detail and understanding of user needs created an intuitive experience that our clients love. Highly professional and creative.',
    rating: 5
  },
  {
    name: 'Umair Ayaz Kamangar',
    position: 'Lecturer, Computer Systems Engineering Department at Sukkur IBA University',
    avatar: 'https://i.pravatar.cc/150?img=33',
    testimonial: 'Working with Basit has been exceptional. His blend of technical knowledge and design thinking produces outstanding results. He brings fresh perspectives and consistently delivers quality work.',
    rating: 5
  },
  {
    name: 'Dr. Kashif Memon',
    position: 'Professor of EE at Sukkur IBA University and IEEE Lead Head',
    avatar: 'https://i.pravatar.cc/150?img=14',
    testimonial: 'Basit\'s creative work for IEEE events was remarkable. His modern design approach and attention to branding standards elevated our conferences and workshops significantly.',
    rating: 5
  },
  {
    name: 'Adeel Ahmed Soomro',
    position: 'IEEE Sukkur Sub Section Lead Coordinator 2022',
    avatar: 'https://i.pravatar.cc/150?img=68',
    testimonial: 'Abdul Basit is a talented designer who understands both aesthetics and functionality. His contributions to our IEEE events were invaluable, and his professionalism made collaboration seamless.',
    rating: 5
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const autoPlayRef = useRef<number | null>(null);

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

  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
  };

  return (
    <section className={`${styles.testimonials} section-padding`} ref={sectionRef}>
      <div className="container">
        <div className={`${styles.header} ${isVisible ? styles.visible : ''}`}>
          <span className={`label ${styles.sectionLabel}`}>Testimonials</span>
          <h2 className="heading-lg">
            What Clients <span className="gradient-text">Say</span>
          </h2>
          <p className={`body-lg ${styles.subtitle}`}>
            Trusted by professionals and businesses worldwide
          </p>
        </div>

        <div className={`${styles.carouselContainer} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.carousel}>
            {testimonials.map((testimonial, index) => (
                            <div
                              key={testimonial.name}
                              className={`${styles.testimonialCard} ${index === currentIndex ? styles.active : ''}`}>
                              <div className={`glass-card ${styles.card}`}>
                                <div className={styles.quoteIcon}>
                                  <QuoteIcon width={48} height={48} color="var(--color-primary)" />
                                </div>
                                
                                <div className={styles.rating}>
                                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                                    <StarIcon key={i} width={20} height={20} color="var(--color-accent)" />
                                  ))}
                                </div>
              
                                <p className={`body-lg ${styles.quote}`}>{testimonial.testimonial}</p>
              
                                <div className={styles.author}>
                                  <img 
                                    src={testimonial.avatar} 
                                    alt={testimonial.name}
                                    className={styles.avatar}
                                    width={60}
                                    height={60}
                                  />
                                  <div className={styles.authorInfo}>
                                    <h4 className={`heading-sm ${styles.authorName}`}>{testimonial.name}</h4>
                                    <p className={`body-sm ${styles.authorRole}`}>{testimonial.position}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
            ))}
          </div>

          <div className={styles.dots}>
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

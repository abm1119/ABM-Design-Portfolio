import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import CalendarIcon from '../icons/CalendarIcon';
import ArrowRightIcon from '../icons/ArrowRightIcon';
import styles from './Blog.module.css';
import type { BlogPost } from '../../types/blog';

const truncate = (str: string, len: number) => 
  str.length > len ? str.slice(0, len) + '...' : str;

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const [headerVisible, setHeaderVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  // Fetch blogs from API
  const fetchPosts = async (retry = 0) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:3000/blogs', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      setPosts(Array.isArray(data) ? data : []);
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load blogs';
      
      if (retry < 3) {
        console.log(`Retry ${retry + 1}/3 in 2 seconds...`);
        setTimeout(() => fetchPosts(retry + 1), 2000);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load posts on mount
  useEffect(() => {
    fetchPosts();
  }, []);

  // Setup intersection observers for animations
  useEffect(() => {
    // Header animation
    const headerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHeaderVisible(true);
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      headerObserver.observe(sectionRef.current);
    }

    // Items animation
    const itemObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = itemRefs.current.indexOf(entry.target as HTMLElement);
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
  }, [posts]);

  return (
    <section className={`${styles.blog} section-padding`} ref={sectionRef}>
      <div className="container">
        {/* Header */}
        <div className={`${styles.header} ${headerVisible ? styles.visible : ''}`}>
          <span className={`label ${styles.sectionLabel}`}>Blog & Insights</span>
          <h2 className="heading-lg">
            Stories & <span className="gradient-text">Ideas</span>
          </h2>
          <p className={`body-lg ${styles.subtitle}`}>
            Exploring design, development, and digital innovation
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className={styles.state}>
            <div className={styles.spinner}></div>
            <p>Loading articles...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className={styles.state}>
            <p className={styles.errorIcon}>⚠️</p>
            <p className={styles.errorText}>{error}</p>
            <button onClick={() => fetchPosts(0)} className={styles.retryBtn}>
              Try Again
            </button>
            <p className={styles.hint}>
              Make sure the server is running: <code>npm run server</code>
            </p>
          </div>
        )}

        {/* Blog List */}
        {!loading && !error && posts.length > 0 && (
          <div className={styles.list}>
            {posts.map((post, idx) => (
              <article
                key={post.id || post.slug}
                ref={(el) => { itemRefs.current[idx] = el; }}
                className={`${styles.item} ${visibleItems.has(idx) ? styles.visible : ''}`}
              >
                <Link to={`/blog/${post.slug}`} className={styles.link}>
                  {/* Cover Image */}
                  {post.coverImage && (
                    <div className={styles.cover}>
                      <img src={post.coverImage} alt={post.title} />
                    </div>
                  )}

                  {/* Content */}
                  <div className={styles.content}>
                    {/* Meta Row */}
                    <div className={styles.meta}>
                      <div className={styles.metaLeft}>
                        <CalendarIcon width={14} height={14} />
                        <span>{post.createdFormatted || 'Published'}</span>
                      </div>
                      {post.category && (
                        <span className={styles.category}>{post.category}</span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className={styles.title}>{post.title}</h3>

                    {/* Excerpt */}
                    <p className={styles.excerpt}>
                      {truncate(post.contentSnippet || 'No description', 160)}
                    </p>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className={styles.tags}>
                        {post.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className={styles.tag}>{tag}</span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className={styles.tag}>+{post.tags.length - 3}</span>
                        )}
                      </div>
                    )}

                    {/* Read More */}
                    <div className={styles.readMore}>
                      Read More
                      <ArrowRightIcon width={14} height={14} />
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && posts.length === 0 && (
          <div className={styles.state}>
            <p className={styles.emptyIcon}>📝</p>
            <p>No published articles yet</p>
            <p className={styles.hint}>Check back soon for new content!</p>
          </div>
        )}
      </div>
    </section>
  );
}

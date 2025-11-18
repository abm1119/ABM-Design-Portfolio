import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import CalendarIcon from '../icons/CalendarIcon';
import ArrowLeftIcon from '../icons/ArrowLeftIcon';
import { endpoints, apiFetch } from '../../config/api';
import styles from './BlogDetail.module.css';
import type { BlogPost } from '../../types/blog';

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiFetch(endpoints.blog(slug!));
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blogPost = await response.json();
        if (blogPost.error) {
          throw new Error(blogPost.message || 'Server error');
        }
        setPost(blogPost);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading article...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <p className={styles.errorTitle}>Error loading article</p>
          <p className={styles.errorMessage}>{error.message}</p>
          <Link to="/" className={styles.backLink}>
            <ArrowLeftIcon width={18} height={18} />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <p className={styles.errorTitle}>Article not found</p>
          <Link to="/" className={styles.backLink}>
            <ArrowLeftIcon width={18} height={18} />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const wordCount = post.content?.split(/\s+/).length || 0;
  const readTime = Math.ceil(wordCount / 200);

  return (
    <div className={styles.container}>
      {/* Reading Progress Bar */}
      <div className={styles.progressBar} style={{ width: `${scrollProgress}%` }}></div>

      <article className={styles.article}>
        {/* Navigation */}
        <nav className={styles.nav}>
          <Link to="/" className={styles.backLink}>
            <ArrowLeftIcon width={16} height={16} />
            Back to Blog
          </Link>
        </nav>

        {/* Header Section */}
        <header className={styles.header}>
          {/* Meta Information */}
          <div className={styles.metaContainer}>
            <div className={styles.metaLeft}>
              <span className={styles.date}>
                <CalendarIcon width={14} height={14} />
                <span>{post.createdFormatted || 'Published'}</span>
              </span>
              {post.category && (
                <span className={styles.category}>{post.category}</span>
              )}
            </div>
            
            <div className={styles.metaRight}>
              <div className={styles.readTime}>
                <span className={styles.readTimeIcon}>📖</span>
                <span>{readTime} min read</span>
              </div>
              <div className={styles.wordCount}>
                <span className={styles.wordCountIcon}>✍️</span>
                <span>{wordCount.toLocaleString()} words</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className={styles.title}>{post.title}</h1>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className={styles.tagsSection}>
              <div className={styles.tagsLabel}>Topics:</div>
              <div className={styles.tags}>
                {post.tags.map((tag: string, index: number) => (
                  <span key={index} className={styles.tag}>
                    <span className={styles.tagIcon}>#</span>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Divider */}
          <div className={styles.divider}></div>
        </header>

        {/* Main Content */}
        <div className={styles.contentWrapper}>
          <div className={styles.content}>
            {post.content ? (
              <div className={styles.richContent} dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
              <div className={styles.emptyContent}>
                <p>Content not available at this time.</p>
              </div>
            )}
          </div>
        </div>

        {/* Engagement Section */}
        <section className={styles.engagementSection}>
          <div className={styles.engagementCard}>
            <div className={styles.engagementIcon}>💡</div>
            <div className={styles.engagementContent}>
              <h3>Key Takeaway</h3>
              <p>This article provides valuable insights and practical knowledge. Share it with your network to spread the knowledge.</p>
            </div>
          </div>
        </section>

        {/* Footer with Meta */}
        <footer className={styles.footer}>
          <div className={styles.footerDivider}></div>
          
          <div className={styles.authorSection}>
            <div className={styles.authorBadge}>✨</div>
            <div className={styles.authorInfo}>
              <h3>About the Author</h3>
              <p>Exploring design, development, and digital innovation with passion and creativity.</p>
              <div className={styles.authorMeta}>
                <span className={styles.authorMark}>Expert in Web Design & Development</span>
              </div>
            </div>
          </div>

          {/* Article Stats */}
          <div className={styles.articleStats}>
            <div className={styles.statItem}>
              <span className={styles.statIcon}>📊</span>
              <div className={styles.statContent}>
                <span className={styles.statLabel}>Reading Time</span>
                <span className={styles.statValue}>{readTime} minutes</span>
              </div>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statIcon}>📝</span>
              <div className={styles.statContent}>
                <span className={styles.statLabel}>Word Count</span>
                <span className={styles.statValue}>{wordCount.toLocaleString()}</span>
              </div>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statIcon}>🎯</span>
              <div className={styles.statContent}>
                <span className={styles.statLabel}>Topics Covered</span>
                <span className={styles.statValue}>{post.tags?.length || 0}</span>
              </div>
            </div>
          </div>

          {/* Related Actions */}
          <div className={styles.actions}>
            <Link to="/" className={styles.backButton}>
              <ArrowLeftIcon width={16} height={16} />
              <span>Back to All Articles</span>
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}

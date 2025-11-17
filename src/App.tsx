import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero/Hero';
import Summary from './components/Summary/Summary';
import Experience from './components/Experience/Experience';
import Skills from './components/Skills/Skills';
import Education from './components/Education/Education';
import ProjectsShowcase from './components/Projects/Projects';
import Testimonials from './components/Testimonials/Testimonials';
import Blog from './components/Blog/Blog';
import BlogDetail from './components/Blog/BlogDetail';
import Contact from './components/Contact/Contact';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <main>
      <Hero />
      <Summary />
      <Experience />
      <Skills />
      <ProjectsShowcase />
      <Testimonials />
            <Blog />
            <Education />
            <Contact />
          </main>
        } />
        <Route path="/blog/:slug" element={<BlogDetail />} />
      </Routes>
    </Router>
  );
}
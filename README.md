# ABM Design Portfolio

A modern, interactive portfolio website for **Abdul Basit-ABM** - UI/UX Designer & Front-End Developer. Built with React, TypeScript, and Vite, featuring a dynamic blog system powered by Notion API.

## 🌟 Features

### Portfolio Sections
- **Hero Section** - Interactive introduction with animated elements
- **Summary** - Professional overview and key highlights
- **Experience Timeline** - Career journey with detailed work history
- **Skills Showcase** - Categorized technical and creative skills
- **Projects Gallery** - Interactive project showcase with detailed modals
- **Testimonials** - Client feedback carousel
- **Blog System** - Dynamic blog powered by Notion CMS
- **Education** - Academic background and certifications
- **Contact** - Professional contact information

### Technical Features
- ⚡ **Fast Performance** - Built with Vite for lightning-fast development
- 📱 **Responsive Design** - Optimized for all device sizes
- 🎨 **Modern UI/UX** - Glass morphism effects and smooth animations
- 🔄 **Dynamic Content** - Blog posts fetched from Notion database
- 🎯 **SEO Optimized** - Proper meta tags and semantic HTML
- 🚀 **Production Ready** - Optimized build with code splitting

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Next-generation frontend tooling
- **CSS Modules** - Scoped styling with modern CSS
- **React Router** - Client-side routing

### Backend & CMS
- **Node.js/Express** - Blog API server
- **Notion API** - Headless CMS for blog content
- **CORS** - Cross-origin resource sharing

### Development Tools
- **ESLint** - Code linting with TypeScript support
- **PostCSS** - CSS processing with Autoprefixer
- **TypeScript** - Static type checking

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Notion account (for blog functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/abm-design-portfolio.git
   cd abm-design-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp server/.env.example server/.env
   ```
   
   Edit `server/.env` with your Notion credentials:
   ```env
   NOTION_API_KEY=your_notion_integration_token
   NOTION_DATABASE_ID=your_notion_database_id
   NODE_ENV=production
   ```

4. **Verify Notion setup**
   ```bash
   node server/check-env.js
   ```

### Development

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Start the blog API server** (in a separate terminal)
   ```bash
   npm run server
   ```

3. **Open your browser**
   - Portfolio: `http://localhost:5173`
   - API: `http://localhost:3000`

### Production Build

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
abm-design-portfolio/
├── src/
│   ├── components/          # React components
│   │   ├── Hero/           # Hero section
│   │   ├── Projects/       # Projects showcase
│   │   ├── Blog/           # Blog components
│   │   ├── Skills/         # Skills section
│   │   ├── Experience/     # Experience timeline
│   │   ├── Testimonials/   # Client testimonials
│   │   ├── Contact/        # Contact section
│   │   └── icons/          # Custom SVG icons
│   ├── data/               # Static data files
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # App entry point
│   └── index.css           # Global styles
├── server/                 # Blog API server
│   ├── server.js           # Express server
│   ├── check-env.js        # Environment validator
│   ├── .env.example        # Environment template
│   └── README.md           # Server documentation
├── public/                 # Static assets
├── dist/                   # Production build
└── package.json            # Dependencies and scripts
```

## 🎨 Design System

### Color Palette
- **Primary**: `#FF6B35` (Orange)
- **Secondary**: `#F7931E` (Amber)
- **Accent**: `#FFC857` (Yellow)
- **Dark**: `#0A0A0F` (Near Black)
- **Text**: `#1A1A1A` (Dark Gray)

### Typography
- **Display**: Playfair Display (Serif)
- **Headings**: Space Grotesk (Sans-serif)
- **Body**: Inter (Sans-serif)

### Key Features
- Glass morphism effects
- Smooth scroll animations
- Intersection Observer for scroll triggers
- Responsive grid layouts
- Modern CSS custom properties

## 🔧 Blog System Setup

The portfolio includes a dynamic blog system powered by Notion. Follow these steps to set it up:

### 1. Create Notion Integration

1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Name it "ABM Portfolio Blog"
4. Copy the **Internal Integration Token**

### 2. Create Notion Database

Create a new database in Notion with these properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `Title` | Title | ✅ | Blog post title |
| `Status` | Select | ✅ | Options: "Published", "Draft" |
| `Slug` | Rich Text | ✅ | URL slug (e.g., "my-first-post") |
| `Published` | Date | ✅ | Publication date |
| `Created At` | Created time | ✅ | Auto-generated |
| `Meta Description` | Rich Text | ❌ | SEO description |
| `Category` | Select | ❌ | Blog category |
| `Tags` | Multi-select | ❌ | Blog tags |
| `Author` | Rich Text | ❌ | Author name |

### 3. Share Database with Integration

1. Open your Notion database
2. Click "Share" → "Invite"
3. Search for your integration name
4. Grant access

### 4. Configure Environment

1. Copy the database URL and extract the ID:
   ```
   https://notion.so/DATABASE_ID?v=...
   ```

2. Update `server/.env`:
   ```env
   NOTION_API_KEY=your_integration_token
   NOTION_DATABASE_ID=your_database_id
   NODE_ENV=production
   ```

### 5. Test the Setup

```bash
# Verify configuration
node server/check-env.js

# Test API connection
node server/test-server.js

# Start the blog server
npm run server
```

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Vite) |
| `npm run server` | Start blog API server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🌐 API Endpoints

### Blog API (Port 3000)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check and server info |
| `/blogs` | GET | Get all published blog posts |
| `/blog/:slug` | GET | Get single blog post by slug |

### Example API Response

```json
{
  "id": "abc123",
  "title": "My First Blog Post",
  "slug": "my-first-post",
  "excerpt": "This is a brief description...",
  "content": "<p>Full HTML content...</p>",
  "coverImage": "https://notion.so/image.jpg",
  "publishedDate": "2024-01-15",
  "category": "Design",
  "tags": ["UI/UX", "Design"],
  "author": "Abdul Basit Memon"
}
```

## 🎯 Key Components

### Hero Section
- Animated introduction with gradient effects
- Interactive call-to-action buttons
- Smooth scroll indicators
- Responsive logo animation

### Projects Showcase
- Interactive project gallery
- Modal-based project details
- Image carousel with drag support
- Category filtering
- Hover effects and animations

### Skills Section
- Categorized skill display
- Icon-based skill categories
- Animated skill tags
- Intersection observer animations

### Experience Timeline
- Chronological work history
- Company details and achievements
- Animated timeline indicators
- Responsive card layouts

### Blog System
- Dynamic content from Notion
- Rich text rendering
- Image optimization
- SEO-friendly URLs
- Error handling and retry logic

### Testimonials
- Carousel-based testimonials
- Star ratings
- Client avatars
- Auto-rotating slides

## 🔒 Security Features

- Environment variables for sensitive data
- HTML escaping for code blocks
- CORS configuration
- Input validation
- Error boundary handling

## 📱 Responsive Design

- Mobile-first approach
- Flexible grid systems
- Touch-friendly interactions
- Optimized images
- Progressive enhancement

## ⚡ Performance Optimizations

- Code splitting with Vite
- Lazy loading for images
- Optimized bundle size
- Tree shaking
- Modern ES modules
- Efficient re-renders with React 19

## 🚀 Deployment

### Frontend (Vercel/Netlify)

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder**

### Backend (Railway/Heroku)

1. **Set environment variables**
   ```env
   NOTION_API_KEY=your_token
   NOTION_DATABASE_ID=your_db_id
   NODE_ENV=production
   PORT=3000
   ```

2. **Deploy server folder**
   ```bash
   node server/server.js
   ```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NOTION_API_KEY` | ✅ | Notion integration token |
| `NOTION_DATABASE_ID` | ✅ | Notion database ID |
| `NODE_ENV` | ❌ | Environment (development/production) |
| `PORT` | ❌ | Server port (default: 3000) |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Abdul Basit Memon**
- Portfolio: [abmdesign.com](https://engrabm.com)
- LinkedIn: [Abdul Basit Memon](https://linkedin.com/in/abdul-basit-memon)
- Email: info@abmdesign.com

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite team for the blazing-fast build tool
- Notion team for the powerful API
- Design inspiration from modern portfolio trends

---

**Built with ❤️ by Abdul Basit - ABM**

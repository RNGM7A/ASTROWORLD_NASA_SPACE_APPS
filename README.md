# ASTROWORLD NASA Space Apps 🚀

A comprehensive space biology research platform built for NASA Space Apps Challenge, featuring interactive data visualization, AI-powered research assistance, and advanced simulation capabilities for space biology research.

## 🌟 Overview

ASTROWORLD is an innovative web application designed to explore and analyze NASA's space biology research data. The platform combines cutting-edge data visualization, AI-powered research assistance, and interactive simulation tools to help researchers and space enthusiasts understand the effects of space conditions on biological systems.

### Key Features

- 🔬 **Interactive Data Explorer** - Browse and analyze NASA space biology research papers
- 🤖 **AI Research Assistant** - Get intelligent insights and answers about research papers
- 🐭 **Interactive Simulator** - Simulate space conditions effects on biological systems
- 📊 **Advanced Data Visualization** - Charts, graphs, and interactive dashboards
- 🎯 **Research Insights** - Discover patterns and trends in space biology data
- 🌙 **Dark Theme** - Optimized for extended research sessions

## 🛠️ Technology Stack

### Frontend
- **React 19** - Latest React with modern features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **OpenAI API** - AI-powered research assistance
- **CORS** - Cross-origin resource sharing

### Data Visualization
- **ApexCharts** - Interactive charts and graphs
- **Recharts** - Composable charting library
- **Chart.js** - Simple yet flexible charting
- **D3.js** - Data-driven document manipulation

### UI Components
- **Lucide React** - Beautiful icon library
- **React Router** - Client-side routing
- **React DnD** - Drag and drop functionality
- **React Dropzone** - File upload handling
- **React Window** - Virtual scrolling for large datasets

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or later (recommended: Node.js 20.x+)
- **npm** or **yarn** package manager
- **Git** for version control

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/RNGM7A/ASTROWORLD_NASA_SPACE_APPS.git
cd ASTROWORLD_NASA_SPACE_APPS
```

### 2. Install Frontend Dependencies

```bash
npm install
# or
yarn install
```

> **Note:** If you encounter peer dependency issues, use the `--legacy-peer-deps` flag:
> ```bash
> npm install --legacy-peer-deps
> ```

### 3. Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

### 4. Environment Configuration

Create a `.env` file in the `server` directory:

```bash
cp server/env.example server/.env
```

Edit `server/.env` and add your OpenAI API key:

```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001
```

### 5. Start the Application

**Option 1: Start both servers simultaneously**

```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd server
npm start
```

**Option 2: Use VS Code Tasks (Recommended)**

1. Open the project in VS Code
2. Press `Ctrl + Shift + P` (or `Cmd + Shift + P` on Mac)
3. Type "Tasks: Run Task"
4. Select "Start Frontend" and "Start Backend"

## 🌐 Access the Application

Once both servers are running:

- **Frontend**: http://localhost:5173/
- **Backend API**: http://localhost:3001/
- **Health Check**: http://localhost:3001/health
- **NASA Simulator**: http://localhost:5173/nasa/simulator

## 📚 Project Structure

```
ASTROWORLD_NASA_SPACE_APPS/
├── public/                     # Static assets
│   ├── images/                # Optimized images
│   └── data/                  # NASA research data
├── src/                       # Frontend source code
│   ├── components/            # Reusable components
│   │   ├── chat/             # AI chatbot components
│   │   ├── nasa/             # NASA-specific components
│   │   ├── space/            # Space simulation components
│   │   └── ui/               # UI components
│   ├── pages/                # Application pages
│   │   ├── nasa/             # NASA research pages
│   │   └── AuthPages/        # Authentication pages
│   ├── services/             # API services
│   ├── stores/               # State management
│   └── hooks/                # Custom React hooks
├── server/                   # Backend server
│   ├── chat-server.js        # AI chat API
│   └── package.json         # Backend dependencies
└── package.json             # Frontend dependencies
```

## 🔧 Available Scripts

### Frontend Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Scripts

```bash
cd server
npm start           # Start production server
npm run dev         # Start development server with nodemon
```

## 🎯 Key Features Explained

### 1. NASA Data Explorer
- Browse research papers from NASA's space biology database
- Filter and search through scientific publications
- View detailed paper information and summaries

### 2. AI Research Assistant
- Ask questions about research papers
- Get intelligent summaries and insights
- Quick prompt suggestions for common queries
- Context-aware responses based on paper content

### 3. Interactive Simulator
- Simulate space conditions effects on biological systems
- Adjust mission parameters
- View real-time physiological changes
- Compare different genetic strains
- Longitudinal health predictions

### 4. Data Visualization
- Interactive charts and graphs
- Real-time data updates
- Export capabilities
- Responsive design for all devices

## 🔑 Environment Variables

### Required Environment Variables

```env
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
PORT=3001
```

### Getting OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env` file

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

```bash
npm run build
```

The built files will be in the `dist` directory.

### Backend Deployment (Railway/Heroku)

1. Ensure your `.env` file is properly configured
2. Deploy the `server` directory
3. Set environment variables in your hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- **NASA** for providing the space biology research data
- **OpenAI** for the AI research assistance capabilities
- **TailAdmin** for the beautiful UI components
- **React Community** for the amazing ecosystem

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/RNGM7A/ASTROWORLD_NASA_SPACE_APPS/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

## 🌟 Star the Project

If you find this project helpful, please consider giving it a star on GitHub! Your support helps us continue developing and maintaining this platform.

---

**Built with ❤️ for NASA Space Apps Challenge 2024**

*Exploring the frontiers of space biology research through innovative technology.*

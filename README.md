# 🌊 JalArogya - Water Quality Monitoring Platform

![React](https://img.shields.io/badge/React-19.1-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.1-purple?logo=vite)
![License](https://img.shields.io/badge/license-MIT-green)

A comprehensive web application for monitoring and analyzing water quality through Heavy Metal Pollution Index (HMPI) calculations. JalArogya empowers citizens, scientists, and policymakers to track water safety and make informed decisions.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [User Roles](#user-roles)
- [Project Structure](#project-structure)
- [Water Quality Metrics](#water-quality-metrics)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

JalArogya ("Water Health" in Hindi) is a modern water quality monitoring platform that analyzes heavy metal concentrations in water samples and calculates pollution indices to assess water safety. The application serves three distinct user roles with specialized interfaces:

- **Citizens**: Access water quality reports, view safety maps, and learn about water contamination
- **Scientists**: Upload samples, analyze data, generate detailed reports, and track trends
- **Policymakers**: View regional analytics, identify hotspots, and make data-driven policy decisions

## ✨ Features

### Core Functionality

- **🧪 HMPI/HPI Calculation**: Automated Heavy Metal Pollution Index computation
- **📍 Interactive Maps**: Geospatial visualization of water quality using Leaflet
- **📊 Data Analytics**: Comprehensive charts and statistics with Recharts
- **📁 Multi-format Support**: Import/export data in CSV, Excel, and JSON formats
- **📄 PDF Reports**: Generate detailed water quality assessment reports
- **🎨 Theming**: Dark/Light mode support for better accessibility
- **🌐 Internationalization**: Multi-language support (English, Hindi, Bengali)

### User-Specific Features

#### For Citizens
- View water quality status by location
- Search and filter water samples
- Access safety recommendations
- Download safety reports
- Educational resources about water contamination

#### For Scientists
- Upload water sample data (CSV/Excel)
- Perform batch HMPI calculations
- Generate detailed analytical reports
- Visualize metal concentration trends
- Track historical data
- Export processed datasets

#### For Policymakers
- Regional water quality dashboard
- Hotspot identification and mapping
- Trend analysis across time periods
- Comparative regional statistics
- Policy recommendation insights
- Export policy briefs

## 🛠️ Tech Stack

### Frontend Framework
- **React 19.1** - UI library with latest features
- **TypeScript 5.8** - Type-safe development
- **Vite 7.1** - Fast build tool and dev server

### UI & Styling
- **Chakra UI 3.26** - Component library
- **Tailwind CSS 4.1** - Utility-first CSS
- **Framer Motion 12.23** - Animation library
- **Lucide React** - Icon library

### Data Visualization
- **Recharts 3.2** - Charting library
- **React Leaflet 5.0** - Interactive maps
- **Leaflet 1.9** - Map rendering engine

### Data Processing
- **PapaParse 5.5** - CSV parsing
- **XLSX 0.18** - Excel file handling
- **jsPDF 3.0** - PDF generation
- **File Saver 2.0** - File download utilities

### State Management
- **TanStack Query 5.87** - Server state management
- **React Router DOM 7.8** - Client-side routing
- **React Context API** - Global state (theme, language)

### Development Tools
- **ESLint 9.33** - Code linting
- **PostCSS & Autoprefixer** - CSS processing

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/DebadritNag/Jal-Arogya.git
cd Jal-Arogya
```

2. **Install dependencies**

```bash
npm install
```

3. **Start development server**

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## 👥 User Roles

### Demo Accounts

The application comes with pre-configured demo accounts:

| Role | Username | Password | Description |
|------|----------|----------|-------------|
| Citizen | `citizen_demo` | `demo123` | Public user interface |
| Scientist | `scientist_demo` | `demo123` | Data analysis interface |
| Policymaker | `policymaker_demo` | `demo123` | Policy dashboard |

### Creating New Accounts

Users can sign up with their preferred role. Scientists and policymakers may require additional verification (security key) for role-based access.

## 📁 Project Structure

```
Jal-Arogya/
├── public/              # Static assets
│   └── logo.svg         # Application logo
├── src/
│   ├── assets/          # Images and media files
│   ├── components/      # Reusable React components
│   │   ├── LoginPage.tsx
│   │   ├── SignupPage.tsx
│   │   ├── LanguageToggle.tsx
│   │   └── ThemeToggle.tsx
│   ├── contexts/        # React context providers
│   │   ├── LanguageContext.tsx
│   │   └── ThemeContext.tsx
│   ├── data/            # Static data and configurations
│   ├── hooks/           # Custom React hooks
│   │   ├── useLanguage.ts
│   │   └── useTheme.ts
│   ├── locales/         # Translation files
│   │   ├── en.json
│   │   ├── hi.json
│   │   └── bn.json
│   ├── pages/           # Main application pages
│   │   ├── CitizenInterface.tsx
│   │   ├── ScientistDashboard.tsx
│   │   └── PolicymakerInterface.tsx
│   ├── theme/           # Chakra UI theme customization
│   ├── types/           # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/           # Utility functions
│   │   └── authUtils.ts
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles
├── .gitignore
├── eslint.config.js     # ESLint configuration
├── index.html           # HTML template
├── package.json         # Project dependencies
├── postcss.config.js    # PostCSS configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
├── tsconfig.app.json    # App-specific TS config
├── tsconfig.node.json   # Node-specific TS config
└── vite.config.ts       # Vite configuration
```

## 🧪 Water Quality Metrics

### Heavy Metal Parameters Analyzed

JalArogya monitors the following heavy metals:

| Metal | Symbol | WHO Standard (mg/L) |
|-------|--------|--------------------|
| Lead | Pb | 0.01 |
| Arsenic | As | 0.01 |
| Cadmium | Cd | 0.003 |
| Chromium | Cr | 0.05 |
| Nickel | Ni | 0.07 |

### Additional Parameters

- **pH Level**: Measures acidity/alkalinity (Safe range: 6.5-8.5)
- **Conductivity**: Electrical conductivity in μS/cm (indicates dissolved solids)

### HMPI Classification

| HMPI Value | Classification | Risk Level | Description |
|------------|----------------|------------|-------------|
| < 100 | Safe | Low | Water suitable for all uses |
| 100-150 | Moderate | Medium | Caution advised, monitoring needed |
| > 150 | Unsafe | High/Critical | Not suitable for consumption |

### HPI (Heavy Metal Pollution Index)

Complementary index that provides additional insights into water contamination levels.

## 💻 Development

### Code Style

This project uses ESLint for code quality. Key rules:

- TypeScript strict mode enabled
- React Hooks rules enforced
- Consistent formatting with recommended configs

### Adding New Features

1. Create feature branch: `git checkout -b feature/your-feature-name`
2. Implement your changes
3. Test thoroughly
4. Submit pull request

### Environment Variables

Create a `.env` file for environment-specific configuration:

```env
VITE_APP_NAME=JalArogya
VITE_API_BASE_URL=https://api.example.com
```

### Type Safety

All data models are defined in `src/types/index.ts`. Always use proper TypeScript types:

```typescript
import type { WaterSample, HMPIResult, User } from './types';
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines

- Write clean, documented code
- Follow existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Debadrit Nag**

- GitHub: [@DebadritNag](https://github.com/DebadritNag)
- Email: www.ritnag2019@gmail.com

## 🙏 Acknowledgments

- WHO water quality guidelines
- Environmental research organizations
- Open source community
- All contributors and testers

## 📞 Support

For issues, questions, or suggestions:

- Open an issue on GitHub
- Contact the development team
- Check existing documentation

---

<div align="center">
  <strong>Built with ❤️ for a healthier future</strong>
  <br>
  <sub>Protecting water resources through technology</sub>
</div>
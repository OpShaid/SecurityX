# SecurityX - Advanced Security Platform

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth-green)](https://supabase.com/)
[![In Development](https://img.shields.io/badge/Status-In%20Production-orange)](https://github.com)

> ⚠️ **This project is currently in active development. New features and improvements are being added regularly.**

A comprehensive security platform built with Next.js 14, featuring AI-powered vulnerability scanning, real-time threat detection, and seamless security tool integrations.

## 📅 Development Roadmap

### Q1 2025
-Complete Docker integration
-Add PostgreSQL monitoring
-Implement advanced analytics dashboard
-  Release compliance tracking features

### Q2 2025
-  API endpoint vulnerability scanner
-  Custom security rules engine
-  Multi-factor authentication
 - team collaboration features

### Q3 2025
-Mobile app (React Native)
-  Advanced threat detection AI
 - Integration marketplace
  - White-label solutions

## ✨ Features

### ✅ Current Features
- **🔐 User Authentication** - Secure sign-up/sign-in with Supabase Auth
- **📊 Security Dashboard** - Real-time security metrics and analytics
- **🤖 AI Assistant (Agentia v1.0)** - Intelligent security guidance powered by custom AI
- **🔍 Security Scanning** - Automated vulnerability detection system
- **🚨 Alert Management** - Real-time security notifications and monitoring
- **📈 Activity Timeline** - Comprehensive activity tracking and logs
- **🎨 Modern UI/UX** - Glassmorphism design with smooth animations
- **📱 Responsive Design** - Fully optimized for mobile and desktop

### 🔌 Integrations (Active)
- ✅ **Kubernetes** - Cluster security monitoring and configuration
- ✅ **Grafana** - Security metrics visualization and dashboards
- ✅ **Prometheus** - Performance and security monitoring
- ✅ **Slack** - Real-time alert notifications

### 🚧 Coming Soon
- 🔄 **Docker Integration** - Container security scanning
- 🔄 **PostgreSQL Monitoring** - Database security auditing
- 🔄 **MySQL Support** - Additional database monitoring
- 🔄 **Redis Integration** - Cache security monitoring
- 🔄 **Advanced Analytics** - Enhanced security metrics and reporting
- 🔄 **Compliance Tracking** - GDPR, SOC2, OWASP compliance monitoring
- 🔄 **API Endpoint Scanner** - Automated API vulnerability detection
- 🔄 **Custom Security Rules** - User-defined security policies

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Email**: EmailJS
- **Animations**: Custom CSS with glassmorphism effects

## 📋 Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Supabase account and project
- EmailJS account (optional, for contact form)

## 🔧 Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/securityx.git
cd securityx
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# EmailJS Configuration (Optional)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

### 4. Set up Supabase database

Run the SQL scripts in order in your Supabase SQL Editor:
```sql
-- Run these scripts in order:
1. scripts/001_create_users_table.sql
2. scripts/002_create_chat_messages_table.sql
3. scripts/003_create_integrations_table.sql
```

### 5. Run the development server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

### 6. Open your browser
Navigate to `http://localhost:3000`

## 🎨 Key Features Explained

### AI Assistant (Agentia v1.0)
- Context-aware security guidance
- Real-time vulnerability analysis
- Integration setup assistance
- OWASP best practices recommendations

### Dashboard
- Security score monitoring
- Real-time activity timeline
- Integration management
- Alert notifications

### Security Features
- Row-Level Security (RLS) on all database tables
- Encrypted user data
- Secure authentication flow
- API key management
- HTTPS/TLS enforcement

## 🔐 Security Best Practices Included

- ✅ SQL Injection Prevention
- ✅ XSS Protection
- ✅ CSRF Protection
- ✅ Authentication & Authorization
- ✅ Rate Limiting
- ✅ Secure Headers
- ✅ Content Security Policy

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms
This Next.js app can be deployed on any platform that supports Node.js:
- Netlify
- Railway
- Render
- AWS Amplify

## 🤝 Contributing

This project is currently in active development. Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Author

**Shaid T**
- GitHub: [@OpShaid](https://github.com/OpShaid)
- Email: shaidt137@gmail.com

## 📞 Support

For support, email shaidt137@gmail.com or open an issue in the GitHub repository.

---

**Note**: This project is under active development. Features and documentation are subject to change. Check back regularly for updates!

<div align="center">

# Arya Hospital Portal 2.0

**A Modern, AI-Powered Healthcare Management Platform**

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

[![Live Demo](https://img.shields.io/badge/ LIVE_DEMO -arya--hospital--portal.vercel.app-success?style=flat-square&logo=vercel)](https://arya-hospital-portal.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=flat-square&logo=github)](https://github.com/mhassaniik-coder/Arya-Hospital-portal)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## Overview

Arya Hospital Portal 2.0 is a cutting-edge healthcare management application that leverages artificial intelligence to provide a seamless, patient-centric experience. Built with modern web technologies, it offers real-time health monitoring, AI-powered medical assistance, and comprehensive patient management tools.

> **Live Demo:** [https://arya-hospital-portal.vercel.app](https://arya-hospital-portal.vercel.app)

---

## Screenshots

<div align="center">

| Dashboard | AI Health Assistant | Appointments |
|:---------:|:------------------:|:------------:|
| ![Dashboard](https://via.placeholder.com/400x250/0EA5E9/FFFFFF?text=Dashboard) | ![AI Chat](https://via.placeholder.com/400x250/8B5CF6/FFFFFF?text=AI+Health+Assistant) | ![Appointments](https://via.placeholder.com/400x250/10B981/FFFFFF?text=Appointments) |

| Medical Records | Symptom Checker | Digital Patient ID |
|:---------------:|:---------------:|:------------------:|
| ![Records](https://via.placeholder.com/400x250/F59E0B/FFFFFF?text=Medical+Records) | ![Symptoms](https://via.placeholder.com/400x250/EF4444/FFFFFF?text=Symptom+Checker) | ![Patient ID](https://via.placeholder.com/400x250/6366F1/FFFFFF?text=Digital+Patient+ID) |

</div>

---

## Features

### AI-Powered Health Assistant
- **Live Voice & Text Chat** - Real-time conversations with Google Gemini AI
- **Medical Query Resolution** - Get instant answers to health-related questions
- **Context-Aware Responses** - AI understands patient history and context

### Smart Appointment Booking
- **AI-Triaged Scheduling** - Intelligent appointment prioritization
- **Doctor Matching** - Automatic specialist recommendations based on symptoms
- **Calendar Integration** - Seamless scheduling with reminders

### Digital Patient ID
- **QR-Coded Verification** - Secure patient identification system
- **Instant Access** - Quick retrieval of patient information
- **Privacy Controls** - Manage data sharing preferences

### Health Dashboard
- **Vitals Tracking** - Monitor blood pressure, heart rate, glucose levels
- **Interactive Charts** - Visualize health trends with Recharts
- **Goal Setting** - Track progress towards health objectives

### Medical Records
- **Lab Results** - View and download laboratory reports
- **Medication History** - Complete prescription timeline
- **Visit Records** - Historical consultation summaries

### Pharmacy Management
- **Prescription Tracking** - Monitor active prescriptions
- **Refill Reminders** - Automated medication refill alerts
- **Pharmacy Locator** - Find nearby pharmacies

### Symptom Checker
- **AI-Powered Analysis** - Intelligent symptom evaluation
- **Condition Suggestions** - Potential diagnoses based on symptoms
- **Urgency Assessment** - Determine care priority

### Emergency SOS
- **One-Tap Alert** - Instant emergency notification
- **Location Sharing** - Automatic GPS coordinates transmission
- **Emergency Contacts** - Pre-configured notification list

### Family Accounts
- **Multi-Patient Management** - Manage family members' health profiles
- **Caregiver Access** - Authorized access to dependent records
- **Unified Dashboard** - View all family health data in one place

### Insurance Integration
- **Claims Tracking** - Monitor insurance claim status
- **Coverage Details** - View policy information and benefits
- **Pre-authorization** - Request approvals for procedures

### Wellness Tracking
- **Health Metrics** - Track weight, sleep, exercise, and nutrition
- **Goal Progress** - Visual progress indicators
- **Wellness Insights** - AI-generated health recommendations

---

## Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Frontend Framework** | React | 19.2.4 |
| **Language** | TypeScript | 5.8.2 |
| **Build Tool** | Vite | 6.2.0 |
| **Styling** | Tailwind CSS | 4.1.18 |
| **AI Integration** | Google Gemini AI | 1.41.0 |
| **Charts** | Recharts | 3.7.0 |
| **Icons** | Lucide React | 0.564.0 |
| **Deployment** | Vercel | - |

---

## Getting Started

### Prerequisites

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **Google Gemini API Key**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mhassaniik-coder/Arya-Hospital-portal.git
   cd Arya-Hospital-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env.local file
   echo "VITE_GEMINI_API_KEY=your_gemini_api_key_here" > .env.local
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

---

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Google Gemini AI API Key | Yes |

### How to Get a Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Navigate to "Get API Key"
4. Create a new API key
5. Copy and paste into your `.env.local` file

---

## Project Structure

```
arya-hospital-portal-2.0/
|-- public/
|-- src/
|   |-- components/
|   |   |-- AIChat.tsx           # AI Health Assistant
|   |   |-- Appointments.tsx     # Appointment scheduling
|   |   |-- AuthPage.tsx         # Authentication
|   |   |-- Dashboard.tsx        # Main dashboard
|   |   |-- FamilyPage.tsx       # Family accounts
|   |   |-- HistoryPage.tsx      # Medical history
|   |   |-- InsurancePage.tsx    # Insurance management
|   |   |-- MedicalRecords.tsx   # Patient records
|   |   |-- NotificationsPage.tsx
|   |   |-- PharmacyPage.tsx     # Pharmacy features
|   |   |-- SettingsPage.tsx     # User settings
|   |   |-- SymptomChecker.tsx   # Symptom analysis
|   |   |-- VerificationModal.tsx
|   |   |-- WellnessPage.tsx     # Wellness tracking
|   |-- services/
|   |   |-- geminiService.ts     # Gemini AI integration
|   |-- App.tsx                  # Main application
|   |-- index.tsx                # Entry point
|   |-- index.css                # Global styles
|   |-- types.ts                 # TypeScript definitions
|-- package.json
|-- tsconfig.json
|-- vite.config.ts
|-- tailwind.config.js
|-- postcss.config.js
`-- README.md
```

---

## API Integration

### Google Gemini AI Setup

This project uses Google's Gemini AI for intelligent health assistance features:

```typescript
import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI(import.meta.env.VITE_GEMINI_API_KEY);

// Example: Health query
const response = await genAI.models.generateContent({
  model: 'gemini-pro',
  contents: 'What are the symptoms of dehydration?'
});
```

### Supported AI Features

- **Symptom Analysis** - AI-powered symptom evaluation
- **Health Recommendations** - Personalized wellness tips
- **Medical Q&A** - Natural language health queries
- **Appointment Triage** - Intelligent scheduling assistance

---

## Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables

3. **Set Environment Variables**
   - In Vercel dashboard, go to Settings > Environment Variables
   - Add `VITE_GEMINI_API_KEY` with your API key

4. **Deploy**
   - Vercel will automatically deploy on push to main branch

### Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Code Style Guidelines

- Use TypeScript for all new files
- Follow existing component structure
- Use Tailwind CSS for styling
- Write meaningful commit messages

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Arya Hospital Portal

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## Contact

### Developer

**GitHub:** [@mhassaniik-coder](https://github.com/mhassaniik-coder)

**Project Link:** [https://github.com/mhassaniik-coder/Arya-Hospital-portal](https://github.com/mhassaniik-coder/Arya-Hospital-portal)

**Live Demo:** [https://arya-hospital-portal.vercel.app](https://arya-hospital-portal.vercel.app)

---

<div align="center">

**Built with by the Arya Hospital Portal Team**

[ Live Demo ](https://arya-hospital-portal.vercel.app) · [ Report Bug ](https://github.com/mhassaniik-coder/Arya-Hospital-portal/issues) · [ Request Feature ](https://github.com/mhassaniik-coder/Arya-Hospital-portal/issues)

</div>

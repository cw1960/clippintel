# Clipp Intelligence

An intelligent opportunity monitoring platform built with React, TypeScript, and Mantine UI.

## Features

- 🎯 **Smart Opportunity Matching** - AI-powered matching of opportunities to user criteria
- 📊 **Real-time Dashboard** - Monitor opportunities and analytics in real-time
- 🔔 **Smart Notifications** - Get notified about relevant opportunities instantly
- 🎨 **Modern UI** - Beautiful dark theme with Mantine components
- 🔐 **Secure Authentication** - User authentication with Supabase
- ⚡ **Fast Performance** - Built with Vite for lightning-fast development

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Library**: Mantine v7 with dark theme
- **State Management**: Zustand
- **Routing**: React Router v6
- **Backend**: Supabase
- **Styling**: Emotion CSS-in-JS
- **Icons**: Tabler Icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/cw1960/clippintel.git
cd clippintel
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your Supabase credentials.

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard components
│   ├── criteria/       # Criteria management
│   ├── notifications/  # Notification components
│   └── layout/         # Layout components
├── services/           # API services
│   ├── supabase.ts     # Supabase client
│   ├── whopApi.ts      # Whop API integration
│   └── rateLimiter.ts  # Rate limiting service
├── stores/             # Zustand stores
│   ├── authStore.ts    # Authentication state
│   ├── opportunityStore.ts # Opportunity management
│   └── settingsStore.ts # User settings
├── types/              # TypeScript type definitions
│   ├── opportunity.ts  # Opportunity types
│   ├── user.ts         # User types
│   └── notification.ts # Notification types
├── utils/              # Utility functions
│   ├── matching.ts     # Opportunity matching logic
│   ├── formatting.ts   # Data formatting helpers
│   └── validation.ts   # Form validation
├── App.tsx             # Main app component
├── main.tsx            # App entry point
└── theme.ts            # Mantine theme configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and ensure code quality
5. Submit a pull request

## License

This project is licensed under the MIT License.

# AstroGenie - Your Personal Astrological AI Assistant

![AstroGenie Logo](public/astrogenielogo.png)

## Overview

AstroGenie is a modern, AI-powered astrological platform that combines traditional astrological wisdom with cutting-edge artificial intelligence. Our platform offers personalized astrological insights, birth chart analysis, and real-time consultations through an intuitive chat interface.

## Features

### Core Features

- **Interactive Birth Chart Analysis**
  - Detailed planetary positions
  - House interpretations
  - Aspect analysis
  - Personalized readings

- **AI-Powered Chat Interface**
  - Real-time astrological consultations
  - Natural language interactions
  - Personalized responses based on birth data
  - Credit-based conversation system

- **User Profile Management**
  - Secure birth data storage
  - Customizable preferences
  - History tracking
  - Credit management

### Advanced Features

- **Location Services**
  - Precise birth location detection
  - Timezone handling
  - Coordinates validation

- **Credit System**
  - Trial credits for new users
  - Token-based usage tracking
  - Subscription management
  - Pay-as-you-go options

## Technologies

- **Frontend**
  - Next.js 13+ (App Router)
  - React
  - TypeScript
  - Tailwind CSS
  - Shadcn UI Components

- **Backend**
  - Supabase (Authentication & Database)
  - OpenRouter API Integration
  - Swiss Ephemeris

- **Infrastructure**
  - Vercel Deployment
  - PostgreSQL Database
  - Stripe Payment Integration

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- OpenRouter API key
- Stripe account (for payments)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/astrogenie.git
cd astrogenie
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in your environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NEXT_PUBLIC_OPENROUTER_API_KEY=your_openrouter_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

4. Run the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Credit System

AstroGenie uses a token-based credit system:

- **New Users**:
  - 1000 trial credits
  - 3-day trial period
  - No rollover for trial credits

- **Credit Usage**:
  - 1 token = 1 credit
  - Credits deducted per AI interaction
  - Real-time balance tracking
  - Automatic trial expiration

- **Subscription Options**:
  - Monthly credit packages
  - Premium features access
  - Rollover credits for paid users

## Usage

1. **Sign Up/Login**
   - Create an account or log in
   - Enter birth details for personalized readings

2. **Birth Chart Analysis**
   - Input birth date, time, and location
   - View detailed chart interpretation
   - Explore planetary positions and aspects

3. **AI Consultation**
   - Chat with AstroGenie
   - Ask specific questions
   - Receive personalized guidance
   - Monitor credit usage

4. **Profile Management**
   - Update personal information
   - View consultation history
   - Manage subscription
   - Track credit balance

## Security

- Secure birth data storage
- Encrypted user information
- GDPR compliant
- Regular security audits

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenRouter API for AI capabilities
- Swiss Ephemeris for astrological calculations
- Supabase team for backend infrastructure
- Open source community for various tools and libraries

## Support

For support, email support@astrogenie.com or join our [Discord community](https://discord.gg/astrogenie).

---

<p align="center">Made with love by the AstroGenie Team</p>

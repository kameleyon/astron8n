# AstroGenie - Your Personal Astrological AI Assistant

![AstroGenie Logo](public/astrogenielogo.png)

## Overview

AstroGenie is a modern, AI-powered astrological platform that combines traditional astrological wisdom with cutting-edge artificial intelligence. Our platform offers personalized astrological insights, birth chart analysis, real-time consultations, and detailed astrological reports through an intuitive interface.

## Features

### Core Features

- **Interactive Birth Chart Analysis**
  - Detailed planetary positions and aspects
  - House interpretations with visual wheel
  - Dynamic aspect analysis
  - Personalized readings
  - Interactive birth chart wheel
  - Special features and patterns detection

- **AI-Powered Chat Interface**
  - Real-time astrological consultations
  - Natural language interactions
  - Personalized responses based on birth data
  - Credit-based conversation system
  - Chat history tracking
  - Multi-model AI integration (Gemini + Qwen)

- **Comprehensive Reports**
  - 30-day personalized forecasts
  - Transit analysis with house positions
  - Detailed aspect interpretations
  - PDF report generation
  - Automated report storage
  - Custom report formatting

- **User Profile Management**
  - Secure birth data storage
  - Customizable preferences
  - History tracking
  - Credit management
  - API key management

### Advanced Features

- **Location Services**
  - Precise birth location detection
  - Timezone handling
  - Coordinates validation
  - Interactive location search

- **Credit System**
  - Trial credits for new users
  - Token-based usage tracking
  - Subscription management
  - Pay-as-you-go options
  - Usage analytics

- **Transit Analysis**
  - Real-time planetary positions
  - Aspect calculations
  - House position tracking
  - Retrograde monitoring
  - Eclipse predictions

## Project Structure

```
├── app/                      # Next.js 13+ app directory
│   ├── api/                 # API routes
│   ├── birth-chart/         # Birth chart components
│   ├── reports/            # Report generation
│   └── chat-history/       # Chat interface
├── birthchartpack/          # Astrological calculations package
│   ├── lib/                # Core calculation logic
│   └── ephe/              # Swiss Ephemeris data
├── api-package/             # Shared API utilities
├── components/              # Reusable React components
├── lib/                     # Utility functions and services
│   ├── astro/             # Astrological utilities
│   ├── services/          # Backend services
│   └── utils/             # Helper functions
└── public/                  # Static assets
```

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
  - PDF Generation (pdf-lib)

- **AI Models**
  - Google Gemini (Transit Analysis)
  - Qwen (Chat Interface)
  - Custom Prompt Engineering

- **Infrastructure**
  - Vercel Deployment
  - PostgreSQL Database
  - Stripe Payment Integration
  - Supabase Storage

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
  - Report generation costs

- **Subscription Options**:
  - Monthly credit packages
  - Premium features access
  - Rollover credits for paid users
  - Custom enterprise plans

## Usage

1. **Sign Up/Login**
   - Create an account or log in
   - Enter birth details for personalized readings
   - Set up API keys if needed

2. **Birth Chart Analysis**
   - Input birth date, time, and location
   - View detailed chart interpretation
   - Explore planetary positions and aspects
   - Analyze special patterns

3. **Report Generation**
   - Generate 30-day forecasts
   - View transit analysis
   - Download PDF reports
   - Access report history

4. **AI Consultation**
   - Chat with AstroGenie
   - Ask specific questions
   - Receive personalized guidance
   - Monitor credit usage
   - View chat history

5. **Profile Management**
   - Update personal information
   - View consultation history
   - Manage subscription
   - Track credit balance
   - Manage API keys

## Security

- Secure birth data storage
- Encrypted user information
- GDPR compliant
- Regular security audits
- API key rotation
- Rate limiting

## Development

### Key Components

- **birthchartpack**: Core astrological calculations package
  - Swiss Ephemeris integration
  - Planetary calculations
  - House system implementations
  - Aspect calculations

- **api-package**: Shared API utilities
  - Type definitions
  - Validation logic
  - Common calculations
  - API interfaces

### Code Style

- TypeScript for type safety
- ESLint configuration
- Prettier formatting
- Component-based architecture
- Custom hooks for reusability

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

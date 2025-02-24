# AstroGenie - Your Personal Astrological AI Assistant

![AstroGenie Logo](public/astrogenielogo.png)

## Overview

AstroGenie is a modern, AI-powered astrological platform that combines traditional astrological wisdom with cutting-edge artificial intelligence. Our platform offers personalized astrological insights, birth chart analysis, real-time consultations, and detailed astrological reports through an intuitive interface.

## Features

Discover the power of AI-driven astrological insights with our comprehensive feature set:

### Birth Chart Analysis
- Get detailed insights into your natal chart with AI-powered interpretations
- Interactive birth chart wheel visualization
- Detailed planetary positions and aspects
- House system interpretations
- Dynamic aspect analysis
- Pattern and configuration detection
- Special features identification
- Personalized birth chart readings

### AI Chat Assistant
- Chat with our AI for personalized astrological guidance anytime
- Natural language understanding
- Context-aware responses
- Birth chart integration
- Multi-model AI system (Gemini + Qwen)
- Chat history tracking
- Conversation continuity
- Real-time transit integration

### Custom Reports
- Generate in-depth reports for specific life areas or time periods
- 30-day personalized forecasts
- Transit analysis with house positions
- Aspect interpretations
- PDF generation with custom formatting
- Aspect interpretations
- PDF generation with custom formatting
- Secure report storage
- Automated delivery
- Report history tracking

### Transit Predictions
- Understand how current planetary positions affect your chart
- Real-time planetary tracking
- Aspect calculations
- House position monitoring
- Retrograde periods
- Eclipse predictions
- Daily transit updates
- Personal transit calendar

### Compatibility Analysis
- Compare charts and understand relationship dynamics
- Synastry analysis
- Composite chart creation
- Relationship patterns
- Compatibility scores
- Aspect interpretations
- Relationship forecasting
- Dynamic compatibility updates

### SEO Optimization
- **Rich Metadata**
  - Comprehensive meta tags
  - Extensive keyword optimization
  - OpenGraph and Twitter Card support
  - Structured data (JSON-LD)
  - Mobile-friendly configuration
  - Progressive Web App support
  - Search engine directives
  - Social media optimization

- **Technical SEO**
  - Semantic HTML structure
  - Structured data implementation
  - Canonical URL handling
  - Mobile responsiveness
  - Web app manifest
  - Performance optimization
  - Search engine verification
  - Rich snippets support

### Advanced Features
- Location Services
  - Precise birth location detection
  - Global timezone handling
  - Coordinate validation
  - Interactive location search
  - Automatic timezone conversion
  - Location history
  - Multiple location support

- Profile Management
  - Secure data storage
  - Multiple chart storage
  - Preference customization
  - History tracking
  - Data export options
  - Privacy controls
  - Account management

## Simple, Transparent Pricing

Our Monthly Plan includes everything you need:

- $7.99 per month
- 2,500 credits monthly
- Full birth chart analysis
- Unlimited chat sessions
- Custom reports
- API access
- Priority support
- Never expires
- Flexible usage
- Combine with token packages

Token Packages:
- Basic: 5,000 tokens for $2.99
- Pro: 9,000 tokens for $3.99 (Most Popular)
- Premium: 17,000 tokens for $5.99

## Project Structure

```
├── app/                      # Next.js 13+ app directory
│   ├── api/                 # API routes
│   ├── structured-data.tsx  # SEO structured data
│   ├── layout.tsx          # App layout with SEO metadata
│   │   ├── billing/        # Billing and payment endpoints
│   │   ├── stripe/        # Stripe integration endpoints
│   │   └── reports/       # Report generation endpoints
│   ├── birth-chart/        # Birth chart components
│   ├── reports/           # Report generation
│   └── chat-history/      # Chat interface
├── birthchartpack/          # Astrological calculations package
├── components/              # Reusable React components
│   ├── settings/          # Settings components
│   └── ui/               # UI components
├── lib/                     # Utility functions and services
│   ├── astro/            # Astrological utilities
│   ├── services/         # Backend services
│   └── utils/            # Helper functions
├── public/                  # Public assets
│   ├── site.webmanifest    # Progressive Web App manifest
│   └── manifesto.png       # App icons and images
└── types/                   # TypeScript type definitions
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

- **Payment Processing**
  - Stripe Integration
  - Secure Payment Portal
  - Real-time Billing
  - Transaction History

- **Infrastructure**
  - Vercel Deployment
  - PostgreSQL Database
  - Supabase Storage
  - Stripe Webhooks

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
NEXT_PUBLIC_URL=your_app_url
```

4. Run the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Credit System

AstroGenie uses a flexible token-based credit system:

### Token Packages
- **Basic Package**: 5,000 tokens for $2.99
- **Pro Package**: 9,000 tokens for $3.99 (Most Popular)
- **Premium Package**: 17,000 tokens for $5.99

### Trial System
- 3-day trial period
- Access to all features
- Automatic transition to pay-as-you-go
- Real-time trial expiration tracking

### Credit Management
- Real-time balance tracking
- Automatic usage monitoring
- Detailed transaction history
- Rollover credits for 30 days

### Payment System
- Secure Stripe integration
- Multiple payment methods
- Automatic billing
- Transaction history
- Real-time payment updates

### Usage Tracking
- Token consumption analytics
- Usage patterns monitoring
- Credit alerts
- Activity logs
- Detailed billing history

## Usage

1. **Sign Up/Login**
   - Create an account or log in
   - Enter birth details for personalized readings
   - Set up payment method

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

5. **Billing Management**
   - Purchase token packages
   - View transaction history
   - Manage payment methods
   - Track credit balance
   - Monitor usage

## Security

- Secure payment processing
- Encrypted user information
- GDPR compliant
- Regular security audits
- API key rotation
- Rate limiting

## Development

### Key Components

- **Billing System**
  - Stripe integration
  - Token management
  - Payment processing
  - Usage tracking
  - Transaction history

- **Report Generation**
  - PDF creation
  - Dynamic content
  - Payment processing
  - Secure storage

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
- Stripe team for payment infrastructure
- Open source community for various tools and libraries

## Support

For support, email support@astrogenie.com or join our [Discord community](https://discord.gg/astrogenie).

---

<p align="center">Made with love by the AstroGenie Team</p>

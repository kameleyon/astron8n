# Web to Mobile (w2m) Roadmap

This roadmap outlines the process of creating a mobile app from our existing Next.js web application using the separate project approach with code sharing.

## Phase 1: Project Setup and Environment Configuration
**Duration: 1-2 days**

- [x] **Create a new mobile app directory**
  - [x] Create directory at `./mobileapp`
  - [x] Initialize new Expo project: `npx create-expo-app . --template blank-typescript`

- [x] **Link to existing EAS project**
  - [x] Install EAS CLI: `npm install -g eas-cli`
  - [x] Initialize with existing project ID: `eas init --id 41b4c850-32de-4fe5-8d48-1df8eb7b050e`
  - [x] Run `eas build:configure` to set up build profiles

- [x] **Configure app metadata**
  - [x] Update app.json with app name, slug, version
  - [x] Add app icon and splash screen assets
  - [x] Configure eas.json for build profiles (development, staging, production)

- [x] **Set up shared code structure**
  - [x] Create shared package directory: `mkdir shared`
  - [x] Initialize npm package: `cd shared && npm init -y`
  - [x] Configure package.json for local linking
  - [x] Set up TypeScript configuration
  - [x] Link shared package to both projects

## Phase 2: Share Core Business Logic
**Duration: 3-5 days**

- [x] **Identify shared functionality**
  - [x] Review web app to identify reusable code
  - [x] Document API client functions
  - [x] List data models/types
  - [x] Identify authentication logic
  - [x] Catalog utility functions
  - [x] Document constants (API endpoints, theme values)

- [x] **Create shared package structure**
  - [x] Set up directory structure:
    ```
    shared/
    ├── src/
    │   ├── api/
    │   ├── types/
    │   ├── utils/
    │   ├── constants/
    │   └── index.ts
    ├── package.json
    └── tsconfig.json
    ```

- [x] **Move reusable code**
  - [x] Create placeholder API client functions
  - [x] Create placeholder type definitions
  - [x] Create placeholder utility functions
  - [x] Create placeholder constants
  - [x] Extract actual code from web app
  - [x] Ensure platform-specific code is properly isolated

- [x] **Configure TypeScript**
  - [x] Set up proper module resolution
  - [x] Configure basic TypeScript settings
  - [x] Ensure compatibility between Next.js and React Native
  - [x] Create build scripts for the shared package

## Phase 3: Authentication & User Management
**Duration: 3-4 days**

- [x] **Set up Supabase in mobile app**
  - [x] Install Supabase packages: `npm install @supabase/supabase-js`
  - [x] Configure Supabase client
  - [x] Set up environment variables
  - [x] Implement secure storage for session tokens

- [x] **Implement authentication flows**
  - [x] Create login screen
  - [x] Build registration screen
  - [x] Implement password reset functionality
  - [x] Set up session management
  - [x] Implement secure token storage using Expo SecureStore

- [x] **User profile management**
  - [x] Create profile screen
  - [x] Implement account settings
  - [x] Build user preferences interface
  - [x] Add profile image upload functionality

## Phase 4: UI Components & Navigation
**Duration: 5-7 days**

- [x] **Create navigation structure**
  - [x] Install React Navigation: `npm install @react-navigation/native @react-navigation/stack`
  - [x] Set up navigation container
  - [x] Configure stack navigators
  - [ ] Implement tab navigation for main sections
  - [x] Add authentication flow navigation

- [ ] **Develop core UI components**
  - [ ] Create header components
  - [ ] Build form elements (inputs, buttons, selectors)
  - [ ] Implement list/card components
  - [ ] Create modals and popups
  - [ ] Design loading states and indicators

- [ ] **Implement screens**
  - [ ] Build home screen
  - [ ] Create birth chart screen
  - [ ] Implement reports screen
  - [ ] Design dashboard
  - [ ] Add settings screen

## Phase 5: Feature Implementation
**Duration: 7-10 days**

- [ ] **Birth chart functionality**
  - [ ] Implement birth chart form
  - [ ] Create chart visualization for mobile
  - [ ] Integrate with chart calculation logic from shared code
  - [ ] Add interpretation display
  - [ ] Implement saving/sharing functionality

- [ ] **Reports system**
  - [ ] Create reports listing screen
  - [ ] Build report detail view
  - [ ] Implement report generation
  - [ ] Add report sharing functionality
  - [ ] Implement offline report access

- [ ] **Implement payment flow**
  - [ ] Integrate Stripe for mobile
  - [ ] Implement in-app purchases
  - [ ] Create subscription management screens
  - [ ] Add backend verification
  - [ ] Implement location search
  - [ ] Integrate with location API
  - [ ] Create mobile-friendly location picker
  - [ ] Implement location autocomplete
  - [ ] Store locations for birth charts

## Phase 6: Testing & Optimization
**Duration: 4-6 days**

- [ ] **Performance optimization**
  - [ ] Analyze bundle size
  - [ ] Optimize image loading and caching
  - [ ] Implement lazy loading where appropriate
  - [ ] Monitor and optimize memory usage
  - [ ] Reduce unnecessary re-renders

- [ ] **Test on multiple devices**
  - [ ] Test on iOS devices
  - [ ] Test on Android devices
  - [ ] Verify compatibility with different screen sizes
  - [ ] Test on older device versions
  - [ ] Address platform-specific issues

- [ ] **Offline functionality**
  - [ ] Implement data caching
  - [ ] Create offline UI states
  - [ ] Handle network transitions gracefully
  - [ ] Queue operations for reconnection
  - [ ] Implement sync mechanisms

## Phase 7: Deployment Preparation
**Duration: 2-3 days**

- [ ] **Configure app signing**
  - [ ] Generate iOS signing certificates
  - [ ] Create Apple App Store profile
  - [ ] Generate Android keystore
  - [ ] Configure signing in EAS
  - [ ] Secure signing credentials

- [ ] **Prepare app store assets**
  - [ ] Create app icons in various sizes
  - [ ] Take screenshots for different devices
  - [ ] Design promotional graphics
  - [ ] Write app descriptions and keywords
  - [ ] Prepare privacy policy

- [ ] **Configure CI/CD**
  - [ ] Set up EAS build triggers
  - [ ] Configure automated testing
  - [ ] Create staging and production workflows
  - [ ] Set up preview channels
  - [ ] Configure update rollout strategy

## Phase 8: Deployment & Distribution
**Duration: 2-4 days**

- [ ] **Build production versions**
  - [ ] Create production build: `eas build --platform all`
  - [ ] Generate test builds for final review
  - [ ] Perform internal testing
  - [ ] Address any final issues

- [ ] **Prepare store listings**
  - [ ] Set up App Store Connect account
  - [ ] Configure Google Play Console
  - [ ] Complete all metadata requirements
  - [ ] Set up pricing and availability
  - [ ] Configure in-app purchases

- [ ] **Submit for review**
  - [ ] Submit to App Store
  - [ ] Submit to Google Play
  - [ ] Monitor review status
  - [ ] Address any review feedback
  - [ ] Prepare for launch

- [ ] **Plan for updates**
  - [ ] Configure OTA updates with Expo
  - [ ] Create update strategy
  - [ ] Plan feature roadmap
  - [ ] Set up monitoring and analytics

## Phase 9: Additional Features
**Duration: 5-7 days**

- [ ] **Ephemeris Data Handling**
  - [ ] Implement efficient storage for ephemeris files on mobile
  - [ ] Optimize ephemeris data loading for mobile performance
  - [ ] Create caching mechanism for frequently used ephemeris data
  - [ ] Ensure ephemeris calculations work offline
  - [ ] Test accuracy of calculations on mobile devices

- [ ] **Push Notifications**
  - [ ] Set up push notification infrastructure
  - [ ] Implement transit alert notifications
  - [ ] Create notification for report completions
  - [ ] Add birthday/special event reminders
  - [ ] Implement notification preferences settings

- [ ] **Accessibility Compliance**
  - [ ] Implement proper screen reader support
  - [ ] Ensure adequate color contrast
  - [ ] Add support for dynamic text sizes
  - [ ] Implement proper focus management
  - [ ] Test with accessibility tools on both platforms

- [ ] **Internationalization**
  - [ ] Extract all text strings to translation files
  - [ ] Implement language selection UI
  - [ ] Handle right-to-left languages if needed
  - [ ] Test with multiple languages

- [ ] **User Onboarding**
  - [ ] Design mobile-specific onboarding flow
  - [ ] Create onboarding screens with key feature highlights
  - [ ] Implement interactive tutorials for complex features
  - [ ] Add contextual help throughout the app
  - [ ] Create first-time user experience

## Additional Tasks

- [ ] **State Management**
  - [ ] Select state management solution (Redux, Zustand, Context API)
  - [ ] Implement consistent patterns between web and mobile
  - [ ] Create shared state logic where possible

- [ ] **Code Sharing Ratio**
  - [ ] Audit shared code percentage
  - [ ] Identify opportunities to increase code sharing
  - [ ] Document platform-specific implementations

- [ ] **API Design**
  - [ ] Review API endpoints for mobile efficiency
  - [ ] Implement mobile-specific optimizations
  - [ ] Create API versioning strategy

- [ ] **Asset Management**
  - [ ] Create strategy for sharing images and other assets
  - [ ] Implement responsive asset loading
  - [ ] Optimize assets for mobile

- [ ] **Error Handling**
  - [ ] Implement consistent error handling across platforms
  - [ ] Create user-friendly error messages
  - [ ] Set up error reporting

- [ ] **Analytics**
  - [ ] Set up cross-platform analytics
  - [ ] Implement event tracking
  - [ ] Create dashboards for monitoring

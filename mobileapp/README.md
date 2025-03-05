# AstroGenie Mobile App

This is the mobile app version of AstroGenie, built with React Native and Expo.

## Prerequisites

- Node.js (v16 or newer)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device (available on [iOS App Store](https://apps.apple.com/app/apple-store/id982107779) or [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent))

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   - Update the `.env` file with your actual API keys and URLs
   - Make sure to add your Supabase URL and anon key

## Running the App

### Development Mode

To run the app in development mode:

```bash
npm start
```

This will start the Expo development server and display a QR code in your terminal.

### Running on a Physical Device

1. Install the Expo Go app on your mobile device
2. Scan the QR code with your device:
   - iOS: Use the Camera app
   - Android: Use the Expo Go app's QR scanner

### Running on Simulators/Emulators

To run on iOS simulator:
```bash
npm run ios
```

To run on Android emulator:
```bash
npm run android
```

## Project Structure

- `App.tsx`: Main application component
- `LoginScreen.tsx`: Login screen
- `RegistrationScreen.tsx`: Registration screen
- `PasswordResetScreen.tsx`: Password reset screen
- `ProfileScreen.tsx`: User profile management screen

## Features

- Authentication (login, registration, password reset)
- Secure token storage
- User profile management
- Profile image upload

## Shared Code

This app uses shared code from the `@astrogenie/shared` package, which includes:
- API client functions
- Type definitions
- Utility functions
- Constants

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Make sure your `.env` file is properly configured
   - Restart the Expo server after changing environment variables

2. **Connection to Supabase Fails**
   - Verify your Supabase URL and anon key
   - Check if your IP is allowed in Supabase settings

3. **Image Upload Issues**
   - Ensure you have proper permissions set up
   - Check if the Supabase storage bucket exists and has proper policies

4. **Expo Go Connection Issues**
   - Make sure your mobile device and development machine are on the same network
   - Try using the "tunnel" connection option: `npm start -- --tunnel`

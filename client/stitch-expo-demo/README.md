# SmartKissan Expo App

This is the mobile application for the SmartKissan platform, built using React Native and Expo.

## Prerequisites

Before you begin, ensure you have the following installed on your laptop:
- **Node.js** (v18 or newer recommended)
- **npm** (included with Node.js)
- **Expo Go** app installed on your physical smartphone (available on iOS App Store and Google Play Store).

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/HackVincibles/smartkisaan_updated.git
   ```

2. **Navigate to the Expo app directory**:
   ```bash
   cd smartkisaan_updated/client/stitch-expo-demo
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```
   *(If you use `yarn` or `bun`, you can run `yarn install` or `bun install` instead).*

## Running the App

1. **Start the Expo development server**:
   ```bash
   npx expo start
   ```

2. **View the app on your phone**:
   - Once the server starts, a QR code will appear in your terminal.
   - **Android**: Open the **Expo Go** app on your phone and select "Scan QR code".
   - **iOS**: Open the default **Camera** app, point it at the QR code, and tap the notification to open it in Expo Go.
   
   *(Important: Ensure both your laptop and your phone are connected to the same Wi-Fi network).*

## Alternative: Running on an Emulator
If you prefer not to use a physical device, you can run the app on a local emulator:
- **Android Emulator**: Press `a` in the terminal (requires Android Studio to be set up).
- **iOS Simulator**: Press `i` in the terminal (requires a Mac with Xcode installed).
- **Web**: Press `w` to open a web-based preview in your browser.

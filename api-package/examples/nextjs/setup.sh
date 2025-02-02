#!/bin/bash

# Build the main package
cd ../..
npm install
npm run build

# Install dependencies in the example project
cd examples/nextjs
npm install

# Create a symbolic link to the main package
npm link ../../

# Install Tailwind CSS for styling
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

echo "Setup complete! You can now run 'npm run dev' to start the example app."

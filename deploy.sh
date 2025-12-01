#!/bin/bash
# Quick Deploy Script for HealthAI Guardian

echo "🚀 HealthAI Guardian - Quick Deploy"
echo "===================================="
echo ""

# Check if environment variable is set
if [ -z "$VITE_GEMINI_API_KEY" ]; then
    echo "⚠️  WARNING: VITE_GEMINI_API_KEY not set!"
    echo "Please set it before deploying:"
    echo "  export VITE_GEMINI_API_KEY=your-key"
    echo ""
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Build the project
echo "📦 Building production bundle..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Fix errors and try again."
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Ask user which platform to deploy to
echo "Choose deployment platform:"
echo "1) Vercel (Recommended - Fastest)"
echo "2) Netlify"
echo "3) Preview locally (npm run preview)"
echo "4) Exit"
echo ""
read -p "Enter choice (1-4): " choice

case $choice in
    1)
        echo "🚀 Deploying to Vercel..."
        if command -v vercel &> /dev/null; then
            vercel --prod
        else
            echo "Installing Vercel CLI..."
            npm i -g vercel
            vercel --prod
        fi
        ;;
    2)
        echo "🚀 Deploying to Netlify..."
        if command -v netlify &> /dev/null; then
            netlify deploy --prod
        else
            echo "Installing Netlify CLI..."
            npm i -g netlify-cli
            netlify deploy --prod
        fi
        ;;
    3)
        echo "🔍 Starting preview server..."
        npm run preview
        ;;
    4)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📝 Remember to:"
echo "  - Set VITE_GEMINI_API_KEY in platform dashboard"
echo "  - Test all features on live site"
echo "  - Monitor API usage at https://ai.dev/usage"
echo ""

#!/bin/bash

# WorkOS Setup Helper Script
# This script helps you configure WorkOS AuthKit for your application

echo "🚀 WorkOS AuthKit Setup Helper"
echo "================================"
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ Error: .env.local file not found!"
    echo "Please run this script from the frontend directory."
    exit 1
fi

echo "📝 Step 1: Generate Secure Cookie Password"
echo "-------------------------------------------"
echo ""
echo "Generating a secure password for cookie encryption..."
COOKIE_PASSWORD=$(openssl rand -base64 24)
echo "✅ Generated: $COOKIE_PASSWORD"
echo ""

# Update .env.local with the generated password
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s|WORKOS_COOKIE_PASSWORD=.*|WORKOS_COOKIE_PASSWORD=$COOKIE_PASSWORD|" .env.local
else
    # Linux
    sed -i "s|WORKOS_COOKIE_PASSWORD=.*|WORKOS_COOKIE_PASSWORD=$COOKIE_PASSWORD|" .env.local
fi

echo "✅ Updated .env.local with the generated password"
echo ""

echo "🔑 Step 2: Get Your WorkOS Credentials"
echo "---------------------------------------"
echo ""
echo "1. Go to: https://dashboard.workos.com/"
echo "2. Sign in or create a free account"
echo "3. Create a new project (if you haven't already)"
echo "4. Click 'Set up AuthKit' in the Overview section"
echo ""
echo "5. Get your credentials from the 'API Keys' section:"
echo "   - API Key (starts with 'sk_test_' or 'sk_live_')"
echo "   - Client ID (starts with 'client_')"
echo ""

read -p "Press Enter to continue once you have your credentials..."
echo ""

echo "📋 Step 3: Enter Your WorkOS Credentials"
echo "-----------------------------------------"
echo ""

read -p "Enter your WORKOS_API_KEY (or press Enter to skip): " API_KEY
if [ ! -z "$API_KEY" ]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|WORKOS_API_KEY=.*|WORKOS_API_KEY=$API_KEY|" .env.local
    else
        sed -i "s|WORKOS_API_KEY=.*|WORKOS_API_KEY=$API_KEY|" .env.local
    fi
    echo "✅ API Key saved"
fi
echo ""

read -p "Enter your WORKOS_CLIENT_ID (or press Enter to skip): " CLIENT_ID
if [ ! -z "$CLIENT_ID" ]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|WORKOS_CLIENT_ID=.*|WORKOS_CLIENT_ID=$CLIENT_ID|" .env.local
    else
        sed -i "s|WORKOS_CLIENT_ID=.*|WORKOS_CLIENT_ID=$CLIENT_ID|" .env.local
    fi
    echo "✅ Client ID saved"
fi
echo ""

echo "🌐 Step 4: Configure Redirect URIs in WorkOS Dashboard"
echo "-------------------------------------------------------"
echo ""
echo "Go to: https://dashboard.workos.com/"
echo "Navigate to: Configuration → Redirects"
echo ""
echo "Add these URIs:"
echo "  1. Redirect URI: http://localhost:3001/api/auth/callback"
echo "  2. Sign-out Redirect URI: http://localhost:3001/"
echo "  3. Login Endpoint: http://localhost:3001/login"
echo ""

read -p "Press Enter once you've configured the redirect URIs..."
echo ""

echo "✅ Setup Complete!"
echo "===================="
echo ""
echo "Your .env.local file has been updated with:"
echo "  ✅ Secure cookie password"
if [ ! -z "$API_KEY" ]; then
    echo "  ✅ API Key"
fi
if [ ! -z "$CLIENT_ID" ]; then
    echo "  ✅ Client ID"
fi
echo ""
echo "📚 Next Steps:"
echo "  1. Review your .env.local file to ensure all values are set"
echo "  2. Run 'npm run dev' to start the development server"
echo "  3. Visit http://localhost:3001 and test authentication"
echo ""
echo "📖 For more information, see:"
echo "  - WORKOS-QUICKSTART.md"
echo "  - WORKOS-AUTH-GUIDE.md"
echo ""
echo "🎉 Happy coding!"

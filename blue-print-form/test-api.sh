#!/bin/bash

echo "🧪 Testing API Routes..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if backend is running
echo "1️⃣  Checking backend server..."
if curl -s http://localhost:5000 > /dev/null; then
    echo -e "${GREEN}✅ Backend is running on port 5000${NC}"
else
    echo -e "${RED}❌ Backend is NOT running. Start it with: cd backend && npm start${NC}"
    exit 1
fi

echo ""

# Check if frontend is running
echo "2️⃣  Checking frontend server..."
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ Frontend is running on port 3000${NC}"
else
    echo -e "${RED}❌ Frontend is NOT running. Start it with: npm run dev${NC}"
    exit 1
fi

echo ""
echo "3️⃣  Testing API Routes..."
echo ""

# Test register endpoint
echo "📝 Testing POST /api/auth/register..."
REGISTER_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser_'$(date +%s)'",
    "email": "test'$(date +%s)'@example.com",
    "companyName": "Test Corp",
    "password": "password123"
  }')

HTTP_CODE=$(echo "$REGISTER_RESPONSE" | tail -n1)
if [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Register endpoint working (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${YELLOW}⚠️  Register endpoint returned HTTP $HTTP_CODE${NC}"
fi

echo ""

# Test login endpoint
echo "🔐 Testing POST /api/auth/login..."
LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

HTTP_CODE=$(echo "$LOGIN_RESPONSE" | tail -n1)
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "401" ]; then
    echo -e "${GREEN}✅ Login endpoint working (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${YELLOW}⚠️  Login endpoint returned HTTP $HTTP_CODE${NC}"
fi

echo ""

# Test blueprint endpoints (without auth - should return 401)
echo "📋 Testing GET /api/blueprint/get (without auth)..."
BLUEPRINT_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET http://localhost:3000/api/blueprint/get)

HTTP_CODE=$(echo "$BLUEPRINT_RESPONSE" | tail -n1)
if [ "$HTTP_CODE" = "401" ]; then
    echo -e "${GREEN}✅ Blueprint GET endpoint working (correctly requires auth)${NC}"
else
    echo -e "${YELLOW}⚠️  Blueprint GET endpoint returned HTTP $HTTP_CODE${NC}"
fi

echo ""
echo "✅ API Routes Test Complete!"
echo ""
echo "📚 For detailed API documentation, see:"
echo "   - API_DOCUMENTATION.md"
echo "   - API_ROUTES_SUMMARY.md"
echo ""

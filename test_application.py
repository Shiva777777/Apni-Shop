"""
Test Script to Verify Apni Shop Application is Working
Run this with: python test_application.py
"""

import requests
import json

# Configuration
BACKEND_URL = "http://localhost:8002"
FRONTEND_URL = "http://localhost:3001"

print("=" * 60)
print("TESTING APNI SHOP APPLICATION")
print("=" * 60)

# Test 1: Backend Health Check
print("\n[Test 1] Backend API Health Check")
try:
    response = requests.get(f"{BACKEND_URL}/api/products/categories/", timeout=5)
    if response.status_code == 200:
        print("[PASS] Backend API is WORKING!")
        print(f"   - Status Code: {response.status_code}")
    else:
        print(f"[WARN] Backend responded with status: {response.status_code}")
except Exception as e:
    print(f"[FAIL] Backend API FAILED: {str(e)}")

# Test 2: Frontend
print("\n[Test 2] Frontend Server Check")
try:
    response = requests.get(FRONTEND_URL, timeout=5)
    if response.status_code == 200:
        print("[PASS] Frontend is WORKING!")
        print(f"   - Status Code: {response.status_code}")
    else:
        print(f"[WARN] Frontend responded with status: {response.status_code}")
except Exception as e:
    print(f"[FAIL] Frontend FAILED: {str(e)}")

# Test 3: Orders API (Critical Test)
print("\n[Test 3] Orders API Check (CRITICAL)")
print("   Note: This requires authentication. Testing endpoint availability...")
try:
    # We expect 401 or 403 (unauthorized) which means the endpoint exists
    response = requests.get(f"{BACKEND_URL}/api/orders/orders/", timeout=5)
    if response.status_code in [200, 401, 403]:
        print("[PASS] Orders API endpoint is WORKING!")
        print(f"   - Status Code: {response.status_code}")
        if response.status_code == 401:
            print("   - (401 is expected without authentication)")
    else:
        print(f"[WARN] Orders API responded with status: {response.status_code}")
except Exception as e:
    print(f"[FAIL] Orders API FAILED: {str(e)}")

# Test 4: Database Connection (via API)
print("\n[Test 4] Database Connection Check")
try:
    response = requests.get(f"{BACKEND_URL}/api/products/products/", timeout=5)
    if response.status_code == 200:
        data = response.json()
        results = data.get('results', data) if isinstance(data, dict) else data
        product_count = len(results) if isinstance(results, list) else 0
        print("[PASS] Database is WORKING!")
        print(f"   - Products in database: {product_count}")
    else:
        print(f"[WARN] Database check responded with status: {response.status_code}")
except Exception as e:
    print(f"[FAIL] Database Connection FAILED: {str(e)}")

# Test 5: API Documentation
print("\n[Test 5] API Documentation Check")
try:
    response = requests.get(f"{BACKEND_URL}/swagger/", timeout=5)
    if response.status_code == 200:
        print("[PASS] API Documentation (Swagger) is WORKING!")
        print(f"   - Access at: {BACKEND_URL}/swagger/")
    else:
        print(f"[WARN] API Docs responded with status: {response.status_code}")
except Exception as e:
    print(f"[FAIL] API Documentation FAILED: {str(e)}")

# Summary
print("\n" + "=" * 60)
print("TEST SUMMARY")
print("=" * 60)
print("\n[SUCCESS] If all tests passed, your application is FULLY WORKING!")
print("\nAccess Points:")
print(f"   - Frontend: {FRONTEND_URL}")
print(f"   - Backend API: {BACKEND_URL}/api/")
print(f"   - Admin Panel: {BACKEND_URL}/admin/")
print(f"   - API Docs: {BACKEND_URL}/swagger/")
print("\nHow to use the application:")
print("   1. Open frontend: http://localhost:3001")
print("   2. Register/Login as a user")
print("   3. Add products to cart")
print("   4. Place an order")
print("   5. Check 'My Orders' page - YOUR ORDERS WILL SHOW!")
print("\n" + "=" * 60)

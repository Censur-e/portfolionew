#!/usr/bin/env python3
"""
Backend API Test Suite for Censure Portfolio
Tests all endpoints as specified in the review request.
"""

import requests
import json
import sys
from typing import Dict, Any, Optional

# Read backend URL from frontend/.env
BACKEND_URL = "https://nexus-ui.preview.emergentagent.com"
BASE_URL = f"{BACKEND_URL}/api"

# Test credentials from review request
TEST_USERNAME = "CensureSiteWeb"
TEST_PASSWORD = "14621462aBaB"

# ANSI color codes for output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'

test_results = []
token = None


def log_test(test_name: str, passed: bool, details: str = ""):
    """Log test result with color coding."""
    status = f"{GREEN}✓ PASS{RESET}" if passed else f"{RED}✗ FAIL{RESET}"
    print(f"{status} | {test_name}")
    if details:
        print(f"       {details}")
    test_results.append({
        "test": test_name,
        "passed": passed,
        "details": details
    })


def test_1_root_endpoint():
    """Test 1: GET /api/ should return welcome message."""
    print(f"\n{BLUE}Test 1: GET /api/ - Root endpoint{RESET}")
    try:
        response = requests.get(f"{BASE_URL}/", timeout=10)
        
        if response.status_code != 200:
            log_test("Root endpoint status code", False, f"Expected 200, got {response.status_code}")
            return False
        
        data = response.json()
        if data.get("message") == "Censure portfolio API":
            log_test("Root endpoint message", True, f"Response: {data}")
            return True
        else:
            log_test("Root endpoint message", False, f"Expected 'Censure portfolio API', got: {data}")
            return False
            
    except Exception as e:
        log_test("Root endpoint", False, f"Exception: {str(e)}")
        return False


def test_2_get_content_public():
    """Test 2: GET /api/content - Public content with auto-seeding."""
    print(f"\n{BLUE}Test 2: GET /api/content - Public content endpoint{RESET}")
    try:
        response = requests.get(f"{BASE_URL}/content", timeout=10)
        
        if response.status_code != 200:
            log_test("GET /api/content status", False, f"Expected 200, got {response.status_code}")
            return False
        
        log_test("GET /api/content status", True, "Status 200 OK")
        
        data = response.json()
        
        # Check required keys
        required_keys = ["hero", "about", "projects", "skillsRow1", "skillsRow2", "skillsRow3", "socials", "contact"]
        missing_keys = [key for key in required_keys if key not in data]
        
        if missing_keys:
            log_test("Content structure", False, f"Missing keys: {missing_keys}")
            return False
        
        log_test("Content structure", True, "All required keys present")
        
        # Verify hero.name == "Censure"
        hero_name = data.get("hero", {}).get("name")
        if hero_name != "Censure":
            log_test("Hero name verification", False, f"Expected 'Censure', got '{hero_name}'")
            return False
        
        log_test("Hero name verification", True, f"hero.name = 'Censure'")
        
        # Verify about.bio is non-empty list
        about_bio = data.get("about", {}).get("bio")
        if not isinstance(about_bio, list) or len(about_bio) == 0:
            log_test("About bio verification", False, f"Expected non-empty list, got: {type(about_bio)} with length {len(about_bio) if isinstance(about_bio, list) else 'N/A'}")
            return False
        
        log_test("About bio verification", True, f"about.bio is non-empty list with {len(about_bio)} items")
        
        return True
        
    except Exception as e:
        log_test("GET /api/content", False, f"Exception: {str(e)}")
        return False


def test_3_login_valid_credentials():
    """Test 3: POST /api/auth/login with valid credentials."""
    global token
    print(f"\n{BLUE}Test 3: POST /api/auth/login - Valid credentials{RESET}")
    try:
        payload = {
            "username": TEST_USERNAME,
            "password": TEST_PASSWORD
        }
        response = requests.post(f"{BASE_URL}/auth/login", json=payload, timeout=10)
        
        if response.status_code != 200:
            log_test("Login with valid credentials", False, f"Expected 200, got {response.status_code}. Response: {response.text}")
            return False
        
        data = response.json()
        
        # Check for token and expires_in
        if "token" not in data or "expires_in" not in data:
            log_test("Login response structure", False, f"Missing 'token' or 'expires_in'. Response: {data}")
            return False
        
        token = data["token"]
        log_test("Login with valid credentials", True, f"Received token (length: {len(token)}) and expires_in: {data['expires_in']}")
        
        return True
        
    except Exception as e:
        log_test("Login with valid credentials", False, f"Exception: {str(e)}")
        return False


def test_4_login_invalid_credentials():
    """Test 4: POST /api/auth/login with invalid credentials."""
    print(f"\n{BLUE}Test 4: POST /api/auth/login - Invalid credentials{RESET}")
    try:
        payload = {
            "username": "wronguser",
            "password": "wrongpassword"
        }
        response = requests.post(f"{BASE_URL}/auth/login", json=payload, timeout=10)
        
        if response.status_code == 401:
            log_test("Login with invalid credentials", True, f"Correctly returned 401. Response: {response.json()}")
            return True
        else:
            log_test("Login with invalid credentials", False, f"Expected 401, got {response.status_code}")
            return False
            
    except Exception as e:
        log_test("Login with invalid credentials", False, f"Exception: {str(e)}")
        return False


def test_5_auth_me_without_token():
    """Test 5: GET /api/auth/me without token."""
    print(f"\n{BLUE}Test 5: GET /api/auth/me - Without token{RESET}")
    try:
        response = requests.get(f"{BASE_URL}/auth/me", timeout=10)
        
        if response.status_code == 401:
            log_test("GET /api/auth/me without token", True, f"Correctly returned 401")
            return True
        else:
            log_test("GET /api/auth/me without token", False, f"Expected 401, got {response.status_code}")
            return False
            
    except Exception as e:
        log_test("GET /api/auth/me without token", False, f"Exception: {str(e)}")
        return False


def test_6_auth_me_with_token():
    """Test 6: GET /api/auth/me with valid token."""
    global token
    print(f"\n{BLUE}Test 6: GET /api/auth/me - With valid token{RESET}")
    
    if not token:
        log_test("GET /api/auth/me with token", False, "No token available from previous test")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/auth/me", headers=headers, timeout=10)
        
        if response.status_code != 200:
            log_test("GET /api/auth/me with token", False, f"Expected 200, got {response.status_code}. Response: {response.text}")
            return False
        
        data = response.json()
        
        if data.get("username") == TEST_USERNAME:
            log_test("GET /api/auth/me with token", True, f"Correctly returned username: {data['username']}")
            return True
        else:
            log_test("GET /api/auth/me with token", False, f"Expected username '{TEST_USERNAME}', got: {data}")
            return False
            
    except Exception as e:
        log_test("GET /api/auth/me with token", False, f"Exception: {str(e)}")
        return False


def test_7_update_content_without_auth():
    """Test 7: PUT /api/content without authentication."""
    print(f"\n{BLUE}Test 7: PUT /api/content - Without authentication{RESET}")
    try:
        # Minimal valid payload
        payload = {
            "hero": {
                "name": "Test",
                "role": "Test",
                "headlineLine1": "Test",
                "headlineLine2": "Test",
                "headlineLine3": "Test",
                "headlineLine4": "Test",
                "status": "Test"
            },
            "about": {
                "bio": ["Test"],
                "meta": [],
                "terminalLines": []
            },
            "projects": [],
            "skillsRow1": [],
            "skillsRow2": [],
            "skillsRow3": [],
            "socials": [],
            "contact": {
                "primary": "test",
                "primaryLabel": "test",
                "caption": "test",
                "copyright": "test"
            }
        }
        
        response = requests.put(f"{BASE_URL}/content", json=payload, timeout=10)
        
        if response.status_code == 401:
            log_test("PUT /api/content without auth", True, f"Correctly returned 401")
            return True
        else:
            log_test("PUT /api/content without auth", False, f"Expected 401, got {response.status_code}")
            return False
            
    except Exception as e:
        log_test("PUT /api/content without auth", False, f"Exception: {str(e)}")
        return False


def test_8_update_content_with_auth():
    """Test 8: PUT /api/content with auth, verify persistence."""
    global token
    print(f"\n{BLUE}Test 8: PUT /api/content - With authentication and persistence check{RESET}")
    
    if not token:
        log_test("PUT /api/content with auth", False, "No token available")
        return False
    
    try:
        # First, get current content
        response = requests.get(f"{BASE_URL}/content", timeout=10)
        if response.status_code != 200:
            log_test("GET content before update", False, f"Failed to get content: {response.status_code}")
            return False
        
        original_content = response.json()
        log_test("GET content before update", True, "Retrieved original content")
        
        # Modify hero.name
        modified_content = original_content.copy()
        modified_content["hero"]["name"] = "Censure Updated"
        
        # Update content
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.put(f"{BASE_URL}/content", json=modified_content, headers=headers, timeout=10)
        
        if response.status_code != 200:
            log_test("PUT /api/content with auth", False, f"Expected 200, got {response.status_code}. Response: {response.text}")
            return False
        
        log_test("PUT /api/content with auth", True, "Content updated successfully")
        
        # Verify the change persisted
        response = requests.get(f"{BASE_URL}/content", timeout=10)
        if response.status_code != 200:
            log_test("GET content after update", False, f"Failed to get content: {response.status_code}")
            return False
        
        updated_content = response.json()
        
        if updated_content["hero"]["name"] != "Censure Updated":
            log_test("Content persistence verification", False, f"Expected 'Censure Updated', got '{updated_content['hero']['name']}'")
            return False
        
        log_test("Content persistence verification", True, "Change persisted correctly")
        
        # Restore original content
        original_content["hero"]["name"] = "Censure"
        response = requests.put(f"{BASE_URL}/content", json=original_content, headers=headers, timeout=10)
        
        if response.status_code != 200:
            log_test("Restore original content", False, f"Failed to restore: {response.status_code}")
            return False
        
        log_test("Restore original content", True, "Content restored to 'Censure'")
        
        return True
        
    except Exception as e:
        log_test("PUT /api/content with auth", False, f"Exception: {str(e)}")
        return False


def test_9_reset_content():
    """Test 9: POST /api/content/reset with auth."""
    global token
    print(f"\n{BLUE}Test 9: POST /api/content/reset - Reset to defaults{RESET}")
    
    if not token:
        log_test("POST /api/content/reset", False, "No token available")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.post(f"{BASE_URL}/content/reset", headers=headers, timeout=10)
        
        if response.status_code != 200:
            log_test("POST /api/content/reset", False, f"Expected 200, got {response.status_code}. Response: {response.text}")
            return False
        
        log_test("POST /api/content/reset status", True, "Reset endpoint returned 200")
        
        data = response.json()
        
        # Verify defaults are restored
        if data.get("hero", {}).get("name") != "Censure":
            log_test("Reset content verification", False, f"Expected hero.name='Censure', got '{data.get('hero', {}).get('name')}'")
            return False
        
        # Check that about.bio has the default French content
        about_bio = data.get("about", {}).get("bio", [])
        if not about_bio or not any("Censure" in line and "développeur Roblox" in line for line in about_bio):
            log_test("Reset content verification", False, f"Default French content not found in about.bio")
            return False
        
        log_test("Reset content verification", True, "Content successfully reset to defaults")
        
        return True
        
    except Exception as e:
        log_test("POST /api/content/reset", False, f"Exception: {str(e)}")
        return False


def print_summary():
    """Print test summary."""
    print(f"\n{'='*70}")
    print(f"{BLUE}TEST SUMMARY{RESET}")
    print(f"{'='*70}")
    
    passed = sum(1 for r in test_results if r["passed"])
    total = len(test_results)
    
    print(f"\nTotal Tests: {total}")
    print(f"{GREEN}Passed: {passed}{RESET}")
    print(f"{RED}Failed: {total - passed}{RESET}")
    
    if total - passed > 0:
        print(f"\n{RED}Failed Tests:{RESET}")
        for result in test_results:
            if not result["passed"]:
                print(f"  - {result['test']}")
                if result["details"]:
                    print(f"    {result['details']}")
    
    print(f"\n{'='*70}\n")
    
    return passed == total


def main():
    """Run all tests."""
    print(f"\n{BLUE}{'='*70}{RESET}")
    print(f"{BLUE}Censure Portfolio Backend API Test Suite{RESET}")
    print(f"{BLUE}{'='*70}{RESET}")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Base API URL: {BASE_URL}")
    print(f"Test Credentials: {TEST_USERNAME} / {TEST_PASSWORD}")
    
    # Run all tests in sequence
    test_1_root_endpoint()
    test_2_get_content_public()
    test_3_login_valid_credentials()
    test_4_login_invalid_credentials()
    test_5_auth_me_without_token()
    test_6_auth_me_with_token()
    test_7_update_content_without_auth()
    test_8_update_content_with_auth()
    test_9_reset_content()
    
    # Print summary
    all_passed = print_summary()
    
    sys.exit(0 if all_passed else 1)


if __name__ == "__main__":
    main()

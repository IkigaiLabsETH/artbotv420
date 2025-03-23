#!/bin/bash

# Test script for the integrated style service
# This script runs the integrated style test to ensure all style files are used

echo "=== Running Integrated Style Test ==="
echo "This test verifies that all style files are properly utilized in art generation"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
  echo "Error: .env file is missing. Please create one with your API keys."
  echo "Required keys: REPLICATE_API_KEY, ANTHROPIC_API_KEY or OPENAI_API_KEY"
  exit 1
fi

# Run the TypeScript file
echo "Starting test..."
npx ts-node src/examples/integrated-style-test.ts

# Check exit status
if [ $? -eq 0 ]; then
  echo ""
  echo "=== Test completed successfully ==="
  echo "All style files have been properly integrated!"
else
  echo ""
  echo "=== Test failed ==="
  echo "Please check the error messages above."
fi 
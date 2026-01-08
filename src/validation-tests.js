// Validation test cases for the recommendation API
// Run with: node src/validation-tests.js

// Test cases for various validation scenarios
const testCases = [
  {
    name: "Valid Request",
    request: {
      options: [
        {
          id: "option1",
          name: "Option 1",
          features: { cost: 100, performance: 80 }
        },
        {
          id: "option2", 
          name: "Option 2",
          features: { cost: 150, performance: 90 }
        }
      ],
      constraints: [
        { criteria: "cost", operator: "lte", value: 200, required: true }
      ],
      priorities: [
        { criteria: "cost", weight: 0.6, optimization: "minimize" },
        { criteria: "performance", weight: 0.4, optimization: "maximize" }
      ]
    },
    expectedStatus: 200
  },
  
  {
    name: "Missing Options",
    request: {
      constraints: [],
      priorities: [
        { criteria: "cost", weight: 1.0, optimization: "minimize" }
      ]
    },
    expectedStatus: 400
  },
  
  {
    name: "Only One Option (Should Fail)",
    request: {
      options: [
        { id: "option1", name: "Option 1", features: { cost: 100 } }
      ],
      constraints: [],
      priorities: [
        { criteria: "cost", weight: 1.0, optimization: "minimize" }
      ]
    },
    expectedStatus: 400
  },
  
  {
    name: "Invalid Priority Weights (Don't Sum to 1)",
    request: {
      options: [
        { id: "option1", name: "Option 1", features: { cost: 100 } },
        { id: "option2", name: "Option 2", features: { cost: 150 } }
      ],
      constraints: [],
      priorities: [
        { criteria: "cost", weight: 0.3, optimization: "minimize" },
        { criteria: "performance", weight: 0.5, optimization: "maximize" }
      ]
    },
    expectedStatus: 400
  },
  
  {
    name: "Missing Required Fields in Option",
    request: {
      options: [
        { name: "Option 1", features: { cost: 100 } }, // Missing ID
        { id: "option2", features: { cost: 150 } }      // Missing name
      ],
      constraints: [],
      priorities: [
        { criteria: "cost", weight: 1.0, optimization: "minimize" }
      ]
    },
    expectedStatus: 400
  },
  
  {
    name: "Invalid Constraint Operator",
    request: {
      options: [
        { id: "option1", name: "Option 1", features: { cost: 100 } },
        { id: "option2", name: "Option 2", features: { cost: 150 } }
      ],
      constraints: [
        { criteria: "cost", operator: "invalid_op", value: 200 }
      ],
      priorities: [
        { criteria: "cost", weight: 1.0, optimization: "minimize" }
      ]
    },
    expectedStatus: 400
  },
  
  {
    name: "Priority Criteria Not Found in Options",
    request: {
      options: [
        { id: "option1", name: "Option 1", features: { cost: 100 } },
        { id: "option2", name: "Option 2", features: { cost: 150 } }
      ],
      constraints: [],
      priorities: [
        { criteria: "nonexistent_field", weight: 1.0, optimization: "minimize" }
      ]
    },
    expectedStatus: 400
  },
  
  {
    name: "Duplicate Option IDs",
    request: {
      options: [
        { id: "duplicate", name: "Option 1", features: { cost: 100 } },
        { id: "duplicate", name: "Option 2", features: { cost: 150 } }
      ],
      constraints: [],
      priorities: [
        { criteria: "cost", weight: 1.0, optimization: "minimize" }
      ]
    },
    expectedStatus: 400
  },
  
  {
    name: "Invalid Settings",
    request: {
      options: [
        { id: "option1", name: "Option 1", features: { cost: 100 } },
        { id: "option2", name: "Option 2", features: { cost: 150 } }
      ],
      constraints: [],
      priorities: [
        { criteria: "cost", weight: 1.0, optimization: "minimize" }
      ],
      settings: {
        algorithm: "invalid_algorithm",
        max_results: -1
      }
    },
    expectedStatus: 400
  }
];

// Function to test a single case
async function testCase(testCase) {
  try {
    console.log(`\n=== Testing: ${testCase.name} ===`);
    
    const response = await fetch('http://localhost:3000/api/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testCase.request)
    });

    const result = await response.json();
    
    console.log(`Status: ${response.status} (expected: ${testCase.expectedStatus})`);
    
    if (response.status === testCase.expectedStatus) {
      console.log('✅ PASS');
    } else {
      console.log('❌ FAIL');
    }
    
    if (response.status >= 400) {
      console.log('Error Details:');
      if (result.errors) {
        result.errors.forEach((error, index) => {
          console.log(`  ${index + 1}. ${error}`);
        });
      } else {
        console.log(`  ${result.message}`);
      }
      
      if (result.help) {
        console.log('Help:');
        Object.entries(result.help).forEach(([key, value]) => {
          console.log(`  ${key}: ${value}`);
        });
      }
    }
    
  } catch (error) {
    console.log('❌ FAIL - Network/Parse Error:', error.message);
  }
}

// Run all test cases
async function runAllTests() {
  console.log('🧪 Running Validation Tests for Recommendation API');
  console.log('Make sure your Next.js server is running on http://localhost:3000');
  
  for (const testCase of testCases) {
    await testCase(testCase);
    await new Promise(resolve => setTimeout(resolve, 100)); // Small delay between tests
  }
  
  console.log('\n🏁 All tests completed!');
}

// Export for use in other files
module.exports = { testCases, testCase, runAllTests };

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}
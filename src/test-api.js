// Test script for the refactored recommendation API
// Run with: node src/test-api.js

const validRequest = {
  options: [
    {
      id: "postgres-rds",
      name: "Amazon RDS PostgreSQL",
      category: "database",
      features: {
        cost: 0.115,
        performance: 3000,
        scalability: 8,
        reliability: 99.95,
        managed_service: true
      }
    },
    {
      id: "mongodb-atlas",
      name: "MongoDB Atlas",
      category: "database", 
      features: {
        cost: 0.08,
        performance: 2500,
        scalability: 9,
        reliability: 99.995,
        managed_service: true
      }
    },
    {
      id: "mysql-self-hosted",
      name: "Self-hosted MySQL",
      category: "database",
      features: {
        cost: 0.05,
        performance: 2000,
        scalability: 6,
        reliability: 99.5,
        managed_service: false
      }
    }
  ],
  constraints: [
    {
      criteria: "cost",
      operator: "lte",
      value: 0.12,
      required: true
    },
    {
      criteria: "reliability", 
      operator: "gte",
      value: 99.0,
      required: true
    },
    {
      criteria: "managed_service",
      operator: "eq", 
      value: true,
      required: false
    }
  ],
  priorities: [
    {
      criteria: "cost",
      weight: 0.3,
      optimization: "minimize"
    },
    {
      criteria: "performance",
      weight: 0.4,
      optimization: "maximize"
    },
    {
      criteria: "scalability",
      weight: 0.2,
      optimization: "maximize"
    },
    {
      criteria: "reliability",
      weight: 0.1,
      optimization: "maximize"
    }
  ],
  settings: {
    algorithm: "weighted_sum",
    include_explanations: true,
    max_results: 10
  }
};

// Test function for valid request
async function testValidRequest() {
  console.log('🧪 Testing Valid Request with Refactored API...\n');
  
  try {
    const response = await fetch('http://localhost:3000/api/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validRequest)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Valid request succeeded!');
      console.log(`Status: ${response.status}`);
      console.log(`Options evaluated: ${result.metadata.input_summary.optionsCount}`);
      console.log(`Processing time: ${result.metadata.processing_time_ms}ms`);
      
      if (result.results.rankedOptions.length > 0) {
        const topOption = result.results.rankedOptions[0];
        console.log(`\nTop recommendation: ${topOption.name} (Score: ${topOption.totalScore})`);
        console.log('Sample explanation:', topOption.reasons[0]?.explanation);
        
        // Test the new structure
        console.log('\n📊 New Structure Validation:');
        console.log(`- Trade-offs: ${topOption.tradeOffs ? '✅' : '❌'}`);
        console.log(`- Reasons: ${topOption.reasons ? '✅' : '❌'}`);
        console.log(`- Criteria scores: ${topOption.criteriaScores ? '✅' : '❌'}`);
      }
    } else {
      console.log('❌ Unexpected error with valid request');
      console.log('Response:', JSON.stringify(result, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

// Test the modular structure
async function testModularStructure() {
  console.log('\n🔧 Testing Modular Structure...\n');
  
  // Test that the API still works with the refactored backend
  try {
    const response = await fetch('http://localhost:3000/api/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validRequest)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Modular backend working correctly!');
      
      // Validate response structure matches new format
      const expectedFields = [
        'status',
        'timestamp', 
        'results',
        'metadata'
      ];
      
      const missingFields = expectedFields.filter(field => !(field in result));
      if (missingFields.length === 0) {
        console.log('✅ Response structure is correct');
      } else {
        console.log('❌ Missing fields:', missingFields);
      }
      
      // Check results structure
      if (result.results && result.results.rankedOptions) {
        const option = result.results.rankedOptions[0];
        const expectedOptionFields = ['optionId', 'name', 'totalScore', 'criteriaScores', 'reasons', 'tradeOffs'];
        const missingOptionFields = expectedOptionFields.filter(field => !(field in option));
        
        if (missingOptionFields.length === 0) {
          console.log('✅ Option structure is correct');
        } else {
          console.log('❌ Missing option fields:', missingOptionFields);
        }
      }
      
    } else {
      console.log('❌ Modular backend error:', result.message);
    }
    
  } catch (error) {
    console.error('❌ Modular structure test failed:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Testing Refactored Production-Quality API');
  console.log('Make sure your Next.js server is running on http://localhost:3000\n');
  
  await testValidRequest();
  await testModularStructure();
  
  console.log('\n🏁 All tests completed!');
  console.log('\n📁 New File Structure:');
  console.log('├── src/lib/validation.js    - Input validation logic');
  console.log('├── src/lib/scoring.js       - Scoring and constraint logic');
  console.log('├── src/lib/analysis.js      - Trade-off analysis');
  console.log('├── src/lib/utils.js         - Utility functions');
  console.log('└── src/pages/api/recommend.js - Clean API handler');
}

// Export for use in other files
module.exports = { 
  validRequest, 
  testValidRequest, 
  testModularStructure,
  runAllTests 
};

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}
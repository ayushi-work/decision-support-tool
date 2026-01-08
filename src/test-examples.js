/**
 * Comprehensive test examples for the Decision Support Tool
 * Includes various scenarios with expected output formats
 */

// PostgreSQL vs DynamoDB comparison - Real-world database selection scenario
export const postgresDynamoExample = {
  name: "PostgreSQL vs DynamoDB Database Selection",
  description: "Comparing relational vs NoSQL databases for a high-traffic application",
  
  input: {
    options: [
      {
        id: "postgresql-rds",
        name: "Amazon RDS PostgreSQL",
        features: {
          cost_per_hour: 0.145,
          read_latency_ms: 5,
          write_latency_ms: 8,
          max_connections: 5000,
          scalability_score: 7,
          consistency_model: "ACID",
          query_flexibility: 10,
          operational_overhead: 3,
          backup_automation: true,
          multi_region: false
        }
      },
      {
        id: "dynamodb",
        name: "Amazon DynamoDB",
        features: {
          cost_per_hour: 0.25,
          read_latency_ms: 1,
          write_latency_ms: 2,
          max_connections: 40000,
          scalability_score: 10,
          consistency_model: "Eventually Consistent",
          query_flexibility: 6,
          operational_overhead: 1,
          backup_automation: true,
          multi_region: true
        }
      },
      {
        id: "postgresql-aurora",
        name: "Amazon Aurora PostgreSQL",
        features: {
          cost_per_hour: 0.29,
          read_latency_ms: 3,
          write_latency_ms: 5,
          max_connections: 15000,
          scalability_score: 9,
          consistency_model: "ACID",
          query_flexibility: 10,
          operational_overhead: 2,
          backup_automation: true,
          multi_region: true
        }
      }
    ],
    constraints: [
      {
        criteria: "cost_per_hour",
        operator: "lte",
        value: 0.30,
        required: true
      },
      {
        criteria: "read_latency_ms",
        operator: "lte",
        value: 10,
        required: true
      },
      {
        criteria: "backup_automation",
        operator: "eq",
        value: true,
        required: false
      }
    ],
    priorities: [
      {
        criteria: "cost_per_hour",
        weight: 0.25,
        optimization: "minimize"
      },
      {
        criteria: "read_latency_ms",
        weight: 0.30,
        optimization: "minimize"
      },
      {
        criteria: "scalability_score",
        weight: 0.25,
        optimization: "maximize"
      },
      {
        criteria: "query_flexibility",
        weight: 0.20,
        optimization: "maximize"
      }
    ],
    settings: {
      algorithm: "weighted_sum",
      include_explanations: true,
      max_results: 10
    }
  },

  expectedOutput: {
    status: "success",
    timestamp: "2024-01-08T10:00:00.000Z",
    results: {
      rankedOptions: [
        {
          optionId: "dynamodb",
          name: "Amazon DynamoDB",
          rank: 1,
          totalScore: 87.5,
          criteriaScores: {
            cost_per_hour: {
              score: 25.0,
              normalizedValue: 0.75,
              rawValue: 0.25
            },
            read_latency_ms: {
              score: 100.0,
              normalizedValue: 0.0,
              rawValue: 1
            },
            scalability_score: {
              score: 100.0,
              normalizedValue: 1.0,
              rawValue: 10
            },
            query_flexibility: {
              score: 50.0,
              normalizedValue: 0.5,
              rawValue: 6
            }
          },
          reasons: [
            {
              criteria: "cost_per_hour",
              status: "negative",
              explanation: "Amazon DynamoDB has high cost_per_hour ($0.250), which is above average compared to alternatives. This hurts its overall ranking.",
              details: {
                rawValue: 0.25,
                formattedValue: "$0.250",
                score: 25.0,
                performanceLevel: "high",
                comparison: "above average",
                weightPercentage: 25
              },
              impact: "negative",
              weightContribution: 6.25
            },
            {
              criteria: "read_latency_ms",
              status: "positive",
              explanation: "Amazon DynamoDB has excellent read_latency_ms (1), which is among the lowest compared to alternatives. This helps its overall ranking.",
              details: {
                rawValue: 1,
                formattedValue: "1",
                score: 100.0,
                performanceLevel: "very low",
                comparison: "among the lowest",
                weightPercentage: 30
              },
              impact: "positive",
              weightContribution: 30.0
            }
          ],
          constraintCompliance: {
            passed: true,
            failedConstraints: [],
            constraintReasons: [
              {
                criteria: "cost_per_hour",
                status: "passed",
                explanation: "Amazon DynamoDB cost_per_hour ($0.250) meets the required requirement of being less than or equal to $0.300",
                required: true,
                actualValue: 0.25,
                constraintValue: 0.30,
                operator: "lte"
              }
            ]
          },
          tradeOffs: {
            strengths: [
              "Strong read_latency_ms: 1 (very low)",
              "Strong scalability_score: 10 (excellent)"
            ],
            weaknesses: [
              "Weak cost_per_hour: $0.250 (high)",
              "Weak query_flexibility: 6 (below average)"
            ],
            keyDifferentiators: [
              "superior read_latency_ms: 1 vs competitors",
              "superior scalability_score: 10 vs competitors",
              "Top overall recommendation based on your priorities"
            ]
          }
        }
      ],
      summary: {
        totalOptionsEvaluated: 3,
        optionsMeetingConstraints: 3,
        topRecommendation: {
          optionId: "dynamodb",
          confidence: 0.85,
          reasoning: "Scored 87.5/100 overall. Clear leader with 12.3 point advantage. Key strength: strong read_latency_ms: 1 (very low)."
        }
      },
      explanations: {
        methodology: "Used weighted_sum algorithm with user-defined priority weights. Each option scored 0-100 per criteria, then weighted by importance.",
        scoringBreakdown: "Criteria weights: cost_per_hour (25%), read_latency_ms (30%), scalability_score (25%), query_flexibility (20%)",
        tradeOffAnalysis: "Strengths and weaknesses identified by comparing scores across criteria. Key differentiators highlight significant performance gaps."
      }
    },
    metadata: {
      processing_time_ms: 45,
      algorithm_used: "weighted_sum",
      data_freshness: "2024-01-08T10:00:00.000Z",
      input_summary: {
        optionsCount: 3,
        constraintsCount: 3,
        prioritiesCount: 4
      }
    }
  }
};

// API Gateway comparison example
export const apiGatewayExample = {
  name: "API Gateway Selection",
  description: "Choosing between managed and self-hosted API gateway solutions",
  
  input: {
    options: [
      {
        id: "aws-api-gateway",
        name: "AWS API Gateway",
        features: {
          cost_per_million_requests: 3.50,
          latency_ms: 25,
          rate_limit_rps: 10000,
          auth_methods: 5,
          monitoring_features: 8,
          deployment_complexity: 4,
          vendor_lock_in: 7
        }
      },
      {
        id: "kong-gateway",
        name: "Kong API Gateway",
        features: {
          cost_per_million_requests: 0.00,
          latency_ms: 15,
          rate_limit_rps: 50000,
          auth_methods: 8,
          monitoring_features: 6,
          deployment_complexity: 7,
          vendor_lock_in: 2
        }
      },
      {
        id: "nginx-plus",
        name: "NGINX Plus",
        features: {
          cost_per_million_requests: 1.50,
          latency_ms: 10,
          rate_limit_rps: 100000,
          auth_methods: 4,
          monitoring_features: 7,
          deployment_complexity: 8,
          vendor_lock_in: 3
        }
      }
    ],
    constraints: [
      {
        criteria: "cost_per_million_requests",
        operator: "lte",
        value: 5.00,
        required: true
      },
      {
        criteria: "latency_ms",
        operator: "lte",
        value: 50,
        required: true
      }
    ],
    priorities: [
      {
        criteria: "latency_ms",
        weight: 0.35,
        optimization: "minimize"
      },
      {
        criteria: "cost_per_million_requests",
        weight: 0.25,
        optimization: "minimize"
      },
      {
        criteria: "rate_limit_rps",
        weight: 0.20,
        optimization: "maximize"
      },
      {
        criteria: "vendor_lock_in",
        weight: 0.20,
        optimization: "minimize"
      }
    ]
  }
};

// Machine Learning Platform comparison
export const mlPlatformExample = {
  name: "ML Platform Selection",
  description: "Comparing cloud-based machine learning platforms for model training and deployment",
  
  input: {
    options: [
      {
        id: "aws-sagemaker",
        name: "Amazon SageMaker",
        features: {
          cost_per_hour: 0.464,
          model_training_speed: 8,
          pre_built_algorithms: 25,
          auto_scaling: true,
          notebook_integration: 9,
          deployment_options: 7,
          learning_curve: 6
        }
      },
      {
        id: "google-vertex-ai",
        name: "Google Vertex AI",
        features: {
          cost_per_hour: 0.420,
          model_training_speed: 9,
          pre_built_algorithms: 30,
          auto_scaling: true,
          notebook_integration: 8,
          deployment_options: 8,
          learning_curve: 7
        }
      },
      {
        id: "databricks",
        name: "Databricks",
        features: {
          cost_per_hour: 0.55,
          model_training_speed: 9,
          pre_built_algorithms: 15,
          auto_scaling: true,
          notebook_integration: 10,
          deployment_options: 5,
          learning_curve: 8
        }
      }
    ],
    constraints: [
      {
        criteria: "cost_per_hour",
        operator: "lte",
        value: 0.50,
        required: true
      },
      {
        criteria: "auto_scaling",
        operator: "eq",
        value: true,
        required: true
      }
    ],
    priorities: [
      {
        criteria: "model_training_speed",
        weight: 0.30,
        optimization: "maximize"
      },
      {
        criteria: "cost_per_hour",
        weight: 0.25,
        optimization: "minimize"
      },
      {
        criteria: "notebook_integration",
        weight: 0.25,
        optimization: "maximize"
      },
      {
        criteria: "learning_curve",
        weight: 0.20,
        optimization: "maximize"
      }
    ]
  }
};

// Test function to run all examples
export async function testAllExamples() {
  const examples = [
    postgresDynamoExample,
    apiGatewayExample,
    mlPlatformExample
  ];

  console.log('🧪 Testing All Decision Support Tool Examples\n');

  for (const example of examples) {
    console.log(`\n=== ${example.name} ===`);
    console.log(`Description: ${example.description}`);
    
    try {
      const response = await fetch('http://localhost:3000/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(example.input)
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log('✅ Request successful');
        console.log(`Processing time: ${result.metadata.processing_time_ms}ms`);
        
        if (result.results.rankedOptions.length > 0) {
          const topOption = result.results.rankedOptions[0];
          console.log(`🏆 Winner: ${topOption.name} (Score: ${topOption.totalScore})`);
          
          // Show key insights
          if (topOption.tradeOffs) {
            console.log(`💪 Top strength: ${topOption.tradeOffs.strengths[0] || 'N/A'}`);
            console.log(`⚠️  Main weakness: ${topOption.tradeOffs.weaknesses[0] || 'N/A'}`);
          }
        }
      } else {
        console.log('❌ Request failed:', result.message);
        if (result.errors) {
          result.errors.forEach(error => console.log(`  - ${error}`));
        }
      }
    } catch (error) {
      console.log('❌ Network error:', error.message);
    }
  }
  
  console.log('\n🏁 All examples tested!');
}

// Export all examples
export const allExamples = {
  postgresDynamoExample,
  apiGatewayExample,
  mlPlatformExample
};

// Run tests if this file is executed directly
if (typeof window === 'undefined' && require.main === module) {
  testAllExamples().catch(console.error);
}
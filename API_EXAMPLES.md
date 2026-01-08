# Decision Support Tool - API Examples & Expected Outputs

This document provides comprehensive examples of how to use the Decision Support Tool API, including real-world scenarios and expected response formats.

## Table of Contents
- [PostgreSQL vs DynamoDB Example](#postgresql-vs-dynamodb-example)
- [API Gateway Comparison](#api-gateway-comparison)
- [Machine Learning Platform Selection](#machine-learning-platform-selection)
- [Response Format Specification](#response-format-specification)
- [Common Use Cases](#common-use-cases)

---

## PostgreSQL vs DynamoDB Example

### Scenario
Choosing between relational and NoSQL databases for a high-traffic web application that requires low latency and high scalability.

### Input Request

```json
{
  "options": [
    {
      "id": "postgresql-rds",
      "name": "Amazon RDS PostgreSQL",
      "features": {
        "cost_per_hour": 0.145,
        "read_latency_ms": 5,
        "write_latency_ms": 8,
        "max_connections": 5000,
        "scalability_score": 7,
        "query_flexibility": 10,
        "operational_overhead": 3,
        "backup_automation": true,
        "multi_region": false
      }
    },
    {
      "id": "dynamodb",
      "name": "Amazon DynamoDB",
      "features": {
        "cost_per_hour": 0.25,
        "read_latency_ms": 1,
        "write_latency_ms": 2,
        "max_connections": 40000,
        "scalability_score": 10,
        "query_flexibility": 6,
        "operational_overhead": 1,
        "backup_automation": true,
        "multi_region": true
      }
    },
    {
      "id": "postgresql-aurora",
      "name": "Amazon Aurora PostgreSQL",
      "features": {
        "cost_per_hour": 0.29,
        "read_latency_ms": 3,
        "write_latency_ms": 5,
        "max_connections": 15000,
        "scalability_score": 9,
        "query_flexibility": 10,
        "operational_overhead": 2,
        "backup_automation": true,
        "multi_region": true
      }
    }
  ],
  "constraints": [
    {
      "criteria": "cost_per_hour",
      "operator": "lte",
      "value": 0.30,
      "required": true
    },
    {
      "criteria": "read_latency_ms",
      "operator": "lte",
      "value": 10,
      "required": true
    },
    {
      "criteria": "backup_automation",
      "operator": "eq",
      "value": true,
      "required": false
    }
  ],
  "priorities": [
    {
      "criteria": "cost_per_hour",
      "weight": 0.25,
      "optimization": "minimize"
    },
    {
      "criteria": "read_latency_ms",
      "weight": 0.30,
      "optimization": "minimize"
    },
    {
      "criteria": "scalability_score",
      "weight": 0.25,
      "optimization": "maximize"
    },
    {
      "criteria": "query_flexibility",
      "weight": 0.20,
      "optimization": "maximize"
    }
  ],
  "settings": {
    "algorithm": "weighted_sum",
    "include_explanations": true,
    "max_results": 10
  }
}
```

### Expected Response

```json
{
  "status": "success",
  "timestamp": "2024-01-08T10:00:00.000Z",
  "results": {
    "rankedOptions": [
      {
        "optionId": "dynamodb",
        "name": "Amazon DynamoDB",
        "rank": 1,
        "totalScore": 87.5,
        "criteriaScores": {
          "cost_per_hour": {
            "score": 25.0,
            "normalizedValue": 0.75,
            "rawValue": 0.25
          },
          "read_latency_ms": {
            "score": 100.0,
            "normalizedValue": 0.0,
            "rawValue": 1
          },
          "scalability_score": {
            "score": 100.0,
            "normalizedValue": 1.0,
            "rawValue": 10
          },
          "query_flexibility": {
            "score": 50.0,
            "normalizedValue": 0.5,
            "rawValue": 6
          }
        },
        "reasons": [
          {
            "criteria": "cost_per_hour",
            "status": "negative",
            "explanation": "Amazon DynamoDB has high cost_per_hour ($0.250), which is above average compared to alternatives. This hurts its overall ranking.",
            "details": {
              "rawValue": 0.25,
              "formattedValue": "$0.250",
              "score": 25.0,
              "performanceLevel": "high",
              "comparison": "above average",
              "weightPercentage": 25
            },
            "impact": "negative",
            "weightContribution": 6.25
          },
          {
            "criteria": "read_latency_ms",
            "status": "positive",
            "explanation": "Amazon DynamoDB has excellent read_latency_ms (1), which is among the lowest compared to alternatives. This helps its overall ranking.",
            "details": {
              "rawValue": 1,
              "formattedValue": "1",
              "score": 100.0,
              "performanceLevel": "very low",
              "comparison": "among the lowest",
              "weightPercentage": 30
            },
            "impact": "positive",
            "weightContribution": 30.0
          }
        ],
        "constraintCompliance": {
          "passed": true,
          "failedConstraints": [],
          "constraintReasons": [
            {
              "criteria": "cost_per_hour",
              "status": "passed",
              "explanation": "Amazon DynamoDB cost_per_hour ($0.250) meets the required requirement of being less than or equal to $0.300",
              "required": true,
              "actualValue": 0.25,
              "constraintValue": 0.30,
              "operator": "lte"
            }
          ]
        },
        "tradeOffs": {
          "strengths": [
            "Strong read_latency_ms: 1 (very low)",
            "Strong scalability_score: 10 (excellent)"
          ],
          "weaknesses": [
            "Weak cost_per_hour: $0.250 (high)",
            "Weak query_flexibility: 6 (below average)"
          ],
          "keyDifferentiators": [
            "superior read_latency_ms: 1 vs competitors",
            "superior scalability_score: 10 vs competitors",
            "Top overall recommendation based on your priorities"
          ]
        }
      }
    ],
    "summary": {
      "totalOptionsEvaluated": 3,
      "optionsMeetingConstraints": 3,
      "topRecommendation": {
        "optionId": "dynamodb",
        "confidence": 0.85,
        "reasoning": "Scored 87.5/100 overall. Clear leader with 12.3 point advantage. Key strength: strong read_latency_ms: 1 (very low)."
      }
    },
    "explanations": {
      "methodology": "Used weighted_sum algorithm with user-defined priority weights. Each option scored 0-100 per criteria, then weighted by importance.",
      "scoringBreakdown": "Criteria weights: cost_per_hour (25%), read_latency_ms (30%), scalability_score (25%), query_flexibility (20%)",
      "tradeOffAnalysis": "Strengths and weaknesses identified by comparing scores across criteria. Key differentiators highlight significant performance gaps."
    }
  },
  "metadata": {
    "processing_time_ms": 45,
    "algorithm_used": "weighted_sum",
    "data_freshness": "2024-01-08T10:00:00.000Z",
    "input_summary": {
      "optionsCount": 3,
      "constraintsCount": 3,
      "prioritiesCount": 4
    }
  }
}
```

### Key Insights from This Example

**Winner: Amazon DynamoDB (87.5/100)**
- **Strengths**: Exceptional latency (1ms reads) and perfect scalability
- **Weaknesses**: Higher cost and limited query flexibility
- **Best for**: High-traffic applications prioritizing speed over complex queries

---

## API Gateway Comparison

### Scenario
Selecting an API gateway solution balancing performance, cost, and vendor independence.

### Input Request

```json
{
  "options": [
    {
      "id": "aws-api-gateway",
      "name": "AWS API Gateway",
      "features": {
        "cost_per_million_requests": 3.50,
        "latency_ms": 25,
        "rate_limit_rps": 10000,
        "auth_methods": 5,
        "monitoring_features": 8,
        "deployment_complexity": 4,
        "vendor_lock_in": 7
      }
    },
    {
      "id": "kong-gateway",
      "name": "Kong API Gateway",
      "features": {
        "cost_per_million_requests": 0.00,
        "latency_ms": 15,
        "rate_limit_rps": 50000,
        "auth_methods": 8,
        "monitoring_features": 6,
        "deployment_complexity": 7,
        "vendor_lock_in": 2
      }
    },
    {
      "id": "nginx-plus",
      "name": "NGINX Plus",
      "features": {
        "cost_per_million_requests": 1.50,
        "latency_ms": 10,
        "rate_limit_rps": 100000,
        "auth_methods": 4,
        "monitoring_features": 7,
        "deployment_complexity": 8,
        "vendor_lock_in": 3
      }
    }
  ],
  "constraints": [
    {
      "criteria": "cost_per_million_requests",
      "operator": "lte",
      "value": 5.00,
      "required": true
    },
    {
      "criteria": "latency_ms",
      "operator": "lte",
      "value": 50,
      "required": true
    }
  ],
  "priorities": [
    {
      "criteria": "latency_ms",
      "weight": 0.35,
      "optimization": "minimize"
    },
    {
      "criteria": "cost_per_million_requests",
      "weight": 0.25,
      "optimization": "minimize"
    },
    {
      "criteria": "rate_limit_rps",
      "weight": 0.20,
      "optimization": "maximize"
    },
    {
      "criteria": "vendor_lock_in",
      "weight": 0.20,
      "optimization": "minimize"
    }
  ]
}
```

### Expected Winner
**NGINX Plus** would likely win due to:
- Lowest latency (10ms)
- Highest rate limits (100k RPS)
- Moderate cost and vendor lock-in
- Strong overall performance balance

---

## Response Format Specification

### Top-Level Structure
```json
{
  "status": "success|error",
  "timestamp": "ISO8601 timestamp",
  "results": { /* Results object */ },
  "metadata": { /* Processing metadata */ }
}
```

### Results Object
```json
{
  "rankedOptions": [
    {
      "optionId": "string",
      "name": "string", 
      "rank": "number (1-based)",
      "totalScore": "number (0-100)",
      "criteriaScores": { /* Per-criteria breakdown */ },
      "reasons": [ /* Plain-English explanations */ ],
      "constraintCompliance": { /* Constraint pass/fail */ },
      "tradeOffs": { /* Strengths/weaknesses analysis */ }
    }
  ],
  "summary": {
    "totalOptionsEvaluated": "number",
    "optionsMeetingConstraints": "number", 
    "topRecommendation": {
      "optionId": "string",
      "confidence": "number (0-1)",
      "reasoning": "string"
    }
  },
  "explanations": {
    "methodology": "string",
    "scoringBreakdown": "string",
    "tradeOffAnalysis": "string"
  }
}
```

### Criteria Scores Format
```json
{
  "criteria_name": {
    "score": "number (0-100)",
    "normalizedValue": "number (0-1)",
    "rawValue": "original value from input"
  }
}
```

### Reasons Format
```json
{
  "criteria": "string",
  "status": "positive|negative|neutral",
  "explanation": "Human-readable explanation",
  "details": {
    "rawValue": "original value",
    "formattedValue": "display-friendly value",
    "score": "number (0-100)",
    "performanceLevel": "excellent|good|average|below average|poor",
    "comparison": "among the highest|above average|near average|below average|among the lowest",
    "weightPercentage": "number (0-100)"
  },
  "impact": "positive|negative|neutral",
  "weightContribution": "number (contribution to total score)"
}
```

---

## Common Use Cases

### 1. Technology Stack Selection
- **Frontend Frameworks**: React vs Vue vs Angular
- **Backend Languages**: Node.js vs Python vs Go
- **Databases**: SQL vs NoSQL options
- **Cloud Providers**: AWS vs GCP vs Azure

### 2. Vendor Evaluation
- **SaaS Tools**: CRM, Analytics, Monitoring solutions
- **Infrastructure**: CDN, Load balancers, Security tools
- **Development Tools**: CI/CD, Testing, Deployment platforms

### 3. Architecture Decisions
- **Microservices vs Monolith**
- **Container Orchestration**: Kubernetes vs Docker Swarm
- **Message Queues**: RabbitMQ vs Apache Kafka vs AWS SQS

### 4. Performance vs Cost Trade-offs
- **Instance Types**: Compute-optimized vs Memory-optimized
- **Storage Options**: SSD vs HDD vs Object storage
- **Network Solutions**: Dedicated vs Shared bandwidth

---

## Testing the Examples

Use the provided test files to validate the API:

```bash
# Test the PostgreSQL vs DynamoDB example
node src/test-examples.js

# Test all validation scenarios  
node src/validation-tests.js

# Test the refactored API structure
node src/test-api.js
```

Each test provides detailed output showing:
- Request/response validation
- Processing times
- Score breakdowns
- Trade-off analysis
- Constraint compliance

The Decision Support Tool provides transparent, explainable recommendations that help teams make informed technical decisions with confidence.
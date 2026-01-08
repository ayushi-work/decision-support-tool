# Decision Support Tool

A web-based application for making informed technical decisions by comparing multiple options based on user-defined constraints and weighted priorities. Unlike simple recommendation engines, this tool provides transparent, explainable analysis that helps teams understand trade-offs and make confident choices.

## 🎯 What This Tool Does

The Decision Support Tool helps you systematically evaluate and compare technical alternatives (databases, cloud services, frameworks, APIs, etc.) by:

- **Filtering options** based on hard requirements (constraints)
- **Scoring alternatives** using weighted criteria that matter to your use case
- **Providing explanations** for why each option scored as it did
- **Highlighting trade-offs** between competing alternatives
- **Generating confidence scores** for recommendations

### Real-World Example

Choosing between PostgreSQL and DynamoDB for a high-traffic application:

**Input**: Cost, latency, scalability priorities with budget constraints
**Output**: DynamoDB wins (87.5/100) due to exceptional latency (1ms) and scalability, despite higher cost
**Insight**: "Best for speed-critical applications where query flexibility can be sacrificed"

## 🤔 Decision Support vs Recommendations

| **Traditional Recommendations** | **Decision Support** |
|--------------------------------|---------------------|
| "Buy this product" | "Here's why option A beats option B" |
| Black box algorithms | Transparent scoring methodology |
| One-size-fits-all | Customized to your priorities |
| Simple rankings | Detailed trade-off analysis |
| Trust the algorithm | Understand the reasoning |

**Decision Support** empowers you to:
- Understand **why** something is recommended
- Adjust priorities and see how rankings change
- Identify **trade-offs** between alternatives
- Make **defensible** choices in team discussions
- Learn from the analysis process

## 🚀 Features

- **Multi-Criteria Analysis**: Compare options across multiple dimensions
- **Flexible Constraints**: Set hard requirements (budget, performance, compliance)
- **Weighted Priorities**: Define what matters most to your specific use case
- **Plain-English Explanations**: Understand exactly why each option scored as it did
- **Trade-off Visualization**: See strengths, weaknesses, and key differentiators
- **Side-by-Side Comparison**: Visual comparison interface for easy analysis
- **Production-Ready API**: Clean, modular backend with comprehensive validation

## 🏗️ Architecture

```
Frontend (Next.js)     Backend API           Analysis Engine
├── Input Forms   →    ├── Validation   →    ├── Constraint Filtering
├── Sample Data        ├── Processing        ├── Weighted Scoring  
└── Results UI         └── Response          └── Trade-off Analysis
```

**Modular Backend Structure:**
- `src/lib/validation.js` - Input validation with detailed error messages
- `src/lib/scoring.js` - Constraint filtering & weighted scoring algorithms
- `src/lib/analysis.js` - Trade-off analysis & insights generation
- `src/lib/utils.js` - Utility functions & data manipulation helpers

## 🛠️ Getting Started

### Prerequisites

- Node.js 16+ and npm
- Modern web browser

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd decision-support-tool
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Quick Test

1. Click **"PostgreSQL vs DynamoDB"** to load a sample comparison
2. Review the pre-filled options, constraints, and priorities
3. Click **"Get Recommendations"** to see the analysis
4. Explore the side-by-side results with explanations

## 📊 Example Usage

### API Request

**POST** `/api/recommend`

```json
{
  "options": [
    {
      "id": "postgresql-rds",
      "name": "Amazon RDS PostgreSQL",
      "features": {
        "cost_per_hour": 0.145,
        "read_latency_ms": 5,
        "scalability_score": 7,
        "query_flexibility": 10
      }
    },
    {
      "id": "dynamodb",
      "name": "Amazon DynamoDB", 
      "features": {
        "cost_per_hour": 0.25,
        "read_latency_ms": 1,
        "scalability_score": 10,
        "query_flexibility": 6
      }
    }
  ],
  "constraints": [
    {
      "criteria": "cost_per_hour",
      "operator": "lte",
      "value": 0.30,
      "required": true
    }
  ],
  "priorities": [
    {
      "criteria": "read_latency_ms",
      "weight": 0.40,
      "optimization": "minimize"
    },
    {
      "criteria": "scalability_score", 
      "weight": 0.35,
      "optimization": "maximize"
    },
    {
      "criteria": "cost_per_hour",
      "weight": 0.25,
      "optimization": "minimize"
    }
  ]
}
```

### API Response

```json
{
  "status": "success",
  "results": {
    "rankedOptions": [
      {
        "optionId": "dynamodb",
        "name": "Amazon DynamoDB",
        "rank": 1,
        "totalScore": 87.5,
        "reasons": [
          {
            "criteria": "read_latency_ms",
            "explanation": "Amazon DynamoDB has excellent read_latency_ms (1), which is among the lowest compared to alternatives. This helps its overall ranking.",
            "impact": "positive",
            "weightContribution": 40.0
          }
        ],
        "tradeOffs": {
          "strengths": ["Strong read_latency_ms: 1 (very low)"],
          "weaknesses": ["Weak cost_per_hour: $0.250 (high)"],
          "keyDifferentiators": ["superior read_latency_ms: 1 vs competitors"]
        }
      }
    ],
    "summary": {
      "topRecommendation": {
        "optionId": "dynamodb",
        "confidence": 0.85,
        "reasoning": "Scored 87.5/100 overall. Clear leader with 12.3 point advantage. Key strength: exceptional latency performance."
      }
    }
  }
}
```

## 🎮 Sample Scenarios

The tool includes 5 pre-built comparison scenarios:

1. **PostgreSQL vs DynamoDB** - Database selection for high-traffic apps
2. **Database Comparison** - Traditional database options
3. **Cloud Providers** - AWS vs GCP vs Azure compute instances  
4. **API Gateways** - Managed vs self-hosted gateway solutions
5. **ML Platforms** - SageMaker vs Vertex AI vs Databricks

Each scenario demonstrates different aspects:
- Cost vs performance trade-offs
- Vendor lock-in considerations
- Scalability requirements
- Operational complexity factors

## 🧪 Testing

### Run Test Suites

```bash
# Test all example scenarios
node src/test-examples.js

# Test input validation
node src/validation-tests.js

# Test API functionality  
node src/test-api.js
```

### Manual Testing

1. **Valid Input Test**: Use sample data buttons to test successful requests
2. **Validation Test**: Try submitting incomplete forms to see error handling
3. **Edge Cases**: Test with single option, zero weights, missing criteria

## 🔧 Configuration

### Supported Constraint Operators

- `lte` - Less than or equal (≤)
- `lt` - Less than (<)
- `gte` - Greater than or equal (≥)  
- `gt` - Greater than (>)
- `eq` - Equal to (=)
- `neq` - Not equal to (≠)
- `in` - Value in array
- `contains` - String contains substring

### Optimization Types

- `minimize` - Lower values are better (cost, latency, complexity)
- `maximize` - Higher values are better (performance, features, reliability)

### Algorithm Settings

```json
{
  "algorithm": "weighted_sum",        // Currently supported: weighted_sum
  "include_explanations": true,       // Generate detailed explanations
  "max_results": 10                   // Limit number of results returned
}
```

## 🏢 Use Cases

### Technology Selection
- **Frontend Frameworks**: React vs Vue vs Angular
- **Databases**: SQL vs NoSQL options with specific requirements
- **Cloud Services**: Comparing AWS, GCP, Azure offerings
- **Development Tools**: CI/CD platforms, monitoring solutions

### Vendor Evaluation  
- **SaaS Platforms**: CRM, analytics, security tools
- **Infrastructure**: CDN providers, load balancers
- **APIs**: Payment processors, mapping services, communication platforms

### Architecture Decisions
- **Deployment Strategies**: Containers vs serverless vs VMs
- **Data Storage**: Object storage vs block storage vs databases
- **Integration Patterns**: REST vs GraphQL vs message queues

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- **Modular Code**: Keep validation, scoring, and analysis separate
- **Comprehensive Tests**: Add test cases for new features
- **Clear Documentation**: Update README and API docs
- **Error Handling**: Provide helpful error messages

## 📝 API Documentation

### Request Format

```typescript
interface ComparisonRequest {
  options: Array<{
    id: string;
    name: string;
    features: Record<string, any>;
  }>;
  constraints: Array<{
    criteria: string;
    operator: 'lt' | 'lte' | 'gt' | 'gte' | 'eq' | 'neq' | 'in' | 'contains';
    value: any;
    required?: boolean;
  }>;
  priorities: Array<{
    criteria: string;
    weight: number; // 0-1, must sum to 1.0
    optimization: 'minimize' | 'maximize';
  }>;
  settings?: {
    algorithm?: string;
    include_explanations?: boolean;
    max_results?: number;
  };
}
```

### Response Format

```typescript
interface ComparisonResponse {
  status: 'success' | 'error';
  timestamp: string;
  results: {
    rankedOptions: Array<{
      optionId: string;
      name: string;
      rank: number;
      totalScore: number;
      criteriaScores: Record<string, {
        score: number;
        normalizedValue: number;
        rawValue: any;
      }>;
      reasons: Array<{
        criteria: string;
        explanation: string;
        impact: 'positive' | 'negative' | 'neutral';
        weightContribution: number;
      }>;
      tradeOffs: {
        strengths: string[];
        weaknesses: string[];
        keyDifferentiators: string[];
      };
    }>;
    summary: {
      totalOptionsEvaluated: number;
      optionsMeetingConstraints: number;
      topRecommendation: {
        optionId: string;
        confidence: number;
        reasoning: string;
      };
    };
  };
  metadata: {
    processing_time_ms: number;
    algorithm_used: string;
    input_summary: {
      optionsCount: number;
      constraintsCount: number;
      prioritiesCount: number;
    };
  };
}
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

- **Documentation**: See [API_EXAMPLES.md](API_EXAMPLES.md) for detailed examples
- **Issues**: Report bugs and request features via GitHub Issues
- **Discussions**: Join conversations about use cases and improvements

---

**Built for teams who need to make informed technical decisions with confidence and transparency.**
// Sample data for quick testing
export const sampleDatabaseComparison = {
  options: [
    {
      id: "postgres-rds",
      name: "Amazon RDS PostgreSQL",
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
  ]
};

// PostgreSQL vs DynamoDB comparison example
export const samplePostgresDynamoComparison = {
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
  ]
};

export const sampleCloudComparison = {
  options: [
    {
      id: "aws-ec2",
      name: "AWS EC2",
      features: {
        cost_per_hour: 0.096,
        cpu_cores: 4,
        memory_gb: 16,
        network_performance: 10,
        availability_zones: 3,
        managed_services: 200
      }
    },
    {
      id: "gcp-compute",
      name: "Google Compute Engine", 
      features: {
        cost_per_hour: 0.089,
        cpu_cores: 4,
        memory_gb: 15,
        network_performance: 10,
        availability_zones: 3,
        managed_services: 150
      }
    },
    {
      id: "azure-vm",
      name: "Azure Virtual Machine",
      features: {
        cost_per_hour: 0.092,
        cpu_cores: 4,
        memory_gb: 16,
        network_performance: 8,
        availability_zones: 3,
        managed_services: 180
      }
    }
  ],
  constraints: [
    {
      criteria: "cost_per_hour",
      operator: "lte",
      value: 0.10,
      required: true
    },
    {
      criteria: "memory_gb",
      operator: "gte",
      value: 15,
      required: true
    }
  ],
  priorities: [
    {
      criteria: "cost_per_hour",
      weight: 0.4,
      optimization: "minimize"
    },
    {
      criteria: "network_performance",
      weight: 0.3,
      optimization: "maximize"
    },
    {
      criteria: "managed_services",
      weight: 0.3,
      optimization: "maximize"
    }
  ]
};

// API Gateway comparison example
export const sampleApiGatewayComparison = {
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
        cost_per_million_requests: 0.00, // Open source
        latency_ms: 15,
        rate_limit_rps: 50000,
        auth_methods: 8,
        monitoring_features: 6,
        deployment_complexity: 7,
        vendor_lock_in: 2
      }
    },
    {
      id: "azure-api-management",
      name: "Azure API Management",
      features: {
        cost_per_million_requests: 4.20,
        latency_ms: 30,
        rate_limit_rps: 8000,
        auth_methods: 6,
        monitoring_features: 9,
        deployment_complexity: 5,
        vendor_lock_in: 8
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
    },
    {
      criteria: "rate_limit_rps",
      operator: "gte",
      value: 5000,
      required: false
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
};

// Machine Learning Platform comparison
export const sampleMLPlatformComparison = {
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
      id: "azure-ml",
      name: "Azure Machine Learning",
      features: {
        cost_per_hour: 0.480,
        model_training_speed: 7,
        pre_built_algorithms: 20,
        auto_scaling: true,
        notebook_integration: 7,
        deployment_options: 6,
        learning_curve: 5
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
};
/**
 * Scoring engine for the recommendation system
 * Handles constraint filtering, normalization, and weighted scoring
 */

import { getNestedValue, setNestedValue } from './utils.js';

/**
 * Main scoring function that processes options through the complete pipeline
 * @param {Array} options - Array of option objects
 * @param {Array} constraints - Array of constraint objects
 * @param {Array} priorities - Array of priority objects with weights
 * @param {Object} settings - Algorithm settings
 * @returns {Object} Scoring results with ranked options
 */
export function scoreOptions(options, constraints, priorities, settings = {}) {
  // Step 1: Apply constraints to filter valid options
  const constraintResults = applyConstraints(options, constraints);
  const validOptions = constraintResults.validOptions;

  if (validOptions.length === 0) {
    return {
      rankedOptions: [],
      summary: {
        totalOptionsEvaluated: options.length,
        optionsMeetingConstraints: 0,
        topRecommendation: null
      },
      constraintResults: constraintResults.allResults
    };
  }

  // Step 2: Calculate normalized scores for valid options
  const scoredOptions = calculateWeightedScores(validOptions, priorities);

  // Step 3: Rank options by total score (descending)
  const rankedOptions = scoredOptions
    .sort((a, b) => b.totalScore - a.totalScore)
    .map((option, index) => ({
      ...option,
      rank: index + 1
    }));

  // Step 4: Apply max results limit if specified
  const limitedResults = settings.max_results 
    ? rankedOptions.slice(0, settings.max_results)
    : rankedOptions;

  return {
    rankedOptions: limitedResults,
    summary: {
      totalOptionsEvaluated: options.length,
      optionsMeetingConstraints: validOptions.length,
      topRecommendation: limitedResults.length > 0 ? limitedResults[0] : null
    },
    constraintResults: constraintResults.allResults
  };
}

/**
 * Applies constraints to filter options and generate compliance reports
 * @param {Array} options - Array of option objects
 * @param {Array} constraints - Array of constraint objects
 * @returns {Object} Results with valid options and constraint compliance data
 */
export function applyConstraints(options, constraints) {
  const validOptions = [];
  const allResults = {};

  for (const option of options) {
    const constraintReasons = [];
    const failedConstraints = [];
    let passesAllConstraints = true;

    // Evaluate each constraint for this option
    for (const constraint of constraints) {
      const passes = evaluateConstraint(option, constraint);
      const reason = generateConstraintReason(option, constraint, passes);
      constraintReasons.push(reason);

      if (!passes) {
        failedConstraints.push(constraint.criteria);
        if (constraint.required !== false) {
          passesAllConstraints = false;
        }
      }
    }

    // Store constraint results
    const complianceResult = {
      passed: passesAllConstraints,
      failedConstraints,
      constraintReasons
    };

    allResults[option.id] = complianceResult;

    // Add to valid options if passes all required constraints
    if (passesAllConstraints) {
      validOptions.push({
        ...option,
        constraintCompliance: complianceResult
      });
    }
  }

  return {
    validOptions,
    allResults
  };
}

/**
 * Evaluates a single constraint against an option
 * @param {Object} option - The option to evaluate
 * @param {Object} constraint - The constraint to check
 * @returns {boolean} Whether the constraint passes
 */
function evaluateConstraint(option, constraint) {
  const value = getNestedValue(option.features, constraint.criteria);
  
  if (value === undefined || value === null) {
    return false;
  }

  const constraintValue = constraint.value;

  switch (constraint.operator) {
    case 'lt':
      return Number(value) < Number(constraintValue);
    case 'lte':
      return Number(value) <= Number(constraintValue);
    case 'gt':
      return Number(value) > Number(constraintValue);
    case 'gte':
      return Number(value) >= Number(constraintValue);
    case 'eq':
      return value === constraintValue;
    case 'neq':
      return value !== constraintValue;
    case 'in':
      return Array.isArray(constraintValue) && constraintValue.includes(value);
    case 'contains':
      return String(value).toLowerCase().includes(String(constraintValue).toLowerCase());
    default:
      return false;
  }
}

/**
 * Calculates weighted scores for all valid options
 * @param {Array} options - Array of valid option objects
 * @param {Array} priorities - Array of priority objects with weights
 * @returns {Array} Options with calculated scores and reasons
 */
export function calculateWeightedScores(options, priorities) {
  // First normalize all criteria values across options
  const normalizedOptions = normalizeOptionValues(options, priorities);
  
  // Calculate statistics for explanation generation
  const criteriaStats = calculateCriteriaStatistics(options, priorities);

  return normalizedOptions.map(option => {
    const criteriaScores = {};
    const reasons = [];
    let totalScore = 0;

    // Calculate score for each priority criteria
    for (const priority of priorities) {
      const result = calculateCriteriaScore(option, priority, criteriaStats);
      
      if (result.success) {
        criteriaScores[priority.criteria] = {
          score: result.score,
          normalizedValue: result.normalizedValue,
          rawValue: result.rawValue
        };

        reasons.push(result.reason);
        totalScore += result.score * priority.weight;
      } else {
        // Handle missing data
        reasons.push({
          criteria: priority.criteria,
          status: 'missing_data',
          explanation: `No ${priority.criteria} data available for ${option.name}`,
          impact: 'neutral',
          weightContribution: 0
        });
      }
    }

    return {
      optionId: option.id,
      name: option.name,
      totalScore: Math.round(totalScore * 100) / 100,
      criteriaScores,
      reasons,
      constraintCompliance: option.constraintCompliance || { 
        passed: true, 
        failedConstraints: [],
        constraintReasons: []
      }
    };
  });
}

/**
 * Calculates score for a single criteria
 * @param {Object} option - The option being scored
 * @param {Object} priority - The priority criteria with weight and optimization
 * @param {Object} criteriaStats - Statistics for all criteria
 * @returns {Object} Score calculation result
 */
function calculateCriteriaScore(option, priority, criteriaStats) {
  const normalizedValue = getNestedValue(option.normalizedFeatures, priority.criteria);
  const rawValue = getNestedValue(option.features, priority.criteria);

  if (normalizedValue === undefined || rawValue === undefined) {
    return { success: false };
  }

  // Convert normalized value (0-1) to score (0-100)
  let score = normalizedValue * 100;
  
  // Apply optimization direction
  if (priority.optimization === 'minimize') {
    score = 100 - score;
  }

  // Generate explanation
  const reason = generateCriteriaReason(
    priority, 
    rawValue, 
    score, 
    criteriaStats[priority.criteria],
    option.name
  );

  return {
    success: true,
    score: Math.round(score * 100) / 100,
    normalizedValue,
    rawValue,
    reason
  };
}

/**
 * Normalizes option values across all criteria for fair comparison
 * @param {Array} options - Array of option objects
 * @param {Array} priorities - Array of priority objects
 * @returns {Array} Options with normalized feature values
 */
function normalizeOptionValues(options, priorities) {
  const criteriaRanges = {};

  // Calculate min/max ranges for each criteria
  for (const priority of priorities) {
    const values = options
      .map(option => getNestedValue(option.features, priority.criteria))
      .filter(val => val !== undefined && val !== null)
      .map(val => Number(val))
      .filter(val => !isNaN(val));

    if (values.length > 0) {
      criteriaRanges[priority.criteria] = {
        min: Math.min(...values),
        max: Math.max(...values),
        range: Math.max(...values) - Math.min(...values)
      };
    }
  }

  // Normalize each option's values
  return options.map(option => {
    const normalizedFeatures = JSON.parse(JSON.stringify(option.features));

    for (const priority of priorities) {
      const rawValue = getNestedValue(option.features, priority.criteria);
      const range = criteriaRanges[priority.criteria];

      if (rawValue !== undefined && range && range.range > 0) {
        const normalizedValue = (Number(rawValue) - range.min) / range.range;
        setNestedValue(normalizedFeatures, priority.criteria, normalizedValue);
      }
    }

    return {
      ...option,
      normalizedFeatures
    };
  });
}

/**
 * Calculates statistical information for criteria explanations
 * @param {Array} options - Array of option objects
 * @param {Array} priorities - Array of priority objects
 * @returns {Object} Statistics for each criteria
 */
function calculateCriteriaStatistics(options, priorities) {
  const stats = {};
  
  for (const priority of priorities) {
    const values = options
      .map(option => getNestedValue(option.features, priority.criteria))
      .filter(val => val !== undefined && val !== null)
      .map(val => Number(val))
      .filter(val => !isNaN(val));

    if (values.length > 0) {
      const sorted = [...values].sort((a, b) => a - b);
      stats[priority.criteria] = {
        min: Math.min(...values),
        max: Math.max(...values),
        avg: values.reduce((sum, val) => sum + val, 0) / values.length,
        median: sorted[Math.floor(sorted.length / 2)],
        count: values.length
      };
    }
  }
  
  return stats;
}

/**
 * Generates human-readable explanation for constraint evaluation
 * @param {Object} option - The option being evaluated
 * @param {Object} constraint - The constraint being checked
 * @param {boolean} passes - Whether the constraint passes
 * @returns {Object} Constraint reason object
 */
function generateConstraintReason(option, constraint, passes) {
  const value = getNestedValue(option.features, constraint.criteria);
  const formattedValue = formatDisplayValue(value, constraint.criteria);
  const formattedConstraintValue = formatDisplayValue(constraint.value, constraint.criteria);
  
  const operatorText = {
    'lt': 'less than',
    'lte': 'less than or equal to',
    'gt': 'greater than',
    'gte': 'greater than or equal to',
    'eq': 'equal to',
    'neq': 'not equal to',
    'in': 'one of',
    'contains': 'containing'
  };

  const operator = operatorText[constraint.operator] || constraint.operator;
  const status = passes ? 'passed' : 'failed';
  const requiredText = constraint.required !== false ? 'required' : 'optional';
  
  let explanation;
  if (value === undefined || value === null) {
    explanation = `${option.name} has no ${constraint.criteria} data available for ${requiredText} constraint`;
  } else {
    explanation = `${option.name} ${constraint.criteria} (${formattedValue}) ${passes ? 'meets' : 'does not meet'} the ${requiredText} requirement of being ${operator} ${formattedConstraintValue}`;
  }

  return {
    criteria: constraint.criteria,
    status,
    explanation,
    required: constraint.required !== false,
    actualValue: value,
    constraintValue: constraint.value,
    operator: constraint.operator
  };
}

/**
 * Generates human-readable explanation for criteria scoring
 * @param {Object} priority - Priority object with criteria and optimization
 * @param {*} rawValue - Raw value from option features
 * @param {number} score - Calculated score (0-100)
 * @param {Object} stats - Statistical information for this criteria
 * @param {string} optionName - Name of the option
 * @returns {Object} Criteria reason object
 */
function generateCriteriaReason(priority, rawValue, score, stats, optionName) {
  const criteria = priority.criteria;
  const weight = Math.round(priority.weight * 100);
  const isMinimize = priority.optimization === 'minimize';
  
  // Determine performance level
  let performanceLevel, comparison, impact;
  
  if (score >= 80) {
    performanceLevel = isMinimize ? 'very low' : 'excellent';
    impact = 'positive';
  } else if (score >= 60) {
    performanceLevel = isMinimize ? 'low' : 'good';
    impact = 'positive';
  } else if (score >= 40) {
    performanceLevel = 'average';
    impact = 'neutral';
  } else if (score >= 20) {
    performanceLevel = isMinimize ? 'high' : 'below average';
    impact = 'negative';
  } else {
    performanceLevel = isMinimize ? 'very high' : 'poor';
    impact = 'negative';
  }

  // Generate comparison to other options
  if (stats && stats.count > 1) {
    const percentile = calculatePercentile(rawValue, stats, isMinimize);
    if (percentile >= 80) {
      comparison = isMinimize ? 'among the lowest' : 'among the highest';
    } else if (percentile >= 60) {
      comparison = isMinimize ? 'below average' : 'above average';
    } else if (percentile >= 40) {
      comparison = 'near average';
    } else {
      comparison = isMinimize ? 'above average' : 'below average';
    }
  } else {
    comparison = 'only option available';
  }

  const formattedValue = formatDisplayValue(rawValue, criteria);
  const weightContribution = Math.round(score * priority.weight * 100) / 100;

  return {
    criteria,
    status: impact,
    explanation: `${optionName} has ${performanceLevel} ${criteria} (${formattedValue}), which is ${comparison} compared to alternatives. This ${impact === 'positive' ? 'helps' : impact === 'negative' ? 'hurts' : 'neutrally affects'} its overall ranking.`,
    details: {
      rawValue,
      formattedValue,
      score: Math.round(score * 100) / 100,
      performanceLevel,
      comparison,
      weightPercentage: weight
    },
    impact,
    weightContribution
  };
}

/**
 * Calculates percentile ranking for a value within a dataset
 * @param {number} value - The value to rank
 * @param {Object} stats - Statistical information
 * @param {boolean} isMinimize - Whether lower values are better
 * @returns {number} Percentile (0-100)
 */
function calculatePercentile(value, stats, isMinimize) {
  const range = stats.max - stats.min;
  if (range === 0) return 50; // All values are the same
  
  let percentile = ((value - stats.min) / range) * 100;
  
  // For minimize criteria, invert the percentile
  if (isMinimize) {
    percentile = 100 - percentile;
  }
  
  return Math.max(0, Math.min(100, percentile));
}

/**
 * Formats values for human-readable display
 * @param {*} value - The value to format
 * @param {string} criteria - The criteria name for context
 * @returns {string} Formatted value
 */
function formatDisplayValue(value, criteria) {
  if (typeof value === 'number') {
    // Handle common criteria formatting
    if (criteria.includes('cost') || criteria.includes('price')) {
      return `$${value.toFixed(3)}`;
    } else if (criteria.includes('percent') || criteria.includes('reliability') || criteria.includes('uptime')) {
      return `${value}%`;
    } else if (criteria.includes('performance') || criteria.includes('iops')) {
      return value.toLocaleString();
    } else if (value < 1) {
      return value.toFixed(3);
    } else if (value < 100) {
      return value.toFixed(1);
    } else {
      return Math.round(value).toLocaleString();
    }
  }
  
  return String(value);
}
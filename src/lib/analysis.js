/**
 * Analysis and insights generation for recommendation results
 * Handles trade-off analysis, summary generation, and recommendation reasoning
 */

import { average, roundToDecimals } from './utils.js';

/**
 * Generates comprehensive trade-off analysis for ranked options
 * @param {Array} rankedOptions - Array of scored and ranked options
 * @param {Array} priorities - Array of priority objects with weights
 * @returns {Array} Options enhanced with trade-off analysis
 */
export function generateTradeOffAnalysis(rankedOptions, priorities) {
  if (!rankedOptions || rankedOptions.length === 0) {
    return [];
  }

  return rankedOptions.map(option => {
    const tradeOffs = analyzeOptionTradeOffs(option, rankedOptions, priorities);
    
    return {
      ...option,
      tradeOffs
    };
  });
}

/**
 * Analyzes trade-offs for a single option
 * @param {Object} option - The option to analyze
 * @param {Array} allOptions - All ranked options for comparison
 * @param {Array} priorities - Priority criteria with weights
 * @returns {Object} Trade-off analysis object
 */
function analyzeOptionTradeOffs(option, allOptions, priorities) {
  const strengths = [];
  const weaknesses = [];
  const keyDifferentiators = [];

  // Analyze reasons for insights
  const positiveReasons = option.reasons.filter(r => r.impact === 'positive');
  const negativeReasons = option.reasons.filter(r => r.impact === 'negative');
  
  // Extract top strengths from reasons
  positiveReasons
    .sort((a, b) => b.weightContribution - a.weightContribution)
    .slice(0, 3)
    .forEach(reason => {
      strengths.push(`Strong ${reason.criteria}: ${reason.details.formattedValue} (${reason.details.performanceLevel})`);
    });

  // Extract top weaknesses from reasons  
  negativeReasons
    .sort((a, b) => b.weightContribution - a.weightContribution)
    .slice(0, 3)
    .forEach(reason => {
      weaknesses.push(`Weak ${reason.criteria}: ${reason.details.formattedValue} (${reason.details.performanceLevel})`);
    });

  // Find differentiators (scores significantly different from average)
  for (const [criteria, scoreData] of Object.entries(option.criteriaScores)) {
    const score = scoreData.score;
    const avgScore = calculateAverageScore(allOptions, criteria);
    
    if (Math.abs(score - avgScore) > 20) {
      const direction = score > avgScore ? 'superior' : 'inferior';
      const reason = option.reasons.find(r => r.criteria === criteria);
      if (reason) {
        keyDifferentiators.push(`${direction} ${criteria}: ${reason.details.formattedValue} vs competitors`);
      }
    }
  }

  // Add contextual insights
  if (option.rank === 1) {
    keyDifferentiators.push('Top overall recommendation based on your priorities');
  } else if (option.rank <= 3) {
    keyDifferentiators.push(`Ranked #${option.rank} among viable options`);
  }

  // Add constraint compliance insights
  if (option.constraintCompliance && option.constraintCompliance.constraintReasons) {
    const failedOptionalConstraints = option.constraintCompliance.constraintReasons
      .filter(r => r.status === 'failed' && !r.required);
    
    if (failedOptionalConstraints.length > 0) {
      keyDifferentiators.push(`Fails ${failedOptionalConstraints.length} optional constraint(s)`);
    }
  }

  return {
    strengths: strengths.slice(0, 3),
    weaknesses: weaknesses.slice(0, 3), 
    keyDifferentiators: keyDifferentiators.slice(0, 4)
  };
}

/**
 * Generates summary insights for the overall comparison
 * @param {Object} scoringResults - Results from the scoring engine
 * @param {Array} originalOptions - Original options before filtering
 * @returns {Object} Summary object with key insights
 */
export function generateSummary(scoringResults, originalOptions) {
  const { rankedOptions, summary: scoringSummary } = scoringResults;
  const topOption = rankedOptions.length > 0 ? rankedOptions[0] : null;
  
  const summary = {
    totalOptionsEvaluated: scoringSummary.totalOptionsEvaluated,
    optionsMeetingConstraints: scoringSummary.optionsMeetingConstraints,
    topRecommendation: null
  };

  if (topOption) {
    summary.topRecommendation = {
      optionId: topOption.optionId,
      confidence: calculateConfidence(rankedOptions),
      reasoning: generateRecommendationReasoning(topOption, rankedOptions)
    };
  }

  return summary;
}

/**
 * Generates explanations for the methodology and approach used
 * @param {Array} priorities - Priority criteria with weights
 * @param {Object} settings - Algorithm settings
 * @returns {Object} Explanations object
 */
export function generateExplanations(priorities, settings = {}) {
  const algorithm = settings.algorithm || 'weighted_sum';
  
  return {
    methodology: `Used ${algorithm} algorithm with user-defined priority weights. Each option scored 0-100 per criteria, then weighted by importance.`,
    scoringBreakdown: `Criteria weights: ${priorities.map(p => `${p.criteria} (${Math.round(p.weight * 100)}%)`).join(', ')}`,
    tradeOffAnalysis: 'Strengths and weaknesses identified by comparing scores across criteria. Key differentiators highlight significant performance gaps.'
  };
}

/**
 * Calculates confidence level for the top recommendation
 * @param {Array} rankedOptions - Array of ranked options
 * @returns {number} Confidence level between 0 and 1
 */
function calculateConfidence(rankedOptions) {
  if (rankedOptions.length < 2) {
    return 1.0;
  }
  
  const topScore = rankedOptions[0].totalScore;
  const secondScore = rankedOptions[1].totalScore;
  const gap = topScore - secondScore;
  
  // Higher confidence with larger score gaps
  // Scale: 0-10 point gap = 0.5-0.7 confidence, 10+ point gap = 0.7-1.0 confidence
  const baseConfidence = 0.5;
  const gapBonus = Math.min(gap / 100, 0.5); // Max 0.5 bonus for 50+ point gap
  
  return roundToDecimals(baseConfidence + gapBonus, 2);
}

/**
 * Generates reasoning text for the top recommendation
 * @param {Object} topOption - The highest-ranked option
 * @param {Array} allOptions - All ranked options
 * @returns {string} Human-readable reasoning
 */
function generateRecommendationReasoning(topOption, allOptions) {
  const score = topOption.totalScore;
  const gap = allOptions.length > 1 ? topOption.totalScore - allOptions[1].totalScore : 0;
  
  let reasoning = `Scored ${score}/100 overall. `;
  
  if (gap > 15) {
    reasoning += `Clear leader with ${roundToDecimals(gap, 1)} point advantage. `;
  } else if (gap > 8) {
    reasoning += `Moderate edge over alternatives. `;
  } else if (gap > 3) {
    reasoning += `Slight advantage in close competition. `;
  } else {
    reasoning += `Very close competition with other options. `;
  }

  // Add top strength
  const topStrength = topOption.tradeOffs?.strengths?.[0];
  if (topStrength) {
    reasoning += `Key strength: ${topStrength.toLowerCase()}.`;
  }

  return reasoning;
}

/**
 * Calculates average score for a specific criteria across all options
 * @param {Array} options - Array of scored options
 * @param {string} criteria - The criteria to average
 * @returns {number} Average score for the criteria
 */
function calculateAverageScore(options, criteria) {
  const scores = options
    .map(opt => opt.criteriaScores[criteria]?.score)
    .filter(score => score !== undefined);
  
  return scores.length > 0 ? average(scores) : 0;
}

/**
 * Identifies the most important criteria based on weight and score variance
 * @param {Array} rankedOptions - Array of ranked options
 * @param {Array} priorities - Priority criteria with weights
 * @returns {Array} Criteria sorted by importance/impact
 */
export function identifyKeyDecisionFactors(rankedOptions, priorities) {
  if (!rankedOptions || rankedOptions.length === 0) {
    return [];
  }

  const factors = priorities.map(priority => {
    const scores = rankedOptions
      .map(opt => opt.criteriaScores[priority.criteria]?.score)
      .filter(score => score !== undefined);
    
    if (scores.length === 0) {
      return null;
    }

    // Calculate variance to measure how much this criteria differentiates options
    const avgScore = average(scores);
    const variance = average(scores.map(score => Math.pow(score - avgScore, 2)));
    
    // Impact score combines weight and variance
    const impactScore = priority.weight * Math.sqrt(variance);
    
    return {
      criteria: priority.criteria,
      weight: priority.weight,
      variance: roundToDecimals(variance, 2),
      impactScore: roundToDecimals(impactScore, 3),
      optimization: priority.optimization
    };
  }).filter(factor => factor !== null);

  // Sort by impact score (descending)
  return factors.sort((a, b) => b.impactScore - a.impactScore);
}

/**
 * Generates insights about the decision landscape
 * @param {Array} rankedOptions - Array of ranked options
 * @param {Array} priorities - Priority criteria
 * @returns {Object} Decision insights
 */
export function generateDecisionInsights(rankedOptions, priorities) {
  if (!rankedOptions || rankedOptions.length === 0) {
    return {
      competitiveness: 'no_options',
      keyFactors: [],
      recommendations: []
    };
  }

  const keyFactors = identifyKeyDecisionFactors(rankedOptions, priorities);
  const scoreRange = rankedOptions[0].totalScore - rankedOptions[rankedOptions.length - 1].totalScore;
  
  let competitiveness;
  if (scoreRange < 10) {
    competitiveness = 'very_close';
  } else if (scoreRange < 25) {
    competitiveness = 'competitive';
  } else {
    competitiveness = 'clear_differences';
  }

  const recommendations = generateDecisionRecommendations(rankedOptions, keyFactors, competitiveness);

  return {
    competitiveness,
    scoreRange: roundToDecimals(scoreRange, 1),
    keyFactors: keyFactors.slice(0, 3), // Top 3 most impactful factors
    recommendations
  };
}

/**
 * Generates actionable recommendations based on the analysis
 * @param {Array} rankedOptions - Ranked options
 * @param {Array} keyFactors - Most impactful decision factors
 * @param {string} competitiveness - Level of competition between options
 * @returns {Array} Array of recommendation strings
 */
function generateDecisionRecommendations(rankedOptions, keyFactors, competitiveness) {
  const recommendations = [];
  
  if (competitiveness === 'very_close') {
    recommendations.push('Consider additional criteria or gather more detailed data - the options are very close in overall value');
    
    if (keyFactors.length > 0) {
      recommendations.push(`Focus on ${keyFactors[0].criteria} as it's the most differentiating factor`);
    }
  } else if (competitiveness === 'clear_differences') {
    recommendations.push('The analysis shows clear differences between options - the top choice is well-supported');
    
    const topOption = rankedOptions[0];
    if (topOption.tradeOffs?.strengths?.length > 0) {
      recommendations.push(`Top choice excels in: ${topOption.tradeOffs.strengths[0]}`);
    }
  }

  // Add constraint-based recommendations
  const constraintFailures = rankedOptions.reduce((total, opt) => 
    total + (opt.constraintCompliance?.failedConstraints?.length || 0), 0
  );
  
  if (constraintFailures > 0) {
    recommendations.push('Some options failed constraints - consider if requirements can be relaxed');
  }

  return recommendations.slice(0, 3); // Limit to 3 recommendations
}
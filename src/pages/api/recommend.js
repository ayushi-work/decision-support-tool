/**
 * Decision Support Tool - Recommendation API Route
 * POST /api/recommend
 * 
 * Production-quality API for comparing technical options based on
 * user-defined constraints and weighted priorities.
 */

import { validateRequest } from '../../lib/validation.js';
import { scoreOptions } from '../../lib/scoring.js';
import { generateTradeOffAnalysis, generateSummary, generateExplanations } from '../../lib/analysis.js';
import { createTimestamp, roundToDecimals } from '../../lib/utils.js';

/**
 * Main API handler for recommendation requests
 * @param {Object} req - Next.js request object
 * @param {Object} res - Next.js response object
 */
export default async function handler(req, res) {
  const startTime = Date.now();
  const timestamp = createTimestamp();

  try {
    // Method validation
    if (req.method !== 'POST') {
      return sendErrorResponse(res, 405, 'Method not allowed. Use POST.', {
        allowedMethods: ['POST'],
        timestamp
      });
    }

    // Request body validation
    if (!req.body || Object.keys(req.body).length === 0) {
      return sendErrorResponse(res, 400, 'Request body is required', {
        requiredFields: ['options', 'constraints', 'priorities'],
        timestamp
      });
    }

    // Extract and validate input
    const { options, constraints, priorities, settings = {} } = req.body;
    const validation = validateRequest({ options, constraints, priorities, settings });

    if (!validation.valid) {
      return sendErrorResponse(res, 400, validation.message, {
        errors: validation.errors,
        errorCount: validation.errorCount,
        timestamp,
        help: {
          options: 'Provide an array of at least 2 options with id, name, and features',
          constraints: 'Provide an array of constraints with criteria, operator, and value',
          priorities: 'Provide an array of priorities with criteria, weight (0-1), and optimization (minimize/maximize)',
          weights: 'Ensure all priority weights sum to exactly 1.0'
        }
      });
    }

    // Process the comparison
    const results = await processComparison({
      options,
      constraints,
      priorities,
      settings
    });

    const processingTime = Date.now() - startTime;

    // Send successful response
    return sendSuccessResponse(res, results, {
      processingTime,
      algorithm: settings.algorithm || 'weighted_sum',
      timestamp,
      inputSummary: {
        optionsCount: options.length,
        constraintsCount: constraints.length,
        prioritiesCount: priorities.length
      }
    });

  } catch (error) {
    console.error('Recommendation API Error:', error);
    
    // Handle specific error types
    if (error.name === 'SyntaxError') {
      return sendErrorResponse(res, 400, 'Invalid JSON in request body', { timestamp });
    }

    return sendErrorResponse(res, 500, 'Internal server error during comparison processing', {
      timestamp,
      help: 'Please check your input format and try again. If the problem persists, contact support.'
    });
  }
}

/**
 * Main comparison processing pipeline
 * @param {Object} input - Validated input containing options, constraints, priorities, settings
 * @returns {Object} Processed comparison results
 */
async function processComparison({ options, constraints, priorities, settings }) {
  try {
    // Step 1: Score options using the scoring engine
    const scoringResults = scoreOptions(options, constraints, priorities, settings);

    // Step 2: Generate trade-off analysis
    const rankedOptionsWithTradeOffs = generateTradeOffAnalysis(
      scoringResults.rankedOptions, 
      priorities
    );

    // Step 3: Generate summary and explanations
    const summary = generateSummary(scoringResults, options);
    const explanations = generateExplanations(priorities, settings);

    // Step 4: Format final results
    return {
      rankedOptions: rankedOptionsWithTradeOffs,
      summary,
      explanations
    };

  } catch (error) {
    console.error('Processing error:', error);
    throw new Error('Failed to process comparison: ' + error.message);
  }
}

/**
 * Sends a successful response with consistent formatting
 * @param {Object} res - Response object
 * @param {Object} results - Processing results
 * @param {Object} metadata - Additional metadata
 */
function sendSuccessResponse(res, results, metadata) {
  res.status(200).json({
    status: 'success',
    timestamp: metadata.timestamp,
    results,
    metadata: {
      processing_time_ms: metadata.processingTime,
      algorithm_used: metadata.algorithm,
      data_freshness: metadata.timestamp,
      input_summary: metadata.inputSummary
    }
  });
}

/**
 * Sends an error response with consistent formatting
 * @param {Object} res - Response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {Object} additionalData - Additional error data
 */
function sendErrorResponse(res, statusCode, message, additionalData = {}) {
  res.status(statusCode).json({
    status: 'error',
    message,
    ...additionalData
  });
}


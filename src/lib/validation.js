/**
 * Input validation utilities for the recommendation API
 * Provides comprehensive validation with detailed error messages
 */

/**
 * Validates the complete request input
 * @param {Object} input - The request body containing options, constraints, priorities
 * @returns {Object} Validation result with success status and errors
 */
export function validateRequest(input) {
  const { options, constraints, priorities, settings } = input;
  const errors = [];

  // Validate main sections
  const optionsValidation = validateOptions(options);
  const constraintsValidation = validateConstraints(constraints);
  const prioritiesValidation = validatePriorities(priorities);
  const settingsValidation = validateSettings(settings);

  errors.push(...optionsValidation.errors);
  errors.push(...constraintsValidation.errors);
  errors.push(...prioritiesValidation.errors);
  errors.push(...settingsValidation.errors);

  // Cross-validation: ensure priority criteria exist in options
  if (optionsValidation.valid && prioritiesValidation.valid) {
    const crossValidationErrors = validateCriteriaExistence(options, priorities);
    errors.push(...crossValidationErrors);
  }

  return {
    valid: errors.length === 0,
    errors,
    errorCount: errors.length,
    message: errors.length > 0 ? 'Validation failed' : 'Valid input'
  };
}

/**
 * Validates options array and individual option structure
 */
export function validateOptions(options) {
  const errors = [];

  if (!options) {
    errors.push('Options field is required');
    return { valid: false, errors };
  }

  if (!Array.isArray(options)) {
    errors.push('Options must be an array');
    return { valid: false, errors };
  }

  if (options.length === 0) {
    errors.push('At least one option is required');
    return { valid: false, errors };
  }

  if (options.length < 2) {
    errors.push('At least two options are required for meaningful comparison');
  }

  // Validate each option structure
  options.forEach((option, index) => {
    const optionErrors = validateSingleOption(option, index);
    errors.push(...optionErrors);
  });

  // Check for duplicate option IDs
  const optionIds = options.map(opt => opt.id).filter(id => id);
  const duplicateIds = findDuplicates(optionIds);
  if (duplicateIds.length > 0) {
    errors.push(`Duplicate option IDs found: ${duplicateIds.join(', ')}`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validates a single option object
 */
function validateSingleOption(option, index) {
  const errors = [];
  const prefix = `Option ${index + 1}`;

  if (!option || typeof option !== 'object') {
    errors.push(`${prefix}: must be an object`);
    return errors;
  }

  // Required fields validation
  const requiredFields = [
    { field: 'id', type: 'string' },
    { field: 'name', type: 'string' },
    { field: 'features', type: 'object' }
  ];

  requiredFields.forEach(({ field, type }) => {
    if (!option[field]) {
      errors.push(`${prefix}: '${field}' field is required`);
    } else if (type === 'object' && (typeof option[field] !== 'object' || Array.isArray(option[field]))) {
      errors.push(`${prefix}: '${field}' must be an object`);
    } else if (type === 'string' && typeof option[field] !== 'string') {
      errors.push(`${prefix}: '${field}' must be a string`);
    }
  });

  // Features object validation
  if (option.features && typeof option.features === 'object' && Object.keys(option.features).length === 0) {
    errors.push(`${prefix}: 'features' cannot be empty`);
  }

  return errors;
}

/**
 * Validates constraints array and individual constraint structure
 */
export function validateConstraints(constraints) {
  const errors = [];

  if (!constraints) {
    errors.push('Constraints field is required');
    return { valid: false, errors };
  }

  if (!Array.isArray(constraints)) {
    errors.push('Constraints must be an array');
    return { valid: false, errors };
  }

  // Validate each constraint
  constraints.forEach((constraint, index) => {
    const constraintErrors = validateSingleConstraint(constraint, index);
    errors.push(...constraintErrors);
  });

  return { valid: errors.length === 0, errors };
}

/**
 * Validates a single constraint object
 */
function validateSingleConstraint(constraint, index) {
  const errors = [];
  const prefix = `Constraint ${index + 1}`;

  if (!constraint || typeof constraint !== 'object') {
    errors.push(`${prefix}: must be an object`);
    return errors;
  }

  // Required fields
  if (!constraint.criteria) {
    errors.push(`${prefix}: 'criteria' field is required`);
  } else if (typeof constraint.criteria !== 'string') {
    errors.push(`${prefix}: 'criteria' must be a string`);
  }

  // Operator validation
  const validOperators = ['lt', 'lte', 'gt', 'gte', 'eq', 'neq', 'in', 'contains'];
  if (!constraint.operator) {
    errors.push(`${prefix}: 'operator' field is required`);
  } else if (!validOperators.includes(constraint.operator)) {
    errors.push(`${prefix}: 'operator' must be one of: ${validOperators.join(', ')}`);
  }

  // Value validation
  if (constraint.value === undefined || constraint.value === null) {
    errors.push(`${prefix}: 'value' field is required`);
  }

  // Optional fields validation
  if (constraint.required !== undefined && typeof constraint.required !== 'boolean') {
    errors.push(`${prefix}: 'required' must be a boolean`);
  }

  return errors;
}

/**
 * Validates priorities array and individual priority structure
 */
export function validatePriorities(priorities) {
  const errors = [];

  if (!priorities) {
    errors.push('Priorities field is required');
    return { valid: false, errors };
  }

  if (!Array.isArray(priorities)) {
    errors.push('Priorities must be an array');
    return { valid: false, errors };
  }

  if (priorities.length === 0) {
    errors.push('At least one priority is required');
    return { valid: false, errors };
  }

  // Validate each priority
  priorities.forEach((priority, index) => {
    const priorityErrors = validateSinglePriority(priority, index);
    errors.push(...priorityErrors);
  });

  // Validate weight sum
  const validPriorities = priorities.filter(p => 
    typeof p.weight === 'number' && !isNaN(p.weight)
  );
  
  if (validPriorities.length > 0) {
    const totalWeight = validPriorities.reduce((sum, p) => sum + p.weight, 0);
    if (Math.abs(totalWeight - 1) > 0.01) {
      errors.push(`Priority weights must sum to 1.0 (current sum: ${totalWeight.toFixed(3)})`);
    }
  }

  // Check for duplicate criteria
  const criteria = priorities.map(p => p.criteria).filter(c => c);
  const duplicates = findDuplicates(criteria);
  if (duplicates.length > 0) {
    errors.push(`Duplicate priority criteria found: ${duplicates.join(', ')}`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validates a single priority object
 */
function validateSinglePriority(priority, index) {
  const errors = [];
  const prefix = `Priority ${index + 1}`;

  if (!priority || typeof priority !== 'object') {
    errors.push(`${prefix}: must be an object`);
    return errors;
  }

  // Criteria validation
  if (!priority.criteria) {
    errors.push(`${prefix}: 'criteria' field is required`);
  } else if (typeof priority.criteria !== 'string') {
    errors.push(`${prefix}: 'criteria' must be a string`);
  }

  // Weight validation
  if (priority.weight === undefined || priority.weight === null) {
    errors.push(`${prefix}: 'weight' field is required`);
  } else if (typeof priority.weight !== 'number' || isNaN(priority.weight)) {
    errors.push(`${prefix}: 'weight' must be a number`);
  } else if (priority.weight < 0 || priority.weight > 1) {
    errors.push(`${prefix}: 'weight' must be between 0 and 1 (got ${priority.weight})`);
  }

  // Optimization validation
  const validOptimizations = ['minimize', 'maximize'];
  if (!priority.optimization) {
    errors.push(`${prefix}: 'optimization' field is required`);
  } else if (!validOptimizations.includes(priority.optimization)) {
    errors.push(`${prefix}: 'optimization' must be either 'minimize' or 'maximize'`);
  }

  return errors;
}

/**
 * Validates settings object
 */
export function validateSettings(settings) {
  const errors = [];

  if (!settings) {
    return { valid: true, errors };
  }

  if (typeof settings !== 'object' || Array.isArray(settings)) {
    errors.push('Settings must be an object');
    return { valid: false, errors };
  }

  // Algorithm validation
  if (settings.algorithm !== undefined) {
    const validAlgorithms = ['weighted_sum', 'topsis', 'ahp'];
    if (!validAlgorithms.includes(settings.algorithm)) {
      errors.push(`Settings 'algorithm' must be one of: ${validAlgorithms.join(', ')}`);
    }
  }

  // Boolean fields validation
  if (settings.include_explanations !== undefined && typeof settings.include_explanations !== 'boolean') {
    errors.push("Settings 'include_explanations' must be a boolean");
  }

  // Numeric fields validation
  if (settings.max_results !== undefined) {
    if (typeof settings.max_results !== 'number' || 
        !Number.isInteger(settings.max_results) || 
        settings.max_results < 1) {
      errors.push("Settings 'max_results' must be a positive integer");
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Cross-validates that priority criteria exist in option features
 */
function validateCriteriaExistence(options, priorities) {
  const errors = [];
  const allFeatureKeys = new Set();

  // Collect all feature keys from all options (including nested)
  options.forEach(option => {
    if (option.features && typeof option.features === 'object') {
      collectFeatureKeys(option.features, '', allFeatureKeys);
    }
  });

  // Check if each priority criteria exists
  priorities.forEach(priority => {
    if (priority.criteria && !allFeatureKeys.has(priority.criteria)) {
      errors.push(`Priority criteria '${priority.criteria}' not found in any option features`);
    }
  });

  return errors;
}

/**
 * Recursively collects feature keys including nested paths
 */
function collectFeatureKeys(obj, prefix, keySet) {
  Object.keys(obj).forEach(key => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    keySet.add(fullKey);
    
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && obj[key] !== null) {
      collectFeatureKeys(obj[key], fullKey, keySet);
    }
  });
}

/**
 * Utility function to find duplicate values in an array
 */
function findDuplicates(array) {
  const seen = new Set();
  const duplicates = new Set();
  
  array.forEach(item => {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  });
  
  return Array.from(duplicates);
}
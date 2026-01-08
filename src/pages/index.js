import { useState } from 'react';
import Head from 'next/head';
import { 
  sampleDatabaseComparison, 
  sampleCloudComparison, 
  samplePostgresDynamoComparison,
  sampleApiGatewayComparison,
  sampleMLPlatformComparison 
} from '../components/SampleData';

export default function Home() {
  const [options, setOptions] = useState([
    { id: '', name: '', features: {} },
    { id: '', name: '', features: {} }
  ]);
  const [constraints, setConstraints] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Load sample data
  const loadSampleData = (sampleData) => {
    setOptions(sampleData.options.map(opt => ({
      ...opt,
      features: JSON.stringify(opt.features, null, 2)
    })));
    setConstraints(sampleData.constraints);
    setPriorities(sampleData.priorities);
    setError(null);
    setResults(null);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Add new option
  const addOption = () => {
    setOptions([...options, { id: '', name: '', features: {} }]);
  };

  // Remove option
  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  // Update option
  const updateOption = (index, field, value) => {
    const newOptions = [...options];
    if (field === 'features') {
      newOptions[index].features = value;
    } else {
      newOptions[index][field] = value;
    }
    setOptions(newOptions);
  };

  // Add constraint
  const addConstraint = () => {
    setConstraints([...constraints, { criteria: '', operator: 'lte', value: '', required: true }]);
  };

  // Update constraint
  const updateConstraint = (index, field, value) => {
    const newConstraints = [...constraints];
    newConstraints[index][field] = value;
    setConstraints(newConstraints);
  };

  // Remove constraint
  const removeConstraint = (index) => {
    setConstraints(constraints.filter((_, i) => i !== index));
  };

  // Add priority
  const addPriority = () => {
    setPriorities([...priorities, { criteria: '', weight: 0, optimization: 'maximize' }]);
  };

  // Update priority
  const updatePriority = (index, field, value) => {
    const newPriorities = [...priorities];
    newPriorities[index][field] = field === 'weight' ? parseFloat(value) || 0 : value;
    setPriorities(newPriorities);
  };

  // Remove priority
  const removePriority = (index) => {
    setPriorities(priorities.filter((_, i) => i !== index));
  };

  // Submit to API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      // Prepare data
      const requestData = {
        options: options.map(opt => ({
          ...opt,
          features: typeof opt.features === 'string' ? JSON.parse(opt.features) : opt.features
        })),
        constraints: constraints.map(c => ({
          ...c,
          value: isNaN(c.value) ? c.value : parseFloat(c.value)
        })),
        priorities: priorities,
        settings: {
          algorithm: 'weighted_sum',
          include_explanations: true
        }
      };

      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data);
      } else {
        setError(data);
      }
    } catch (err) {
      setError({ message: 'Network error: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  // Calculate total weight
  const totalWeight = priorities.reduce((sum, p) => sum + (p.weight || 0), 0);

  return (
    <div className={`container ${darkMode ? 'dark' : ''}`}>
      <Head>
        <title>Decision Support Tool</title>
        <meta name="description" content="Compare technical options with weighted priorities" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />
      </Head>

      <header>
        <div className="header-top">
          <div></div> {/* Spacer for centering */}
          <div className="header-content">
            <h1>Decision Support Tool</h1>
            <p>Compare technical options based on constraints and weighted priorities</p>
          </div>
          <button 
            onClick={toggleDarkMode}
            className="dark-mode-toggle"
            aria-label="Toggle dark mode"
          >
            {darkMode ? 'Light' : 'Dark'}
          </button>
        </div>
        
        {/* Sample Data Buttons */}
        <div className="sample-buttons">
          <button 
            type="button" 
            onClick={() => loadSampleData(samplePostgresDynamoComparison)}
            className="btn-sample"
          >
            PostgreSQL vs DynamoDB
          </button>
          <button 
            type="button" 
            onClick={() => loadSampleData(sampleDatabaseComparison)}
            className="btn-sample"
          >
            Database Comparison
          </button>
          <button 
            type="button" 
            onClick={() => loadSampleData(sampleCloudComparison)}
            className="btn-sample"
          >
            Cloud Providers
          </button>
          <button 
            type="button" 
            onClick={() => loadSampleData(sampleApiGatewayComparison)}
            className="btn-sample"
          >
            API Gateways
          </button>
          <button 
            type="button" 
            onClick={() => loadSampleData(sampleMLPlatformComparison)}
            className="btn-sample"
          >
            ML Platforms
          </button>
        </div>
      </header>

      <form onSubmit={handleSubmit}>
        {/* Options Section */}
        <section>
          <h2>Options ({options.length})</h2>
          {options.map((option, index) => (
            <div key={index} className="card">
              <div className="card-header">
                <h3>Option {index + 1}</h3>
                {options.length > 2 && (
                  <button type="button" onClick={() => removeOption(index)} className="btn-danger">
                    Remove
                  </button>
                )}
              </div>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="ID (e.g., postgres-rds)"
                  value={option.id}
                  onChange={(e) => updateOption(index, 'id', e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Name (e.g., PostgreSQL RDS)"
                  value={option.name}
                  onChange={(e) => updateOption(index, 'name', e.target.value)}
                  required
                />
              </div>
              <textarea
                placeholder='Features JSON (e.g., {"cost": 0.115, "performance": 3000, "reliability": 99.95})'
                value={typeof option.features === 'string' ? option.features : JSON.stringify(option.features, null, 2)}
                onChange={(e) => updateOption(index, 'features', e.target.value)}
                rows={3}
                required
              />
            </div>
          ))}
          <button type="button" onClick={addOption} className="btn-secondary">
            Add Option
          </button>
        </section>

        {/* Constraints Section */}
        <section>
          <h2>Constraints ({constraints.length})</h2>
          {constraints.map((constraint, index) => (
            <div key={index} className="card">
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Criteria (e.g., cost)"
                  value={constraint.criteria}
                  onChange={(e) => updateConstraint(index, 'criteria', e.target.value)}
                  required
                />
                <select
                  value={constraint.operator}
                  onChange={(e) => updateConstraint(index, 'operator', e.target.value)}
                >
                  <option value="lte">≤ (less than or equal)</option>
                  <option value="lt">&lt; (less than)</option>
                  <option value="gte">≥ (greater than or equal)</option>
                  <option value="gt">&gt; (greater than)</option>
                  <option value="eq">= (equal to)</option>
                  <option value="neq">≠ (not equal to)</option>
                </select>
                <input
                  type="text"
                  placeholder="Value"
                  value={constraint.value}
                  onChange={(e) => updateConstraint(index, 'value', e.target.value)}
                  required
                />
                <label>
                  <input
                    type="checkbox"
                    checked={constraint.required}
                    onChange={(e) => updateConstraint(index, 'required', e.target.checked)}
                  />
                  Required
                </label>
                <button type="button" onClick={() => removeConstraint(index)} className="btn-danger">
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button type="button" onClick={addConstraint} className="btn-secondary">
            Add Constraint
          </button>
        </section>

        {/* Priorities Section */}
        <section>
          <h2>Priorities ({priorities.length}) - Total Weight: {totalWeight.toFixed(2)}</h2>
          {totalWeight !== 1.0 && priorities.length > 0 && (
            <div className="warning">Weights must sum to 1.0</div>
          )}
          {priorities.map((priority, index) => (
            <div key={index} className="card">
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Criteria (e.g., cost)"
                  value={priority.criteria}
                  onChange={(e) => updatePriority(index, 'criteria', e.target.value)}
                  required
                />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  placeholder="Weight (0-1)"
                  value={priority.weight}
                  onChange={(e) => updatePriority(index, 'weight', e.target.value)}
                  required
                />
                <select
                  value={priority.optimization}
                  onChange={(e) => updatePriority(index, 'optimization', e.target.value)}
                >
                  <option value="maximize">Maximize (higher is better)</option>
                  <option value="minimize">Minimize (lower is better)</option>
                </select>
                <button type="button" onClick={() => removePriority(index)} className="btn-danger">
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button type="button" onClick={addPriority} className="btn-secondary">
            Add Priority
          </button>
        </section>

        {/* Submit Button */}
        <div className="submit-section">
          <button 
            type="submit" 
            disabled={loading || totalWeight !== 1.0 || priorities.length === 0}
            className="btn-primary"
          >
            {loading ? 'Analyzing...' : 'Get Recommendations'}
          </button>
        </div>
      </form>

      {/* Error Display */}
      {error && (
        <section className="error-section">
          <h2>Error</h2>
          <div className="error-message">{error.message}</div>
          {error.errors && (
            <ul>
              {error.errors.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Results Display */}
      {results && (
        <section className="results-section">
          <h2>Comparison Results</h2>
          <div className="results-summary">
            <p>Processing time: {results.metadata.processing_time_ms}ms | Options evaluated: {results.metadata.input_summary.optionsCount}</p>
          </div>
          
          {/* Side-by-side comparison */}
          <div className="comparison-grid">
            {results.results.ranked_options.map((option, index) => (
              <div key={option.option_id} className="comparison-card">
                {/* Header with rank and score */}
                <div className="comparison-header">
                  <div className="rank-badge">#{option.rank}</div>
                  <h3 className="option-name">{option.name}</h3>
                  <div className="total-score">
                    <div className="score-number">{option.total_score}</div>
                    <div className="score-label">/ 100</div>
                  </div>
                </div>

                {/* Criteria scores as progress bars */}
                <div className="criteria-section">
                  <h4>Criteria Scores</h4>
                  {Object.entries(option.criteria_scores).map(([criteria, score]) => (
                    <div key={criteria} className="criteria-bar">
                      <div className="criteria-label">
                        <span className="criteria-name">{criteria}</span>
                        <span className="criteria-score">{score.score}/100</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${score.score}%` }}
                        ></div>
                      </div>
                      <div className="raw-value">Raw: {score.raw_value}</div>
                    </div>
                  ))}
                </div>

                {/* Reasons as bullet points */}
                <div className="reasons-section">
                  <h4>Why This Score?</h4>
                  <ul className="reasons-list">
                    {option.reasons.map((reason, idx) => (
                      <li key={idx} className={`reason-item ${reason.impact}`}>
                        <span className="reason-icon">
                          {reason.impact === 'positive' ? '+' : reason.impact === 'negative' ? '−' : '•'}
                        </span>
                        <span className="reason-text">{reason.explanation}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Trade-offs summary */}
                <div className="tradeoffs-section">
                  <h4>Trade-offs Summary</h4>
                  
                  {option.trade_offs.strengths.length > 0 && (
                    <div className="strengths-list">
                      <h5>Strengths</h5>
                      <ul>
                        {option.trade_offs.strengths.map((strength, idx) => (
                          <li key={idx}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {option.trade_offs.weaknesses.length > 0 && (
                    <div className="weaknesses-list">
                      <h5>Weaknesses</h5>
                      <ul>
                        {option.trade_offs.weaknesses.map((weakness, idx) => (
                          <li key={idx}>{weakness}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {option.trade_offs.key_differentiators.length > 0 && (
                    <div className="differentiators-list">
                      <h5>Key Differentiators</h5>
                      <ul>
                        {option.trade_offs.key_differentiators.map((diff, idx) => (
                          <li key={idx}>{diff}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Constraint compliance */}
                {option.constraint_compliance && option.constraint_compliance.constraint_reasons && (
                  <div className="constraints-section">
                    <h4>Constraint Compliance</h4>
                    <ul className="constraints-list">
                      {option.constraint_compliance.constraint_reasons.map((constraint, idx) => (
                        <li key={idx} className={`constraint-item ${constraint.status}`}>
                          <span className="constraint-icon">
                            {constraint.status === 'passed' ? '✓' : '✗'}
                          </span>
                          <span className="constraint-text">{constraint.explanation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Summary insights */}
          {results.results.summary && (
            <div className="summary-insights">
              <h3>Decision Summary</h3>
              <div className="insight-grid">
                <div className="insight-item">
                  <strong>Options Meeting Constraints:</strong> {results.results.summary.options_meeting_constraints} of {results.results.summary.total_options_evaluated}
                </div>
                {results.results.summary.top_recommendation && (
                  <div className="insight-item">
                    <strong>Top Recommendation:</strong> {results.results.ranked_options.find(opt => opt.option_id === results.results.summary.top_recommendation.option_id)?.name}
                    <br />
                    <em>Confidence: {Math.round(results.results.summary.top_recommendation.confidence * 100)}%</em>
                    <br />
                    <span className="reasoning">{results.results.summary.top_recommendation.reasoning}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Instrument Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #2c3e50;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        header {
          text-align: center;
          margin-bottom: 40px;
          border-bottom: 1px solid #e1e8ed;
          padding-bottom: 30px;
        }

        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .header-content {
          flex: 1;
          text-align: center;
        }

        .dark-mode-toggle {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-family: 'Instrument Sans', sans-serif;
          font-weight: 500;
          font-size: 14px;
          transition: all 0.2s ease;
          min-width: 60px;
        }

        .dark-mode-toggle:hover {
          background: #e5e7eb;
          border-color: #9ca3af;
        }

        h1 {
          font-family: 'Instrument Serif', Georgia, serif;
          color: #1a202c;
          margin-bottom: 10px;
          font-size: 2.5rem;
          font-weight: 400;
          letter-spacing: -0.02em;
        }

        h2 {
          font-family: 'Instrument Serif', Georgia, serif;
          color: #2d3748;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 10px;
          font-size: 1.5rem;
          font-weight: 400;
          margin-bottom: 20px;
        }

        h3, h4, h5 {
          font-family: 'Instrument Sans', sans-serif;
          font-weight: 600;
          color: #2d3748;
        }

        section {
          margin-bottom: 30px;
        }

        .card {
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 20px;
          margin-bottom: 15px;
          background: #ffffff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          border-bottom: 1px solid #f7fafc;
          padding-bottom: 10px;
        }

        .form-row {
          display: flex;
          gap: 10px;
          align-items: center;
          margin-bottom: 10px;
        }

        input, select, textarea {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 14px;
          font-family: 'Instrument Sans', sans-serif;
          transition: border-color 0.2s ease, background-color 0.3s ease, color 0.3s ease;
        }

        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        input[type="text"], input[type="number"] {
          flex: 1;
        }

        textarea {
          width: 100%;
          font-family: 'JetBrains Mono', 'Courier New', monospace;
          resize: vertical;
          font-size: 13px;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          font-weight: 500;
          font-family: 'Instrument Sans', sans-serif;
          transition: background-color 0.2s ease;
        }

        .btn-primary:hover:not(:disabled) {
          background: #2563eb;
        }

        .btn-primary:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: #6b7280;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-family: 'Instrument Sans', sans-serif;
          font-weight: 500;
          transition: background-color 0.2s ease;
        }

        .btn-secondary:hover {
          background: #4b5563;
        }

        .btn-danger {
          background: #dc2626;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          font-family: 'Instrument Sans', sans-serif;
          font-weight: 500;
          transition: background-color 0.2s ease;
        }

        .btn-danger:hover {
          background: #b91c1c;
        }

        .btn-sample {
          background: #059669;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          margin: 0 5px;
          font-size: 14px;
          font-family: 'Instrument Sans', sans-serif;
          font-weight: 500;
          transition: background-color 0.2s ease;
        }

        .btn-sample:hover {
          background: #047857;
        }

        .sample-buttons {
          margin-top: 20px;
        }

        .submit-section {
          text-align: center;
          margin: 40px 0;
        }

        .warning {
          background: #fef3c7;
          color: #92400e;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 15px;
          border-left: 4px solid #f59e0b;
          font-weight: 500;
        }

        .error-section {
          background: #fef2f2;
          color: #991b1b;
          padding: 20px;
          border-radius: 6px;
          margin: 20px 0;
          border-left: 4px solid #dc2626;
        }

        .error-message {
          font-weight: 600;
          margin-bottom: 10px;
        }

        .results-section {
          margin-top: 40px;
        }

        .results-summary {
          background: #f0f9ff;
          color: #0c4a6e;
          padding: 15px;
          border-radius: 6px;
          margin-bottom: 20px;
          text-align: center;
          border-left: 4px solid #0ea5e9;
        }

        .comparison-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .comparison-card {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          background: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .comparison-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .comparison-header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #f3f4f6;
        }

        .rank-badge {
          background: #3b82f6;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 18px;
          margin-right: 15px;
          flex-shrink: 0;
          font-family: 'Instrument Sans', sans-serif;
        }

        .option-name {
          flex: 1;
          margin: 0;
          color: #1f2937;
          font-size: 18px;
          font-family: 'Instrument Serif', serif;
          font-weight: 400;
        }

        .total-score {
          text-align: center;
          margin-left: 15px;
        }

        .score-number {
          font-size: 32px;
          font-weight: 700;
          color: #3b82f6;
          line-height: 1;
          font-family: 'Instrument Sans', sans-serif;
        }

        .score-label {
          font-size: 14px;
          color: #6b7280;
          font-family: 'Instrument Sans', sans-serif;
        }

        .criteria-section {
          margin-bottom: 25px;
        }

        .criteria-section h4 {
          margin-bottom: 15px;
          color: #374151;
          font-size: 16px;
          border-bottom: 1px solid #f3f4f6;
          padding-bottom: 5px;
        }

        .criteria-bar {
          margin-bottom: 12px;
        }

        .criteria-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
          font-size: 14px;
        }

        .criteria-name {
          font-weight: 500;
          color: #374151;
        }

        .criteria-score {
          font-weight: 600;
          color: #3b82f6;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #f3f4f6;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%);
          transition: width 0.3s ease;
        }

        .raw-value {
          font-size: 12px;
          color: #6b7280;
          margin-top: 2px;
        }

        .reasons-section {
          margin-bottom: 25px;
        }

        .reasons-section h4 {
          margin-bottom: 15px;
          color: #374151;
          font-size: 16px;
          border-bottom: 1px solid #f3f4f6;
          padding-bottom: 5px;
        }

        .reasons-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .reason-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 10px;
          padding: 8px;
          border-radius: 4px;
          font-size: 14px;
          line-height: 1.4;
        }

        .reason-item.positive {
          background: #f0fdf4;
          border-left: 3px solid #10b981;
        }

        .reason-item.negative {
          background: #fef2f2;
          border-left: 3px solid #ef4444;
        }

        .reason-item.neutral {
          background: #f8fafc;
          border-left: 3px solid #64748b;
        }

        .reason-icon {
          margin-right: 8px;
          flex-shrink: 0;
          font-weight: 700;
          font-size: 16px;
        }

        .reason-item.positive .reason-icon {
          color: #10b981;
        }

        .reason-item.negative .reason-icon {
          color: #ef4444;
        }

        .reason-item.neutral .reason-icon {
          color: #64748b;
        }

        .reason-text {
          flex: 1;
        }

        .tradeoffs-section {
          margin-bottom: 25px;
        }

        .tradeoffs-section h4 {
          margin-bottom: 15px;
          color: #374151;
          font-size: 16px;
          border-bottom: 1px solid #f3f4f6;
          padding-bottom: 5px;
        }

        .tradeoffs-section h5 {
          margin: 10px 0 8px 0;
          font-size: 14px;
          font-weight: 600;
        }

        .strengths-list {
          margin-bottom: 15px;
        }

        .strengths-list h5 {
          color: #059669;
        }

        .strengths-list ul {
          background: #f0fdf4;
          padding: 10px 15px;
          border-radius: 4px;
          margin: 0;
          border-left: 3px solid #10b981;
        }

        .strengths-list li {
          color: #065f46;
          margin-bottom: 4px;
        }

        .weaknesses-list {
          margin-bottom: 15px;
        }

        .weaknesses-list h5 {
          color: #dc2626;
        }

        .weaknesses-list ul {
          background: #fef2f2;
          padding: 10px 15px;
          border-radius: 4px;
          margin: 0;
          border-left: 3px solid #ef4444;
        }

        .weaknesses-list li {
          color: #991b1b;
          margin-bottom: 4px;
        }

        .differentiators-list h5 {
          color: #0369a1;
        }

        .differentiators-list ul {
          background: #f0f9ff;
          padding: 10px 15px;
          border-radius: 4px;
          margin: 0;
          border-left: 3px solid #3b82f6;
        }

        .differentiators-list li {
          color: #1e40af;
          margin-bottom: 4px;
        }

        .constraints-section {
          margin-bottom: 20px;
        }

        .constraints-section h4 {
          margin-bottom: 15px;
          color: #374151;
          font-size: 16px;
          border-bottom: 1px solid #f3f4f6;
          padding-bottom: 5px;
        }

        .constraints-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .constraint-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 8px;
          padding: 6px;
          border-radius: 4px;
          font-size: 13px;
        }

        .constraint-item.passed {
          background: #f0fdf4;
          color: #065f46;
        }

        .constraint-item.failed {
          background: #fef2f2;
          color: #991b1b;
        }

        .constraint-icon {
          margin-right: 6px;
          flex-shrink: 0;
          font-weight: 700;
        }

        .constraint-item.passed .constraint-icon {
          color: #10b981;
        }

        .constraint-item.failed .constraint-icon {
          color: #ef4444;
        }

        .constraint-text {
          flex: 1;
        }

        .summary-insights {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 20px;
          margin-top: 30px;
        }

        .summary-insights h3 {
          margin-top: 0;
          margin-bottom: 15px;
          color: #1f2937;
          font-family: 'Instrument Serif', serif;
          font-weight: 400;
        }

        .insight-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 15px;
        }

        .insight-item {
          background: white;
          padding: 15px;
          border-radius: 4px;
          border-left: 3px solid #3b82f6;
        }

        .reasoning {
          font-style: italic;
          color: #6b7280;
          font-size: 14px;
        }

        /* Dark Mode Styles */
        .container.dark {
          background: #0f172a;
          color: #e2e8f0;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .container.dark h1 {
          color: #f1f5f9;
        }

        .container.dark h2 {
          color: #e2e8f0;
          border-bottom-color: #334155;
        }

        .container.dark h3,
        .container.dark h4,
        .container.dark h5 {
          color: #e2e8f0;
        }

        .container.dark header {
          border-bottom-color: #334155;
        }

        .container.dark .dark-mode-toggle {
          background: #334155;
          color: #e2e8f0;
          border-color: #475569;
        }

        .container.dark .dark-mode-toggle:hover {
          background: #475569;
          border-color: #64748b;
        }

        .container.dark .card {
          background: #1e293b;
          border-color: #334155;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        .container.dark .card-header {
          border-bottom-color: #334155;
        }

        .container.dark input,
        .container.dark select,
        .container.dark textarea {
          background: #0f172a;
          border-color: #475569;
          color: #e2e8f0;
        }

        .container.dark input:focus,
        .container.dark select:focus,
        .container.dark textarea:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }

        .container.dark input::placeholder,
        .container.dark textarea::placeholder {
          color: #94a3b8;
        }

        .container.dark .btn-primary {
          background: #3b82f6;
        }

        .container.dark .btn-primary:hover:not(:disabled) {
          background: #2563eb;
        }

        .container.dark .btn-primary:disabled {
          background: #475569;
        }

        .container.dark .btn-secondary {
          background: #475569;
        }

        .container.dark .btn-secondary:hover {
          background: #64748b;
        }

        .container.dark .btn-danger {
          background: #dc2626;
        }

        .container.dark .btn-danger:hover {
          background: #b91c1c;
        }

        .container.dark .btn-sample {
          background: #059669;
        }

        .container.dark .btn-sample:hover {
          background: #047857;
        }

        .container.dark .warning {
          background: #451a03;
          color: #fbbf24;
          border-left-color: #f59e0b;
        }

        .container.dark .error-section {
          background: #450a0a;
          color: #fca5a5;
          border-left-color: #dc2626;
        }

        .container.dark .results-summary {
          background: #0c4a6e;
          color: #bae6fd;
          border-left-color: #0ea5e9;
        }

        .container.dark .comparison-card {
          background: #1e293b;
          border-color: #334155;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .container.dark .comparison-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }

        .container.dark .comparison-header {
          border-bottom-color: #334155;
        }

        .container.dark .rank-badge {
          background: #3b82f6;
        }

        .container.dark .option-name {
          color: #f1f5f9;
        }

        .container.dark .score-number {
          color: #60a5fa;
        }

        .container.dark .score-label {
          color: #94a3b8;
        }

        .container.dark .criteria-section h4,
        .container.dark .reasons-section h4,
        .container.dark .tradeoffs-section h4,
        .container.dark .constraints-section h4 {
          color: #e2e8f0;
          border-bottom-color: #334155;
        }

        .container.dark .criteria-name {
          color: #e2e8f0;
        }

        .container.dark .criteria-score {
          color: #60a5fa;
        }

        .container.dark .progress-bar {
          background: #334155;
        }

        .container.dark .raw-value {
          color: #94a3b8;
        }

        .container.dark .reason-item.positive {
          background: #064e3b;
          border-left-color: #10b981;
        }

        .container.dark .reason-item.negative {
          background: #450a0a;
          border-left-color: #ef4444;
        }

        .container.dark .reason-item.neutral {
          background: #1e293b;
          border-left-color: #64748b;
        }

        .container.dark .strengths-list ul {
          background: #064e3b;
          border-left-color: #10b981;
        }

        .container.dark .strengths-list li {
          color: #6ee7b7;
        }

        .container.dark .weaknesses-list ul {
          background: #450a0a;
          border-left-color: #ef4444;
        }

        .container.dark .weaknesses-list li {
          color: #fca5a5;
        }

        .container.dark .differentiators-list ul {
          background: #0c4a6e;
          border-left-color: #3b82f6;
        }

        .container.dark .differentiators-list li {
          color: #93c5fd;
        }

        .container.dark .constraint-item.passed {
          background: #064e3b;
          color: #6ee7b7;
        }

        .container.dark .constraint-item.failed {
          background: #450a0a;
          color: #fca5a5;
        }

        .container.dark .summary-insights {
          background: #1e293b;
          border-color: #334155;
        }

        .container.dark .summary-insights h3 {
          color: #f1f5f9;
        }

        .container.dark .insight-item {
          background: #0f172a;
          border-left-color: #3b82f6;
        }

        .container.dark .reasoning {
          color: #94a3b8;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .comparison-grid {
            grid-template-columns: 1fr;
          }
          
          .comparison-header {
            flex-direction: column;
            text-align: center;
          }
          
          .rank-badge {
            margin-right: 0;
            margin-bottom: 10px;
          }
          
          .total-score {
            margin-left: 0;
            margin-top: 10px;
          }

          .form-row {
            flex-direction: column;
            align-items: stretch;
          }

          .sample-buttons {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 8px;
          }

          .btn-sample {
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
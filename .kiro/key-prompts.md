# Key Prompts Used in Development

This document captures the critical prompts that guided Kiro through each phase of development, demonstrating how strategic prompting led to high-quality outcomes.

## 🎯 Phase 1: Initial System Design

### Prompt: System Architecture Definition
```
I want to build a web-based Decision Support Tool that compares technical options 
(APIs, databases, cloud services, frameworks) based on user-defined constraints 
and priorities. Design the system architecture and explain:
- frontend responsibilities
- backend responsibilities  
- how data flows
- where the comparison logic should live
```

**Kiro's Response Impact**:
- Recommended clean three-tier architecture
- Suggested Next.js for full-stack simplicity
- Identified key separation of concerns
- Proposed modular backend structure

**Why This Prompt Worked**:
- Specific domain (technical options comparison)
- Clear deliverables (architecture explanation)
- Open-ended enough for Kiro to suggest best practices
- Focused on system design rather than implementation details

## 🔧 Phase 2: API Contract Design

### Prompt: API Specification
```
Define a clean API contract for this tool.
Inputs:
- options (list of alternatives with features)
- constraints (user requirements)
- priorities (criteria with weights)
Output:
- ranked options
- scores
- human-readable trade-off explanations
Give example request and response JSON.
```

**Kiro's Response Impact**:
- Designed comprehensive JSON schema
- Included detailed example with PostgreSQL vs MongoDB
- Specified clear input validation requirements
- Defined rich response format with explanations

**Why This Prompt Worked**:
- Structured input/output specification
- Requested concrete examples (JSON)
- Emphasized human-readable explanations
- Clear scope boundaries

## 🏗️ Phase 3: Backend Implementation

### Prompt: API Route Creation
```
Create a Next.js API route at:
src/pages/api/recommend.js
The route should:
- accept POST requests
- read options, constraints, and priorities from the request body
- return a ranked comparison response in JSON
```

**Kiro's Response Impact**:
- Generated complete API route with validation
- Implemented scoring algorithms
- Added comprehensive error handling
- Created modular function structure

**Why This Prompt Worked**:
- Specific file path and framework
- Clear functional requirements
- Focused on single responsibility (API endpoint)
- Left implementation details to Kiro's expertise

## 🧠 Phase 4: Comparison Engine Logic

### Prompt: Scoring Algorithm Implementation
```
Inside the API route, implement a function that compares multiple options based on:
- constraints
- priorities with weights
Each option should be scored numerically and returned in descending order.
```

**Kiro's Response Impact**:
- Implemented weighted scoring algorithm
- Added constraint filtering logic
- Created normalization for fair comparison
- Built ranking and sorting functionality

**Why This Prompt Worked**:
- Focused on core business logic
- Specified key requirements (numerical scoring, ordering)
- Left algorithm choice to Kiro's judgment
- Clear success criteria (descending order)

## 💬 Phase 5: Explainable AI Features

### Prompt: Adding Explanations
```
Refactor the comparison logic so that each option also returns:
- a list called "reasons"
- plain-English explanations of why it matched or failed each priority
The result should be both ranked and explainable.
```

**Kiro's Response Impact**:
- Added comprehensive explanation generation
- Created human-readable reasoning for each score
- Implemented performance level categorization
- Built comparative analysis ("above average", "excellent", etc.)

**Why This Prompt Worked**:
- Focused on explainability (key differentiator)
- Requested specific output format ("reasons" list)
- Emphasized plain-English communication
- Maintained existing functionality while adding new features

## 🛡️ Phase 6: Input Validation

### Prompt: Robust Validation
```
Add robust input validation to the API:
- Require at least two options
- Ensure constraints and priorities are provided
- Return helpful error messages for invalid requests
```

**Kiro's Response Impact**:
- Created comprehensive validation module
- Added detailed error messages with specific guidance
- Implemented cross-field validation (weights sum to 1.0)
- Built helpful error response format

**Why This Prompt Worked**:
- Specific validation rules
- Emphasized user experience (helpful messages)
- Clear minimum requirements
- Focused on error handling quality

## 🎨 Phase 7: Frontend Development

### Prompt: User Interface Creation
```
Create a simple Next.js frontend that allows users to:
- enter multiple options
- define constraints
- assign weights to priorities
- submit the data to /api/recommend
Keep the UI minimal and developer-friendly.
```

**Kiro's Response Impact**:
- Built complete React-based interface
- Created dynamic form handling
- Added real-time validation feedback
- Implemented sample data loading

**Why This Prompt Worked**:
- Clear functional requirements
- Specified target audience (developers)
- Emphasized simplicity over complexity
- Connected to existing API endpoint

## 📊 Phase 8: Results Visualization

### Prompt: UI Refinement for Trade-offs
```
Update the frontend to display results as:
- a side-by-side comparison
- with scores clearly visible
- and each option's reasons listed as bullet points
Focus on clarity of trade-offs rather than just showing a winner.
```

**Kiro's Response Impact**:
- Redesigned results display with comparison grid
- Added visual score indicators (progress bars)
- Implemented categorized trade-off analysis
- Created responsive side-by-side layout

**Why This Prompt Worked**:
- Specific UI requirements (side-by-side, bullet points)
- Emphasized trade-off analysis over simple ranking
- Clear visual design direction
- Focused on user understanding rather than just data display

## 🔄 Phase 9: Code Quality Improvement

### Prompt: Backend Refactoring
```
Refactor the backend logic to improve readability and structure:
- separate validation logic
- isolate scoring logic
- keep formatting and response generation clean
Make the code production-quality.
```

**Kiro's Response Impact**:
- Created modular architecture with separate files
- Extracted validation, scoring, analysis, and utilities
- Reduced main API route by 80%
- Added comprehensive documentation and error handling

**Why This Prompt Worked**:
- Focused on code quality and maintainability
- Specified separation of concerns
- Emphasized production readiness
- Clear refactoring objectives

## 📝 Phase 10: Documentation & Examples

### Prompt: Test Data Generation
```
Generate example test input for this tool, such as:
- comparing PostgreSQL vs DynamoDB
- with constraints like cost, scalability, and latency
- including priorities with weights
Also provide the expected output format.
```

**Kiro's Response Impact**:
- Created 5 comprehensive test scenarios
- Built realistic comparison examples
- Generated expected output documentation
- Added sample data integration to UI

**Why This Prompt Worked**:
- Specific, realistic example (PostgreSQL vs DynamoDB)
- Requested both input and output examples
- Focused on practical use cases
- Asked for complete documentation

## 🎯 Prompt Strategy Analysis

### What Made These Prompts Effective

**1. Specificity with Flexibility**
- Clear requirements but room for Kiro to apply best practices
- Specific deliverables without micromanaging implementation
- Domain context provided upfront

**2. Incremental Complexity**
- Started with architecture, moved to implementation
- Built features progressively rather than all at once
- Each prompt built on previous work

**3. User-Focused Language**
- Emphasized user experience and developer-friendliness
- Requested explanations and documentation
- Focused on practical outcomes

**4. Quality Emphasis**
- Consistently requested "production-quality" code
- Asked for comprehensive error handling
- Emphasized maintainability and readability

### Prompt Patterns That Worked

**"Create X that does Y"** - Clear deliverable with functional requirements
```
Create a Next.js API route that accepts POST requests and returns ranked comparisons
```

**"Refactor X to improve Y"** - Quality improvement with specific goals
```
Refactor the backend logic to improve readability and structure
```

**"Add X to Y so that Z"** - Feature addition with clear purpose
```
Add explanations to each option so that users understand the reasoning
```

**"Update X to display Y"** - UI changes with specific visual requirements
```
Update the frontend to display results as side-by-side comparison
```

### Lessons Learned

1. **Start with architecture** - High-level design decisions guide all subsequent work
2. **Be specific about deliverables** - Clear outputs lead to better results
3. **Emphasize quality consistently** - Requesting "production-quality" throughout
4. **Build incrementally** - Each prompt adds to previous work rather than starting over
5. **Focus on user value** - Always connect technical requirements to user benefits

These prompts demonstrate how strategic AI collaboration can produce professional-quality software through clear communication, incremental development, and consistent quality standards.
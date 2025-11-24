/**
 * Caphè Technologies Workflows - Enhanced Search Engine
 * Advanced business automation platform with hybrid categorization
 * Supports both integration-based and business-focused workflow discovery
 */

class EnhancedWorkflowSearch extends WorkflowSearch {
    constructor() {
        super();
        this.businessCategories = null;
        this.hybridMode = true; // Support both categorization systems
        this.setupEnhancedFilters();
    }

    async init() {
        try {
            await this.loadSearchIndex();
            await this.loadBusinessCategories();
            this.setupEventListeners();
            this.populateEnhancedFilters();
            this.updateEnhancedStats();
            this.showFeaturedWorkflows();
        } catch (error) {
            console.error('Failed to initialize enhanced search:', error);
            this.showError('Failed to load workflow data. Please try again later.');
        }
    }

    async loadBusinessCategories() {
        try {
            const response = await fetch('api/business-categories.json');
            if (response.ok) {
                this.businessCategories = await response.json();
            }
        } catch (error) {
            console.warn('Business categories not available, using integration categories only');
        }
    }

    setupEnhancedFilters() {
        // Add business category filter to the existing filters
        const filtersContainer = document.querySelector('.filters');

        // Create business category filter
        const businessCategoryFilter = document.createElement('select');
        businessCategoryFilter.id = 'business-category-filter';
        businessCategoryFilter.innerHTML = '<option value="">All Business Categories</option>';

        // Add difficulty filter (mapped from our metadata)
        const difficultyFilter = document.createElement('select');
        difficultyFilter.id = 'difficulty-filter';
        difficultyFilter.innerHTML = `
            <option value="">All Difficulty</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
        `;

        // Add use case filter
        const useCaseFilter = document.createElement('select');
        useCaseFilter.id = 'use-case-filter';
        useCaseFilter.innerHTML = '<option value="">All Use Cases</option>';

        filtersContainer.appendChild(businessCategoryFilter);
        filtersContainer.appendChild(difficultyFilter);
        filtersContainer.appendChild(useCaseFilter);

        // Store references
        this.businessCategoryFilter = businessCategoryFilter;
        this.difficultyFilter = difficultyFilter;
        this.useCaseFilter = useCaseFilter;
    }

    populateEnhancedFilters() {
        // Populate existing integration categories
        super.populateFilters();

        // Populate business categories
        if (this.businessCategories) {
            this.businessCategories.categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.displayName;
                this.businessCategoryFilter.appendChild(option);
            });
        }

        // Populate use cases from workflows
        const useCases = new Set();
        this.searchIndex.workflows.forEach(workflow => {
            if (workflow.meta && workflow.meta.business_metadata && workflow.meta.business_metadata.useCase) {
                const useCase = workflow.meta.business_metadata.useCase;
                if (useCase.length > 0 && useCase.length <= 50) { // Reasonable length
                    useCases.add(useCase);
                }
            }
        });

        [...useCases].sort().forEach(useCase => {
            const option = document.createElement('option');
            option.value = useCase;
            option.textContent = useCase.length > 40 ? useCase.substring(0, 40) + '...' : useCase;
            this.useCaseFilter.appendChild(option);
        });
    }

    setupEventListeners() {
        super.setupEventListeners();

        // Enhanced filter listeners
        this.businessCategoryFilter.addEventListener('change', this.handleEnhancedSearch.bind(this));
        this.difficultyFilter.addEventListener('change', this.handleEnhancedSearch.bind(this));
        this.useCaseFilter.addEventListener('change', this.handleEnhancedSearch.bind(this));

        // View mode toggle
        this.setupViewModeToggle();
    }

    setupViewModeToggle() {
        // Add toggle between integration view and business view
        const header = document.querySelector('.search-container');
        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'view-toggle';
        toggleContainer.innerHTML = `
            <div class="toggle-buttons">
                <button id="integration-view" class="toggle-btn active">Integration View</button>
                <button id="business-view" class="toggle-btn">Business View</button>
                <button id="hybrid-view" class="toggle-btn">Hybrid View</button>
            </div>
        `;

        header.appendChild(toggleContainer);

        // Event listeners for view toggle
        document.getElementById('integration-view').addEventListener('click', () => {
            this.setViewMode('integration');
        });

        document.getElementById('business-view').addEventListener('click', () => {
            this.setViewMode('business');
        });

        document.getElementById('hybrid-view').addEventListener('click', () => {
            this.setViewMode('hybrid');
        });
    }

    setViewMode(mode) {
        this.viewMode = mode;

        // Update active button
        document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`${mode}-view`).classList.add('active');

        // Show/hide appropriate filters
        const integrationFilters = [this.categoryFilter];
        const businessFilters = [this.businessCategoryFilter, this.difficultyFilter, this.useCaseFilter];

        if (mode === 'integration') {
            integrationFilters.forEach(filter => filter.style.display = 'block');
            businessFilters.forEach(filter => filter.style.display = 'none');
        } else if (mode === 'business') {
            integrationFilters.forEach(filter => filter.style.display = 'none');
            businessFilters.forEach(filter => filter.style.display = 'block');
        } else { // hybrid
            integrationFilters.forEach(filter => filter.style.display = 'block');
            businessFilters.forEach(filter => filter.style.display = 'block');
        }

        // Refresh search results
        this.handleEnhancedSearch();
    }

    handleEnhancedSearch() {
        const query = this.searchInput.value.trim().toLowerCase();
        const category = this.categoryFilter.value;
        const complexity = this.complexityFilter.value;
        const trigger = this.triggerFilter.value;
        const businessCategory = this.businessCategoryFilter.value;
        const difficulty = this.difficultyFilter.value;
        const useCase = this.useCaseFilter.value;

        this.currentResults = this.searchEnhancedWorkflows(query, {
            category,
            complexity,
            trigger,
            businessCategory,
            difficulty,
            useCase
        });

        this.displayedCount = 0;
        this.displayResults(true);
        this.updateResultsHeader(query, {
            category,
            complexity,
            trigger,
            businessCategory,
            difficulty,
            useCase
        });
    }

    searchEnhancedWorkflows(query, filters = {}) {
        let results = [...this.searchIndex.workflows];

        // Text search with enhanced fields
        if (query) {
            results = results.filter(workflow => {
                const searchableText = [
                    workflow.name,
                    workflow.description,
                    workflow.searchable_text,
                    // Enhanced search fields from our metadata
                    workflow.meta?.business_metadata?.useCase || '',
                    workflow.meta?.business_metadata?.features?.join(' ') || '',
                    workflow.meta?.business_metadata?.tags?.join(' ') || '',
                ].join(' ').toLowerCase();

                return searchableText.includes(query);
            });

            // Enhanced relevance scoring
            results.sort((a, b) => {
                const aScore = this.calculateRelevanceScore(a, query);
                const bScore = this.calculateRelevanceScore(b, query);
                return bScore - aScore;
            });
        }

        // Apply integration-based filters
        if (filters.category) {
            results = results.filter(workflow => workflow.category === filters.category);
        }

        if (filters.complexity) {
            results = results.filter(workflow => workflow.complexity === filters.complexity);
        }

        if (filters.trigger) {
            results = results.filter(workflow => workflow.trigger_type === filters.trigger);
        }

        // Apply business-focused filters
        if (filters.businessCategory) {
            results = results.filter(workflow =>
                workflow.meta?.category === filters.businessCategory ||
                workflow.meta?.business_metadata?.category === filters.businessCategory
            );
        }

        if (filters.difficulty) {
            results = results.filter(workflow =>
                workflow.meta?.business_metadata?.difficulty === filters.difficulty
            );
        }

        if (filters.useCase) {
            results = results.filter(workflow =>
                workflow.meta?.business_metadata?.useCase?.toLowerCase().includes(filters.useCase.toLowerCase())
            );
        }

        return results;
    }

    calculateRelevanceScore(workflow, query) {
        let score = 0;
        const queryTerms = query.split(' ');

        queryTerms.forEach(term => {
            // Name matches (highest priority)
            if (workflow.name.toLowerCase().includes(term)) {
                score += 10;
            }

            // Use case matches (high priority for business value)
            if (workflow.meta?.business_metadata?.useCase?.toLowerCase().includes(term)) {
                score += 8;
            }

            // Description matches
            if (workflow.description?.toLowerCase().includes(term)) {
                score += 5;
            }

            // Tag matches
            if (workflow.meta?.business_metadata?.tags?.some(tag =>
                tag.toLowerCase().includes(term))) {
                score += 4;
            }

            // Integration matches
            if (workflow.integrations?.some(integration =>
                integration.toLowerCase().includes(term))) {
                score += 3;
            }

            // Feature matches
            if (workflow.meta?.business_metadata?.features?.some(feature =>
                feature.toLowerCase().includes(term))) {
                score += 2;
            }
        });

        return score;
    }

    updateEnhancedStats() {
        super.updateStats();

        // Add enhanced statistics
        const enhancedStats = this.calculateEnhancedStats();

        // Add business category breakdown
        if (enhancedStats.businessCategories) {
            this.displayBusinessCategoryBreakdown(enhancedStats.businessCategories);
        }
    }

    calculateEnhancedStats() {
        const workflows = this.searchIndex.workflows;
        const stats = {
            businessCategories: {},
            difficultyDistribution: {},
            avgSetupTime: 0,
            enhancedWorkflows: 0
        };

        workflows.forEach(workflow => {
            // Business category stats
            const businessCategory = workflow.meta?.category || workflow.meta?.business_metadata?.category;
            if (businessCategory) {
                stats.businessCategories[businessCategory] = (stats.businessCategories[businessCategory] || 0) + 1;
            }

            // Difficulty distribution
            const difficulty = workflow.meta?.business_metadata?.difficulty;
            if (difficulty) {
                stats.difficultyDistribution[difficulty] = (stats.difficultyDistribution[difficulty] || 0) + 1;
            }

            // Enhanced workflows (those with our rich metadata)
            if (workflow.meta?.business_metadata) {
                stats.enhancedWorkflows++;
            }
        });

        return stats;
    }

    displayEnhancedWorkflowCard(workflow) {
        const businessMetadata = workflow.meta?.business_metadata;

        const cardElement = document.createElement('div');
        cardElement.className = 'workflow-card enhanced';

        cardElement.innerHTML = `
            <div class="workflow-header">
                <h3 class="workflow-title">${workflow.name}</h3>
                <div class="workflow-badges">
                    ${businessMetadata?.difficulty ?
                        `<span class="badge difficulty-${businessMetadata.difficulty}">${businessMetadata.difficulty}</span>` : ''}
                    ${workflow.meta?.category ?
                        `<span class="badge business-category">${workflow.meta.category}</span>` : ''}
                    <span class="badge integration-category">${workflow.category}</span>
                </div>
            </div>

            <div class="workflow-content">
                <p class="workflow-description">${workflow.description || 'No description available'}</p>

                ${businessMetadata?.useCase ?
                    `<div class="use-case">
                        <strong>Use Case:</strong> ${businessMetadata.useCase}
                    </div>` : ''}

                ${businessMetadata?.estimatedSetupTime ?
                    `<div class="setup-time">
                        <strong>Setup Time:</strong> ${businessMetadata.estimatedSetupTime}
                    </div>` : ''}

                <div class="workflow-integrations">
                    <strong>Integrations:</strong>
                    <div class="integration-tags">
                        ${workflow.integrations?.slice(0, 4).map(integration =>
                            `<span class="integration-tag">${integration}</span>`
                        ).join('') || '<span class="no-integrations">No integrations specified</span>'}
                    </div>
                </div>

                ${businessMetadata?.features?.length ?
                    `<div class="workflow-features">
                        <strong>Key Features:</strong>
                        <ul>
                            ${businessMetadata.features.slice(0, 3).map(feature =>
                                `<li>${feature}</li>`
                            ).join('')}
                        </ul>
                    </div>` : ''}
            </div>

            <div class="workflow-actions">
                <a href="${workflow.download_url}" class="btn btn-primary" download>
                    📥 Download JSON
                </a>
                <button class="btn btn-secondary" onclick="this.showWorkflowDetails('${workflow.id}')">
                    📋 View Details
                </button>
            </div>
        `;

        return cardElement;
    }

    displayResults(reset = false) {
        if (reset) {
            this.resultsGrid.innerHTML = '';
            this.displayedCount = 0;
        }

        const start = this.displayedCount;
        const end = Math.min(start + this.resultsPerPage, this.currentResults.length);

        for (let i = start; i < end; i++) {
            const workflow = this.currentResults[i];
            const cardElement = this.displayEnhancedWorkflowCard(workflow);
            this.resultsGrid.appendChild(cardElement);
        }

        this.displayedCount = end;

        // Update load more button
        if (this.loadMoreBtn) {
            if (end < this.currentResults.length) {
                this.loadMoreBtn.style.display = 'block';
                this.loadMoreBtn.textContent = `Load More (${this.currentResults.length - end} remaining)`;
            } else {
                this.loadMoreBtn.style.display = 'none';
            }
        }

        // Update results count
        if (this.resultsCount) {
            this.resultsCount.textContent = `Showing ${end} of ${this.currentResults.length} workflows`;
        }
    }
}

// Enhanced CSS for the new features
const enhancedStyles = `
.view-toggle {
    margin: 1rem 0;
    text-align: center;
}

.toggle-buttons {
    display: inline-flex;
    border-radius: var(--border-radius);
    overflow: hidden;
    box-shadow: var(--shadow);
}

.toggle-btn {
    padding: 0.75rem 1.5rem;
    border: none;
    background: var(--surface);
    color: var(--text-secondary);
    cursor: pointer;
    transition: var(--transition);
    border-right: 1px solid var(--border);
}

.toggle-btn:last-child {
    border-right: none;
}

.toggle-btn:hover {
    background: var(--border-light);
}

.toggle-btn.active {
    background: var(--primary-color);
    color: white;
}

.workflow-card.enhanced {
    border-left: 4px solid var(--accent-color);
}

.workflow-badges {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
}

.badge {
    padding: 0.25rem 0.5rem;
    border-radius: var(--border-radius);
    font-size: 0.75rem;
    font-weight: 600;
}

.badge.difficulty-beginner { background: #10b981; color: white; }
.badge.difficulty-intermediate { background: #f59e0b; color: white; }
.badge.difficulty-advanced { background: #ef4444; color: white; }
.badge.difficulty-expert { background: #8b5cf6; color: white; }
.badge.business-category { background: var(--secondary-color); color: white; }
.badge.integration-category { background: var(--text-muted); color: white; }

.use-case, .setup-time {
    margin: 0.75rem 0;
    font-size: 0.875rem;
}

.workflow-features ul {
    margin: 0.5rem 0 0 1rem;
    font-size: 0.875rem;
}

.integration-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    margin-top: 0.25rem;
}

.integration-tag {
    background: var(--border-light);
    padding: 0.125rem 0.5rem;
    border-radius: var(--border-radius);
    font-size: 0.75rem;
}

.workflow-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
}

.btn {
    padding: 0.5rem 1rem;
    border-radius: var(--border-radius);
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
}

.btn-primary {
    background: var(--primary-color);
    color: white;
    border: none;
}

.btn-primary:hover {
    background: var(--primary-dark);
}

.btn-secondary {
    background: var(--surface);
    color: var(--text-primary);
    border: 1px solid var(--border);
}

.btn-secondary:hover {
    background: var(--border-light);
}
`;

// Inject enhanced styles
const styleSheet = document.createElement('style');
styleSheet.textContent = enhancedStyles;
document.head.appendChild(styleSheet);

// Initialize enhanced search when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.workflowSearch = new EnhancedWorkflowSearch();
});

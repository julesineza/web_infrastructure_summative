
// Initializing the page
document.addEventListener('DOMContentLoaded', function() {
    initCollapsibleSections();
    
    const searchInput = document.getElementById('search-text');
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchInDrugInfo();
            }
        });
    }
});

// Function to scroll to a section
function toggleSection(sectionId) {
    const content = document.getElementById(sectionId);
    if (!content) return;
    
    const icon = content.previousElementSibling?.querySelector('.toggle-icon');
    const isExpanded = content.classList.contains('expanded');
    
    content.classList.toggle('expanded');
    
    if (icon) {
        icon.textContent = isExpanded ? '+' : '−';
    }
    
    // Use requestAnimationFrame for smooth animation
    requestAnimationFrame(() => {
        content.style.maxHeight = isExpanded ? '0' : `${content.scrollHeight}px`;
    });
}

// function to Initialize all collapsible sections
function initCollapsibleSections() {
    const sections = document.querySelectorAll('.info-header');
    
    sections.forEach(section => {
        const content = section.nextElementSibling;
        const icon = section.querySelector('.toggle-icon');
        
        if (!content || !icon) return;
        
        // Close all sections by default
        content.style.maxHeight = '0';
        icon.textContent = '+';
    });
}


// function fir Toggling show more/less for content
function toggleReadMore(event, sectionId) {
    event.stopPropagation();

    const button = event.currentTarget || event.target;
    const section = document.getElementById(sectionId);
    if (!section) return;

    const content = section.querySelector('.content-preview');
    if (!content) return;

    content.classList.toggle('expanded');
    const isExpanded = content.classList.contains('expanded');

    button.textContent = isExpanded ? 'Show Less' : 'Show More';
    button.classList.toggle('expanded', isExpanded);

    if (!section.classList.contains('expanded')) {
        section.classList.add('expanded');
        const header = section.previousElementSibling;
        const icon = header ? header.querySelector('.toggle-icon') : null;
        if (icon) {
            icon.textContent = '−';
        }
    }
    //calucluating the new container height based on new content from api size
    section.style.maxHeight = section.scrollHeight + 'px';
}

// Search within drug information
function searchInDrugInfo() {
    const searchTerm = document.getElementById('search-text').value.trim().toLowerCase();
    const errorMessageEl = document.getElementById('error-message');

    if (errorMessageEl) {
        errorMessageEl.textContent = '';
        errorMessageEl.style.display = 'none';
    }

    if (!searchTerm) {
        if (errorMessageEl) {
            errorMessageEl.textContent = 'Please enter a search term.';
            errorMessageEl.style.display = 'block';
        }
        return;
    }
    
    const sections = document.querySelectorAll('.info-content');
    let found = false;
    
    sections.forEach(section => {
        const content = section.textContent.toLowerCase();
        const html = section.innerHTML.toLowerCase();
        
        if (content.includes(searchTerm)) {
            // Expand the section if it's collapsed
            section.classList.add('expanded');
            section.previousElementSibling.querySelector('.toggle-icon').textContent = '−';
            
            // Highlight the search term (case-insensitive)
            const highlightedHtml = section.innerHTML.replace(
                new RegExp(searchTerm, 'gi'),
                match => `<span class="highlight">${match}</span>`
            );
            section.innerHTML = highlightedHtml;
            
            // Scroll to the first match
            if (!found) {
                section.scrollIntoView({ behavior: 'smooth', block: 'center' });
                found = true;
            }
        }
    });
    
    if (!found && errorMessageEl) {
        errorMessageEl.textContent = 'No matches found.';
        errorMessageEl.style.display = 'block';
    }
}

// Update safety indicator based on warnings
function updateSafetyIndicator(warningsText) {
    const indicator = document.getElementById('safety-indicator');
    const dot = indicator.querySelector('.safety-dot');
    const text = indicator.querySelector('.safety-text');
    
    // Reset classes
    indicator.className = 'safety-indicator';
    
    // Check for warning keywords
    const warningWords = ['fatal', 'death', 'severe', 'dangerous', 'contraindicated'];
    const cautionWords = ['warning', 'caution', 'careful', 'monitor', 'risk'];
    
    const hasSevereWarning = warningWords.some(word => warningsText.toLowerCase().includes(word));
    const hasCaution = cautionWords.some(word => warningsText.toLowerCase().includes(word));
    
    if (hasSevereWarning) {
        indicator.classList.add('danger');
        text.textContent = 'Safety: High Risk';
    } else if (hasCaution) {
        indicator.classList.add('warning');
        text.textContent = 'Safety: Use with Caution';
    } else {
        indicator.classList.add('safe');
        text.textContent = 'Safety: Generally Safe';
    }
}

function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// get input from user 
function getInput(){
    const inputEl = document.querySelector('.text-input');
    const userInput = inputEl ? inputEl.value : '';
    const cleanedInput = userInput.toLowerCase().trim();
    return cleanedInput;
}

// Function to search the FDA API
async function searchApi(drugName) {
    try {
        const baseUrl = 'https://api.fda.gov/drug/label.json';
        // get also partial matches using regex.
        const normalizedTerm = drugName.trim().replace(/\s+/g, '+');
        const searchQuery = `openfda.brand_name:${normalizedTerm}*+openfda.generic_name:${normalizedTerm}*+openfda.substance_name:${normalizedTerm}*`;
        //limit is 3 so we can ge t three variations of the medication
        const url = `${baseUrl}?search=${searchQuery}&limit=3`;
        
        console.log('Making API request to:', url);
        
        const response = await axios.get(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            timeout: 20000
        });
        
        if (!response.data || !response.data.results || response.data.results.length === 0) {
            throw new Error('No results found for the specified drug');
        }
        
        return response.data;
    } catch (error) {
        console.error('Error in searchApi:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            config: {
                url: error.config?.url,
                method: error.config?.method
            }
        });
        if (error.response && error.response.status === 404) {
            throw new Error('No results found for that medicine name. Please check the spelling and try again.');
        }

        // Handle network/timeout errors more clearly for the user
        if (error.code === 'ECONNABORTED') {
            throw new Error('The request is taking too long. Please check your connection and try again.');
        }

        if (!navigator.onLine) {
            throw new Error('You appear to be offline. Please connect to the internet and try again.');
        }

        throw new Error('Failed to fetch drug information. Please try again later.');
    }
}

async function handleSearch() {
    try {
        const drugName = document.querySelector('.drug-name');
        const description = document.querySelector('#description .content-preview');
        const indicationUsage = document.querySelector('#indication_usage .content-preview');
        const warnings = document.querySelector('#warnings .content-preview');
        const dosage = document.querySelector('#dosage .adult-content .content-preview');
        const sideEffects = document.querySelector('#side_effects .content-preview');
        const drugInteractions = document.querySelector('#drug_interactions .content-preview');
        const loadingSkeleton = document.getElementById('loading-skeleton');
        const drugInfo = document.getElementById('drug-info');
        const errorMessage = document.getElementById('error-message');
        const noResultsError = document.getElementById('no-results-error');

        const cleanedInput = getInput();

        if (errorMessage) {
            errorMessage.textContent = '';
            errorMessage.style.display = 'none';
        }

        if (noResultsError) {
            noResultsError.style.display = 'none';
        }

        if (!cleanedInput) {
            if (errorMessage) {
                errorMessage.textContent = 'Please enter a drug name.';
                errorMessage.style.display = 'block';
            }
            return;
        }

        // Show loading state
        if (loadingSkeleton) {
            loadingSkeleton.style.display = 'block';
        }

        if (drugInfo) {
            drugInfo.style.display = 'none';
        }
        scrollToSection('results');

        // Fetch data from API
        const data = await searchApi(cleanedInput);

        if (data && data.results && data.results.length > 0) {
            const variants = data.results;

            const getVariantName = (v) => {
                const ofda = v.openfda || {};
                const brand = Array.isArray(ofda.brand_name) ? ofda.brand_name[0] : ofda.brand_name;
                const generic = Array.isArray(ofda.generic_name) ? ofda.generic_name[0] : ofda.generic_name;
                const form = Array.isArray(ofda.dosage_form) ? ofda.dosage_form[0] : ofda.dosage_form;
                const strength = Array.isArray(ofda.product_strength) ? ofda.product_strength[0] : ofda.product_strength;

                const baseName = brand || generic || cleanedInput;
                const details = [form, strength].filter(Boolean).join(' • ');
                return details ? `${baseName} (${details})` : baseName;
            };

            const variantNames = variants.map(getVariantName);

            // Brand header: main name plus list of other variant names, if any
            const mainBrand = variantNames[0] || cleanedInput;
            const otherNames = variantNames.slice(1);
            const extraBrandNote = otherNames.length > 0
                ? ` <span class="variant-note">Other medicines found: ${otherNames.join(', ')}</span>`
                : '';

            drugName.innerHTML = mainBrand + extraBrandNote;

            // Helper to combine text fields from all variants with dividers
            const combineField = (fieldName, fallbackText) => {
                const pieces = variants
                    .map((v, index) => {
                        const raw = v[fieldName];
                        if (!raw) return null;
                        const text = Array.isArray(raw) ? raw.join(' ') : raw;
                        const nameLabel = variantNames[index] || `Medicine ${index + 1}`;
                        return `<div class="variant-block"><strong>${nameLabel}</strong><br>${text}</div>`;
                    })
                    .filter(Boolean);

                if (pieces.length === 0) {
                    return fallbackText;
                }

                return pieces.join('<hr class="variant-separator">');
            };

            // Description
            description.innerHTML = combineField('description', 'No description available.');

            // Indications & Usage
            indicationUsage.innerHTML = combineField('indications_and_usage', 'No information available.');

            // Warnings and safety indicator (flatten all warnings text for the indicator)
            const warningsCombinedHtml = combineField('warnings_and_cautions', 'No specific warnings.');
            warnings.innerHTML = warningsCombinedHtml;

            const warningsPlainText = variants
                .map(v => v.warnings_and_cautions)
                .filter(Boolean)
                .map(raw => Array.isArray(raw) ? raw.join(' ') : raw)
                .join(' ');

            updateSafetyIndicator(warningsPlainText || '');

            // Dosage
            dosage.innerHTML = combineField('dosage_and_administration', 'Dosage information not available.');

            // Side effects
            sideEffects.innerHTML = combineField('adverse_reactions', 'No specific side effects listed.');

            // Drug interactions
            drugInteractions.innerHTML = combineField('drug_interactions', 'No known drug interactions.');

            // Show the drug info and hide loading skeleton
            if (loadingSkeleton) {
                loadingSkeleton.style.display = 'none';
            }

            if (drugInfo) {
                drugInfo.style.display = 'block';
            }
        } else {
            throw new Error('No results found');
        }
    } catch (error) {
        console.error('Error fetching drug information:', error);
        const loadingEl = document.getElementById('loading-skeleton');
        const drugInfoEl = document.getElementById('drug-info');
        const errorMessageEl = document.getElementById('error-message');
        const noResultsErrorEl = document.getElementById('no-results-error');

        if (loadingEl) {
            loadingEl.style.display = 'none';
        }

        if (drugInfoEl) {
            drugInfoEl.style.display = 'none';
        }

        const message = error && error.message
            ? error.message
            : 'Failed to fetch drug information. Please try again.';

        // If this is specifically a "no results" situation, show the dedicated no-results UI
        if (noResultsErrorEl && message.toLowerCase().includes('no results')) {
            noResultsErrorEl.style.display = 'block';
            if (errorMessageEl) {
                errorMessageEl.style.display = 'none';
            }
        } else if (errorMessageEl) {
            // For other errors (network, timeout, etc.), show a simple text error
            errorMessageEl.textContent = message;
            errorMessageEl.style.display = 'block';
            if (noResultsErrorEl) {
                noResultsErrorEl.style.display = 'none';
            }
        }
    }
}

const textInputEl = document.querySelector('.text-input');
if (textInputEl) {
    textInputEl.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
}


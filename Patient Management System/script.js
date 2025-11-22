let patients = [];

// API endpoints
const API_BASE_URL = 'https://api.fda.gov/drug/label.json';
const NEWSDATA_API_KEY = API_KEYS.NEWSDATA;
const NEWSDATA_API_URL = 'https://newsdata.io/api/1/news';

// Toast notification system
function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    
    toast.innerHTML = `
        <span class="toast-icon">${icons[type]}</span>
        <span class="toast-message">${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Fetch treatment data from FDA API
async function fetchTreatmentInfo(condition) {
    try {
        // Map conditions to better search terms
        const searchTerms = {
            'diabetes': 'diabetes OR diabetic OR glucose OR insulin',
            'hypertension': 'hypertension OR "high blood pressure" OR "blood pressure" OR antihypertensive',
            'asthma': 'asthma OR bronchial OR bronchodilator OR respiratory',
            'cardiovascular': 'cardiovascular OR cardiac OR heart OR coronary OR angina'
        };
        
        const searchQuery = searchTerms[condition] || condition;
        
        const response = await fetch(
            `${API_BASE_URL}?search=indications_and_usage:${searchQuery}&limit=5`
        );
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            const treatments = data.results.map(result => ({
                brandName: result.openfda?.brand_name?.[0] || 'N/A',
                genericName: result.openfda?.generic_name?.[0] || 'N/A',
                manufacturer: result.openfda?.manufacturer_name?.[0] || 'N/A',
                purpose: result.purpose?.[0] || result.indications_and_usage?.[0]?.substring(0, 200) || 'N/A'
            }));
            
            return treatments;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching treatment info:', error);
        return null;
    }
}

// Fetch health news from NewsData API
async function fetchHealthNews() {
    try {
        const response = await fetch(
            `${NEWSDATA_API_URL}?apikey=${NEWSDATA_API_KEY}&category=health&language=en`
        );
        
        if (!response.ok) {
            if (response.status === 429) {
                showToast('News API rate limit reached. Please try again later.', 'warning');
            } else if (response.status === 403) {
                showToast('Invalid API key. Please check your configuration.', 'error');
            } else {
                showToast('Failed to load health news.', 'error');
            }
            throw new Error('News API request failed');
        }
        
        const data = await response.json();
        
        if (!data.results || data.results.length === 0) {
            showToast('No health news available at this time.', 'info');
        }
        
        return data.results ? data.results.slice(0, 5) : [];
    } catch (error) {
        console.error('Error fetching health news:', error);
        return [];
    }
}

// Display news articles on dashboard
async function displayHealthNews() {
    const newsContainer = document.querySelector('.news-section');
    
    if (!newsContainer) return;
    
    newsContainer.innerHTML = '<p style="text-align: center; color: #6B7280;">Loading health news...</p>';
    
    const articles = await fetchHealthNews();
    
    if (articles.length === 0) {
        newsContainer.innerHTML = '<p style="text-align: center; color: #6B7280;">Unable to load health news at this time.</p>';
        return;
    }
    
    newsContainer.innerHTML = articles.map(article => `
        <div class="news-card">
            <img src="${article.image_url || 'https://via.placeholder.com/300x150?text=Health+News'}" alt="News image" class="news-image">
            <div class="news-content">
                <h4 class="news-title">${article.title}</h4>
                <p class="news-description">${article.description || 'No description available.'}</p>
                <div class="news-footer">
                    <span class="news-source">${article.source_id || 'Unknown'}</span>
                    <a href="${article.link}" target="_blank" class="news-link">Read More →</a>
                </div>
            </div>
        </div>
    `).join('');
}

const dashboardPage = document.getElementById("dashboardPage");
const addPatientPage = document.getElementById("addPatientPage");
const allPatientsPage = document.getElementById("allPatientsPage");

function showMainPage() {
    dashboardPage.style.display = "block";
    addPatientPage.style.display = "none";
    allPatientsPage.style.display = "none";
}

function showAllPatientsPage() {
    dashboardPage.style.display = "none";
    addPatientPage.style.display = "none";
    allPatientsPage.style.display = "block";

    renderPatients(patients);
}

function showAddPatientPage() {
    dashboardPage.style.display = "none";
    allPatientsPage.style.display = "none";
    addPatientPage.style.display = "block";
}

// Render patient cards with treatment info
function renderPatients(patientList) {
    const container = document.querySelector("#allPatientsPage .patient-list");
    
    if (!patientList.length) {
        container.innerHTML = "<p style='text-align: center; color: #6B7280; margin-top: 30px;'>No patients available.</p>";
        return;
    }

    container.innerHTML = patientList.map(p => {
        let adherenceClass = '';
        if (p.adherence >= 80) adherenceClass = 'adherence-high';
        else if (p.adherence >= 50) adherenceClass = 'adherence-medium';
        else adherenceClass = 'adherence-low';

        let treatmentHTML = '';
        if (p.treatments && p.treatments.length > 0) {
            treatmentHTML = `
                <div style="margin-top: 15px; padding: 10px; background-color: #EFF6FF; border-radius: 5px; border-left: 3px solid #3B82F6;">
                    <p style="font-weight: 600; color: #1E40AF; margin-bottom: 5px;">Recommended Treatment:</p>
                    <p style="font-size: 13px; color: #1F2937; margin: 3px 0;"><strong>Brand:</strong> ${p.treatments[0].brandName}</p>
                    <p style="font-size: 13px; color: #1F2937; margin: 3px 0;"><strong>Generic:</strong> ${p.treatments[0].genericName}</p>
                </div>
            `;
        }

        return `
            <div class="patient-card">
                <h3>${p.name}</h3>
                <p class="patient-id">ID: ${p.id}</p>
                <span class="condition">${p.condition.charAt(0).toUpperCase() + p.condition.slice(1)}</span>
                <p class="adherence-level ${adherenceClass}">Adherence: ${p.adherence}%</p>
                <p style="margin-top: 10px; ${p.needAttention ? 'color: #DC2626; font-weight: 600;' : 'color: #059669; font-weight: 600;'}">
                    ${p.needAttention ? "⚠ Needs Attention" : "✔ Stable"}
                </p>
                ${treatmentHTML}
            </div>
        `;
    }).join("");
}

// Update dashboard statistics
function updateStats() {
    document.querySelector(".num").innerHTML = `Total Patients: ${patients.length}`;

    if (patients.length === 0) {
        document.querySelector(".Adherence").innerHTML = `Avg Adherence: 0%`;
        document.querySelector(".doses").innerHTML = `Missed Doses: 0%`;
        document.querySelector(".attention").innerHTML = `Need Attention: 0`;
        return;
    }

    let avg = patients.reduce((sum, p) => sum + p.adherence, 0) / patients.length;
    document.querySelector(".Adherence").innerHTML = `Avg Adherence: ${avg.toFixed(1)}%`;
    document.querySelector(".doses").innerHTML = `Missed Doses: ${(100 - avg).toFixed(1)}%`;

    let count = patients.filter(p => p.needAttention).length;
    document.querySelector(".attention").innerHTML = `Need Attention: ${count}`;
}

// Handle form submission and API call
document.getElementById("addPatientForm").onsubmit = async function (e) {
    e.preventDefault();

    const submitBtn = document.querySelector(".submit-btn");
    const originalText = submitBtn.textContent;
    
    let name = document.getElementById("patientName").value;
    let id = document.getElementById("patientID").value;
    let cond = document.getElementById("condition").value;
    let adh = Number(document.getElementById("adherence").value);

    // Validation: Check if patient ID contains only numbers
    if (!/^\d+$/.test(id)) {
        showToast('Patient ID must contain only numbers!', 'error');
        return;
    }

    // Validation: Check if patient ID already exists
    const existingPatient = patients.find(p => p.id === id);
    if (existingPatient) {
        showToast(`Patient ID "${id}" already exists! Please use a different ID.`, 'error');
        return;
    }

    submitBtn.textContent = "Adding Patient...";
    submitBtn.disabled = true;

    const treatments = await fetchTreatmentInfo(cond);
    let needAttention = adh < 50 ? true : false;

    patients.push({
        name,
        id,
        condition: cond,
        adherence: adh,
        needAttention,
        treatments: treatments,
        dateAdded: new Date().toLocaleDateString()
    });

    if (treatments) {
        showToast(`Patient ${name} added successfully with treatment information!`, 'success');
    } else {
        showToast(`Patient ${name} added successfully!`, 'success');
    }

    // Save to localStorage
    localStorage.setItem('patients', JSON.stringify(patients));

    document.getElementById("addPatientForm").reset();
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;

    updateStats();
    showMainPage();
};

// Search functionality
document.querySelector(".search-btn").onclick = () => {
    let value = document.querySelector(".search-input").value.toLowerCase();

    if (!value) {
        showAllPatientsPage();
        return;
    }

    let result = patients.filter(p =>
        p.name.toLowerCase().includes(value) ||
        p.id.toLowerCase().includes(value) ||
        p.condition.toLowerCase().includes(value)
    );

    showAllPatientsPage();
    renderPatients(result);
};

document.querySelector(".clear-btn").onclick = () => {
    document.querySelector(".search-input").value = "";
    showAllPatientsPage();
};

// Filter functionality
const conditionFilter = document.querySelector(".condition-filter");
const adherenceFilter = document.querySelector(".adherence-filter");

conditionFilter.onchange = applyFilters;
adherenceFilter.onchange = applyFilters;

function applyFilters() {
    let cond = conditionFilter.value;
    let adh = adherenceFilter.value;

    let filtered = patients;

    if (cond !== "All Conditions") {
        filtered = filtered.filter(p => p.condition.toLowerCase() === cond.toLowerCase());
    }

    if (adh.includes("High")) filtered = filtered.filter(p => p.adherence >= 80);
    else if (adh.includes("Medium")) filtered = filtered.filter(p => p.adherence >= 50 && p.adherence < 80);
    else if (adh.includes("Low")) filtered = filtered.filter(p => p.adherence < 50);

    showAllPatientsPage();
    renderPatients(filtered);
}

// Button event listeners
document.getElementById("openAddPage").onclick = showAddPatientPage;
document.getElementById("openAllPatientsPage").onclick = showAllPatientsPage;

document.getElementById("backToDashboard1").onclick = showMainPage;
document.getElementById("backToDashboard2").onclick = showMainPage;

// Load patients from localStorage on startup
function loadPatientsFromStorage() {
    const savedPatients = localStorage.getItem('patients');
    if (savedPatients) {
        try {
            patients = JSON.parse(savedPatients);
            showToast(`Loaded ${patients.length} patient(s) from storage`, 'info');
        } catch (error) {
            console.error('Error loading patients from storage:', error);
            showToast('Failed to load saved patient data', 'error');
        }
    }
}

// Initialize app
loadPatientsFromStorage();
updateStats();
displayHealthNews();
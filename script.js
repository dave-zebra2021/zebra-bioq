document.addEventListener("DOMContentLoaded", function() {
    // Ensure settings form exists before binding event
    const settingsForm = document.getElementById("settings-form");
    if (settingsForm) {
        settingsForm.addEventListener("submit", function(event) {
            event.preventDefault(); // Prevent default form submission
            saveSettings();
        });
    }

    // Ensure `showSection()` exists before execution
    if (typeof showSection === "function") {
        showSection("dashboard"); // Set the default section
    }

    loadSettings(); // Load stored settings
});

// ✅ Function to Save Settings
function saveSettings() {
    if (!document.getElementById("settings-form")) return;

    // Helper function to safely get input values
    function getValue(id) {
        const el = document.getElementById(id);
        return el ? el.value : "";
    }

    // Save Feedstock Data
    const feedRows = document.querySelectorAll(".feed-row");
    const feedSettings = Array.from(feedRows).map(row => ({
        name: row.querySelector("select") ? row.querySelector("select").value : "",
        tonnage: row.querySelector("input:nth-child(2)") ? row.querySelector("input:nth-child(2)").value : "",
        cost: row.querySelector("input:nth-child(3)") ? row.querySelector("input:nth-child(3)").value : ""
    }));
    localStorage.setItem("feedSettings", JSON.stringify(feedSettings));

    // Save Water & Recirculation Data
    localStorage.setItem("freshWater", getValue("freshWater"));
    localStorage.setItem("recirculated", getValue("recirculated"));
    localStorage.setItem("recirculatedDM", getValue("recirculatedDM"));

    // Save Biogas Output Data
    const outputRows = document.querySelectorAll(".biogas-output-row");
    const biogasOutputs = Array.from(outputRows).map(row => ({
        type: row.querySelector("select") ? row.querySelector("select").value : "",
        value: row.querySelector("input:nth-child(2)") ? row.querySelector("input:nth-child(2)").value : "",
        income: row.querySelector("input:nth-child(3)") ? row.querySelector("input:nth-child(3)").value : ""
    }));
    localStorage.setItem("biogasOutputs", JSON.stringify(biogasOutputs));

    // Save Additional Values
    localStorage.setItem("annualOPEX", getValue("annualOPEX"));
    localStorage.setItem("annualPowerCosts", getValue("annualPowerCosts"));
    localStorage.setItem("maxDigesterVolume", getValue("maxDigesterVolume"));
    localStorage.setItem("maxDigesterFeed", getValue("maxDigesterFeed"));
    localStorage.setItem("maxBiogasProduced", getValue("maxBiogasProduced"));

    alert("Settings saved successfully!");
}

// ✅ Function to Load Settings
function loadSettings() {
    const safeSetValue = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.value = value;
    };

    // Load Feedstock Data
    const savedFeeds = JSON.parse(localStorage.getItem("feedSettings")) || [];
    savedFeeds.forEach(feed => addFeedRow(feed.name, feed.tonnage, feed.cost));

    // Load Water & Recirculation Data
    safeSetValue("freshWater", localStorage.getItem("freshWater") || "");
    safeSetValue("recirculated", localStorage.getItem("recirculated") || "");
    safeSetValue("recirculatedDM", localStorage.getItem("recirculatedDM") || "");

    // Load Biogas Output Data
    const savedBiogasOutputs = JSON.parse(localStorage.getItem("biogasOutputs")) || [];
    savedBiogasOutputs.forEach(output => addBiogasOutputRow(output.type, output.value, output.income));

    // Load Additional Values
    safeSetValue("annualOPEX", localStorage.getItem("annualOPEX") || "");
    safeSetValue("annualPowerCosts", localStorage.getItem("annualPowerCosts") || "");
    safeSetValue("maxDigesterVolume", localStorage.getItem("maxDigesterVolume") || "");
    safeSetValue("maxDigesterFeed", localStorage.getItem("maxDigesterFeed") || "");
    safeSetValue("maxBiogasProduced", localStorage.getItem("maxBiogasProduced") || "");
}

// ✅ Function to Add a New Feedstock Input Row
function addFeedRow(selectedFeed = "", feedTonnage = "", feedCost = "") {
    const feedContainer = document.getElementById("feed-inputs-container");
    if (!feedContainer) return;

    const labData = ["Maize Silage", "Grass Silage", "Cattle Manure", "Pig Manure",
        "Poultry Manure", "Food Waste", "Wheat Straw", "Sugar Beet",
        "Potato Waste", "Fruit Waste", "Vegetable Waste", "Sewage Sludge",
        "Dairy Waste", "Fish Waste", "Distillery Waste", "Brewery Waste",
        "Algae", "Corn Stover", "Rice Straw", "Garden Waste",
        "Paper Waste", "Chicken Litter", "Coffee Grounds", "Olive Pomace",
        "Glycerol", "Molasses", "Cassava Peels", "Banana Waste", "POME"
    ];

    const row = document.createElement("div");
    row.classList.add("feed-row");

    const select = document.createElement("select");
    select.innerHTML = labData.map(feed =>
        `<option value="${feed}" ${feed === selectedFeed ? "selected" : ""}>${feed}</option>`
    ).join("");

    const inputTonnage = document.createElement("input");
    inputTonnage.type = "number";
    inputTonnage.step = "0.01";
    inputTonnage.placeholder = "Enter Tonnage";
    inputTonnage.value = feedTonnage;

    const inputCost = document.createElement("input");
    inputCost.type = "number";
    inputCost.step = "0.01";
    inputCost.placeholder = "Enter Cost per Tonne";
    inputCost.value = feedCost;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "❌";
    removeBtn.onclick = () => row.remove();

    row.appendChild(select);
    row.appendChild(inputTonnage);
    row.appendChild(inputCost);
    row.appendChild(removeBtn);
    feedContainer.appendChild(row);
}

function addBiogasOutputRow(selectedOutput = "", outputValue = "", incomeValue = "") {
    const biogasContainer = document.getElementById("biogas-output-container");
    if (!biogasContainer) return;

    const row = document.createElement("div");
    row.classList.add("biogas-output-row");

    const select = document.createElement("select");
    const outputOptions = ["CHP", "Boiler", "CBG (BtG)", "Flare", "Cooking", "NA"];
    select.innerHTML = outputOptions.map(option =>
        `<option value="${option}" ${option === selectedOutput ? "selected" : ""}>${option}</option>`
    ).join("");

    const inputValue = document.createElement("input");
    inputValue.type = "number";
    inputValue.step = "0.01";
    inputValue.placeholder = "Enter Output kW/m³";
    inputValue.value = outputValue;

    const inputIncome = document.createElement("input");
    inputIncome.type = "number";
    inputIncome.step = "0.01";
    inputIncome.placeholder = "Enter Income per kW/m³";
    inputIncome.value = incomeValue;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "❌";
    removeBtn.onclick = () => row.remove();

    row.appendChild(select);
    row.appendChild(inputValue);
    row.appendChild(inputIncome);
    row.appendChild(removeBtn);
    biogasContainer.appendChild(row);
}

// ✅ Function to Show Sections Dynamically
function showSection(sectionId) {
    document.querySelectorAll(".content-section").forEach(section => {
        section.style.display = "none";
    });

    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.style.display = "block";
    }
}
// ✅ Set Default Tab on Page Load
document.addEventListener("DOMContentLoaded", function() {
    showSection("dashboard"); // Default to dashboard
});

function displayLabData() {
    console.log("🔄 Running displayLabData()...");

    let labData = JSON.parse(localStorage.getItem("labData")) || [];
    const tableBody = document.getElementById("lab-data-body");

    if (!tableBody) {
        console.error("❌ Table body element not found! Check your HTML.");
        return;
    }

    tableBody.innerHTML = ""; // Clear previous data

    // ✅ Ensure `labData` has content
    if (labData.length === 0) {
        console.warn("⚠️ Lab Data is empty! Re-storing and reloading...");
        storeLabData();
        setTimeout(displayLabData, 500); // Retry after 500ms
        return;
    }

    // ✅ Dynamically create table rows
    labData.forEach(row => {
        const tr = document.createElement("tr");
        row.forEach(cell => {
            const td = document.createElement("td");
            td.textContent = cell;
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });

    console.log("✅ Lab Source Data Table Updated.");
}

// ✅ Run on Page Load
document.addEventListener("DOMContentLoaded", function() {
    console.log("🔄 Loading Lab Data Table...");
    displayLabData();
});

function storeLabData() {
    console.log("⚡ Running storeLabData()...");

    let labData = JSON.parse(localStorage.getItem("labData")) || [];

    // If `labData` is already stored, do not overwrite it
    if (labData.length === 0) {
        labData = [
            ["Maize Silage", "33", "96", "220", "55", "40"],
            ["Grass Silage", "40", "90", "200", "55", "30"],
            ["Cattle Manure", "12", "85", "25", "60", "25"],
            ["Pig Manure", "8", "80", "30", "65", "20"],
            ["Poultry Manure", "30", "80", "60", "70", "10"],
            ["Food Waste", "30", "95", "180", "60", "25"],
            ["Wheat Straw", "90", "90", "300", "55", "100"],
            ["Sugar Beet", "25", "95", "200", "55", "30"],
            ["Potato Waste", "25", "95", "250", "60", "30"],
            ["Fruit Waste", "20", "90", "150", "60", "45"],
            ["Vegetable Waste", "20", "90", "120", "60", "25"],
            ["Sewage Sludge", "12", "70", "20", "65", "10"],
            ["Dairy Waste", "12", "90", "100", "70", "15"],
            ["Fish Waste", "35", "80", "120", "70", "10"],
            ["Distillery Waste", "10", "90", "80", "65", "25"],
            ["Brewery Waste", "10", "90", "80", "65", "25"],
            ["Algae", "15", "80", "100", "70", "30"],
            ["Corn Stover", "90", "90", "200", "55", "80"],
            ["Rice Straw", "85", "85", "150", "55", "70"],
            ["Garden Waste", "60", "80", "120", "60", "30"],
            ["Paper Waste", "95", "90", "100", "55", "200"],
            ["Chicken Litter", "70", "80", "200", "65", "10"],
            ["Coffee Grounds", "60", "80", "150", "65", "25"],
            ["Olive Pomace", "50", "90", "150", "60", "40"],
            ["Glycerol", "10", "99", "400", "75", "10"],
            ["Molasses", "75", "85", "310", "53", "25"],
            ["Cassava Peels", "35", "92", "250", "55", "30"],
            ["Banana Waste", "20", "90", "200", "55", "35"],
            ["Palm Oil Mill Effluent (POME)", "7", "95", "31", "65", "25"]
        ];

        localStorage.setItem("labData", JSON.stringify(labData)); // ✅ Store Lab Data
        console.log("✅ Lab Data Stored Successfully!");
    } else {
        console.log("🔹 Lab Data Already Exists in localStorage. Skipping storage.");
    }
}

// Ensure Lab Data is stored on page load
document.addEventListener("DOMContentLoaded", storeLabData);

// 🚀 Generate Biogas Output Cards
function generateBiogasOutputs() {
    console.log("🔄 Generating Biogas Output Cards...");

    const outputContainer = document.getElementById("gas-output-container");
    if (!outputContainer) return;

    outputContainer.innerHTML = ""; // Clear previous content

    // 🔹 Load saved biogas output selections
    const savedBiogasOutputs = JSON.parse(localStorage.getItem("biogasOutputs")) || [];

    if (savedBiogasOutputs.length === 0) {
        console.warn("⚠️ No Biogas Outputs Selected in Settings.");
        outputContainer.innerHTML = "<p>No biogas outputs selected.</p>";
        return;
    }

    // 🔹 SVG Icons for Each Biogas Output
    const biogasIcons = {
        "Flare": `<svg width="200" height="300" viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">
            <rect x="80" y="100" width="40" height="150" fill="gray" stroke="black" stroke-width="2" />
            <rect x="60" y="250" width="80" height="20" fill="black" />
            <path d="M100,70 C90,60 110,40 100,30 C120,40 130,60 120,80 C115,90 105,85 100,70" 
                  fill="orange" stroke="red" stroke-width="2"/>
            <path d="M100,90 C85,75 115,50 100,35 C115,50 125,75 110,95 C105,100 95,95 100,90" 
                  fill="yellow" stroke="orange" stroke-width="2"/>
        </svg>`,
        "CHP": `<svg width="250" height="200" viewBox="0 0 250 200" xmlns="http://www.w3.org/2000/svg">
            <rect x="50" y="50" width="150" height="80" fill="gray" stroke="black" stroke-width="2" />
            <rect x="190" y="40" width="10" height="30" fill="black" />
            <polygon points="120,60 135,60 125,85 140,85 110,120 120,90 105,90" fill="yellow" stroke="black" stroke-width="2"/>
        </svg>`,
        "Boiler": `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <rect x="60" y="50" width="80" height="100" fill="gray" stroke="black" stroke-width="2" />
            <rect x="50" y="40" width="100" height="10" fill="black" />
            <rect x="50" y="150" width="100" height="10" fill="black" />
            <path d="M100,100 C90,90 110,70 100,60 C120,70 130,90 120,110 C115,120 105,115 100,100" 
                  fill="orange" stroke="red" stroke-width="2"/>
        </svg>`,
        "CBG (BtG)": `<svg width="250" height="200" viewBox="0 0 250 200" xmlns="http://www.w3.org/2000/svg">
            <rect x="100" y="50" width="50" height="100" fill="green" stroke="black" stroke-width="2" rx="10" />
            <rect x="115" y="30" width="20" height="20" fill="gray" stroke="black" stroke-width="2"/>
            <rect x="110" y="20" width="30" height="10" fill="black" />
            <line x1="125" y1="150" x2="125" y2="180" stroke="black" stroke-width="4"/>
            <line x1="100" y1="180" x2="150" y2="180" stroke="black" stroke-width="4"/>
        </svg>`,
        "Cooking": `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <rect x="50" y="120" width="100" height="40" fill="black" stroke="gray" stroke-width="2" />
            <circle cx="100" cy="110" r="20" fill="gray" stroke="black" stroke-width="2" />
            <path d="M100,90 C95,80 105,65 100,55 C110,65 115,80 110,95 C108,100 102,95 100,90" 
                  fill="blue" stroke="darkblue" stroke-width="2"/>
        </svg>`
    };

    // 🔹 Create Output Cards
    savedBiogasOutputs.forEach(output => {
        const type = output.type;
        const icon = biogasIcons[type] || "";

        const card = document.createElement("div");
        card.classList.add("biogas-output-card");

        card.innerHTML = `
            <h3>${type}</h3>
            <div class="linear-gauge">
                <div class="gauge-fill" id="${type.replace(/\s+/g, '-').toLowerCase()}-gauge"></div>
            </div>
            <div class="output-icon">${icon}</div>
            <input type="number" placeholder="Enter Actual Value" id="${type.replace(/\s+/g, '-').toLowerCase()}-value">
        `;

        outputContainer.appendChild(card);
    });

    console.log("✅ Biogas Output Cards Generated.");
}

// ✅ Run on Page Load
document.addEventListener("DOMContentLoaded", generateBiogasOutputs);


function updateFeedSummary() {
    const feedSettings = JSON.parse(localStorage.getItem("feedSettings")) || [];
    const labData = JSON.parse(localStorage.getItem("labData")) || [];

    console.log("Loaded Feed Settings:", feedSettings);
    console.log("Loaded Lab Data:", labData);

    const tableBody = document.querySelector("#feed-summary-table tbody");
    if (!tableBody) return;
    tableBody.innerHTML = ""; // Clear existing rows

    feedSettings.forEach(feed => {
        const feedName = feed.name;
        const annualTonnage = parseFloat(feed.tonnage) || 0;
        const dailyTonnage = annualTonnage / 365; // Convert annual to daily feed

        // Find Biogas Yield from Lab Table
        const labEntry = labData.find(row => row[0] === feedName);
        let biogasYield = labEntry ? parseFloat(labEntry[3]) || 0 : 0; // Column 3 is Biogas Yield

        console.log(`Feed: ${feedName}, Biogas Yield: ${biogasYield}, Daily Tonnage: ${dailyTonnage}`);

        if (isNaN(biogasYield)) {
            console.warn(`Biogas Yield for ${feedName} is not valid.`);
            biogasYield = 0;
        }

        // Calculate theoretical m³ Produced
        const theoreticalM3Produced = dailyTonnage * biogasYield;

        // Create Row
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><strong>${feedName}</strong></td>
            <td>${dailyTonnage.toFixed(2)}</td>
            <td>${theoreticalM3Produced.toFixed(2)}</td>
            <td><input type="number" step="0.01" placeholder="Enter Actual Fed"></td>
            <td><input type="number" step="0.01" placeholder="Enter Actual m³"></td>
        `;

        tableBody.appendChild(row);
    });

    console.log("Updated Feed Summary Table Successfully.");
}
// 🚀 Function to Calculate Financials
function updateFinancials() {
    console.log("🔄 Updating Financials...");

    const biogasOutputs = JSON.parse(localStorage.getItem("biogasOutputs")) || [];
    const annualOPEX = parseFloat(localStorage.getItem("annualOPEX")) || 0;
    const annualPowerCosts = parseFloat(localStorage.getItem("annualPowerCosts")) || 0;

    let totalIncome = 0;
    const financialTableBody = document.querySelector("#financial-summary-table tbody");
    financialTableBody.innerHTML = ""; // Clear old rows

    biogasOutputs.forEach(output => {
        const type = output.type;
        const kWm3Output = parseFloat(output.value) || 0;
        const costPerkWm3 = parseFloat(output.income) || 0;
        const calculatedIncome = kWm3Output * costPerkWm3;

        totalIncome += calculatedIncome;

        // 🔹 Create table row
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><strong>${type}</strong></td>
            <td>${kWm3Output.toFixed(2)}</td>
            <td>£${costPerkWm3.toFixed(2)}</td>
            <td>£${calculatedIncome.toFixed(2)}</td>
        `;
        financialTableBody.appendChild(row);
    });

    // 🔹 Calculate KPI Values
    const totalExpenses = annualOPEX + annualPowerCosts;
    const netProfit = totalIncome - totalExpenses;

    // 🔹 Update KPI Values
    document.getElementById("income-value").textContent = `£${totalIncome.toLocaleString()}`;
    document.getElementById("expenses-value").textContent = `£${totalExpenses.toLocaleString()}`;
    document.getElementById("net-profit-value").textContent = `£${netProfit.toLocaleString()}`;

    console.log("✅ Financials Updated.");
}

// ✅ Run Financial Calculation on Page Load
document.addEventListener("DOMContentLoaded", updateFinancials);

// Load Feed Summary on Dashboard Load
document.addEventListener("DOMContentLoaded", updateFeedSummary);

// 🚀 Dummy Data for Testing
const dummyData = {
    dates: ["2024-03-01", "2024-03-02", "2024-03-03", "2024-03-04", "2024-03-05"],
    olr: [1.2, 1.5, 1.3, 1.7, 1.6],
    hrt: [25, 24, 23, 22, 21],
    ammonia: [300, 320, 310, 290, 280],
    vsWeight: [85, 83, 82, 81, 80],
    runRate: [95, 94, 96, 92, 93],
    efficiency: [87, 88, 86, 89, 85],
    biogasProduced: [500, 520, 530, 540, 550],
    totalFed: [50, 52, 51, 53, 50],
    methanePercentage: [55, 54, 56, 53, 52]
};

// ✅ Store Dummy Data in Local Storage
localStorage.setItem("analyticsData", JSON.stringify(dummyData));

// 🚀 Function to Load Data and Update KPI Cards
function updateKPIValues() {
    const analyticsData = JSON.parse(localStorage.getItem("analyticsData")) || dummyData;

    document.getElementById("olr-value").textContent = `${analyticsData.olr[analyticsData.olr.length - 1]} kgVS/m³`;
    document.getElementById("hrt-value").textContent = `${analyticsData.hrt[analyticsData.hrt.length - 1]} days`;
    document.getElementById("ammonia-value").textContent = `${analyticsData.ammonia[analyticsData.ammonia.length - 1]} mg/L`;
    document.getElementById("efficiency-value").textContent = `${analyticsData.efficiency[analyticsData.efficiency.length - 1]}%`;
}

// ✅ Chart Configuration
let chartInstance = null;

function updateChart() {
    const analyticsData = JSON.parse(localStorage.getItem("analyticsData")) || dummyData;
    const metric = document.getElementById("metric-select").value;

    const ctx = document.getElementById('analyticsChart').getContext('2d');

    // Destroy existing chart
    if (chartInstance) {
        chartInstance.destroy();
    }

    // Create new chart with selected metric
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: analyticsData.dates,
            datasets: [{
                label: metric.charAt(0).toUpperCase() + metric.slice(1),
                data: analyticsData[metric],
                borderColor: 'blue',
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}
document.addEventListener("DOMContentLoaded", function() {
    console.log("✅ Page Loaded: Analytics Section Initialized");

    updateAnalyticsData();
});

function updateAnalyticsData() {
    console.log("🔄 Running updateAnalyticsData()...");

    // Dummy Data
    const analyticsData = [
        { date: "2024-03-01", OLR: 1.2, HRT: 18, Ammonia: 250, VS_Weight: 75, Run_Rate: 90, Efficiency: 85, Biogas_Produced: 1500, Total_Fed: 2000, Methane_Percentage: 65 },
        { date: "2024-03-02", OLR: 1.3, HRT: 17, Ammonia: 255, VS_Weight: 78, Run_Rate: 92, Efficiency: 88, Biogas_Produced: 1550, Total_Fed: 2100, Methane_Percentage: 66 },
        { date: "2024-03-03", OLR: 1.1, HRT: 19, Ammonia: 245, VS_Weight: 70, Run_Rate: 88, Efficiency: 82, Biogas_Produced: 1400, Total_Fed: 1900, Methane_Percentage: 63 },
    ];

    console.log("📊 Loaded Analytics Data:", analyticsData); // ✅ Check if data is being loaded

    // Inject into a Table (Replace `analytics-table` with your actual table ID)
    const tableBody = document.getElementById("analytics-table-body");
    if (!tableBody) {
        console.error("❌ analytics-table-body not found!");
        return;
    }

    tableBody.innerHTML = ""; // Clear existing rows

    analyticsData.forEach((entry) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${entry.date}</td>
            <td>${entry.OLR}</td>
            <td>${entry.HRT}</td>
            <td>${entry.Ammonia}</td>
            <td>${entry.VS_Weight}</td>
            <td>${entry.Run_Rate}</td>
            <td>${entry.Efficiency}</td>
            <td>${entry.Biogas_Produced}</td>
            <td>${entry.Total_Fed}</td>
            <td>${entry.Methane_Percentage}</td>
        `;
        tableBody.appendChild(row);
    });

    console.log("✅ Analytics Data Rendered in Table");
}

// ✅ Load KPIs and Default Chart on Page Load
document.addEventListener("DOMContentLoaded", function() {
    updateKPIValues();
    updateChart();
});

// ✅ Ensure All Functions Are Accessible in `index.html`
window.addFeedRow = addFeedRow;
window.saveSettings = saveSettings;
window.loadSettings = loadSettings;
window.showSection = showSection;
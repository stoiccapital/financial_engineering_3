// Shared Functions for Investment Calculator
// Common utilities used by all calculator modules

let balanceChart = null;

// Show/hide calculation modes
function showMode(mode) {
    // Hide all calculation modes
    const modes = ['end-amount', 'additional-contribution', 'return-rate', 'starting-amount', 'investment-length'];
    modes.forEach(m => {
        document.getElementById(m).classList.add('hidden');
    });
    
    // Show selected mode
    document.getElementById(mode).classList.remove('hidden');
    
    // Update active button
    const buttons = document.querySelectorAll('.mode-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Clear all results and ensure they stay hidden
    clearAllResults();
    
    // Auto-calculate for the selected mode
    setTimeout(function() {
        switch(mode) {
            case 'end-amount':
                calculateEndAmount();
                break;
            case 'additional-contribution':
                calculateAdditionalContribution();
                break;
            case 'return-rate':
                calculateReturnRate();
                break;
            case 'starting-amount':
                calculateStartingAmount();
                break;
            case 'investment-length':
                calculateInvestmentLength();
                break;
        }
    }, 100);
}

// Clear all result displays
function clearAllResults() {
    const results = [
        'ea-result', 'ea-starting-amount-result', 'ea-total-contributions-result', 'ea-total-interest-result',
        'ac-result', 'rr-result', 'sa-result', 'il-result'
    ];
    results.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.classList.add('hidden');
        }
    });
    
    // Clear the chart if it exists
    if (balanceChart) {
        balanceChart.destroy();
        balanceChart = null;
    }
    
    // Reset the yearly breakdown table to empty state (but keep it visible)
    const tbody = document.getElementById('breakdown-tbody');
    if (tbody) {
        tbody.innerHTML = `
            <tr class="empty-state">
                <td colspan="5" style="text-align: center; color: #666; font-style: italic; padding: 24px;">
                    Enter values and calculate to see yearly breakdown
                </td>
            </tr>
        `;
    }
}

// Function to show only relevant results for each mode
function showOnlyRelevantResults(mode) {
    // Hide all result cards first
    const allResults = [
        'ea-result', 'ea-starting-amount-result', 'ea-total-contributions-result', 'ea-total-interest-result',
        'ac-result', 'ac-end-amount-result', 'ac-starting-amount-result', 'ac-total-contributions-result', 'ac-total-interest-result',
        'rr-result', 'rr-end-amount-result', 'rr-starting-amount-result', 'rr-total-contributions-result', 'rr-total-interest-result',
        'sa-result', 'sa-end-amount-result', 'sa-starting-amount-result', 'sa-total-contributions-result', 'sa-total-interest-result',
        'il-result', 'il-end-amount-result', 'il-starting-amount-result', 'il-total-contributions-result', 'il-total-interest-result'
    ];
    allResults.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.classList.add('hidden');
        }
    });
    
    // Then show only the relevant results for the current mode
    switch(mode) {
        case 'end-amount':
            // End Amount mode shows multiple result cards
            document.getElementById('ea-result').classList.remove('hidden');
            document.getElementById('ea-starting-amount-result').classList.remove('hidden');
            document.getElementById('ea-total-contributions-result').classList.remove('hidden');
            document.getElementById('ea-total-interest-result').classList.remove('hidden');
            console.log('Showing End Amount results');
            break;
        case 'additional-contribution':
            // Additional Contribution mode shows multiple result cards
            document.getElementById('ac-result').classList.remove('hidden');
            document.getElementById('ac-end-amount-result').classList.remove('hidden');
            document.getElementById('ac-starting-amount-result').classList.remove('hidden');
            document.getElementById('ac-total-contributions-result').classList.remove('hidden');
            document.getElementById('ac-total-interest-result').classList.remove('hidden');
            console.log('Showing Additional Contribution results');
            break;
        case 'return-rate':
            // Return Rate mode shows multiple result cards
            document.getElementById('rr-result').classList.remove('hidden');
            document.getElementById('rr-end-amount-result').classList.remove('hidden');
            document.getElementById('rr-starting-amount-result').classList.remove('hidden');
            document.getElementById('rr-total-contributions-result').classList.remove('hidden');
            document.getElementById('rr-total-interest-result').classList.remove('hidden');
            console.log('Showing Return Rate results');
            break;
        case 'starting-amount':
            // Starting Amount mode shows multiple result cards
            document.getElementById('sa-result').classList.remove('hidden');
            document.getElementById('sa-end-amount-result').classList.remove('hidden');
            document.getElementById('sa-starting-amount-result').classList.remove('hidden');
            document.getElementById('sa-total-contributions-result').classList.remove('hidden');
            document.getElementById('sa-total-interest-result').classList.remove('hidden');
            console.log('Showing Starting Amount results');
            break;
        case 'investment-length':
            // Investment Length mode shows multiple result cards
            document.getElementById('il-result').classList.remove('hidden');
            document.getElementById('il-end-amount-result').classList.remove('hidden');
            document.getElementById('il-starting-amount-result').classList.remove('hidden');
            document.getElementById('il-total-contributions-result').classList.remove('hidden');
            document.getElementById('il-total-interest-result').classList.remove('hidden');
            console.log('Showing Investment Length results');
            break;
    }
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Format percentage
function formatPercentage(rate) {
    return rate.toFixed(2) + '%';
}

// Format years
function formatYears(years) {
    if (years < 1) {
        const months = Math.ceil(years * 12);
        return months + ' month' + (months !== 1 ? 's' : '');
    } else {
        const wholeYears = Math.floor(years);
        const remainingMonths = Math.round((years - wholeYears) * 12);
        
        if (remainingMonths === 0) {
            return wholeYears + ' year' + (wholeYears !== 1 ? 's' : '');
        } else {
            return wholeYears + ' year' + (wholeYears !== 1 ? 's' : '') + ' and ' + 
                   remainingMonths + ' month' + (remainingMonths !== 1 ? 's' : '');
        }
    }
}

// Calculate future value with compound interest and monthly contributions
function calculateFutureValue(principal, monthlyContribution, annualRate, years) {
    const monthlyRate = annualRate / 100 / 12;
    const months = years * 12;
    
    // Future value of initial principal
    const principalFV = principal * Math.pow(1 + monthlyRate, months);
    
    // Future value of monthly contributions
    let contributionFV;
    if (monthlyRate === 0) {
        // If no interest, contributions are just the sum of all payments
        contributionFV = monthlyContribution * months;
    } else {
        contributionFV = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    }
    
    return principalFV + contributionFV;
}

// Calculate required monthly contribution to reach target
function calculateRequiredContribution(principal, targetAmount, annualRate, years) {
    const monthlyRate = annualRate / 100 / 12;
    const months = years * 12;
    
    // Future value of initial principal
    const principalFV = principal * Math.pow(1 + monthlyRate, months);
    
    // Required future value from contributions
    const requiredContributionFV = targetAmount - principalFV;
    
    // Calculate required monthly contribution
    let monthlyContribution;
    if (monthlyRate === 0) {
        // If no interest, just divide by number of months
        monthlyContribution = requiredContributionFV / months;
    } else {
        monthlyContribution = requiredContributionFV / ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    }
    
    return Math.max(0, monthlyContribution);
}

// Calculate required return rate using binary search
function calculateRequiredRate(principal, monthlyContribution, targetAmount, years) {
    let low = 0;
    let high = 100;
    let mid;
    const tolerance = 0.01;
    
    // Check if it's even possible
    const maxPossible = calculateFutureValue(principal, monthlyContribution, high, years);
    if (maxPossible < targetAmount) {
        return -1; // Impossible to reach target
    }
    
    while (high - low > tolerance) {
        mid = (low + high) / 2;
        const fv = calculateFutureValue(principal, monthlyContribution, mid, years);
        
        if (fv < targetAmount) {
            low = mid;
        } else {
            high = mid;
        }
    }
    
    return (low + high) / 2;
}

// Calculate required starting amount
function calculateRequiredPrincipal(monthlyContribution, targetAmount, annualRate, years) {
    const monthlyRate = annualRate / 100 / 12;
    const months = years * 12;
    
    // Future value of monthly contributions
    let contributionFV;
    if (monthlyRate === 0) {
        // If no interest, contributions are just the sum of all payments
        contributionFV = monthlyContribution * months;
    } else {
        contributionFV = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    }
    
    // Required future value from principal
    const requiredPrincipalFV = targetAmount - contributionFV;
    
    // Calculate required starting principal
    const principal = requiredPrincipalFV / Math.pow(1 + monthlyRate, months);
    
    return Math.max(0, principal);
}

// Calculate time to reach target using binary search
function calculateTimeToTarget(principal, monthlyContribution, targetAmount, annualRate) {
    let low = 0;
    let high = 100; // Max 100 years
    let mid;
    const tolerance = 0.01;
    
    while (high - low > tolerance) {
        mid = (low + high) / 2;
        const fv = calculateFutureValue(principal, monthlyContribution, annualRate, mid);
        
        if (fv < targetAmount) {
            low = mid;
        } else {
            high = mid;
        }
    }
    
    return (low + high) / 2;
}

// Generate yearly breakdown table
function generateYearlyBreakdown(startingAmount, monthlyContribution, annualRate, years) {
    const monthlyRate = annualRate / 100 / 12;
    const tbody = document.getElementById('breakdown-tbody');
    
    if (!tbody) {
        console.error('Could not find breakdown-tbody element');
        return;
    }
    
    // Clear any existing content including empty state message
    tbody.innerHTML = '';
    
    let currentBalance = startingAmount;
    
    for (let year = 1; year <= Math.ceil(years); year++) {
        const yearStartBalance = currentBalance;
        const isPartialYear = year > years;
        const monthsInYear = isPartialYear ? Math.round((years - (year - 1)) * 12) : 12;
        
        let yearlyContributions = 0;
        let yearlyInterest = 0;
        
        // Calculate month by month for this year
        for (let month = 1; month <= monthsInYear; month++) {
            // Add monthly contribution
            currentBalance += monthlyContribution;
            yearlyContributions += monthlyContribution;
            
            // Calculate and add interest
            const monthlyInterest = currentBalance * monthlyRate;
            currentBalance += monthlyInterest;
            yearlyInterest += monthlyInterest;
        }
        
        // Create table row
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${year}</td>
            <td>${formatCurrency(yearStartBalance)}</td>
            <td>${formatCurrency(yearlyContributions)}</td>
            <td>${formatCurrency(yearlyInterest)}</td>
            <td>${formatCurrency(currentBalance)}</td>
        `;
        tbody.appendChild(row);
        
        // Stop if we've reached the target years
        if (year >= years) break;
    }
    
    console.log('Yearly breakdown table updated with', tbody.children.length, 'rows');
}

// Create or update the balance breakdown pie chart
function updateBalanceChart(startingAmount, totalContributions, totalInterest) {
    const ctx = document.getElementById('balanceChart');
    
    if (balanceChart) {
        balanceChart.destroy();
    }
    
    const data = {
        labels: ['Starting Amount', 'Total Contributions', 'Total Interest'],
        datasets: [{
            data: [startingAmount, totalContributions, totalInterest],
            backgroundColor: [
                '#4CAF50', // Green for starting amount
                '#2196F3', // Blue for contributions
                '#FF9800'  // Orange for interest
            ],
            borderColor: [
                '#388E3C',
                '#1976D2', 
                '#F57C00'
            ],
            borderWidth: 2
        }]
    };
    
    const config = {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    align: 'start',
                    labels: {
                        padding: 15,
                        usePointStyle: true,
                        font: {
                            size: 12,
                            weight: '500'
                        },
                        generateLabels: function(chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map((label, i) => {
                                    const dataset = data.datasets[0];
                                    const value = dataset.data[i];
                                    const total = dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = ((value / total) * 100).toFixed(1);
                                    return {
                                        text: `${label}: ${formatCurrency(value)} (${percentage}%)`,
                                        fillStyle: dataset.backgroundColor[i],
                                        strokeStyle: dataset.borderColor[i],
                                        lineWidth: 2,
                                        pointStyle: 'circle',
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                },
                tooltip: {
                    enabled: false
                }
            },
            layout: {
                padding: {
                    bottom: 20
                }
            }
        }
    };
    
    balanceChart = new Chart(ctx, config);
}

// Add keyboard event listeners for Enter key and auto-calculation
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                // Find the calculate button in the same calculation mode
                const calculateBtn = this.closest('.calculation-mode').querySelector('.calculate-btn');
                if (calculateBtn) {
                    calculateBtn.click();
                }
            }
        });
        
        // Add input event listener for auto-calculation when values change
        input.addEventListener('input', function() {
            // Determine which mode is currently active and auto-calculate
            const activeMode = document.querySelector('.calculation-mode:not(.hidden)');
            if (activeMode) {
                const modeId = activeMode.id;
                setTimeout(function() {
                    switch(modeId) {
                        case 'end-amount':
                            calculateEndAmount();
                            break;
                        case 'additional-contribution':
                            calculateAdditionalContribution();
                            break;
                        case 'return-rate':
                            calculateReturnRate();
                            break;
                        case 'starting-amount':
                            calculateStartingAmount();
                            break;
                        case 'investment-length':
                            calculateInvestmentLength();
                            break;
                    }
                }, 100);
            }
        });
    });
    
    // Auto-calculate with default values when page loads
    // Wait a short moment to ensure all elements are loaded
    setTimeout(function() {
        // Calculate End Amount (default mode) automatically
        calculateEndAmount();
    }, 100);
    
    // Debug: Check if yearly breakdown elements exist
    const yearlyBreakdown = document.getElementById('yearly-breakdown');
    const breakdownTable = document.getElementById('breakdown-table');
    const breakdownTbody = document.getElementById('breakdown-tbody');
    
    console.log('Yearly breakdown elements found:');
    console.log('- yearly-breakdown:', yearlyBreakdown ? 'YES' : 'NO');
    console.log('- breakdown-table:', breakdownTable ? 'YES' : 'NO');
    console.log('- breakdown-tbody:', breakdownTbody ? 'YES' : 'NO');
    
    if (yearlyBreakdown) {
        console.log('Yearly breakdown element styles:', window.getComputedStyle(yearlyBreakdown));
    }
}); 
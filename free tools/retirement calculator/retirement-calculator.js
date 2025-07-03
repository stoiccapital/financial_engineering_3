// Retirement Calculator JavaScript

function calculateRetirement() {
    // Get input values
    const desiredIncome = parseFloat(document.getElementById('desiredIncome').value) || 0;
    const currentAssets = parseFloat(document.getElementById('currentAssets').value) || 0;
    const yearsToRetirement = parseInt(document.getElementById('yearsToRetirement').value) || 0;
    const annualReturn = parseFloat(document.getElementById('interestRate').value) / 100 || 0;
    const withdrawalRate = parseFloat(document.getElementById('withdrawalRate').value) / 100 || 0;
    
    // Calculate total amount needed at retirement
    const totalNeeded = desiredIncome / withdrawalRate;
    
    // Calculate future value of current assets
    const futureValueCurrentAssets = currentAssets * Math.pow(1 + annualReturn, yearsToRetirement);
    
    // Calculate adjusted target (what we still need to save)
    const adjustedTarget = Math.max(0, totalNeeded - futureValueCurrentAssets);
    
    // Calculate monthly investment required for adjusted target
    const monthlyReturn = annualReturn / 12;
    const totalMonths = yearsToRetirement * 12;
    
    let monthlyInvestment = 0;
    if (adjustedTarget > 0) {
        if (monthlyReturn > 0) {
            // Future Value of Annuity formula: FV = PMT × [((1 + r)^n - 1) / r]
            // Rearranged: PMT = FV / [((1 + r)^n - 1) / r]
            const denominator = (Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn;
            monthlyInvestment = adjustedTarget / denominator;
        } else {
            // If no interest, simple division
            monthlyInvestment = adjustedTarget / totalMonths;
        }
    }
    
    const totalInvested = monthlyInvestment * totalMonths;
    const totalFutureValue = futureValueCurrentAssets + (monthlyInvestment > 0 ? adjustedTarget : 0);
    const investmentGrowth = totalFutureValue - currentAssets - totalInvested;
    
    // Update results
    document.getElementById('totalNeeded').textContent = formatCurrency(totalNeeded);
    document.getElementById('futureAssets').textContent = formatCurrency(futureValueCurrentAssets);
    document.getElementById('monthlyInvestment').textContent = formatCurrency(monthlyInvestment);
    document.getElementById('totalInvested').textContent = formatCurrency(totalInvested);
    document.getElementById('investmentGrowth').textContent = formatCurrency(investmentGrowth);
    
    // Generate chart
    generateInvestmentChart(totalNeeded, annualReturn, currentAssets);
}

function generateInvestmentChart(targetAmount, annualReturn, currentAssets) {
    const ctx = document.getElementById('scenariosChart');
    
    // Clear existing chart
    if (window.investmentChartInstance) {
        window.investmentChartInstance.destroy();
    }
    
    // Generate data points
    const years = [];
    const monthlyInvestments = [];
    
    // Create data points for years 1 to 50
    for (let year = 1; year <= 50; year++) {
        const monthlyAmount = calculateMonthlyInvestmentNeeded(targetAmount, year, annualReturn, currentAssets);
        // Only include reasonable values
        if (monthlyAmount >= 0) {
            years.push(year);
            monthlyInvestments.push(monthlyAmount);
        }
    }
    
    // Create chart
    const maxY = Math.max(...monthlyInvestments, 1);
    window.investmentChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'Monthly Investment Needed',
                data: monthlyInvestments,
                borderColor: '#000',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#000',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: '#000',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#333',
                    borderWidth: 1,
                    callbacks: {
                        title: function(context) {
                            return `Year ${context[0].dataIndex + 1}`;
                        },
                        label: function(context) {
                            const monthlyAmount = context.parsed.y;
                            return `Monthly Investment: ${formatCurrency(monthlyAmount)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Years Until Retirement',
                        color: '#333',
                        font: {
                            size: 14,
                            weight: '600'
                        }
                    },
                    grid: {
                        color: '#e5e5e5'
                    },
                    ticks: {
                        color: '#666',
                        maxTicksLimit: 20,
                        callback: function(value, index) {
                            // Show every 5th year for better readability
                            if (index % 5 === 0 || index === 0 || index === 49) {
                                return index + 1;
                            }
                            return '';
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Monthly Investment Needed ($)',
                        color: '#333',
                        font: {
                            size: 14,
                            weight: '600'
                        }
                    },
                    grid: {
                        color: '#e5e5e5'
                    },
                    ticks: {
                        color: '#666',
                        callback: function(value) {
                            return formatCompactCurrency(value);
                        }
                    },
                    min: 0,
                    max: maxY * 1.1
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

function generateCapitalGrowthChart(targetAmount, annualReturn, currentAssets, yearsToRetirement) {
    const ctx = document.getElementById('capitalGrowthChart');
    if (window.capitalGrowthChartInstance) {
        window.capitalGrowthChartInstance.destroy();
    }
    const years = [];
    const capital = [];
    for (let year = 1; year <= 50; year++) {
        // Calculate monthly investment needed for this year
        const monthlyInvestment = calculateMonthlyInvestmentNeeded(targetAmount, year, annualReturn, currentAssets);
        // Future value of current assets after 'year' years
        const fvCurrent = currentAssets * Math.pow(1 + annualReturn, year);
        // Future value of new investments (ordinary annuity formula)
        let fvInvestments = 0;
        if (monthlyInvestment > 0) {
            const monthlyReturn = annualReturn / 12;
            const n = year * 12;
            if (Math.abs(monthlyReturn) < 1e-10) {
                fvInvestments = monthlyInvestment * n;
            } else {
                fvInvestments = monthlyInvestment * ((Math.pow(1 + monthlyReturn, n) - 1) / monthlyReturn);
            }
        }
        years.push(year);
        capital.push(fvCurrent + fvInvestments);
    }
    const maxY = Math.max(...capital, 1);
    window.capitalGrowthChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'Projected Capital',
                data: capital,
                borderColor: '#0066cc',
                backgroundColor: 'rgba(0, 102, 204, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#0066cc',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: '#000',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#333',
                    borderWidth: 1,
                    callbacks: {
                        title: function(context) {
                            return `Year ${context[0].dataIndex + 1}`;
                        },
                        label: function(context) {
                            const capital = context.parsed.y;
                            return `Projected Capital: ${formatCurrency(capital)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Years',
                        color: '#333',
                        font: { size: 14, weight: '600' }
                    },
                    grid: { color: '#e5e5e5' },
                    ticks: {
                        color: '#666',
                        maxTicksLimit: 20,
                        callback: function(value, index) {
                            if (index % 5 === 0 || index === 0 || index === 49) {
                                return index + 1;
                            }
                            return '';
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Projected Capital ($)',
                        color: '#333',
                        font: { size: 14, weight: '600' }
                    },
                    grid: { color: '#e5e5e5' },
                    ticks: {
                        color: '#666',
                        callback: function(value) {
                            return formatCompactCurrency(value);
                        }
                    },
                    min: 0,
                    max: maxY * 1.1
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

function calculateMonthlyInvestmentNeeded(targetAmount, years, annualReturn, currentAssets) {
    // Validate inputs
    if (targetAmount <= 0 || years <= 0) {
        return 0;
    }
    
    // Calculate future value of current assets after 'years' of growth
    const futureValueCurrentAssets = currentAssets * Math.pow(1 + annualReturn, years);
    
    // Calculate how much more we need beyond current assets
    const adjustedTarget = targetAmount - futureValueCurrentAssets;
    
    // If current assets already cover the target, no monthly investment needed
    if (adjustedTarget <= 0) {
        return 0;
    }
    
    // Calculate monthly return
    const monthlyReturn = annualReturn / 12;
    const totalMonths = years * 12;
    
    // Handle different interest rate scenarios
    if (Math.abs(monthlyReturn) < 1e-10) {
        // No interest case: simple division
        return adjustedTarget / totalMonths;
    } else if (monthlyReturn > 0) {
        // Positive interest: use Future Value of Annuity formula
        // FV = PMT × [((1 + r)^n - 1) / r]
        // Solving for PMT: PMT = FV × r / ((1 + r)^n - 1)
        const compound = Math.pow(1 + monthlyReturn, totalMonths);
        const denominator = (compound - 1) / monthlyReturn;
        
        // Ensure denominator is not zero or too small
        if (denominator < 1e-10) {
            return adjustedTarget / totalMonths;
        }
        
        return adjustedTarget / denominator;
    } else {
        // Negative interest case (deflation) - handle carefully
        const compound = Math.pow(1 + monthlyReturn, totalMonths);
        if (compound <= 0) {
            return Infinity; // Impossible scenario
        }
        
        const denominator = (compound - 1) / monthlyReturn;
        if (Math.abs(denominator) < 1e-10) {
            return adjustedTarget / totalMonths;
        }
        
        const result = adjustedTarget / denominator;
        return result > 0 ? result : Infinity;
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function formatCompactCurrency(amount) {
    if (amount >= 1000000) {
        return '$' + (amount / 1000000).toFixed(1) + 'M';
    } else if (amount >= 1000) {
        return '$' + (amount / 1000).toFixed(0) + 'k';
    } else {
        return '$' + amount.toFixed(0);
    }
}

// Auto-calculate when inputs change
document.addEventListener('DOMContentLoaded', function() {
    const inputs = ['desiredIncome', 'currentAssets', 'yearsToRetirement', 'interestRate', 'withdrawalRate'];
    
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', calculateRetirement);
        }
    });
    
    // Initial calculation
    calculateRetirement();
}); 
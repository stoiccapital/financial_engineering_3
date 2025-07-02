// Buy, Borrow, Die Strategy Calculator JavaScript

function calculateBBDS() {
    // Get input values
    const assetValue = parseFloat(document.getElementById('assetValue').value) || 0;
    const loanToValue = parseFloat(document.getElementById('loanToValue').value) / 100 || 0;
    const interestRate = parseFloat(document.getElementById('interestRate').value) / 100 || 0;
    const assetGrowthRate = parseFloat(document.getElementById('assetGrowthRate').value) / 100 || 0;
    const desiredMonthlyIncome = parseFloat(document.getElementById('desiredMonthlyIncome').value) || 0;
    const yearsToProject = parseInt(document.getElementById('yearsToProject').value) || 30;
    
    // Calculate results
    const maxLoanAmount = assetValue * loanToValue;
    const monthlyInterestRate = Math.pow(1 + interestRate, 1/12) - 1;
    const monthlyInterestPayment = maxLoanAmount * monthlyInterestRate;
    const netMonthlyIncome = maxLoanAmount - monthlyInterestPayment;
    
    // Calculate future asset value (assuming no principal payments)
    const futureAssetValue = assetValue * Math.pow(1 + assetGrowthRate, yearsToProject);
    const futureLTV = (maxLoanAmount / futureAssetValue) * 100;
    
    // Update results
    document.getElementById('maxLoanAmount').textContent = formatCurrency(maxLoanAmount);
    document.getElementById('monthlyInterest').textContent = formatCurrency(monthlyInterestPayment);
    document.getElementById('netMonthlyIncome').textContent = formatCurrency(netMonthlyIncome);
    document.getElementById('futureAssetValue').textContent = formatCurrency(futureAssetValue);
    document.getElementById('futureLTV').textContent = futureLTV.toFixed(1) + '%';
    
    // Generate strategy comparison
    generateStrategyComparison(assetValue, assetGrowthRate, desiredMonthlyIncome, yearsToProject, interestRate);
    
    // Generate LTV scenarios
    generateLTVScenarios(assetValue, desiredMonthlyIncome, interestRate);
}

function generateStrategyComparison(assetValue, assetGrowthRate, desiredMonthlyIncome, yearsToProject, interestRate) {
    const scenarios = [];
    const monthlyReturn = Math.pow(1 + assetGrowthRate, 1/12) - 1;
    const monthlyInterestRate = Math.pow(1 + interestRate, 1/12) - 1;
    
    // Strategy 1: Buy, Borrow, Die (interest-only loan)
    const bbdLoanAmount = desiredMonthlyIncome / monthlyInterestRate;
    const bbdLTV = bbdLoanAmount / assetValue;
    const bbdMonthlyInterest = bbdLoanAmount * monthlyInterestRate;
    const bbdFutureAssetValue = assetValue * Math.pow(1 + assetGrowthRate, yearsToProject);
    const bbdNetWorth = bbdFutureAssetValue - bbdLoanAmount;
    
    scenarios.push({
        strategy: 'Buy, Borrow, Die',
        monthlyIncome: desiredMonthlyIncome,
        assetValue: bbdFutureAssetValue,
        netWorth: bbdNetWorth
    });
    
    // Strategy 2: Systematic Withdrawal (4% rule)
    const swInitialAssets = desiredMonthlyIncome * 12 / 0.04; // 4% rule
    const swMonthlyWithdrawal = desiredMonthlyIncome;
    let swRemainingAssets = swInitialAssets;
    
    for (let year = 0; year < yearsToProject; year++) {
        for (let month = 0; month < 12; month++) {
            swRemainingAssets = swRemainingAssets * (1 + monthlyReturn) - swMonthlyWithdrawal;
        }
    }
    swRemainingAssets = Math.max(0, swRemainingAssets);
    
    scenarios.push({
        strategy: '4% Withdrawal Rule',
        monthlyIncome: desiredMonthlyIncome,
        assetValue: swRemainingAssets,
        netWorth: swRemainingAssets
    });
    
    // Strategy 3: Dividend Strategy (3% yield)
    const dividendYield = 0.03;
    const dividendAssets = (desiredMonthlyIncome * 12) / dividendYield;
    const dividendFutureValue = dividendAssets * Math.pow(1 + assetGrowthRate, yearsToProject);
    const dividendNetWorth = dividendFutureValue;
    
    scenarios.push({
        strategy: 'Dividend Strategy (3%)',
        monthlyIncome: desiredMonthlyIncome,
        assetValue: dividendFutureValue,
        netWorth: dividendNetWorth
    });
    
    // Update scenarios display
    displayStrategyComparison(scenarios);
}

function displayStrategyComparison(scenarios) {
    const table = document.getElementById('scenariosTable');
    table.innerHTML = '';
    
    scenarios.forEach(scenario => {
        const row = document.createElement('div');
        row.className = 'scenarios-row';
        
        row.innerHTML = `
            <div class="scenarios-cell">${scenario.strategy}</div>
            <div class="scenarios-cell">${formatCompactCurrency(scenario.monthlyIncome)}</div>
            <div class="scenarios-cell">${formatCompactCurrency(scenario.assetValue)}</div>
            <div class="scenarios-cell">${formatCompactCurrency(scenario.netWorth)}</div>
        `;
        
        table.appendChild(row);
    });
}

function generateLTVScenarios(assetValue, desiredMonthlyIncome, interestRate) {
    const scenarios = [];
    const ltvRatios = [30, 40, 50, 60, 70, 80];
    const monthlyInterestRate = Math.pow(1 + interestRate, 1/12) - 1;
    
    ltvRatios.forEach(ltv => {
        const ltvDecimal = ltv / 100;
        const maxLoan = assetValue * ltvDecimal;
        const monthlyInterest = maxLoan * monthlyInterestRate;
        const netIncome = maxLoan - monthlyInterest;
        
        scenarios.push({
            ltv: ltv,
            maxLoan: maxLoan,
            monthlyInterest: monthlyInterest,
            netIncome: netIncome
        });
    });
    
    // Update LTV scenarios display
    displayLTVScenarios(scenarios);
}

function displayLTVScenarios(scenarios) {
    const table = document.getElementById('ltvScenariosTable');
    table.innerHTML = '';
    
    scenarios.forEach(scenario => {
        const row = document.createElement('div');
        row.className = 'scenarios-row';
        
        row.innerHTML = `
            <div class="scenarios-cell">${scenario.ltv}%</div>
            <div class="scenarios-cell">${formatCompactCurrency(scenario.maxLoan)}</div>
            <div class="scenarios-cell">${formatCompactCurrency(scenario.monthlyInterest)}</div>
            <div class="scenarios-cell">${formatCompactCurrency(scenario.netIncome)}</div>
        `;
        
        table.appendChild(row);
    });
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
    const inputs = ['assetValue', 'loanToValue', 'interestRate', 'assetGrowthRate', 'desiredMonthlyIncome', 'yearsToProject'];
    
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', calculateBBDS);
        }
    });
    
    // Initial calculation
    calculateBBDS();
}); 
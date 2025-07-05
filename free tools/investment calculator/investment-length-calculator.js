// Investment Length Calculator Module
// Calculates the time required to reach a target amount

// Investment Length Calculator
function calculateInvestmentLength() {
    const startingAmount = parseFloat(document.getElementById('il-starting-amount').value) || 0;
    const monthlyContribution = parseFloat(document.getElementById('il-monthly-contribution').value) || 0;
    const targetAmount = parseFloat(document.getElementById('il-target-amount').value) || 0;
    const returnRate = parseFloat(document.getElementById('il-return-rate').value) || 0;
    
    if (startingAmount < 0 || monthlyContribution < 0 || targetAmount < 0 || returnRate < 0) {
        alert('Please enter valid positive values.');
        return;
    }
    
    if (returnRate > 100) {
        alert('Return rate cannot exceed 100%.');
        return;
    }
    
    const timeToTarget = calculateTimeToTarget(startingAmount, monthlyContribution, targetAmount, returnRate);
    
    if (timeToTarget > 100) {
        document.getElementById('il-result-value').textContent = 'It will take more than 100 years to reach the target.';
    } else {
        document.getElementById('il-result-value').textContent = formatYears(timeToTarget);
        
        // Calculate and display all result values
        const totalContributions = monthlyContribution * timeToTarget * 12;
        const endAmount = calculateFutureValue(startingAmount, monthlyContribution, returnRate, timeToTarget);
        const totalInterest = endAmount - startingAmount - totalContributions;
        
        document.getElementById('il-end-amount-value').textContent = formatCurrency(targetAmount);
        document.getElementById('il-starting-amount-value').textContent = formatCurrency(startingAmount);
        document.getElementById('il-total-contributions-value').textContent = formatCurrency(totalContributions);
        document.getElementById('il-total-interest-value').textContent = formatCurrency(totalInterest);
    }
    
    // Generate yearly breakdown table and pie chart for successful calculations
    if (timeToTarget <= 100) {
        generateYearlyBreakdown(startingAmount, monthlyContribution, returnRate, timeToTarget);
        // Generate pie chart
        const totalContributions = monthlyContribution * timeToTarget * 12;
        const endAmount = calculateFutureValue(startingAmount, monthlyContribution, returnRate, timeToTarget);
        const totalInterest = endAmount - startingAmount - totalContributions;
        updateBalanceChart(startingAmount, totalContributions, totalInterest);
    }
    
    // Show only relevant results for Investment Length mode (at the very end)
    showOnlyRelevantResults('investment-length');
} 
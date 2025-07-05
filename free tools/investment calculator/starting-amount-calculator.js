// Starting Amount Calculator Module
// Calculates the required initial investment to reach a target amount

// Starting Amount Calculator
function calculateStartingAmount() {
    const monthlyContribution = parseFloat(document.getElementById('sa-monthly-contribution').value) || 0;
    const targetAmount = parseFloat(document.getElementById('sa-target-amount').value) || 0;
    const returnRate = parseFloat(document.getElementById('sa-return-rate').value) || 0;
    const years = parseFloat(document.getElementById('sa-years').value) || 0;
    
    if (monthlyContribution < 0 || targetAmount < 0 || returnRate < 0 || years < 0) {
        alert('Please enter valid positive values.');
        return;
    }
    
    if (returnRate > 100) {
        alert('Return rate cannot exceed 100%.');
        return;
    }
    
    const requiredPrincipal = calculateRequiredPrincipal(monthlyContribution, targetAmount, returnRate, years);
    
    if (requiredPrincipal < 0) {
        document.getElementById('sa-result-value').textContent = 'Target amount is too low for the given parameters.';
    } else {
        document.getElementById('sa-result-value').textContent = formatCurrency(requiredPrincipal);
    }
    
    document.getElementById('sa-result').classList.remove('hidden');
    
    // Generate yearly breakdown table and pie chart for successful calculations
    if (requiredPrincipal >= 0) {
        generateYearlyBreakdown(requiredPrincipal, monthlyContribution, returnRate, years);
        // Generate pie chart
        const totalContributions = monthlyContribution * years * 12;
        const endAmount = calculateFutureValue(requiredPrincipal, monthlyContribution, returnRate, years);
        const totalInterest = endAmount - requiredPrincipal - totalContributions;
        updateBalanceChart(requiredPrincipal, totalContributions, totalInterest);
    }
} 
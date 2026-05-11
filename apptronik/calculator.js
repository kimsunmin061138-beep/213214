document.addEventListener('DOMContentLoaded', () => {
    const numRobotsInput = document.getElementById('num-robots');
    const laborCostInput = document.getElementById('labor-cost');
    const workHoursInput = document.getElementById('work-hours');
    
    const numRobotsVal = document.getElementById('num-robots-val');
    const workHoursVal = document.getElementById('work-hours-val');
    
    const monthlySavingsDisplay = document.getElementById('monthly-savings');
    const paybackPeriodDisplay = document.getElementById('payback-period');

    const ROBOT_COST = 50000; // Estimated cost per robot
    const MONTHLY_MAINTENANCE = 500; // Maintenance per robot

    function calculateROI() {
        const numRobots = parseInt(numRobotsInput.value);
        const laborCost = parseFloat(laborCostInput.value);
        const workHours = parseInt(workHoursInput.value);

        // Update display values
        numRobotsVal.textContent = numRobots;
        workHoursVal.textContent = workHours;

        // Savings Calculation
        // Monthly Labor Cost = numRobots * laborCost * workHours * 30 days
        const monthlyLaborCost = numRobots * laborCost * workHours * 30;
        
        // Robot Monthly Cost (Maintenance)
        const robotMonthlyMaintenance = numRobots * MONTHLY_MAINTENANCE;
        
        const monthlySavings = monthlyLaborCost - robotMonthlyMaintenance;
        
        // Payback Period (Months) = Total Investment / Monthly Savings
        const totalInvestment = numRobots * ROBOT_COST;
        const paybackPeriod = monthlySavings > 0 ? (totalInvestment / monthlySavings).toFixed(1) : '∞';

        // Update UI
        monthlySavingsDisplay.textContent = `$${Math.round(monthlySavings).toLocaleString()}`;
        paybackPeriodDisplay.textContent = `${paybackPeriod}개월`;
    }

    // Event Listeners
    numRobotsInput.addEventListener('input', calculateROI);
    laborCostInput.addEventListener('input', calculateROI);
    workHoursInput.addEventListener('input', calculateROI);

    // Initial Calculation
    calculateROI();
});


function calculateOldTax(totalSal) {
    if (totalSal <= 700000) return 0;

    let tax = 0;
    let remaining = totalSal;

    // 0-3L: 0%
    remaining = Math.max(0, remaining - 300000);
    // 3-4L: 5%
    if (remaining > 0) {
        const taxableAmount = Math.min(remaining, 100000);
        tax += taxableAmount * 0.05;
        remaining = Math.max(0, remaining - 100000);
    }

    // 4-10L: 10%
    if (remaining > 0) {
        const taxableAmount = Math.min(remaining, 600000);
        tax += taxableAmount * 0.10;
        remaining = Math.max(0, remaining - 600000);
    }

    // 10-12L: 15%
    if (remaining > 0) {
        const taxableAmount = Math.min(remaining, 200000);
        tax += taxableAmount * 0.15;
        remaining = Math.max(0, remaining - 200000);
    }

    // 12-15L: 20%
    if (remaining > 0) {
        const taxableAmount = Math.min(remaining, 300000);
        tax += taxableAmount * 0.20;
        remaining = Math.max(0, remaining - 300000);
    }

    // Above 15L: 30%
    if (remaining > 0) {
        tax += remaining * 0.30;
    }

    return tax;
}

function calculateNewTax(totalSal) {
    if (totalSal <= 1200000) return 0;

    let tax = 0;
    let remaining = totalSal;

    // 0-4L: 0%
    remaining = Math.max(0, remaining - 400000);

    // 4-8L: 5%
    if (remaining > 0) {
        const taxableAmount = Math.min(remaining, 400000);
        tax += taxableAmount * 0.05;
        remaining = Math.max(0, remaining - 400000);
    }

    // 8-12L: 10%
    if (remaining > 0) {
        const taxableAmount = Math.min(remaining, 400000);
        tax += taxableAmount * 0.10;
        remaining = Math.max(0, remaining - 400000);
    }

    // 12-16L: 15%
    if (remaining > 0) {
        const taxableAmount = Math.min(remaining, 400000);
        tax += taxableAmount * 0.15;
        remaining = Math.max(0, remaining - 400000);
    }

    // 16-20L: 20%
    if (remaining > 0) {
        const taxableAmount = Math.min(remaining, 400000);
        tax += taxableAmount * 0.20;
        remaining = Math.max(0, remaining - 400000);
    }

    // 20-24L: 25%
    if (remaining > 0) {
        const taxableAmount = Math.min(remaining, 400000);
        tax += taxableAmount * 0.25;
        remaining = Math.max(0, remaining - 400000);
    }

    // Above 24L: 30%
    if (remaining > 0) {
        tax += remaining * 0.30;
    }

    return tax;
}

// UI handling
document.addEventListener('DOMContentLoaded', function() {
    const incomeInput = document.getElementById('income');
    const resultsDiv = document.getElementById('results');
    const toggleDetailsBtn = document.getElementById('toggleDetails');
    const detailsSection = document.getElementById('detailsSection');

    // Format number with Indian style (2,00,000)
    function formatIndianNumber(num) {
        num = num.toString();
        let afterPoint = '';
        if (num.includes('.')) {
            afterPoint = num.substring(num.indexOf('.'));
            num = num.substring(0, num.indexOf('.'));
        }
        let lastThree = num.substring(num.length - 3);
        let otherNumbers = num.substring(0, num.length - 3);
        if (otherNumbers !== '') {
            lastThree = ',' + lastThree;
        }
        let res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
        return res;
    }

    // Remove formatting and get pure number
    function parseIndianNumber(str) {
        return parseInt(str.replace(/,/g, '')) || 0;
    }

    // Format currency for display
    function formatCurrency(amount) {
        return '₹' + formatIndianNumber(Math.round(amount));
    }

    incomeInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^0-9]/g, '');
        
        if (value) {
            // Format the number in Indian style
            const formattedValue = formatIndianNumber(value);
            e.target.value = formattedValue;

            // Get the pure number for calculations
            const totalSal = parseIndianNumber(formattedValue);
            
            if (totalSal > 0) {
                resultsDiv.classList.remove('hidden');
                updateResults(totalSal);
            } else {
                resultsDiv.classList.add('hidden');
            }
        } else {
            e.target.value = '';
            resultsDiv.classList.add('hidden');
        }
    });

    toggleDetailsBtn.addEventListener('click', function() {
        const isHidden = detailsSection.classList.contains('hidden');
        detailsSection.classList.toggle('hidden');
        this.textContent = isHidden ? 'Hide Details' : 'Show Details';
    });

    function updateResults(totalSal) {
        const oldTax = calculateOldTax(totalSal);
        const newTax = calculateNewTax(totalSal);

        // Update tax amounts
        document.getElementById('oldTax').textContent = formatCurrency(oldTax);
        document.getElementById('newTax').textContent = formatCurrency(newTax);

        // Update effective rates
        const oldEffectiveRate = (oldTax / totalSal) * 100;
        const newEffectiveRate = (newTax / totalSal) * 100;

        document.getElementById('oldEffectiveRate').textContent = 
            `Effective Rate: ${oldEffectiveRate.toFixed(1)}%`;
        document.getElementById('newEffectiveRate').textContent = 
            `Effective Rate: ${newEffectiveRate.toFixed(1)}%`;

        if (detailsSection && !detailsSection.classList.contains('hidden')) {
            const oldBreakdown = getDetailedBreakdown(totalSal, false);
            const newBreakdown = getDetailedBreakdown(totalSal, true);
            updateBreakdownSection('oldBreakdown', oldBreakdown);
            updateBreakdownSection('newBreakdown', newBreakdown);
        }
    }
});

function getDetailedBreakdown(totalSal, isNewRegime = true) {
    const slabs = isNewRegime ? [
        { range: '0-4L', rate: '0%', max: 400000 },
        { range: '4-8L', rate: '5%', max: 400000 },
        { range: '8-12L', rate: '10%', max: 400000 },
        { range: '12-16L', rate: '15%', max: 400000 },
        { range: '16-20L', rate: '20%', max: 400000 },
        { range: '20-24L', rate: '25%', max: 400000 },
        { range: 'Above 24L', rate: '30%', max: Infinity }
    ] : [
        { range: '0-3L', rate: '0%', max: 300000 },
        { range: '3-4L', rate: '5%', max: 100000 },
        { range: '4-10L', rate: '10%', max: 600000 },
        { range: '10-12L', rate: '15%', max: 200000 },
        { range: '12-15L', rate: '20%', max: 300000 },
        { range: 'Above 15L', rate: '30%', max: Infinity }
    ];

    let remaining = totalSal;
    const breakdown = [];
    let totalTax = 0;

    for (const slab of slabs) {
        if (remaining <= 0) break;
        
        const taxableAmount = Math.min(remaining, slab.max);
        const rate = parseInt(slab.rate) / 100;
        const tax = taxableAmount * rate;
        
        if (tax > 0 || taxableAmount > 0) {
            breakdown.push({
                range: slab.range,
                rate: slab.rate,
                amount: taxableAmount,
                tax
            });
            totalTax += tax;
        }
        
        remaining = Math.max(0, remaining - slab.max);
    }

    return { breakdown, totalTax };
}

function updateBreakdownSection(elementId, breakdownData) {
    const container = document.getElementById(elementId);
    if (!container) return;

    container.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'grid grid-cols-4 text-sm font-medium border-b pb-2';
    header.innerHTML = `
        <span>Slab</span>
        <span>Rate</span>
        <span>Amount</span>
        <span>Tax</span>
    `;
    container.appendChild(header);


    breakdownData.breakdown.forEach(item => {
        const row = document.createElement('div');
        row.className = 'grid grid-cols-4 text-sm py-2';
        row.innerHTML = `
            <span>${item.range}</span>
            <span>${item.rate}</span>
            <span>₹${formatIndianNumber(Math.round(item.amount))}</span>
            <span>₹${formatIndianNumber(Math.round(item.tax))}</span>
        `;
        container.appendChild(row);
    });


    const total = document.createElement('div');
    total.className = 'grid grid-cols-4 text-sm font-semibold border-t pt-2 mt-2';
    total.innerHTML = `
        <span class="col-span-3">Total Tax</span>
        <span>₹${formatIndianNumber(Math.round(breakdownData.totalTax))}</span>
    `;
    container.appendChild(total);
}
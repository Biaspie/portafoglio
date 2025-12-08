// DOM Elements
const FINNHUB_API_KEY = 'd4rhdehr01qgts2o410gd4rhdehr01qgts2o4110'; // Inserisci qui la tua chiave API di Finnhub

const balanceEl = document.getElementById('total-balance');
const incomeEl = document.getElementById('total-income');
const expenseEl = document.getElementById('total-expense');
const investmentsDashboardEl = document.getElementById('total-investments-dashboard');
const listEl = document.getElementById('transaction-list');
const form = document.getElementById('transaction-form');
const modal = document.getElementById('transaction-modal');
const closeBtn = document.getElementById('close-modal');
const clearBtn = document.getElementById('clear-all');
const isRecurringInput = document.getElementById('is-recurring');
const frequencyGroup = document.getElementById('frequency-group');

// Navigation Elements
const navDashboard = document.getElementById('nav-dashboard');
const navAnalysis = document.getElementById('nav-analysis');
const navInvestments = document.getElementById('nav-investments');
const navRecurring = document.getElementById('nav-recurring');
const navDebts = document.getElementById('nav-debts');

const dashboardView = document.getElementById('dashboard-view');
const analysisView = document.getElementById('analysis-view');
const investmentsView = document.getElementById('investments-view');
const recurringView = document.getElementById('recurring-view');
const debtsView = document.getElementById('debts-view');

// Analysis Elements
const currentMonthEl = document.getElementById('current-month-analysis');
const prevMonthBtn = document.getElementById('prev-month-analysis');
const nextMonthBtn = document.getElementById('next-month-analysis');

// Investment Elements
const investmentsListEl = document.getElementById('investments-list');
const totalInvestedEl = document.getElementById('total-invested');
const totalPlEl = document.getElementById('total-pl');
const btnAddAsset = document.getElementById('btn-add-asset');
const assetModal = document.getElementById('asset-modal');
const closeAssetModalBtn = document.getElementById('close-asset-modal');
const assetForm = document.getElementById('asset-form');

// Wallet Elements
const walletSelector = document.getElementById('wallet-selector');
const walletDropdown = document.getElementById('wallet-dropdown');
const walletListEl = document.getElementById('wallet-list');
const btnAddWallet = document.getElementById('btn-add-wallet');
const walletModal = document.getElementById('wallet-modal');
const closeWalletModalBtn = document.getElementById('close-wallet-modal');
const walletForm = document.getElementById('wallet-form');
const currentWalletNameEl = document.getElementById('current-wallet-name');
const walletSelectTransaction = document.getElementById('wallet-select-transaction');

// Recurring Elements
const recurringListEl = document.getElementById('recurring-list');

// Debt Elements
const loansListEl = document.getElementById('loans-list');
const revolvingListEl = document.getElementById('revolving-list');
const totalDebtRemainingEl = document.getElementById('total-debt-remaining');

const btnAddLoan = document.getElementById('btn-add-loan');
const loanModal = document.getElementById('loan-modal');
const closeLoanModalBtn = document.getElementById('close-loan-modal');
const loanForm = document.getElementById('loan-form');

const btnAddRevolving = document.getElementById('btn-add-revolving');
const revolvingModal = document.getElementById('revolving-modal');
const closeRevolvingModalBtn = document.getElementById('close-revolving-modal');
const revolvingForm = document.getElementById('revolving-form');

const amortizationModal = document.getElementById('amortization-modal');
const closeAmortizationModalBtn = document.getElementById('close-amortization-modal');
const amortizationBody = document.getElementById('amortization-body');

// State
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let recurringFlows = JSON.parse(localStorage.getItem('recurringFlows')) || [];
let investments = JSON.parse(localStorage.getItem('investments')) || [];
let wallets = JSON.parse(localStorage.getItem('wallets')) || [];
let loans = JSON.parse(localStorage.getItem('loans')) || [];
let revolvingCards = JSON.parse(localStorage.getItem('revolvingCards')) || [];
let archivedLoans = JSON.parse(localStorage.getItem('archivedLoans')) || [];
let archivedRevolving = JSON.parse(localStorage.getItem('archivedRevolving')) || [];
let currentWalletId = localStorage.getItem('currentWalletId') || null;
let currentDebtView = 'active'; // 'active' or 'archive'
let currentAnalysisDate = new Date();
let balanceChart = null;
let expensePieChart = null;
let allocationChart = null;
let priceUpdateInterval = null;

// ... (Crypto Map and Categories remain unchanged) ...
// Crypto ID Mapping (Common coins)
const cryptoMap = {
    'bitcoin': 'bitcoin',
    'btc': 'bitcoin',
    'ethereum': 'ethereum',
    'eth': 'ethereum',
    'solana': 'solana',
    'sol': 'solana',
    'cardano': 'cardano',
    'ada': 'cardano',
    'ripple': 'ripple',
    'xrp': 'ripple',
    'polkadot': 'polkadot',
    'dot': 'polkadot',
    'dogecoin': 'dogecoin',
    'doge': 'dogecoin',
    'avalanche': 'avalanche-2',
    'avax': 'avalanche-2',
    'chainlink': 'chainlink',
    'link': 'chainlink',
    'polygon': 'matic-network',
    'matic': 'matic-network'
};

// Category Definitions
const expenseCategories = {
    housing: { label: 'Casa', icon: 'fa-home', color: '#8e44ad' },
    food: { label: 'Cibo & Spesa', icon: 'fa-utensils', color: '#e67e22' },
    transport: { label: 'Trasporti', icon: 'fa-car', color: '#2980b9' },
    entertainment: { label: 'Svago', icon: 'fa-film', color: '#e84393' },
    bills: { label: 'Bollette', icon: 'fa-file-invoice-dollar', color: '#c0392b' },
    shopping: { label: 'Shopping', icon: 'fa-shopping-bag', color: '#9b59b6' },
    health: { label: 'Salute', icon: 'fa-heartbeat', color: '#27ae60' },
    education: { label: 'Istruzione', icon: 'fa-graduation-cap', color: '#16a085' },
    pets: { label: 'Animali', icon: 'fa-paw', color: '#d35400' },
    travel: { label: 'Viaggi', icon: 'fa-plane', color: '#3498db' },
    insurance: { label: 'Assicurazioni', icon: 'fa-shield-alt', color: '#7f8c8d' },
    other: { label: 'Altro', icon: 'fa-circle-notch', color: '#95a5a6' }
};

const incomeCategories = {
    salary: { label: 'Stipendio', icon: 'fa-money-bill-wave', color: '#27ae60' },
    freelance: { label: 'Freelance', icon: 'fa-laptop-code', color: '#2980b9' },
    investments: { label: 'Investimenti', icon: 'fa-chart-line', color: '#8e44ad' },
    gift: { label: 'Regali', icon: 'fa-gift', color: '#e84393' },
    other: { label: 'Altro', icon: 'fa-plus-circle', color: '#95a5a6' }
};

// ... (Init and other functions) ...



// Helper to get all categories for lookup
const allCategories = { ...expenseCategories, ...incomeCategories };

// --- Wallet Management ---

function initWallets() {
    // 1. Initialize Wallets if empty
    if (wallets.length === 0) {
        const defaultWallet = {
            id: 'wallet_' + Date.now(),
            name: 'Principale',
            type: 'general',
            balance: 0
        };
        wallets.push(defaultWallet);
        localStorage.setItem('wallets', JSON.stringify(wallets));
        currentWalletId = defaultWallet.id;
        localStorage.setItem('currentWalletId', currentWalletId);

        // Migrate existing transactions
        let migratedCount = 0;
        transactions = transactions.map(t => {
            if (!t.walletId) {
                t.walletId = defaultWallet.id;
                migratedCount++;
            }
            return t;
        });
        if (migratedCount > 0) {
            localStorage.setItem('transactions', JSON.stringify(transactions));
            console.log(`Migrated ${migratedCount} transactions to default wallet.`);
        }
    } else if (!currentWalletId) {
        currentWalletId = wallets[0].id;
        localStorage.setItem('currentWalletId', currentWalletId);
    }

    renderWalletList();
    updateWalletUI();
}

function renderWalletList() {
    walletListEl.innerHTML = '';
    walletSelectTransaction.innerHTML = ''; // Populate transaction modal select too

    wallets.forEach(wallet => {
        // Sidebar List Item
        const li = document.createElement('li');
        li.innerHTML = `
            <i class="fas fa-${getWalletIcon(wallet.type)}"></i>
            <span>${wallet.name}</span>
        `;
        if (wallet.id === currentWalletId) {
            li.classList.add('active');
        }
        li.addEventListener('click', () => switchWallet(wallet.id));
        walletListEl.appendChild(li);

        // Transaction Modal Option
        const option = document.createElement('option');
        option.value = wallet.id;
        option.text = wallet.name;
        if (wallet.id === currentWalletId) option.selected = true;
        walletSelectTransaction.appendChild(option);
    });
}

function getWalletIcon(type) {
    switch (type) {
        case 'bank': return 'university';
        case 'cash': return 'money-bill-wave';
        case 'savings': return 'piggy-bank';
        default: return 'wallet';
    }
}

function switchWallet(id) {
    currentWalletId = id;
    localStorage.setItem('currentWalletId', currentWalletId);

    // Update UI
    renderWalletList();
    updateWalletUI();

    // Refresh Data
    init();

    // Close dropdown
    walletDropdown.classList.add('hidden');
}

function updateWalletUI() {
    const currentWallet = wallets.find(w => w.id === currentWalletId);
    if (currentWallet) {
        currentWalletNameEl.innerText = currentWallet.name;
    }
}

function createNewWallet(e) {
    e.preventDefault();

    const name = document.getElementById('wallet-name').value;
    const type = document.getElementById('wallet-type').value;

    const newWallet = {
        id: 'wallet_' + Date.now(),
        name: name,
        type: type,
        balance: 0
    };

    wallets.push(newWallet);
    localStorage.setItem('wallets', JSON.stringify(wallets));

    switchWallet(newWallet.id);

    walletModal.classList.remove('active'); // Close modal
    walletForm.reset();
}

// --- End Wallet Management ---

function populateCategories(type) {
    const categorySelect = document.getElementById('category');
    categorySelect.innerHTML = '';

    const categories = type === 'income' ? incomeCategories : expenseCategories;

    for (const [key, value] of Object.entries(categories)) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = value.label;
        categorySelect.appendChild(option);
    }
}

function init() {
    initWallets(); // Initialize wallets and migrate if needed
    populateAssetSelect(); // Initialize asset dropdown

    checkRecurringTransactions();
    listEl.innerHTML = '';

    // Filter by current wallet
    const walletTransactions = transactions.filter(t => t.walletId === currentWalletId);

    // Sort transactions by date descending for list
    walletTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    walletTransactions.forEach(addTransactionDOM);
    updateValues();

    // Set default date to today
    document.getElementById('date').valueAsDate = new Date();

    // Render investments if in view
    if (!investmentsView.classList.contains('hidden')) {
        renderInvestments();
        updateAllocationChart();
        startPriceUpdates();
    }

    // Render Recurring and Debts
    renderRecurring();
    renderDebts();
}

function checkRecurringTransactions() {
    const today = new Date();
    let newTransactionsAdded = false;

    recurringFlows.forEach(flow => {
        let nextDate = new Date(flow.nextDueDate);

        // While the next due date is today or in the past
        while (nextDate <= today) {
            const newTransaction = {
                id: generateID(),
                type: flow.type,
                amount: flow.amount,
                category: flow.category,
                date: nextDate.toISOString().split('T')[0],
                description: flow.description + ' (Ricorrente)'
            };

            transactions.push(newTransaction);
            newTransactionsAdded = true;

            // Calculate next due date
            if (flow.frequency === 'monthly') {
                nextDate.setMonth(nextDate.getMonth() + 1);
            } else if (flow.frequency === 'weekly') {
                nextDate.setDate(nextDate.getDate() + 7);
            } else if (flow.frequency === 'yearly') {
                nextDate.setFullYear(nextDate.getFullYear() + 1);
            }
        }

        // Update the flow's next due date
        flow.nextDueDate = nextDate.toISOString().split('T')[0];
    });

    if (newTransactionsAdded) {
        updateLocalStorage();
        localStorage.setItem('recurringFlows', JSON.stringify(recurringFlows));
    }
}

function addTransaction(e) {
    e.preventDefault();

    const type = document.querySelector('input[name="type"]:checked').value;
    const amount = +document.getElementById('amount').value;
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;
    const walletId = document.getElementById('wallet-select-transaction').value; // Get selected wallet

    // Use the label of the selected category as default description if empty
    const description = document.getElementById('description').value || allCategories[category].label;
    const isRecurring = isRecurringInput.checked;
    const frequency = document.getElementById('frequency').value;

    if (amount === 0) {
        alert('Inserisci un importo valido');
        return;
    }

    const transaction = {
        id: generateID(),
        walletId: walletId, // Assign to wallet
        type,
        amount,
        category,
        date,
        description
    };

    transactions.push(transaction);

    if (isRecurring) {
        // Calculate next occurrence based on the selected date
        let nextDate = new Date(date);
        if (frequency === 'monthly') {
            nextDate.setMonth(nextDate.getMonth() + 1);
        } else if (frequency === 'weekly') {
            nextDate.setDate(nextDate.getDate() + 7);
        } else if (frequency === 'yearly') {
            nextDate.setFullYear(nextDate.getFullYear() + 1);
        }

        const flow = {
            id: generateID(),
            walletId: walletId, // Assign to wallet
            type,
            amount,
            category,
            description,
            frequency,
            nextDueDate: nextDate.toISOString().split('T')[0]
        };
        recurringFlows.push(flow);
        localStorage.setItem('recurringFlows', JSON.stringify(recurringFlows));
    }

    updateLocalStorage();
    init(); // Re-init to sort and display

    form.reset();
    document.getElementById('date').valueAsDate = new Date();
    frequencyGroup.classList.add('hidden');
    closeModal();
}

function generateID() {
    return Math.floor(Math.random() * 100000000);
}

function addTransactionDOM(transaction) {
    // Remove empty state if present
    const emptyState = listEl.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }

    const sign = transaction.type === 'income' ? '+' : '-';
    const item = document.createElement('li');

    item.classList.add('transaction-item');
    item.classList.add(transaction.type);

    const categoryData = allCategories[transaction.category] || allCategories.other;
    const iconClass = categoryData.icon;

    item.innerHTML = `
        <div class="t-info">
            <div class="t-icon">
                <i class="fas ${iconClass}"></i>
            </div>
            <div class="t-details">
                <h4>${transaction.description}</h4>
                <small>${formatDate(transaction.date)}</small>
            </div>
        </div>
        <div class="t-actions">
            <span class="t-amount ${transaction.type}">${sign}€ ${Math.abs(transaction.amount).toFixed(2)}</span>
            <button class="delete-btn" onclick="removeTransaction(${transaction.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

    listEl.appendChild(item);
}

function updateValues() {
    // Filter transactions by current wallet
    const walletTransactions = transactions.filter(t => t.walletId === currentWalletId);

    const amounts = walletTransactions.map(t => t.type === 'income' ? t.amount : -t.amount);

    const totalTransactions = amounts.reduce((acc, item) => (acc += item), 0);

    // Calculate total investments value (Global)
    const totalInvestments = investments.reduce((acc, asset) => acc + asset.current, 0);

    // Total Balance = (Income - Expense) + Investments
    // Note: If you want investments to be per-wallet, you'd filter them too. 
    // For now, keeping investments global as requested.
    const total = (totalTransactions + totalInvestments).toFixed(2);

    const income = walletTransactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => (acc += t.amount), 0)
        .toFixed(2);

    const expense = (walletTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => (acc += t.amount), 0) * 1)
        .toFixed(2);

    balanceEl.innerText = `€ ${total}`;
    incomeEl.innerText = `+€ ${income}`;
    expenseEl.innerText = `-€ ${expense}`;
    investmentsDashboardEl.innerText = `€ ${totalInvestments.toFixed(2)}`;
}

function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    init();
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function formatDate(dateStr) {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('it-IT', options);
}

function openModal(type = 'expense') {
    modal.classList.add('active');
    if (type === 'income') {
        document.getElementById('type-income').checked = true;
    } else {
        document.getElementById('type-expense').checked = true;
    }
    populateCategories(type);
    document.getElementById('date').valueAsDate = new Date();
}

function closeModal() {
    modal.classList.remove('active');
}

function clearAll() {
    if (confirm('Sei sicuro di voler cancellare tutte le transazioni?')) {
        transactions = [];
        recurringFlows = [];
        localStorage.removeItem('recurringFlows');
        updateLocalStorage();
        init();
        // Re-add empty state
        listEl.innerHTML = `
            <li class="empty-state">
                <i class="fas fa-wallet"></i>
                <p>Nessuna transazione ancora</p>
            </li>
        `;
    }
}



// Chart Functions
function updateChart() {
    const ctx = document.getElementById('balance-chart').getContext('2d');

    // Sort transactions by date ascending for chart
    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

    let balance = 0;
    const dataPoints = [];
    const labels = [];

    sortedTransactions.forEach(t => {
        const amount = t.type === 'income' ? t.amount : -t.amount;
        balance += amount;
        dataPoints.push(balance);
        labels.push(formatDate(t.date));
    });

    if (balanceChart) {
        balanceChart.destroy();
    }

    balanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Andamento Saldo',
                data: dataPoints,
                borderColor: '#8e44ad',
                backgroundColor: 'rgba(142, 68, 173, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    grid: {
                        color: '#333333'
                    },
                    ticks: {
                        color: '#a0a0a0'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        display: false // Hide dates on x-axis for cleaner look
                    }
                }
            }
        }
    });
}

function updatePieChart() {
    const ctx = document.getElementById('expense-pie-chart').getContext('2d');

    // Filter expenses for current month
    const currentMonth = currentAnalysisDate.getMonth();
    const currentYear = currentAnalysisDate.getFullYear();

    // Update month label
    const monthNames = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
        "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
    ];
    currentMonthEl.innerText = `${monthNames[currentMonth]} ${currentYear}`;

    const monthlyExpenses = transactions.filter(t => {
        const tDate = new Date(t.date);
        return t.type === 'expense' &&
            tDate.getMonth() === currentMonth &&
            tDate.getFullYear() === currentYear;
    });

    // Group by category
    const categoryTotals = {};
    monthlyExpenses.forEach(t => {
        if (!categoryTotals[t.category]) {
            categoryTotals[t.category] = 0;
        }
        categoryTotals[t.category] += t.amount;
    });

    const labels = Object.keys(categoryTotals).map(key => expenseCategories[key]?.label || 'Altro');
    const data = Object.values(categoryTotals);
    const colors = Object.keys(categoryTotals).map(key => expenseCategories[key]?.color || '#95a5a6');

    if (expensePieChart) {
        expensePieChart.destroy();
    }

    if (data.length === 0) {
        // Show empty state or placeholder if no data
        // For now, just empty chart
        return;
    }

    expensePieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#a0a0a0',
                        usePointStyle: true,
                        padding: 20
                    }
                }
            },
            cutout: '70%'
        }
    });
}

function changeMonth(offset) {
    currentAnalysisDate.setMonth(currentAnalysisDate.getMonth() + offset);
    updatePieChart();
}

// Asset Definitions
const assetList = {
    crypto: {
        label: 'Criptovalute',
        items: [
            { name: 'Bitcoin', apiId: 'bitcoin' },
            { name: 'Ethereum', apiId: 'ethereum' },
            { name: 'Solana', apiId: 'solana' },
            { name: 'Cardano', apiId: 'cardano' },
            { name: 'Ripple', apiId: 'ripple' },
            { name: 'Polkadot', apiId: 'polkadot' },
            { name: 'Dogecoin', apiId: 'dogecoin' },
            { name: 'Avalanche', apiId: 'avalanche-2' },
            { name: 'Chainlink', apiId: 'chainlink' },
            { name: 'Polygon', apiId: 'matic-network' }
        ]
    },
    stocks: {
        label: 'Azioni (Prezzo Manuale)',
        items: [
            { name: 'Apple', apiId: null },
            { name: 'Microsoft', apiId: null },
            { name: 'Google', apiId: null },
            { name: 'Amazon', apiId: null },
            { name: 'Tesla', apiId: null },
            { name: 'Meta', apiId: null },
            { name: 'NVIDIA', apiId: null }
        ]
    },
    etf: {
        label: 'ETF (Live)',
        items: [
            { name: 'Vanguard FTSE All-World (VWCE.DE)', apiId: 'VWCE.DE', type: 'etf' },
            { name: 'iShares Core MSCI World (SWDA.L)', apiId: 'SWDA.L', type: 'etf' },
            { name: 'S&P 500 ETF (SPY)', apiId: 'SPY', type: 'etf' },
            { name: 'Nasdaq 100 ETF (QQQ)', apiId: 'QQQ', type: 'etf' },
            { name: 'Gold ETF (GLD)', apiId: 'GLD', type: 'etf' }
        ]
    },
    custom: {
        label: 'Altro',
        items: [
            { name: 'Altro...', value: 'custom' }
        ]
    }
};

function populateAssetSelect() {
    const select = document.getElementById('asset-select');
    select.innerHTML = '';

    for (const [key, category] of Object.entries(assetList)) {
        const group = document.createElement('optgroup');
        group.label = category.label;

        category.items.forEach(item => {
            const option = document.createElement('option');
            option.textContent = item.name;
            option.value = item.value || item.name;
            option.dataset.apiId = item.apiId || '';
            option.dataset.type = item.type || 'custom';
            group.appendChild(option);
        });

        select.appendChild(group);
    }
}

// Investment Functions
function addAsset(e) {
    e.preventDefault();

    const select = document.getElementById('asset-select');
    const selectedOption = select.options[select.selectedIndex];

    let name = selectedOption.textContent;
    let apiId = selectedOption.dataset.apiId || null;

    // Handle custom asset
    if (selectedOption.value === 'custom') {
        name = document.getElementById('asset-name-custom').value;
        if (!name) {
            alert('Inserisci il nome dell\'asset');
            return;
        }
        apiId = null;
    }

    const quantity = +document.getElementById('asset-quantity').value;
    const invested = +document.getElementById('asset-invested').value;
    const current = +document.getElementById('asset-current').value;

    const asset = {
        id: generateID(),
        name,
        quantity,
        invested,
        current,
        apiId: apiId,
        type: selectedOption.dataset.type || 'custom'
    };

    investments.push(asset);
    localStorage.setItem('investments', JSON.stringify(investments));

    renderInvestments();
    updateAllocationChart();

    if (asset.apiId) {
        fetchCryptoPrices();
        fetchETFPrices();
    }

    closeAssetModal();
    assetForm.reset();
    document.getElementById('asset-name-custom').classList.add('hidden');
    select.value = 'Bitcoin';
}

function removeAsset(id) {
    if (confirm('Eliminare questo asset?')) {
        investments = investments.filter(asset => asset.id !== id);
        localStorage.setItem('investments', JSON.stringify(investments));
        renderInvestments();
        updateAllocationChart();
    }
}

function renderInvestments() {
    if (!investmentsListEl) return;
    investmentsListEl.innerHTML = '';

    let totalInvested = 0;
    let totalInitial = 0;

    investments.forEach(asset => {
        totalInvested += asset.current;
        totalInitial += asset.invested;

        const pl = asset.current - asset.invested;
        const plPercent = asset.invested > 0 ? ((pl / asset.invested) * 100).toFixed(2) : 0;
        const plClass = pl >= 0 ? 'positive' : 'negative';
        const plSign = pl >= 0 ? '+' : '';

        const liveBadge = asset.apiId ? '<span class="live-badge">LIVE</span>' : '';

        const card = document.createElement('div');
        card.classList.add('asset-card');
        card.innerHTML = `
            <div class="asset-header">
                <h3>${asset.name} ${liveBadge}</h3>
                <div class="asset-actions">
                    <button onclick="removeAsset(${asset.id})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
            <div class="asset-values">
                <div class="asset-row">
                    <span>Quantità:</span>
                    <span>${asset.quantity ? asset.quantity : '-'}</span>
                </div>
                <div class="asset-row">
                    <span>Investito:</span>
                    <span>€ ${asset.invested.toFixed(2)}</span>
                </div>
                <div class="asset-row">
                    <span>Valore Attuale:</span>
                    <span>€ ${asset.current.toFixed(2)}</span>
                </div>
            </div>
            <div class="pl-indicator ${plClass}">
                <span>P/L</span>
                <span>${plSign}€ ${pl.toFixed(2)} (${plSign}${plPercent}%)</span>
            </div>
        `;
        investmentsListEl.appendChild(card);
    });

    // Update Header Totals
    const totalPL = totalInvested - totalInitial;
    const totalPLPercent = totalInitial > 0 ? ((totalPL / totalInitial) * 100).toFixed(2) : 0;
    const totalPLClass = totalPL >= 0 ? 'positive' : 'negative';
    const totalPLSign = totalPL >= 0 ? '+' : '';

    totalInvestedEl.innerText = `€ ${totalInvested.toFixed(2)}`;
    totalPlEl.innerText = `${totalPLSign}€ ${totalPL.toFixed(2)} (${totalPLSign}${totalPLPercent}%)`;
    totalPlEl.className = `detail-value ${totalPLClass}`;

    // Update main balance with new investment values
    updateValues();
}

function updateAllocationChart() {
    const ctx = document.getElementById('allocation-chart').getContext('2d');

    const labels = investments.map(a => a.name);
    const data = investments.map(a => a.current);

    // Generate colors
    const colors = [
        '#8e44ad', '#2980b9', '#27ae60', '#f39c12', '#c0392b',
        '#16a085', '#d35400', '#7f8c8d', '#2c3e50', '#9b59b6'
    ];

    if (allocationChart) {
        allocationChart.destroy();
    }

    if (data.length === 0) return;

    allocationChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, data.length),
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#a0a0a0',
                        usePointStyle: true,
                        padding: 20
                    }
                }
            },
            cutout: '60%'
        }
    });
}

// API Integration
async function fetchCryptoPrices() {
    const cryptoAssets = investments.filter(a => a.apiId && a.type !== 'etf');
    if (cryptoAssets.length === 0) return;

    const ids = cryptoAssets.map(a => a.apiId).join(',');
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=eur`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        let updated = false;

        investments.forEach(asset => {
            if (asset.apiId && data[asset.apiId] && data[asset.apiId].eur) {
                const currentPrice = data[asset.apiId].eur;

                if (asset.quantity) {
                    asset.current = asset.quantity * currentPrice;
                } else {
                    asset.quantity = asset.current / currentPrice;
                }
                updated = true;
            }
        });

        if (updated) {
            localStorage.setItem('investments', JSON.stringify(investments));
            renderInvestments();
            updateAllocationChart();
        }

    } catch (error) {
        console.error('Error fetching crypto prices:', error);
    }
}

async function fetchETFPrices() {
    if (FINNHUB_API_KEY === 'YOUR_API_KEY_HERE') {
        console.warn('Finnhub API Key not set');
        return;
    }

    const etfAssets = investments.filter(a => a.type === 'etf' && a.apiId);
    if (etfAssets.length === 0) return;

    let updated = false;

    for (const asset of etfAssets) {
        const url = `https://finnhub.io/api/v1/quote?symbol=${asset.apiId}&token=${FINNHUB_API_KEY}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data && data.c) {
                const currentPrice = data.c;

                if (asset.quantity) {
                    asset.current = asset.quantity * currentPrice;
                } else {
                    asset.quantity = asset.current / currentPrice;
                }

                asset.current = asset.quantity * currentPrice;
                updated = true;
            }
        } catch (error) {
            console.error(`Error fetching price for ${asset.name}:`, error);
        }
    }

    if (updated) {
        localStorage.setItem('investments', JSON.stringify(investments));
        renderInvestments();
        updateAllocationChart();
    }
}

function startPriceUpdates() {
    fetchCryptoPrices();
    fetchETFPrices();
    if (!priceUpdateInterval) {
        priceUpdateInterval = setInterval(() => {
            fetchCryptoPrices();
            fetchETFPrices();
        }, 60000);
    }
}

function stopPriceUpdates() {
    if (priceUpdateInterval) {
        clearInterval(priceUpdateInterval);
        priceUpdateInterval = null;
    }
}

function openAssetModal() {
    assetModal.classList.add('active');
    populateAssetSelect();
    const select = document.getElementById('asset-select');
    const customInput = document.getElementById('asset-name-custom');

    select.onchange = () => {
        if (select.value === 'custom') {
            customInput.classList.remove('hidden');
            customInput.required = true;
        } else {
            customInput.classList.add('hidden');
            customInput.required = false;
        }
    };
}

function closeAssetModal() {
    assetModal.classList.remove('active');
}

// Event Listeners
form.addEventListener('submit', addTransaction);

const typeRadios = document.querySelectorAll('input[name="type"]');
typeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        populateCategories(e.target.value);
    });
});

document.getElementById('btn-income').addEventListener('click', () => openModal('income'));
document.getElementById('btn-expense').addEventListener('click', () => openModal('expense'));

closeBtn.addEventListener('click', closeModal);
clearBtn.addEventListener('click', clearAll);

isRecurringInput.addEventListener('change', (e) => {
    if (e.target.checked) {
        frequencyGroup.classList.remove('hidden');
    } else {
        frequencyGroup.classList.add('hidden');
    }
});

// Navigation Listeners
// Recurring Functions
function renderRecurring() {
    recurringListEl.innerHTML = '';

    if (recurringFlows.length === 0) {
        recurringListEl.innerHTML = `
            <li class="empty-state">
                <i class="fas fa-sync-alt"></i>
                <p>Nessuna spesa ricorrente attiva</p>
            </li>
        `;
        return;
    }

    recurringFlows.forEach(flow => {
        const item = document.createElement('li');
        item.classList.add('transaction-item');

        const category = expenseCategories[flow.category] || incomeCategories[flow.category] || { label: 'Altro', icon: 'fa-circle', color: '#ccc' };
        const amountClass = flow.type === 'income' ? 'income' : 'expense';
        const sign = flow.type === 'income' ? '+' : '-';

        item.innerHTML = `
            <div class="t-info">
                <div class="t-icon" style="color: ${category.color}; border-color: ${category.color}33;">
                    <i class="fas ${category.icon}"></i>
                </div>
                <div class="t-details">
                    <h4>${flow.name || flow.description || category.label} <span class="badge-recurring">${flow.frequency}</span></h4>
                    <small>Prossimo: ${new Date(flow.nextDueDate).toLocaleDateString('it-IT')}</small>
                </div>
            </div>
            <div class="t-amount ${amountClass}">
                ${sign}€ ${Math.abs(flow.amount).toFixed(2)}
                <button class="delete-btn" onclick="deleteRecurringFlow(${flow.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        recurringListEl.appendChild(item);
    });
}

function deleteRecurringFlow(id) {
    if (confirm('Vuoi cancellare questa spesa ricorrente?')) {
        recurringFlows = recurringFlows.filter(f => f.id !== id);
        localStorage.setItem('recurringFlows', JSON.stringify(recurringFlows));
        renderRecurring();
    }
}

// Debt Management Functions
function renderDebts() {
    // Update toggle buttons state
    const btnActive = document.getElementById('btn-debts-active');
    const btnArchive = document.getElementById('btn-debts-archive');

    if (btnActive && btnArchive) {
        if (currentDebtView === 'active') {
            btnActive.classList.add('active');
            btnArchive.classList.remove('active');
        } else {
            btnActive.classList.remove('active');
            btnArchive.classList.add('active');
        }
    }

    renderLoans();
    renderRevolving();
    updateTotalDebt();
}

function renderLoans() {
    loansListEl.innerHTML = '';
    const targetLoans = currentDebtView === 'active' ? loans : archivedLoans;

    if (targetLoans.length === 0) {
        loansListEl.innerHTML = `<p style="text-align:center; color:var(--text-secondary); width:100%;">Nessun prestito ${currentDebtView === 'active' ? 'attivo' : 'archiviato'}</p>`;
        return;
    }

    targetLoans.forEach(loan => {
        const startDate = new Date(loan.startDate);
        const now = new Date();
        const monthsElapsed = (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth());
        const progress = Math.min(100, Math.max(0, (monthsElapsed / loan.months) * 100));
        const isArchived = currentDebtView === 'archive';

        const card = document.createElement('div');
        card.className = `debt-card ${isArchived ? 'archived' : ''}`;
        card.innerHTML = `
            <div class="debt-header">
                <div>
                    <div class="debt-title">${loan.name}</div>
                    <div class="debt-subtitle">${loan.months} Mesi @ ${loan.rate}%</div>
                </div>
                <div class="debt-amount">€ ${parseFloat(loan.amount).toFixed(2)}</div>
            </div>
            <div class="progress-container">
                <div class="progress-bar" style="width: ${progress}%"></div>
            </div>
            <div class="debt-details">
                <span>Inizio: ${startDate.toLocaleDateString('it-IT')}</span>
                <span>${Math.round(progress)}% Completato</span>
            </div>
            <div class="debt-actions">
                <button class="btn-small" onclick="viewAmortization(${loan.id})">Piano</button>
                ${isArchived ?
                `<button class="btn-small" onclick="restoreLoan(${loan.id})">Ripristina</button>` :
                `<button class="btn-small" onclick="archiveLoan(${loan.id})">Archivia</button>`
            }
                <button class="btn-small" onclick="deleteLoan(${loan.id})" style="color: var(--danger-color); border-color: var(--danger-color);">Elimina</button>
            </div>
        `;
        loansListEl.appendChild(card);
    });
}

function renderRevolving() {
    revolvingListEl.innerHTML = '';
    const targetCards = currentDebtView === 'active' ? revolvingCards : archivedRevolving;

    if (targetCards.length === 0) {
        revolvingListEl.innerHTML = `<p style="text-align:center; color:var(--text-secondary); width:100%;">Nessuna carta ${currentDebtView === 'active' ? 'attiva' : 'archiviata'}</p>`;
        return;
    }

    targetCards.forEach(card => {
        const utilization = (card.balance / card.limit) * 100;
        let progressClass = '';
        if (utilization > 75) progressClass = 'danger';
        else if (utilization > 50) progressClass = 'warning';
        const isArchived = currentDebtView === 'archive';

        const item = document.createElement('div');
        item.className = `debt-card ${isArchived ? 'archived' : ''}`;
        item.innerHTML = `
            <div class="debt-header">
                <div>
                    <div class="debt-title">${card.name}</div>
                    <div class="debt-subtitle">Plafond: € ${parseFloat(card.limit).toFixed(2)}</div>
                </div>
                <div class="debt-amount" style="color: var(--danger-color)">-€ ${parseFloat(card.balance).toFixed(2)}</div>
            </div>
            <div class="progress-container">
                <div class="progress-bar ${progressClass}" style="width: ${utilization}%"></div>
            </div>
            <div class="debt-details">
                <span>Disponibile: € ${(card.limit - card.balance).toFixed(2)}</span>
                <span>${Math.round(utilization)}% Utilizzato</span>
            </div>
            <div class="debt-actions">
                ${isArchived ?
                `<button class="btn-small" onclick="restoreRevolving(${card.id})">Ripristina</button>` :
                `<button class="btn-small" onclick="archiveRevolving(${card.id})">Archivia</button>`
            }
                <button class="btn-small" onclick="deleteRevolving(${card.id})" style="color: var(--danger-color); border-color: var(--danger-color);">Elimina</button>
            </div>
        `;
        revolvingListEl.appendChild(item);
    });
}

function updateTotalDebt() {
    const loanDebt = loans.reduce((acc, loan) => {
        // Simple remaining calculation based on progress
        const startDate = new Date(loan.startDate);
        const now = new Date();
        const monthsElapsed = (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth());
        const remainingMonths = Math.max(0, loan.months - monthsElapsed);
        // Approximation: Principal remaining
        const remainingPrincipal = (loan.amount / loan.months) * remainingMonths;
        return acc + remainingPrincipal;
    }, 0);

    const cardDebt = revolvingCards.reduce((acc, card) => acc + parseFloat(card.balance), 0);

    totalDebtRemainingEl.innerText = `€ ${(loanDebt + cardDebt).toFixed(2)}`;
}

function addLoan(e) {
    e.preventDefault();
    const name = document.getElementById('loan-name').value;
    const amount = parseFloat(document.getElementById('loan-amount').value);
    const rate = parseFloat(document.getElementById('loan-rate').value);
    const months = parseInt(document.getElementById('loan-months').value);
    const startDate = document.getElementById('loan-start-date').value;

    const loan = {
        id: Date.now(),
        name,
        amount,
        rate,
        months,
        startDate
    };

    loans.push(loan);
    localStorage.setItem('loans', JSON.stringify(loans));

    // Auto-create recurring transaction
    const monthlyRate = rate / 100 / 12;
    const payment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));

    // Calculate end date
    const loanEndDate = new Date(startDate);
    loanEndDate.setMonth(new Date(startDate).getMonth() + months);

    const recurringFlow = {
        id: Date.now() + 1, // Ensure unique ID
        type: 'expense',
        name: `Rata ${name}`,
        amount: parseFloat(payment.toFixed(2)),
        category: 'Mutuo/Prestito', // Ensure this category exists or use 'Altro'
        frequency: 'monthly',
        startDate: startDate,
        endDate: loanEndDate.toISOString().split('T')[0],
        nextDate: startDate // Will be updated by checkRecurringTransactions
    };

    recurringFlows.push(recurringFlow);
    localStorage.setItem('recurringFlows', JSON.stringify(recurringFlows));

    // Trigger check to generate any past due transactions immediately
    checkRecurringTransactions();

    renderDebts();
    renderRecurring(); // Update recurring list

    loanModal.classList.remove('active');
    loanForm.reset();
}

function addRevolving(e) {
    e.preventDefault();
    const name = document.getElementById('revolving-name').value;
    const limit = parseFloat(document.getElementById('revolving-limit').value);
    const balance = parseFloat(document.getElementById('revolving-balance').value);
    const rate = parseFloat(document.getElementById('revolving-rate').value);

    const card = {
        id: Date.now(),
        name,
        limit,
        balance,
        rate
    };

    revolvingCards.push(card);
    localStorage.setItem('revolvingCards', JSON.stringify(revolvingCards));
    renderDebts();

    revolvingModal.classList.remove('active');
    revolvingForm.reset();
}

function deleteLoan(id) {
    if (confirm('Sei sicuro di voler eliminare questo prestito?')) {
        if (currentDebtView === 'active') {
            loans = loans.filter(l => l.id !== id);
            localStorage.setItem('loans', JSON.stringify(loans));
        } else {
            archivedLoans = archivedLoans.filter(l => l.id !== id);
            localStorage.setItem('archivedLoans', JSON.stringify(archivedLoans));
        }
        renderDebts();
    }
}

function deleteRevolving(id) {
    if (confirm('Sei sicuro di voler eliminare questa carta?')) {
        if (currentDebtView === 'active') {
            revolvingCards = revolvingCards.filter(c => c.id !== id);
            localStorage.setItem('revolvingCards', JSON.stringify(revolvingCards));
        } else {
            archivedRevolving = archivedRevolving.filter(c => c.id !== id);
            localStorage.setItem('archivedRevolving', JSON.stringify(archivedRevolving));
        }
        renderDebts();
    }
}

function archiveLoan(id) {
    const loan = loans.find(l => l.id === id);
    if (loan) {
        loans = loans.filter(l => l.id !== id);
        // Mark as paid/settled by ensuring progress logic will see it as done
        // We don't have a specific 'status' field, but moving to archive implies it.
        // If we want to force the progress bar to 100% in archive view, we can check for archive status there.
        // Or we can modify the start date to ensure calculation shows 100%, but that falsifies data.
        // Better: Add a 'settled' flag.
        loan.settled = true;

        archivedLoans.push(loan);
        localStorage.setItem('loans', JSON.stringify(loans));
        localStorage.setItem('archivedLoans', JSON.stringify(archivedLoans));
        renderDebts();
    }
}

function restoreLoan(id) {
    const loan = archivedLoans.find(l => l.id === id);
    if (loan) {
        archivedLoans = archivedLoans.filter(l => l.id !== id);
        loans.push(loan);
        localStorage.setItem('loans', JSON.stringify(loans));
        localStorage.setItem('archivedLoans', JSON.stringify(archivedLoans));
        renderDebts();
    }
}

function archiveRevolving(id) {
    const card = revolvingCards.find(c => c.id === id);
    if (card) {
        revolvingCards = revolvingCards.filter(c => c.id !== id);
        archivedRevolving.push(card);
        localStorage.setItem('revolvingCards', JSON.stringify(revolvingCards));
        localStorage.setItem('archivedRevolving', JSON.stringify(archivedRevolving));
        renderDebts();
    }
}

function restoreRevolving(id) {
    const card = archivedRevolving.find(c => c.id === id);
    if (card) {
        archivedRevolving = archivedRevolving.filter(c => c.id !== id);
        revolvingCards.push(card);
        localStorage.setItem('revolvingCards', JSON.stringify(revolvingCards));
        localStorage.setItem('archivedRevolving', JSON.stringify(archivedRevolving));
        renderDebts();
    }
}

function viewAmortization(id) {
    let loan = loans.find(l => l.id === id);
    if (!loan) {
        loan = archivedLoans.find(l => l.id === id);
    }

    if (!loan) {
        console.error('Loan not found for amortization view');
        return;
    }

    amortizationBody.innerHTML = '';
    const monthlyRate = loan.rate / 100 / 12;
    const payment = (loan.amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -loan.months));

    let balance = loan.amount;

    for (let i = 1; i <= loan.months; i++) {
        const interest = balance * monthlyRate;
        const principal = payment - interest;
        balance -= principal;
        if (balance < 0) balance = 0;

        // Calculate payment date
        const paymentDate = new Date(startDate);
        paymentDate.setMonth(startDate.getMonth() + i);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i}</td>
            <td>${paymentDate.toLocaleDateString('it-IT')}</td>
            <td>€ ${payment.toFixed(2)}</td>
            <td>€ ${principal.toFixed(2)}</td>
            <td>€ ${interest.toFixed(2)}</td>
            <td>€ ${balance.toFixed(2)}</td>
        `;
        amortizationBody.appendChild(row);
    }

    amortizationModal.classList.add('active');
}

// Navigation Functions
function showRecurring() {
    hideAllViews();
    recurringView.classList.remove('hidden');
    navRecurring.classList.add('active');
}

function showDebts() {
    hideAllViews();
    debtsView.classList.remove('hidden');
    navDebts.classList.add('active');
}

function hideAllViews() {
    dashboardView.classList.add('hidden');
    analysisView.classList.add('hidden');
    investmentsView.classList.add('hidden');
    recurringView.classList.add('hidden');
    debtsView.classList.add('hidden');

    navDashboard.classList.remove('active');
    navAnalysis.classList.remove('active');
    navInvestments.classList.remove('active');
    navRecurring.classList.remove('active');
    navDebts.classList.remove('active');
}

// Update existing navigation functions to use hideAllViews
function showDashboard() {
    hideAllViews();
    dashboardView.classList.remove('hidden');
    navDashboard.classList.add('active');
    stopPriceUpdates();
}

function showAnalysis() {
    hideAllViews();
    analysisView.classList.remove('hidden');
    navAnalysis.classList.add('active');
    stopPriceUpdates();
    updateChart();
    updatePieChart();
}

function showInvestments() {
    hideAllViews();
    investmentsView.classList.remove('hidden');
    navInvestments.classList.add('active');
    renderInvestments();
    updateAllocationChart();
    startPriceUpdates();
}

// Event Listeners for New Features
navDashboard.addEventListener('click', showDashboard);
navAnalysis.addEventListener('click', showAnalysis);
navInvestments.addEventListener('click', showInvestments);
navRecurring.addEventListener('click', showRecurring);
navDebts.addEventListener('click', showDebts);

btnAddLoan.addEventListener('click', () => loanModal.classList.add('active'));
closeLoanModalBtn.addEventListener('click', () => loanModal.classList.remove('active'));
loanForm.addEventListener('submit', addLoan);

btnAddRevolving.addEventListener('click', () => revolvingModal.classList.add('active'));
closeRevolvingModalBtn.addEventListener('click', () => revolvingModal.classList.remove('active'));
revolvingForm.addEventListener('submit', addRevolving);


btnAddAsset.addEventListener('click', () => {
    // Reset form
    assetForm.reset();
    assetModal.classList.add('active');
});
closeAssetModalBtn.addEventListener('click', () => closeAssetModal());
assetForm.addEventListener('submit', addAsset);

document.getElementById('asset-select').addEventListener('change', (e) => {
    const customInput = document.getElementById('asset-name-custom');
    if (e.target.value === 'custom') {
        customInput.classList.remove('hidden');
        customInput.required = true;
    } else {
        customInput.classList.add('hidden');
        customInput.required = false;
    }
});



closeAmortizationModalBtn.addEventListener('click', () => amortizationModal.classList.remove('active'));

// View Toggle Listeners
document.getElementById('btn-debts-active').addEventListener('click', () => {
    currentDebtView = 'active';
    renderDebts();
});

document.getElementById('btn-debts-archive').addEventListener('click', () => {
    currentDebtView = 'archive';
    renderDebts();
});

// Update window click listener for new modals
// Consolidated Window Click Listener
window.addEventListener('click', (e) => {
    // Old Modals
    if (e.target == modal) closeModal();
    if (e.target == assetModal) closeAssetModal();
    if (e.target == walletModal) walletModal.classList.remove('active');

    // New Modals
    if (e.target == loanModal) loanModal.classList.remove('active');
    if (e.target == revolvingModal) revolvingModal.classList.remove('active');
    if (e.target == amortizationModal) amortizationModal.classList.remove('active');

    // Wallet Dropdown
    if (!walletSelector.contains(e.target) && !walletDropdown.contains(e.target)) {
        walletDropdown.classList.add('hidden');
    }
});

// Expose new functions
// Expose new functions
window.deleteLoan = deleteLoan;
window.deleteRevolving = deleteRevolving;
window.viewAmortization = viewAmortization;
window.archiveLoan = archiveLoan;
window.restoreLoan = restoreLoan;
window.archiveRevolving = archiveRevolving;
window.archiveRevolving = archiveRevolving;
window.restoreRevolving = restoreRevolving;
window.deleteRecurringFlow = deleteRecurringFlow;
window.deleteRecurringFlow = deleteRecurringFlow;

init();

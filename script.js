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

const assetDetailsModal = document.getElementById('asset-details-modal');
const closeAssetDetailsModalBtn = document.getElementById('close-asset-details-modal');
const assetHistoryBody = document.getElementById('asset-history-body');

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
const subscriptionsListEl = document.getElementById('subscriptions-list');

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
// State
let transactions = [];
let recurringFlows = [];
let investments = [];
let wallets = [];
let loans = [];
let revolvingCards = [];
let installmentPlans = []; // State for BNPL
let subscriptions = []; // State for Subscriptions
let archivedLoans = [];
let archivedRevolving = [];
let currentWalletId = localStorage.getItem('currentWalletId') || 'default';
let currentDebtView = 'active'; // 'active' or 'archive'
let currentAnalysisDate = new Date();
let balanceChart = null;
let expensePieChart = null;
let allocationChart = null;
let userProfile = null; // Store user profile
let priceUpdateInterval = null;

// DB Subscriptions
let unsubscribeTransactions = null;
let unsubscribeInvestments = null;
let unsubscribeLoans = null;
let unsubscribeRevolving = null;
let unsubscribeInstallments = null;
let unsubscribeSubscriptions = null;

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

async function initWallets() {
    try {
        wallets = await window.dbOps.getWallets();

        if (wallets.length === 0) {
            // Should not happen as registration creates default wallet, but just in case
            const defaultWallet = await window.dbOps.createWallet({
                name: 'Principale',
                type: 'general'
            });
            wallets.push(defaultWallet);
        }

        if (!currentWalletId || !wallets.find(w => w.id === currentWalletId)) {
            currentWalletId = wallets[0].id;
            localStorage.setItem('currentWalletId', currentWalletId);
        }

        renderWalletList();
        updateWalletUI();
    } catch (error) {
        console.error('Error initializing wallets:', error);
    }
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

async function createNewWallet(e) {
    e.preventDefault();

    const name = document.getElementById('wallet-name').value;
    const type = document.getElementById('wallet-type').value;

    const newWalletData = {
        name: name,
        type: type,
        balance: 0
    };

    try {
        const newWallet = await window.dbOps.createWallet(newWalletData);
        wallets.push(newWallet);

        switchWallet(newWallet.id);

        walletModal.classList.remove('active');
        walletForm.reset();
    } catch (error) {
        alert('Errore creazione portafoglio: ' + error.message);
    }
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

async function init() {
    // Wait for auth to be ready
    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            console.log('Initializing app for user:', user.email);

            // 1. Load Wallets
            await initWallets();

            // 2. Subscribe to Data
            if (unsubscribeTransactions) unsubscribeTransactions();
            unsubscribeTransactions = window.dbOps.subscribeToTransactions((data) => {
                transactions = data;
                updateUI();
            });

            if (unsubscribeInvestments) unsubscribeInvestments();
            unsubscribeInvestments = window.dbOps.subscribeToInvestments((data) => {
                investments = data;
                if (!investmentsView.classList.contains('hidden')) {
                    renderInvestments();
                    updateAllocationChart();
                }
            });

            if (unsubscribeLoans) unsubscribeLoans();
            unsubscribeLoans = window.dbOps.subscribeToLoans((data) => {
                // Split into active and archived based on status or history
                loans = data.filter(l => l.status !== 'archived');
                archivedLoans = data.filter(l => l.status === 'archived');

                // Also support legacy local archive if needed, or migration
                // For now, trust the DB status.

                renderDebts();
            });

            if (unsubscribeRevolving) unsubscribeRevolving();
            unsubscribeRevolving = window.dbOps.subscribeToRevolving((data) => {
                revolvingCards = data;
                renderDebts();
            });

            // 3. Installments (BNPL)
            if (unsubscribeInstallments) unsubscribeInstallments();
            unsubscribeInstallments = window.dbOps.subscribeToInstallmentPlans((data) => {
                installmentPlans = data;
                renderInstallments(); // Render UI
                checkDueInstallments(); // Automatic payment check
            });

            // 4. Subscriptions
            if (unsubscribeSubscriptions) unsubscribeSubscriptions();
            unsubscribeSubscriptions = window.dbOps.subscribeToSubscriptions((data) => {
                subscriptions = data;
                renderSubscriptions();
                checkDueSubscriptions();
            });

            populateAssetSelect();

            // Set default date to today
            document.getElementById('date').valueAsDate = new Date();
        }
    });
}

function updateUI() {
    listEl.innerHTML = '';

    // Filter by current wallet
    const walletTransactions = transactions.filter(t => t.walletId === currentWalletId);

    // Sort transactions by date descending for list
    walletTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    walletTransactions.forEach(addTransactionDOM);
    updateValues();

    // Update charts if visible
    if (!dashboardView.classList.contains('hidden')) {
        updateChart();
    }
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

async function addTransaction(e) {
    e.preventDefault();

    const type = document.querySelector('input[name="type"]:checked').value;
    const amount = +document.getElementById('amount').value;
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;
    const walletId = document.getElementById('wallet-select-transaction').value;

    if (!walletId) {
        alert("Seleziona un portafoglio valido.");
        return;
    }

    const description = document.getElementById('description').value || allCategories[category].label;
    const isRecurring = isRecurringInput.checked;

    if (amount === 0) {
        alert('Inserisci un importo valido');
        return;
    }

    const transaction = {
        walletId,
        type,
        amount,
        category,
        date,
        description,
        isRecurring
    };

    if (isRecurring) {
        const frequency = document.getElementById('frequency').value;
        transaction.frequency = frequency;

        // Save to Subscriptions DB
        const subscription = {
            name: description,
            amount: amount,
            category: category,
            frequency: frequency,
            nextDueDate: calculateNextDate(date, frequency),
            walletId: walletId
        };

        try {
            await window.dbOps.addSubscriptionToDb(subscription);
        } catch (e) {
            console.error("Error creating subscription", e);
        }
    }

    try {
        await window.dbOps.addTransactionToDb(transaction);

        closeModal();
        form.reset();
        document.getElementById('date').valueAsDate = new Date();
        frequencyGroup.classList.add('hidden');
    } catch (error) {
        alert('Errore nel salvataggio della transazione: ' + error.message);
    }
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

async function removeTransaction(id) {
    if (confirm('Sei sicuro di voler eliminare questa transazione?')) {
        try {
            await window.dbOps.deleteTransactionFromDb(id);
        } catch (error) {
            alert('Errore eliminazione: ' + error.message);
        }
    }
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



// Chart Functions
function updateChart() {
    const ctx = document.getElementById('balance-chart').getContext('2d');

    // Sort transactions by date ascending for chart
    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

    // Group by Date to get daily closing balance
    const dailyBalances = {};
    let runningBalance = 0;

    // Initialize with 0 for the very first date if needed, or just iterate
    sortedTransactions.forEach(t => {
        const amount = t.type === 'income' ? t.amount : -t.amount;
        runningBalance += amount;

        // Save/Overwrite the balance for this date (so we get the last one of the day)
        const dateStr = formatDate(t.date); // Using existing formatting "DD MMM YYYY"
        dailyBalances[dateStr] = runningBalance;
    });

    const dataPoints = Object.values(dailyBalances);
    const labels = Object.keys(dailyBalances);

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
                pointRadius: 3 // Made points slightly visible
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
                }
            },
            scales: {
                y: {
                    grid: {
                        color: '#333333'
                    },
                    ticks: {
                        color: '#a0a0a0',
                        callback: function (value) {
                            return '€ ' + value;
                        }
                    }
                },
                x: {
                    grid: {
                        color: '#333333', // Show grid lines for days
                        display: true     // Enable grid
                    },
                    ticks: {
                        color: '#a0a0a0',
                        display: true,     // Show dates
                        maxTicksLimit: 7,  // Limit labels to avoid crowding
                        maxRotation: 0,
                        autoSkip: true
                    }
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

    // Safety check for empty selection
    if (select.selectedIndex === -1) {
        alert('Seleziona un asset dalla lista.');
        return;
    }

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

    // Check if asset already exists
    const existingAssetIndex = investments.findIndex(a => a.name === name && a.type === (selectedOption.dataset.type || 'custom'));

    if (existingAssetIndex !== -1) {
        // Merge with existing asset
        if (confirm(`L'asset "${name}" esiste già. Vuoi aggiungere questa transazione allo storico?`)) {
            const existing = investments[existingAssetIndex];

            // Initialize history if missing
            if (!existing.history) {
                existing.history = [{
                    date: new Date().toISOString().split('T')[0],
                    type: 'buy',
                    quantity: existing.quantity,
                    invested: existing.invested,
                    price: existing.invested / existing.quantity
                }];
            }

            // Add new history entry
            existing.history.push({
                date: new Date().toISOString().split('T')[0],
                type: 'buy',
                quantity: quantity,
                invested: invested,
                price: invested / quantity
            });

            // Update totals
            existing.quantity += quantity;
            existing.invested += invested;
            existing.current += current; // Add current value of new chunk to total current

            investments[existingAssetIndex] = existing;
        } else {
            return; // User cancelled
        }
    } else {
        // Create new asset
        const asset = {
            id: generateID(),
            name,
            quantity,
            invested,
            current,
            apiId: apiId,
            type: selectedOption.dataset.type || 'custom',
            history: [{
                date: new Date().toISOString().split('T')[0],
                type: 'buy',
                quantity: quantity,
                invested: invested,
                price: invested / quantity
            }]
        };
        investments.push(asset);
    }

    localStorage.setItem('investments', JSON.stringify(investments));

    renderInvestments();
    updateAllocationChart();

    if (apiId) {
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
            <div class="asset-header" onclick="showAssetDetails(${asset.id})" style="cursor: pointer;">
                <h3>${asset.name} ${liveBadge}</h3>
                <div class="asset-actions">
                    <button onclick="event.stopPropagation(); removeAsset(${asset.id})"><i class="fas fa-trash"></i></button>
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

async function addInvestment(e) {
    e.preventDefault();

    const assetSelect = document.getElementById('asset-select');
    const isCustom = assetSelect.value === 'custom';
    const name = isCustom ? document.getElementById('asset-name-custom').value : assetSelect.options[assetSelect.selectedIndex].text;
    const symbol = isCustom ? 'custom' : assetSelect.value;
    const quantity = parseFloat(document.getElementById('asset-quantity').value);
    const invested = parseFloat(document.getElementById('asset-invested').value);
    const current = parseFloat(document.getElementById('asset-current').value);

    const investment = {
        name,
        symbol,
        quantity,
        invested,
        current,
        history: [{ date: new Date().toISOString(), value: current }]
    };

    try {
        await window.dbOps.addInvestmentToDb(investment);

        assetModal.classList.remove('active');
        assetForm.reset();
        document.getElementById('asset-name-custom').classList.add('hidden');
    } catch (error) {
        alert('Errore salvataggio investimento: ' + error.message);
    }
}

async function deleteInvestment(id) {
    if (confirm('Sei sicuro di voler eliminare questo asset?')) {
        try {
            await window.dbOps.deleteInvestmentFromDb(id);
        } catch (error) {
            alert('Errore eliminazione: ' + error.message);
        }
    }
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

    const allItems = [];

    // 1. Existing Recurring Flows
    recurringFlows.forEach(flow => {
        allItems.push({
            type: 'flow',
            id: flow.id,
            description: flow.description,
            amount: flow.amount,
            date: flow.nextDueDate,
            category: flow.category,
            source: flow // reference
        });
    });

    // 2. Installment Plans (BNPL)
    if (installmentPlans) {
        installmentPlans.filter(p => p.status === 'active').forEach(plan => {
            const nextInst = plan.installments.find(i => i.status === 'pending');
            if (nextInst) {
                allItems.push({
                    type: 'installment',
                    id: plan.id,
                    description: `${plan.name} (Rata ${nextInst.number}/${plan.installmentsCount})`,
                    amount: nextInst.amount,
                    date: nextInst.dueDate,
                    category: 'shopping', // Default category
                    source: plan
                });
            }
        });
    }

    // 3. Active Loans (Next Payment)
    if (loans) {
        loans.filter(l => !l.settled).forEach(loan => {
            // Calculate next payment date based on start date and today
            const start = new Date(loan.startDate);
            const today = new Date();

            // Find first payment date > today
            let nextDate = new Date(start);
            // Simple monthly iteration until future
            while (nextDate <= today) {
                nextDate.setMonth(nextDate.getMonth() + 1);
            }

            // Calculate monthly payment (amortization)
            const monthlyRate = loan.rate / 100 / 12;
            const payment = (loan.amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -loan.months));

            allItems.push({
                type: 'loan',
                id: loan.id,
                description: `${loan.name} (Rata Mutuo/Prestito)`,
                amount: payment,
                date: nextDate.toISOString().split('T')[0],
                category: 'bills',
                source: loan
            });
        });
    }

    // Sort by Date
    allItems.sort((a, b) => new Date(a.date) - new Date(b.date));

    if (allItems.length === 0) {
        recurringListEl.innerHTML = `
            <li class="empty-state">
                <i class="fas fa-sync-alt"></i>
                <p>Nessuna spesa ricorrente attiva</p>
            </li>
        `;
        return;
    }

    allItems.forEach(item => {
        const domItem = document.createElement('li');
        domItem.classList.add('transaction-item');
        domItem.classList.add('expense'); // All debts are expenses usually

        let iconClass = 'fa-circle-notch';
        let categoryLabel = 'Altro';

        if (allCategories[item.category]) {
            iconClass = allCategories[item.category].icon;
            categoryLabel = allCategories[item.category].label;
        }

        // Custom icons for debts
        if (item.type === 'installment') iconClass = 'fa-credit-card';
        if (item.type === 'loan') iconClass = 'fa-university';

        const amountClass = 'expense';
        const sign = '-';

        let actionBtn = '';
        if (item.type === 'flow') {
            actionBtn = `
                <button class="delete-btn" onclick="deleteRecurringFlow('${item.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            `;
        } else {
            // For debts, maybe a link to manage them?
            actionBtn = `
                <button class="delete-btn" style="opacity: 0.5; cursor: default;" title="Gestisci nella sezione Debiti">
                    <i class="fas fa-info-circle"></i>
                </button>
            `;
        }

        domItem.innerHTML = `
            <div class="t-info">
                <div class="t-icon">
                    <i class="fas ${iconClass}"></i>
                </div>
                <div class="t-details">
                    <h4>${item.description}</h4>
                    <small>Prossimo: ${formatDate(item.date)}</small>
                </div>
            </div>
            <div class="t-actions">
                <span class="t-amount ${amountClass}">
                    ${sign}€ ${Math.abs(item.amount).toFixed(2)}
                </span>
                ${actionBtn}
            </div>
        `;
        recurringListEl.appendChild(domItem);
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
                <button class="btn-small" onclick="viewAmortization('${loan.id}')">Piano</button>
                ${isArchived ?
                `<button class="btn-small" onclick="restoreLoan('${loan.id}')">Ripristina</button>` :
                `<button class="btn-small" onclick="openEditLoanModal('${loan.id}')">Modifica</button>
                 <button class="btn-small" onclick="archiveLoan('${loan.id}')">Archivia</button>`
            }
                <button class="btn-small" onclick="deleteLoan('${loan.id}')" style="color: var(--danger-color); border-color: var(--danger-color);">Elimina</button>
            </div>
        `;
        loansListEl.appendChild(card);
    });
}

window.deleteLoan = async function (id) {
    if (confirm('Sei sicuro di voler eliminare questo prestito?')) {
        try {
            await window.dbOps.deleteLoanFromDb(id);
        } catch (error) {
            alert('Errore durante l\'eliminazione del prestito: ' + error.message);
        }
    }
};

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
            ${card.monthlyPayment ? `
            <div class="debt-details" style="margin-top: 5px; font-size: 0.85rem; color: var(--text-primary);">
                <span>Rata: € ${parseFloat(card.monthlyPayment).toFixed(2)}</span>
                <span>Giorno: ${card.paymentDay || '?'}</span>
            </div>` : ''}
            <div class="debt-actions">
                ${isArchived ?
                `<button class="btn-small" onclick="restoreRevolving('${card.id}')">Ripristina</button>` :
                `<button class="btn-small" onclick="openEditRevolvingModal('${card.id}')">Modifica</button>
                 <button class="btn-small" onclick="archiveRevolving('${card.id}')">Archivia</button>`
            }
                <button class="btn-small" onclick="deleteRevolving('${card.id}')" style="color: var(--danger-color); border-color: var(--danger-color);">Elimina</button>
            </div>
        `;
        revolvingListEl.appendChild(item);
    });
}

function updateTotalDebt() {
    let total = 0;

    // Calculate remaining loan balance
    loans.forEach(loan => {
        const startDate = new Date(loan.startDate);
        const now = new Date();
        const monthsElapsed = (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth());

        let balance = loan.amount;
        // Simple amortization calc to get current balance
        const monthlyRate = loan.rate / 100 / 12;
        // If rate is 0, handle simpler
        if (loan.rate === 0) {
            balance = Math.max(0, loan.amount - (loan.amount / loan.months * monthsElapsed));
        } else {
            const payment = (loan.amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -loan.months));
            for (let i = 0; i < monthsElapsed && i < loan.months; i++) {
                const interest = balance * monthlyRate;
                const principal = payment - interest;
                balance -= principal;
            }
        }
        if (balance < 0) balance = 0;
        total += balance;
    });

    // Add revolving card balances
    revolvingCards.forEach(card => {
        total += parseFloat(card.balance);
    });

    console.log('UpdateTotalDebt Debug:', {
        loansCount: loans.length,
        revolvingCount: revolvingCards.length,
        totalCalculated: total
    });

    const totalDebtEl = document.getElementById('total-debt-remaining');
    if (totalDebtEl) {
        totalDebtEl.textContent = `€ ${total.toFixed(2)}`;
    }
}

// Open Modal for Edit
function openEditLoanModal(id) {
    const loan = loans.find(l => l.id === id);
    if (!loan) return;

    document.getElementById('loan-name').value = loan.name;
    document.getElementById('loan-amount').value = loan.amount;
    document.getElementById('loan-rate').value = loan.rate;
    document.getElementById('loan-months').value = loan.months;
    document.getElementById('loan-start-date').value = loan.startDate;

    loanForm.dataset.mode = 'edit';
    loanForm.dataset.editId = id;

    // Change Title/Button
    loanModal.querySelector('.modal-header h3').textContent = 'Modifica Prestito';
    loanModal.querySelector('.submit-btn').textContent = 'Salva Modifiche';

    loanModal.classList.add('active');
}

// Override function to open modal in add mode
const _originalOpenModal = window.openModal; // Assuming openModal is defined elsewhere but here we use specific ID click
// Actually, we need to reset the form when opening in "Add" mode.
document.getElementById('btn-add-loan').addEventListener('click', () => {
    loanForm.reset();
    loanForm.dataset.mode = 'add';
    loanForm.removeAttribute('data-edit-id');
    loanModal.querySelector('.modal-header h3').textContent = 'Nuovo Prestito';
    loanModal.querySelector('.submit-btn').textContent = 'Aggiungi Prestito';
    loanModal.classList.add('active');
});

async function addLoan(e) {
    e.preventDefault();
    const name = document.getElementById('loan-name').value;
    const amount = parseFloat(document.getElementById('loan-amount').value);
    const rate = parseFloat(document.getElementById('loan-rate').value);
    const months = parseInt(document.getElementById('loan-months').value);
    const startDate = document.getElementById('loan-start-date').value;

    const loanData = {
        name,
        amount,
        rate,
        months,
        startDate
    };

    try {
        if (loanForm.dataset.mode === 'edit' && loanForm.dataset.editId) {
            await window.dbOps.updateLoan(loanForm.dataset.editId, loanData);
        } else {
            await window.dbOps.addLoanToDb(loanData);
        }
        loanModal.classList.remove('active');
        loanForm.reset();
    } catch (error) {
        alert('Errore salvataggio prestito: ' + error.message);
    }
}

// Open Modal for Edit
function openEditRevolvingModal(id) {
    const card = revolvingCards.find(c => c.id === id);
    if (!card) return;

    document.getElementById('revolving-name').value = card.name;
    document.getElementById('revolving-limit').value = card.limit;
    document.getElementById('revolving-balance').value = card.balance;
    document.getElementById('revolving-rate').value = card.rate || 0;
    document.getElementById('revolving-monthly-payment').value = card.monthlyPayment || '';
    document.getElementById('revolving-payment-day').value = card.paymentDay || '';

    revolvingForm.dataset.mode = 'edit';
    revolvingForm.dataset.editId = id;

    // Change Title/Button
    revolvingModal.querySelector('.modal-header h3').textContent = 'Modifica Carta';
    revolvingModal.querySelector('.submit-btn').textContent = 'Salva Modifiche';

    revolvingModal.classList.add('active');
}

// Override function to open modal in add mode
document.getElementById('btn-add-revolving').addEventListener('click', () => {
    revolvingForm.reset();
    revolvingForm.dataset.mode = 'add';
    revolvingForm.removeAttribute('data-edit-id');
    revolvingModal.querySelector('.modal-header h3').textContent = 'Nuova Carta Revolving';
    revolvingModal.querySelector('.submit-btn').textContent = 'Aggiungi Carta';
    revolvingModal.classList.add('active');
});

async function addRevolving(e) {
    e.preventDefault();
    const name = document.getElementById('revolving-name').value;
    const limit = parseFloat(document.getElementById('revolving-limit').value);
    const balance = parseFloat(document.getElementById('revolving-balance').value);
    const rate = parseFloat(document.getElementById('revolving-rate').value);
    const monthlyPayment = parseFloat(document.getElementById('revolving-monthly-payment').value) || 0;
    const paymentDay = parseInt(document.getElementById('revolving-payment-day').value) || null;

    const cardData = {
        name,
        limit,
        balance,
        rate,
        monthlyPayment,
        paymentDay
    };

    try {
        if (revolvingForm.dataset.mode === 'edit' && revolvingForm.dataset.editId) {
            await window.dbOps.updateRevolving(revolvingForm.dataset.editId, cardData);
        } else {
            await window.dbOps.addRevolvingToDb(cardData);
        }
        revolvingModal.classList.remove('active');
        revolvingForm.reset();
    } catch (error) {
        alert('Errore salvataggio carta: ' + error.message);
    }
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
    const startDate = new Date(loan.startDate);

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

// Archive Loan (Persistent)
async function archiveLoan(id) {
    if (confirm('Archiviare questo prestito?')) {
        try {
            await window.dbOps.updateLoan(id, { status: 'archived' });
            // UI update happens automatically via subscription
        } catch (e) {
            console.error(e);
            alert('Errore durante l\'archiviazione');
        }
    }
}

// Restore Loan (Persistent)
async function restoreLoan(id) {
    if (confirm('Ripristinare questo prestito?')) {
        try {
            await window.dbOps.updateLoan(id, { status: 'active' });
        } catch (e) {
            console.error(e);
            alert('Errore durante il ripristino');
        }
    }
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
closeAssetDetailsModalBtn.addEventListener('click', () => assetDetailsModal.classList.remove('active'));

// Asset Details Function
window.showAssetDetails = function (id) {
    const asset = investments.find(a => a.id === id);
    if (!asset) return;

    document.getElementById('detail-asset-name').textContent = asset.name;
    document.getElementById('detail-quantity').textContent = asset.quantity;
    document.getElementById('detail-invested').textContent = `€ ${asset.invested.toFixed(2)}`;
    document.getElementById('detail-current').textContent = `€ ${asset.current.toFixed(2)}`;

    const pl = asset.current - asset.invested;
    const plEl = document.getElementById('detail-pl');
    plEl.textContent = `€ ${pl.toFixed(2)}`;
    plEl.className = pl >= 0 ? 'positive' : 'negative';
    plEl.style.color = pl >= 0 ? 'var(--success-color)' : 'var(--danger-color)';

    assetHistoryBody.innerHTML = '';

    // If no history, create one from current state (migration)
    if (!asset.history || asset.history.length === 0) {
        asset.history = [{
            date: new Date().toISOString().split('T')[0],
            type: 'buy',
            quantity: asset.quantity,
            invested: asset.invested,
            price: asset.invested / asset.quantity
        }];
        // Save migration
        localStorage.setItem('investments', JSON.stringify(investments));
    }

    asset.history.forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(entry.date).toLocaleDateString('it-IT')}</td>
            <td>${entry.type === 'buy' ? 'Acquisto' : 'Vendita'}</td>
            <td>${entry.quantity}</td>
            <td>€ ${(entry.price || 0).toFixed(2)}</td>
            <td>€ ${entry.invested.toFixed(2)}</td>
        `;
        assetHistoryBody.appendChild(row);
    });

    assetDetailsModal.classList.add('active');
};

window.addEventListener('click', (e) => {
    if (e.target == assetDetailsModal) assetDetailsModal.classList.remove('active');
});

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
// Consolidated Window Click Listener
window.addEventListener('click', (e) => {
    // Wallet Dropdown
    if (!walletSelector.contains(e.target) && !walletDropdown.contains(e.target)) {
        walletDropdown.classList.add('hidden');
    }
});

// Installments Logic (BNPL)
function renderInstallments() {
    const listEl = document.getElementById('installments-list');
    const reportEl = document.getElementById('installments-report');
    if (!listEl) return;

    listEl.innerHTML = '';

    // Sort by Date
    installmentPlans.sort((a, b) => new Date(a.nextDueDate) - new Date(b.nextDueDate));

    if (installmentPlans.length === 0) {
        listEl.innerHTML = `
            <div style="text-align: center; color: var(--text-secondary); width: 100%; grid-column: 1 / -1; padding: 20px;">
                <p>Nessuna rateizzazione attiva</p>
            </div>
        `;
    } else {
        installmentPlans.forEach(plan => {
            const card = document.createElement('div');
            card.className = 'debt-card';
            // Logic to show progress
            const progress = (plan.paidInstallments / plan.installmentsCount) * 100;

            card.innerHTML = `
                <div class="debt-header">
                    <div>
                        <div class="debt-title">${plan.name}</div>
                        <div class="debt-subtitle">${plan.paidInstallments}/${plan.installmentsCount} Rate</div>
                    </div>
                    <div class="debt-amount">€ ${parseFloat(plan.totalAmount).toFixed(2)}</div>
                </div>
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${progress}%"></div>
                </div>
                <div class="debt-details">
                    <span>Prossima: ${new Date(plan.nextDueDate).toLocaleDateString('it-IT')}</span>
                    <span>€ ${parseFloat(plan.installmentAmount).toFixed(2)}</span>
                </div>
                 <div class="debt-actions">
                    <button class="btn-small" onclick="deleteInstallmentPlan('${plan.id}')" style="color: var(--danger-color); border-color: var(--danger-color);">Elimina</button>
                </div>
             `;
            listEl.appendChild(card);
        });
    }

    // Update Report
    if (reportEl) {
        reportEl.innerHTML = '';
        if (installmentPlans.length === 0) {
            reportEl.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.9rem;">Nessuna scadenza imminente.</p>';
        } else {
            installmentPlans.slice(0, 3).forEach(plan => {
                const item = document.createElement('div');
                item.style.display = 'flex';
                item.style.justifyContent = 'space-between';
                item.style.marginBottom = '8px';
                item.style.fontSize = '0.9rem';
                item.innerHTML = `
                    <span>${plan.name} (${plan.paidInstallments + 1}/${plan.installmentsCount})</span>
                    <span style="font-weight: 500;">€ ${parseFloat(plan.installmentAmount).toFixed(2)} - ${new Date(plan.nextDueDate).toLocaleDateString('it-IT')}</span>
                `;
                reportEl.appendChild(item);
            });
        }
    }
}

function checkDueInstallments() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    installmentPlans.forEach(async plan => {
        const nextDate = new Date(plan.nextDueDate);
        nextDate.setHours(0, 0, 0, 0);

        if (nextDate <= today && plan.paidInstallments < plan.installmentsCount) {
            // Create Transaction
            const transaction = {
                walletId: currentWalletId,
                type: 'expense',
                amount: plan.installmentAmount,
                category: 'shopping', // Default or specific
                date: plan.nextDueDate,
                description: `Rata ${plan.paidInstallments + 1}/${plan.installmentsCount}: ${plan.name}`,
                isRecurring: false
            };

            try {
                await window.dbOps.addTransactionToDb(transaction);

                // Update Plan
                const updates = {
                    paidInstallments: plan.paidInstallments + 1
                };

                // Calc next date
                const newDate = new Date(plan.nextDueDate);
                newDate.setMonth(newDate.getMonth() + 1); // Assume monthly for now
                updates.nextDueDate = newDate.toISOString().split('T')[0];

                if (updates.paidInstallments >= plan.installmentsCount) {
                    await window.dbOps.deleteInstallmentPlan(plan.id);
                } else {
                    await window.dbOps.updateInstallmentPlan(plan.id, updates);
                }

                console.log('Processed installment for:', plan.name);

            } catch (err) {
                console.error('Error processing installment:', err);
            }
        }
    });
}

window.deleteInstallmentPlan = async (id) => {
    if (confirm('Eliminare questo piano rateale?')) {
        await window.dbOps.deleteInstallmentPlan(id);
    }
};

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

// Income and Expense button listeners
const btnIncome = document.getElementById('btn-income');
const btnExpense = document.getElementById('btn-expense');

if (btnIncome) {
    btnIncome.addEventListener('click', () => openModal('income'));
}

if (btnExpense) {
    btnExpense.addEventListener('click', () => openModal('expense'));
}

// Sidebar toggle functionality
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.querySelector('.sidebar');
const appWrapper = document.querySelector('.app-wrapper');

if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        appWrapper.classList.toggle('sidebar-collapsed');
    });
}


// --- Subscription Functions ---

function calculateNextDate(dateStr, frequency) {
    let date = new Date(dateStr);
    if (frequency === 'monthly') {
        date.setMonth(date.getMonth() + 1);
    } else if (frequency === 'weekly') {
        date.setDate(date.getDate() + 7);
    } else if (frequency === 'yearly') {
        date.setFullYear(date.getFullYear() + 1);
    }
    return date.toISOString().split('T')[0];
}

function renderSubscriptions() {
    if (!subscriptionsListEl) return;

    // Clear list first to prevent duplicates/stacking with empty state
    subscriptionsListEl.innerHTML = '';

    // 1. Render Management List (Abbonamenti Attivi)
    if (subscriptions.length === 0) {
        subscriptionsListEl.innerHTML = `
            <li class="empty-state">
                 <i class="fas fa-play-circle"></i>
                <p>Nessun abbonamento attivo</p>
            </li>
        `;
    } else {
        subscriptions.forEach(sub => {
            const item = document.createElement('li');
            item.classList.add('transaction-item');
            item.classList.add('expense');

            const categoryData = allCategories[sub.category] || allCategories.other;
            const iconClass = categoryData.icon;

            item.innerHTML = `
                <div class="t-info">
                    <div class="t-icon">
                        <i class="fas ${iconClass}"></i>
                    </div>
                    <div class="t-details">
                        <h4>${sub.name} <span class="badge-recurring">${getUrlFrequency(sub.frequency)}</span></h4>
                        <small>Prossimo rinnovo: ${formatDate(sub.nextDueDate)}</small>
                    </div>
                </div>
                <div class="t-actions">
                    <span class="t-amount expense">
                        -€ ${Math.abs(sub.amount).toFixed(2)}
                    </span>
                    <button class="delete-btn" onclick="deleteSubscription('${sub.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            subscriptionsListEl.appendChild(item);
        });
    }

    // 2. Render Timeline (Altre Spese Ricorrenti / Proiezioni)
    renderRecurringTimeline();
}

function renderRecurringTimeline() {
    if (!recurringListEl) return;
    recurringListEl.innerHTML = '';

    // 1. Gather all recurring items
    let allItems = [];

    // A. Manual Recurring Flows
    recurringFlows.forEach(flow => {
        allItems.push({
            type: 'flow',
            date: flow.nextDueDate,
            description: flow.description,
            amount: flow.amount,
            category: flow.category,
            id: flow.id,
            original: flow
        });
    });

    // B. Active Subscriptions
    subscriptions.forEach(sub => {
        allItems.push({
            type: 'subscription',
            date: sub.nextDueDate,
            description: `${sub.name} (Abbonamento)`,
            amount: sub.amount,
            category: sub.category,
            id: sub.id,
            original: sub
        });
    });

    // C. Active Installment Plans
    installmentPlans.forEach(plan => {
        allItems.push({
            type: 'installment',
            date: plan.nextDueDate,
            description: `Rata: ${plan.name} (${plan.paidInstallments + 1}/${plan.installmentsCount})`,
            amount: plan.installmentAmount,
            category: 'shopping', // Default for installments
            id: plan.id,
            original: plan
        });
    });

    // D. Active Loans (Next Monthly Payment)
    loans.forEach(loan => {
        if (loan.status === 'archived') return;

        // Calculate next date: set strictly to next month relative to start date or just current day of month
        // Simplifying assumption: Loan payment is due on the same day-of-month as startDate
        const today = new Date();
        const start = new Date(loan.startDate);
        let nextDate = new Date(today.getFullYear(), today.getMonth(), start.getDate());

        if (nextDate < today) {
            nextDate.setMonth(nextDate.getMonth() + 1);
        }

        // Calculate monthly payment (amortization approximation)
        // PMT = [P * r * (1+r)^n] / [(1+r)^n - 1]
        // But user inputs simple rate and amount. Let's use simple approximation or just Amount/Months if rate is 0?
        // Let's assume standard PMT formula if rate > 0
        let monthlyPayment = 0;
        if (loan.rate === 0) {
            monthlyPayment = loan.amount / loan.months;
        } else {
            const r = (loan.rate / 100) / 12;
            const n = loan.months;
            monthlyPayment = (loan.amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        }

        // Format Date Local
        const year = nextDate.getFullYear();
        const month = String(nextDate.getMonth() + 1).padStart(2, '0');
        const day = String(nextDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        allItems.push({
            type: 'loan',
            date: formattedDate,
            description: `Rata Prestito: ${loan.name}`,
            amount: monthlyPayment,
            category: 'bills', // Loans usually go here or housing
            id: loan.id,
            original: loan
        });
    });

    // E. Revolving Cards (Monthly Payment)
    revolvingCards.forEach(card => {
        if (card.status === 'archived' || !card.monthlyPayment || !card.paymentDay) return;

        const today = new Date();
        // Handle payment day > days in month (e.g. 31st)
        const currentMonthDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        const pDay = Math.min(card.paymentDay, currentMonthDays);

        let nextDate = new Date(today.getFullYear(), today.getMonth(), pDay);

        // If date passed, move to next month
        if (nextDate < today) {
            nextDate.setMonth(nextDate.getMonth() + 1);
            // Re-check day validity for next month
            const nextMonthDays = new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate();
            nextDate.setDate(Math.min(card.paymentDay, nextMonthDays));
        }

        // Format Date Local
        const year = nextDate.getFullYear();
        const month = String(nextDate.getMonth() + 1).padStart(2, '0');
        const day = String(nextDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        allItems.push({
            type: 'revolving',
            date: formattedDate,
            description: `Rata Carta: ${card.name}`,
            amount: card.monthlyPayment,
            category: 'bills',
            id: card.id,
            original: card
        });
    });

    // 2. Sort by Date
    allItems.sort((a, b) => new Date(a.date) - new Date(b.date));

    if (allItems.length === 0) {
        recurringListEl.innerHTML = `
            <li class="empty-state">
                <i class="fas fa-sync-alt"></i>
                <p>Nessuna spesa ricorrente attiva</p>
            </li>
        `;
        return;
    }

    allItems.forEach(item => {
        const domItem = document.createElement('li');
        domItem.classList.add('transaction-item');
        domItem.classList.add('expense'); // All debts are expenses usually

        let iconClass = 'fa-circle-notch';
        let categoryLabel = 'Altro';

        if (allCategories[item.category]) {
            iconClass = allCategories[item.category].icon;
            categoryLabel = allCategories[item.category].label;
        }

        // Custom icons for debts
        if (item.type === 'installment' || item.type === 'loan') iconClass = 'fa-university';
        if (item.type === 'subscription') iconClass = 'fa-play-circle';

        const amountClass = 'expense';
        const sign = '-';

        let actionBtn = '';
        if (item.type === 'flow') {
            actionBtn = `
                <button class="delete-btn" onclick="deleteRecurringFlow('${item.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            `;
        } else {
            // For debts, maybe a link to manage them?
            // Use a info icon or similar that isn't a delete button
            actionBtn = `
                <div class="delete-btn" style="opacity: 0.5; cursor: default; border: none;" title="Automatico">
                    <i class="fas fa-robot"></i>
                </div>
            `;
        }

        domItem.innerHTML = `
            <div class="t-info">
                <div class="t-icon">
                    <i class="fas ${iconClass}"></i>
                </div>
                <div class="t-details">
                    <h4>${item.description}</h4>
                    <small>Prossimo: ${formatDate(item.date)}</small>
                </div>
            </div>
            <div class="t-actions">
                <span class="t-amount ${amountClass}">
                    ${sign}€ ${Math.abs(item.amount).toFixed(2)}
                </span>
                ${actionBtn}
            </div>
        `;
        recurringListEl.appendChild(domItem);
    });
}

function getUrlFrequency(freq) {
    if (freq === 'monthly') return 'Mensile';
    if (freq === 'weekly') return 'Settimanale';
    if (freq === 'yearly') return 'Annuale';
    return freq;
}

async function checkDueSubscriptions() {
    const today = new Date().toISOString().split('T')[0];

    for (const sub of subscriptions) {
        if (sub.nextDueDate <= today) {
            console.log(`Renewing subscription: ${sub.name}`);

            // 1. Create Transaction
            const transaction = {
                walletId: sub.walletId || 'default',
                type: 'expense',
                amount: sub.amount,
                category: sub.category,
                date: today,
                description: sub.name + ' (Rinnovo)',
                isRecurring: true,
                frequency: sub.frequency
            };

            // 2. Update Next Due Date
            const nextDate = calculateNextDate(sub.nextDueDate, sub.frequency);

            try {
                await window.dbOps.addTransactionToDb(transaction);
                await window.dbOps.updateSubscription(sub.id, { nextDueDate: nextDate });
            } catch (e) {
                console.error("Error checking subscription", e);
            }
        }
    }
}

window.deleteSubscription = async function (id) {
    if (confirm('Vuoi annullare questo abbonamento?')) {
        try {
            await window.dbOps.deleteSubscriptionFromDb(id);
        } catch (e) {
            alert('Errore cancellazione: ' + e.message);
        }
    }
};

init();

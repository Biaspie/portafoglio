// DOM Elements
const FINNHUB_API_KEY = 'd4rhdehr01qgts2o410gd4rhdehr01qgts2o4110'; // Inserisci qui la tua chiave API di Finnhub
console.log('Portafoglio App v1.14.0 Loaded');

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

// Budget Elements
const navBudget = document.getElementById('nav-budget');
const budgetView = document.getElementById('budget-view');
const budgetListEl = document.getElementById('budget-list');
const btnAddBudget = document.getElementById('btn-add-budget');
const budgetModal = document.getElementById('budget-modal');
const closeBudgetModalBtn = document.getElementById('close-budget-modal');
const budgetForm = document.getElementById('budget-form');
const budgetTotalAmountEl = document.getElementById('total-budget-amount');
const budgetTotalSpentEl = document.getElementById('total-budget-spent');
const budgetTotalRemainingEl = document.getElementById('total-budget-remaining');

// Mobile Navigation Elements
const navDashboardMobile = document.getElementById('nav-dashboard-mobile');
const navAnalysisMobile = document.getElementById('nav-analysis-mobile');
const navInvestmentsMobile = document.getElementById('nav-investments-mobile');
const navRecurringMobile = document.getElementById('nav-recurring-mobile');
const navDebtsMobile = document.getElementById('nav-debts-mobile');
const navBudgetMobile = document.getElementById('nav-budget-mobile');


// State
// State
let transactions = [];
let recurringFlows = [];
let investments = [];
let wallets = [];
let loans = [];
let revolvingCards = [];
let budgets = []; // State for Budgets
let installmentPlans = []; // State for BNPL
let subscriptions = []; // State for Subscriptions
let archivedLoans = [];
let archivedRevolving = [];
let currentWalletId = localStorage.getItem('currentWalletId') || 'default';
let currentDebtView = 'active'; // 'active' or 'archive'
let currentAnalysisDate = new Date();

// Charts
let balanceChart;
let expensePieChart;
let allocationChart;
let projectionChart; // New Projection Chart

let userProfile = null; // Store user profile
let priceUpdateInterval = null;

// DB Subscriptions
let unsubscribeTransactions = null;
let unsubscribeInvestments = null;
let unsubscribeLoans = null;
let unsubscribeRevolving = null;
let unsubscribeInstallments = null;
let unsubscribeSubscriptions = null;
let unsubscribeBudgets = null;

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
        option.value = `wallet_${wallet.id}`; // Prefix to distinguish
        option.text = wallet.name;
        if (wallet.id === currentWalletId) option.selected = true;
        walletSelectTransaction.appendChild(option);
    });

    // Group: Revolving Cards
    if (typeof revolvingCards !== 'undefined' && revolvingCards.length > 0) {
        const cardGroup = document.createElement('optgroup');
        cardGroup.label = 'Carte di Credito';
        let hasCards = false;

        revolvingCards.forEach(card => {
            if (card.status === 'archived') return;
            const option = document.createElement('option');
            option.value = `card_${card.id}`;
            option.textContent = card.name;
            cardGroup.appendChild(option);
            hasCards = true;
        });

        if (hasCards) {
            walletSelectTransaction.appendChild(cardGroup);
        }
    }
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
                    updateProjectionChart(); // Ensure projection chart is updated on investment changes
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
                renderWalletList(); // Update transaction selector
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
            unsubscribeSubscriptions = window.dbOps.subscribeToSubscriptions((subs) => {
                subscriptions = subs;
                // Don't auto-render here, depends on view
                renderSubscriptions(); // Assuming it should still render
                checkDueSubscriptions();
            });

            if (unsubscribeBudgets) unsubscribeBudgets();
            unsubscribeBudgets = window.dbOps.subscribeToBudgets((b) => {
                budgets = b;
                if (navBudget.classList.contains('active')) renderBudgets();
            });

            populateAssetSelect();

            // Set default date to today
            document.getElementById('date').valueAsDate = new Date();
        }
    });
}

function updateUI() {
    listEl.innerHTML = '';

    // Filter by current wallet or if it's a card transaction (global/mixed logic as per user request)
    // User wants to see card transactions in the list.
    const walletTransactions = transactions.filter(t => t.walletId === currentWalletId || t.sourceType === 'card');

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
    const rawWalletId = document.getElementById('wallet-select-transaction').value;

    if (!rawWalletId) {
        alert("Seleziona un portafoglio valido.");
        return;
    }

    let realWalletId = rawWalletId;
    let sourceType = 'wallet';

    if (rawWalletId.startsWith('card_')) {
        sourceType = 'card';
        realWalletId = rawWalletId.replace('card_', '');
    } else if (rawWalletId.startsWith('wallet_')) {
        realWalletId = rawWalletId.replace('wallet_', '');
    }

    const description = document.getElementById('description').value || allCategories[category].label;
    const isRecurring = isRecurringInput.checked;

    if (amount === 0) {
        alert('Inserisci un importo valido');
        return;
    }

    const transaction = {
        walletId: realWalletId,
        sourceType: sourceType,
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
            walletId: realWalletId // Use realWalletId here
        };

        try {
            await window.dbOps.addSubscriptionToDb(subscription);
        } catch (e) {
            console.error("Error creating subscription", e);
        }
    }

    try {
        // If source is a Revolving Card, update its balance (Debt)
        if (sourceType === 'card') {
            const card = revolvingCards.find(c => c.id === realWalletId);
            if (card) {
                const balanceChange = type === 'expense' ? amount : -amount;
                const newBalance = parseFloat(card.balance) + balanceChange;
                await window.dbOps.updateRevolving(realWalletId, { balance: newBalance });
            }
        }

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

    // Card Indicator
    let sourceInfo = formatDate(transaction.date);
    if (transaction.sourceType === 'card') {
        const card = revolvingCards.find(c => c.id === transaction.walletId);
        const cardName = card ? card.name : 'Carta';
        sourceInfo = `<i class="fas fa-credit-card" title="Pagato con ${cardName}" style="margin-right: 5px; color: var(--warning-color);"></i> ${cardName} &bull; ${formatDate(transaction.date)}`;
    }

    item.innerHTML = `
        <div class="t-info">
            <div class="t-icon">
                <i class="fas ${iconClass}"></i>
            </div>
            <div class="t-details">
                <h4>${transaction.description}</h4>
                <small>${sourceInfo}</small>
            </div>
        </div>
        <div class="t-actions">
            <span class="t-amount ${transaction.type}">${sign}€ ${Math.abs(transaction.amount).toFixed(2)}</span>
            <button class="delete-btn" onclick="removeTransaction('${transaction.id}')">
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

    // Net Worth Calculation (Total Assets - Total Debt)
    // Assets = Total Liquidity (All Wallets) + Investments
    // Debts = Loans + Revolving + Installments

    // Calculate Global Cash (Liquidity across ALL wallets)
    // Exclude 'card' transactions as they affect Debt, not Cash (until paid)
    const globalCash = transactions
        .filter(t => t.sourceType !== 'card')
        .reduce((acc, t) => {
            return t.type === 'income' ? acc + t.amount : acc - t.amount;
        }, 0);

    const totalDebt = getGlobalDebt();
    const netWorth = (globalCash + totalInvestments - totalDebt).toFixed(2);

    const netWorthEl = document.getElementById('net-worth-display');
    if (netWorthEl) {
        netWorthEl.innerText = `Patrimonio Reale: € ${netWorth}`;
        // Optional styling: Red if negative
        netWorthEl.style.color = parseFloat(netWorth) < 0 ? 'rgba(231, 76, 60, 0.9)' : 'rgba(255, 255, 255, 0.8)';
    }

    investmentsDashboardEl.innerText = `€ ${totalInvestments.toFixed(2)}`;

    // Update Projection Input default if needed (optional)
}

function updateProjectionChart() {
    const ctx = document.getElementById('projection-chart');
    if (!ctx) return;

    const monthlyContribution = parseFloat(document.getElementById('monthly-contribution').value) || 0;
    const initialPrincipal = investments.reduce((acc, asset) => acc + asset.current, 0); // Global state
    const years = 10;
    const rate = 0.07; // 7% Annual Return

    const labels = [];
    const dataPoints = [];

    let currentAmount = initialPrincipal;

    // Generate Year 0-10 data
    for (let i = 0; i <= years; i++) {
        labels.push(`Anno ${i}`);
        dataPoints.push(currentAmount);

        // Calculate next year
        // FV = P * (1+r) + (PMT * 12) simplified? 
        // More accurate: compound monthly. But simplied yearly:
        // End of Year Amount = (Start Amount * 1.07) + (Monthly * 12)
        // Wait, Monthly contributions also earn interest during the year. 
        // Simple approx: (Current * 1.07) + (Monthly * 12)

        currentAmount = (currentAmount * (1 + rate)) + (monthlyContribution * 12);
    }

    if (projectionChart) {
        projectionChart.destroy();
    }

    projectionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Valore Stimato (7% annuo)',
                data: dataPoints,
                borderColor: '#2ecc71', // Green
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#bdc3c7' }
                }
            },
            scales: {
                y: {
                    beginAtZero: false, // Don't start at 0 if principal is high
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#bdc3c7' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#bdc3c7' }
                }
            }
        }
    });
}

function getGlobalDebt() {
    // 1. Loans (Active)
    const loansDebt = loans.reduce((acc, loan) => {
        // Simple calculation: Initial Amount - (Paid Principal? No, we don't track principal paid directly in array yet, 
        // usually we'd need amortization tracking. CONSTANT for now or 0 if not tracking balance).
        // Better: For loans, we usually track 'remaining'. If not, we use full amount.
        // Assuming 'amount' is the initial. 
        // If we don't have a 'remaining' field in DB, we'll approximate or use amount.
        // CHECK: Do we update loan amounts? No.
        // So for Net Worth, Loans are tricky without amortization.
        // Let's use 0 for now or 'amount' if we assume it's current.
        // A better approach for V2 is adding 'currentBalance' to loans.
        return acc + (loan.currentBalance || loan.amount);
    }, 0);

    // 2. Revolving Cards (Active)
    const cardsDebt = revolvingCards.reduce((acc, card) => {
        return acc + (parseFloat(card.balance) || 0);
    }, 0);

    // 3. Installments (Active)
    const installmentsDebt = installmentPlans.reduce((acc, plan) => {
        // Total - (Paid * Amount)
        const remaining = plan.totalAmount - (plan.paidInstallments * plan.installmentAmount);
        return acc + Math.max(0, remaining);
    }, 0);

    return loansDebt + cardsDebt + installmentsDebt;
}

async function removeTransaction(id) {
    if (confirm('Sei sicuro di voler eliminare questa transazione?')) {
        try {
            // Find transaction to check if it affects a card
            const transaction = transactions.find(t => t.id == id); // Loose equality for number/string id mismatch safety

            if (transaction && transaction.sourceType === 'card') {
                const card = revolvingCards.find(c => c.id === transaction.walletId);
                if (card) {
                    // Revert balance change: 
                    // If it was Expense (increased debt), we subtract amount.
                    // If it was Income (decreased debt), we add amount.
                    const reversalAmount = transaction.type === 'expense' ? -transaction.amount : transaction.amount;
                    const newBalance = parseFloat(card.balance) + reversalAmount;

                    await window.dbOps.updateRevolving(transaction.walletId, { balance: newBalance });
                }
            }

            await window.dbOps.deleteTransactionFromDb(id);
            // UI updates via subscription automatically
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
                    beginAtZero: false, // Don't start at 0 if principal is high
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
            { name: 'Bitcoin', apiId: 'bitcoin', type: 'crypto' },
            { name: 'Ethereum', apiId: 'ethereum', type: 'crypto' },
            { name: 'Solana', apiId: 'solana', type: 'crypto' },
            { name: 'Cardano', apiId: 'cardano', type: 'crypto' },
            { name: 'Ripple', apiId: 'ripple', type: 'crypto' },
            { name: 'Polkadot', apiId: 'polkadot', type: 'crypto' },
            { name: 'Dogecoin', apiId: 'dogecoin', type: 'crypto' },
            { name: 'Avalanche', apiId: 'avalanche-2', type: 'crypto' },
            { name: 'Chainlink', apiId: 'chainlink', type: 'crypto' },
            { name: 'Polygon', apiId: 'matic-network', type: 'crypto' }
        ]
    },
    stocks: {
        label: 'Azioni (Prezzo Manuale)',
        items: [
            { name: 'Apple', apiId: 'AAPL', type: 'stock' },
            { name: 'Microsoft', apiId: 'MSFT', type: 'stock' },
            { name: 'Google', apiId: 'GOOGL', type: 'stock' },
            { name: 'Amazon', apiId: 'AMZN', type: 'stock' },
            { name: 'Tesla', apiId: 'TSLA', type: 'stock' },
            { name: 'Meta', apiId: 'META', type: 'stock' },
            { name: 'NVIDIA', apiId: 'NVDA', type: 'stock' }
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
            { name: 'Altro...', value: 'custom', type: 'custom' }
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
    // Use user-provided date or fallback to today
    const dateInput = document.getElementById('asset-date').value;
    const transactionDate = dateInput || new Date().toISOString().split('T')[0];

    // Check if asset already exists
    const existingAssetIndex = investments.findIndex(a => a.name === name && a.type === (selectedOption.dataset.type || 'custom'));

    if (existingAssetIndex !== -1) {
        // Merge with existing asset
        if (confirm(`L'asset "${name}" esiste già. Vuoi aggiungere questa transazione allo storico?`)) {
            const existing = investments[existingAssetIndex];

            // Initialize history if missing
            if (!existing.history) {
                existing.history = [{
                    date: transactionDate,
                    type: 'buy',
                    quantity: existing.quantity,
                    invested: existing.invested,
                    price: existing.invested / existing.quantity
                }];
            }

            // Add new history entry
            existing.history.push({
                date: transactionDate,
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
                date: transactionDate,
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
    updateProjectionChart(); // Update projection chart after adding/modifying asset

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
        updateProjectionChart(); // Update projection chart after removing asset
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
    const cryptoAssets = investments.filter(a => a.apiId && a.type === 'crypto');
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
            updateProjectionChart(); // Update projection chart after price update
        }

    } catch (error) {
        console.error('Error fetching crypto prices:', error);
    }
}

async function fetchTransactionPrice(apiId, dateStr, type = 'crypto') {
    if (type === 'crypto') {
        // dateStr is yyyy-mm-dd
        // CoinGecko needs dd-mm-yyyy
        const [year, month, day] = dateStr.split('-');
        const formattedDate = `${day}-${month}-${year}`;

        const url = `https://api.coingecko.com/api/v3/coins/${apiId}/history?date=${formattedDate}&localization=false`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('API Rate Limit or Error');
            const data = await response.json();

            if (data.market_data && data.market_data.current_price && data.market_data.current_price.eur) {
                return data.market_data.current_price.eur;
            }
            return null;
        } catch (e) {
            console.error('Error fetching historical crypto price:', e);
            return null;
        }
    } else if (type === 'stock' || type === 'etf') {
        if (!FINNHUB_API_KEY || FINNHUB_API_KEY === 'YOUR_API_KEY_HERE') {
            console.warn('Finnhub API Key missing for stock history');
            return null;
        }

        // Finnhub Candle API
        const timestamp = Math.floor(new Date(dateStr).getTime() / 1000);
        const toTimestamp = timestamp + 86400; // Look at the full day

        const url = `https://finnhub.io/api/v1/stock/candle?symbol=${apiId}&resolution=D&from=${timestamp}&to=${toTimestamp}&token=${FINNHUB_API_KEY}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Finnhub API Error');
            const data = await response.json();

            if (data.c && data.c.length > 0) {
                return data.c[0]; // Return close price of that day
            }
            return null;
        } catch (e) {
            console.error('Error fetching historical stock price:', e);
            return null;
        }
    }
    return null;
}

async function fetchETFPrices() {
    if (FINNHUB_API_KEY === 'YOUR_API_KEY_HERE') {
        console.warn('Finnhub API Key not set');
        return;
    }

    const etfAssets = investments.filter(a => (a.type === 'etf' || a.type === 'stock') && a.apiId);
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
        updateProjectionChart(); // Update projection chart after price update
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

// Event listeners for projection chart
const monthlyContributionInput = document.getElementById('monthly-contribution');
if (monthlyContributionInput) {
    monthlyContributionInput.addEventListener('input', updateProjectionChart);
}

const projectionChartToggle = document.getElementById('projection-chart-toggle');
if (projectionChartToggle) {
    projectionChartToggle.addEventListener('click', () => {
        const projectionChartContainer = document.getElementById('projection-chart-container');
        if (projectionChartContainer) {
            projectionChartContainer.classList.toggle('hidden');
            if (!projectionChartContainer.classList.contains('hidden')) {
                updateProjectionChart(); // Re-render when shown
            }
        }
    });
}


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

    /* 
    // Excluded Debts from Recurring View as per user request
    if (installmentPlans) { ... }
    if (loans) { ... }
    */

    // Sort by Date
    allItems.sort((a, b) => new Date(a.date) - new Date(b.date));

    if (allItems.length === 0) {
        recurringListEl.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-sync-alt"></i>
                <p>Nessuna spesa ricorrente attiva</p>
            </div>
        `;
        return;
    }

    allItems.forEach(item => {
        const domItem = document.createElement('div');
        domItem.classList.add('debt-card'); // Use Debt Card Style

        let iconClass = 'fa-circle-notch';
        let categoryLabel = 'Altro';
        let color = '#ccc'; // Default

        if (allCategories[item.category]) {
            iconClass = allCategories[item.category].icon;
            categoryLabel = allCategories[item.category].label;
            color = allCategories[item.category].color;
        }

        domItem.innerHTML = `
            <div class="debt-header">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div class="icon-circle" style="background-color: ${color}20; color: ${color}; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%;">
                        <i class="fas ${iconClass}"></i>
                    </div>
                    <div>
                        <div class="debt-title">${item.description}</div>
                        <div class="debt-subtitle">${categoryLabel} • Prossimo: ${formatDate(item.date)}</div>
                    </div>
                </div>
                <div class="debt-amount" style="color: var(--danger-color);">€ ${item.amount.toFixed(2)}</div>
            </div>
            <div class="debt-actions" style="margin-top: 15px; border-top: 1px solid var(--border-color); padding-top: 10px;">
                <button class="btn-small delete" onclick="deleteRecurringFlow('${item.id}')" style="color: var(--danger-color); background: none; border: none;">
                    <i class="fas fa-trash"></i> Elimina
                </button>
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
    renderUpcomingDeadlines();
}

function renderUpcomingDeadlines() {
    const reportList = document.getElementById('installments-report');
    if (!reportList) return;

    reportList.innerHTML = '';
    const deadlines = [];

    // 1. Active Loans
    if (loans) {
        loans.filter(l => !l.settled).forEach(loan => {
            const start = new Date(loan.startDate);
            const today = new Date();
            let nextDate = new Date(start);
            while (nextDate <= today) {
                nextDate.setMonth(nextDate.getMonth() + 1);
            }

            const monthlyRate = loan.rate / 100 / 12;
            const payment = (loan.amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -loan.months));

            deadlines.push({
                date: nextDate,
                desc: `${loan.name} (Rata)`,
                amount: payment,
                type: 'Mutuo'
            });
        });
    }

    // 2. Installment Plans
    if (installmentPlans) {
        installmentPlans.filter(p => p.status === 'active').forEach(plan => {
            const nextInst = plan.installments.find(i => i.status === 'pending');
            if (nextInst) {
                deadlines.push({
                    date: new Date(nextInst.dueDate),
                    desc: `${plan.name} (Rata ${nextInst.number}/${plan.installmentsCount})`,
                    amount: nextInst.amount,
                    type: 'Rate'
                });
            }
        });
    }

    // 3. Revolving Cards
    if (revolvingCards) {
        revolvingCards.forEach(card => {
            const today = new Date();
            const pDay = card.paymentDay || 1;
            let nextDate = new Date(today.getFullYear(), today.getMonth(), pDay);
            if (nextDate <= today) {
                nextDate.setMonth(nextDate.getMonth() + 1);
            }
            // Estimate payment (simplified: 5% of limit or used?)
            // We'll just show the date and "Scadenza Carta"
            deadlines.push({
                date: nextDate,
                desc: `${card.name} (Addebito)`,
                amount: card.monthlyPayment || 0,
                type: 'Revolving'
            });
        });
    }

    // Sort and Take Top 5
    deadlines.sort((a, b) => a.date - b.date);
    const upcoming = deadlines.slice(0, 5);

    if (upcoming.length === 0) {
        reportList.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.9rem;">Nessuna scadenza imminente.</p>';
        return;
    }

    upcoming.forEach(item => {
        const div = document.createElement('div');
        div.style.cssText = 'display: flex; justify-content: space-between; border-bottom: 1px dashed var(--border-color); padding: 8px 0; font-size: 0.9rem; align-items: center;';

        const dateStr = item.date.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
        const amountStr = item.amount > 0 ? `€ ${item.amount.toFixed(2)}` : 'Variabile';

        div.innerHTML = `
            <div style="display: flex; gap: 10px; align-items: center;">
                <span style="font-weight: bold; color: var(--accent-color); min-width: 50px;">${dateStr}</span>
                <span>${item.desc}</span>
            </div>
            <div style="font-weight: 500;">${amountStr}</div>
        `;
        reportList.appendChild(div);
    });
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
                <div>
                    <div class="debt-title">${card.name}</div>
                    <div class="debt-subtitle">Plafond: € ${parseFloat(card.limit).toFixed(2)}</div>
                </div>
                <div class="debt-amount">-€ ${parseFloat(card.balance).toFixed(2)}</div>
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

function renderInstallmentPlans() {
    const listEl = document.getElementById('installments-list');
    if (!listEl) return;

    listEl.innerHTML = '';
    const targetPlans = currentDebtView === 'active' ? installmentPlans : []; // Add archive support if needed

    if (!targetPlans || targetPlans.length === 0) {
        // Only show message if we are supposed to show something? 
        // If header exists, we should show empty state.
        // User complained about "Nessuna rateizzazione attiva", so let's use that text.
        listEl.innerHTML = `<p style="text-align:center; color:var(--text-secondary); width:100%;">Nessuna rateizzazione ${currentDebtView === 'active' ? 'attiva' : 'archiviata'}</p>`;
        return;
    }

    targetPlans.forEach(plan => {
        const nextInst = plan.installments.find(i => i.status === 'pending');
        const paidCount = plan.installments.filter(i => i.status === 'paid').length;
        const progress = (paidCount / plan.installmentsCount) * 100;

        const card = document.createElement('div');
        card.className = 'debt-card';
        card.innerHTML = `
            <div class="debt-header">
                <div>
                    <div class="debt-title">${plan.name}</div>
                    <div class="debt-subtitle">${plan.installmentsCount} Rate Mensili</div>
                </div>
                <div class="debt-amount">€ ${parseFloat(plan.totalAmount).toFixed(2)}</div>
            </div>
             <div class="progress-container">
                <div class="progress-bar" style="width: ${progress}%"></div>
            </div>
             <div class="debt-details">
                <span>Pagate: ${paidCount}/${plan.installmentsCount}</span>
                <span>Prossima: ${nextInst ? formatDate(nextInst.dueDate) : '-'}</span>
            </div>
            <div class="debt-actions">
                 <button class="btn-small" onclick="deleteInstallmentPlan('${plan.id}')" style="color: var(--danger-color); border-color: var(--danger-color);">Elimina</button>
            </div>
         `;
        listEl.appendChild(card);
    });
}

function renderDebts() {
    // Toggle Buttons
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
    // renderInstallmentPlans(); // Removed as requested
    updateTotalDebt();
    renderUpcomingDeadlines();
}

function updateTotalDebt() {
    let total = 0;
    let totalMonthly = 0;

    // Calculate remaining loan balance and monthly payments
    loans.forEach(loan => {
        if (loan.status === 'archived') return;

        const startDate = new Date(loan.startDate);
        const now = new Date();
        const monthsElapsed = (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth());

        let balance = loan.amount;
        let payment = 0;

        // Simple amortization calc to get current balance
        const monthlyRate = loan.rate / 100 / 12;

        if (loan.rate === 0) {
            payment = loan.amount / loan.months;
            balance = Math.max(0, loan.amount - (payment * monthsElapsed));
        } else {
            payment = (loan.amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -loan.months));

            let tempBalance = loan.amount;
            for (let i = 0; i < monthsElapsed && i < loan.months; i++) {
                const interest = tempBalance * monthlyRate;
                const principal = payment - interest;
                tempBalance -= principal;
            }
            balance = tempBalance;
        }

        if (balance < 0) balance = 0;

        // Count if active
        if (balance > 0.1) {
            total += balance;
            totalMonthly += payment;
        }
    });

    // Add revolving card balances
    revolvingCards.forEach(card => {
        if (card.status === 'archived') return;
        total += parseFloat(card.balance);
        totalMonthly += (parseFloat(card.monthlyPayment) || 0);
    });

    const totalDebtEl = document.getElementById('total-debt-remaining');
    if (totalDebtEl) {
        totalDebtEl.textContent = `€ ${total.toFixed(2)}`;
    }

    // Update Monthly Total
    const totalMonthlyEl = document.getElementById('total-monthly-debt');
    if (totalMonthlyEl) {
        totalMonthlyEl.innerText = `€ ${totalMonthly.toFixed(2)}`;
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
    const type = document.getElementById('revolving-type').value;

    // Logic for Saldo vs Revolving
    const rate = type === 'saldo' ? 0 : (parseFloat(document.getElementById('revolving-rate').value) || 0);
    const monthlyPayment = parseFloat(document.getElementById('revolving-monthly-payment').value) || 0;
    const paymentDay = parseInt(document.getElementById('revolving-payment-day').value) || null;

    const cardData = {
        name,
        limit,
        balance,
        type,
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

        // Reset visibility
        const revolvingDetailsContainer = document.getElementById('revolving-details-container');
        if (revolvingDetailsContainer) revolvingDetailsContainer.classList.remove('hidden');

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
    renderDebts();
}

function hideAllViews() {
    dashboardView.classList.add('hidden');
    analysisView.classList.add('hidden');
    investmentsView.classList.add('hidden');
    recurringView.classList.add('hidden');
    debtsView.classList.add('hidden');
    budgetView.classList.add('hidden');

    navDashboard.classList.remove('active');
    navAnalysis.classList.remove('active');
    navInvestments.classList.remove('active');
    navRecurring.classList.remove('active');
    navDebts.classList.remove('active');
    navBudget.classList.remove('active');

    if (navDashboardMobile) navDashboardMobile.classList.remove('active');
    if (navAnalysisMobile) navAnalysisMobile.classList.remove('active');
    if (navInvestmentsMobile) navInvestmentsMobile.classList.remove('active');
    if (navRecurringMobile) navRecurringMobile.classList.remove('active');
    if (navDebtsMobile) navDebtsMobile.classList.remove('active');
    if (navBudgetMobile) navBudgetMobile.classList.remove('active');
}

// Update existing navigation functions to use hideAllViews
function showDashboard() {
    hideAllViews();
    dashboardView.classList.remove('hidden');
    navDashboard.classList.add('active');
    if (navDashboardMobile) navDashboardMobile.classList.add('active');
    stopPriceUpdates();
}

function showAnalysis() {
    hideAllViews();
    analysisView.classList.remove('hidden');
    navAnalysis.classList.add('active');
    if (navAnalysisMobile) navAnalysisMobile.classList.add('active');
    stopPriceUpdates();
    updateChart();
    updatePieChart();
}

function showInvestments() {
    hideAllViews();
    investmentsView.classList.remove('hidden');
    navInvestments.classList.add('active');
    if (navInvestmentsMobile) navInvestmentsMobile.classList.add('active');
    renderInvestments();
    updateAllocationChart();
    updateProjectionChart(); // Trigger projection
    startPriceUpdates();
}

function showRecurring() {
    hideAllViews();
    recurringView.classList.remove('hidden');
    navRecurring.classList.add('active');
    if (navRecurringMobile) navRecurringMobile.classList.add('active');
}

function showDebts() {
    hideAllViews();
    debtsView.classList.remove('hidden');
    navDebts.classList.add('active');
    if (navDebtsMobile) navDebtsMobile.classList.add('active');
    renderDebts();
}

function showBudget() {
    hideAllViews();
    budgetView.classList.remove('hidden');
    navBudget.classList.add('active');
    if (navBudgetMobile) navBudgetMobile.classList.add('active');
    renderBudgets();
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

// Handle Type Toggle in Revolving Modal
const revolvingTypeSelect = document.getElementById('revolving-type');
const revolvingDetailsContainer = document.getElementById('revolving-details-container');

if (revolvingTypeSelect) {
    revolvingTypeSelect.addEventListener('change', (e) => {
        if (e.target.value === 'saldo') {
            revolvingDetailsContainer.classList.add('hidden');
        } else {
            revolvingDetailsContainer.classList.remove('hidden');
        }
    });
}

// Wallet Modal Listeners (Fix for "Resta bloccato")
btnAddWallet.addEventListener('click', () => {
    walletModal.classList.add('active');
});
closeWalletModalBtn.addEventListener('click', () => {
    walletModal.classList.remove('active');
});
walletForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('wallet-name').value;
    const type = document.getElementById('wallet-type').value;

    try {
        await window.dbOps.addWalletToDb({ name, type });
        walletModal.classList.remove('active');
        walletForm.reset();
        // Assuming database.js triggers a reload or we need to manually refresh wallets
        // But addWalletToDb usually calls renderWallets or we rely on onSnapshot in init.
        // If not using realtime listener for wallets, we might need:
        // loadWallets(); // But let's assume it works like others.
        // Actually, dbOps.addWalletToDb is likely async.
    } catch (error) {
        alert('Errore creazione portafoglio: ' + error.message);
    }
});


btnAddAsset.addEventListener('click', () => {
    // Reset form
    assetForm.reset();
    document.getElementById('asset-date').valueAsDate = new Date();
    assetModal.classList.add('active');
    // Trigger change to update UI (wallet section visibility)
    document.getElementById('asset-select').dispatchEvent(new Event('change'));
});
closeAssetModalBtn.addEventListener('click', () => closeAssetModal());
assetForm.addEventListener('submit', addAsset);

document.getElementById('asset-select').addEventListener('change', (e) => {
    const customInput = document.getElementById('asset-name-custom');
    const walletSection = document.getElementById('wallet-import-section');
    const selectedOption = e.target.options[e.target.selectedIndex];
    const type = selectedOption.dataset.type;

    // Custom Name Input
    if (e.target.value === 'custom') {
        customInput.classList.remove('hidden');
        customInput.required = true;
    } else {
        customInput.classList.add('hidden');
        customInput.required = false;
        triggerAutoPrice();
    }

    // Wallet Import Section (Only for Crypto)
    if (type === 'crypto') {
        walletSection.classList.remove('hidden');

        // Update caption based on coin
        const caption = document.getElementById('btn-scan-caption');
        if (selectedOption.dataset.apiId === 'bitcoin') caption.textContent = '(Bitcoin Legacy/Segwit)';
        else if (selectedOption.dataset.apiId === 'ethereum') caption.textContent = '(Ethereum/ERC20)';
        else caption.textContent = '(Supporto Beta)';
    } else {
        walletSection.classList.add('hidden');
    }
});

// Wallet Scanning Logic
document.getElementById('btn-scan-wallet').addEventListener('click', async () => {
    const address = document.getElementById('asset-wallet-address').value.trim();
    const select = document.getElementById('asset-select');
    const selectedOption = select.options[select.selectedIndex];
    const apiId = selectedOption.dataset.apiId;

    if (!address) {
        alert("Inserisci un indirizzo wallet.");
        return;
    }

    const btn = document.getElementById('btn-scan-wallet');
    const icon = btn.querySelector('i');
    const originalIcon = icon.className;

    // Loading State
    icon.className = 'fas fa-spinner fa-spin';
    btn.disabled = true;

    try {
        let quantity = 0;
        let estimatedInvested = 0;
        let found = false;

        // Bitcoin Strategy
        if (apiId === 'bitcoin') {
            const response = await fetch(`https://blockchain.info/rawaddr/${address}?limit=10&cors=true`);
            if (!response.ok) throw new Error('Bitcoin API Error');
            const data = await response.json();

            quantity = data.final_balance / 100000000; // Satoshis to BTC

            // Try to estimate cost basis from last few INCOMING transactions
            // Note: This is a rough estimation.
            let analyzedTxCount = 0;
            for (const tx of data.txs) {
                const result = tx.result; // Amount change for this address
                if (result > 0) {
                    // Incoming transaction (Buy/Transfer)
                    const date = new Date(tx.time * 1000).toISOString().split('T')[0];
                    const amount = result / 100000000;

                    // Fetch price at that time
                    const priceAtTime = await fetchTransactionPrice('bitcoin', date);
                    if (priceAtTime) {
                        estimatedInvested += (priceAtTime * amount);
                    }
                    analyzedTxCount++;
                }
                if (analyzedTxCount >= 5) break; // Limit to save API calls/time
            }
            found = true;
        }
        // Ethereum Strategy
        else if (apiId === 'ethereum') {
            // Using BlockCypher (Free tier limits apply)
            const response = await fetch(`https://api.blockcypher.com/v1/eth/main/addrs/${address}/balance`);
            if (!response.ok) throw new Error('Ethereum API Error');
            const data = await response.json();

            quantity = data.balance / 1000000000000000000; // Wei to ETH

            // Cost basis hard to fetch on simple balance endpoint
            // We just leave estimatedInvested as 0 or current value approximation
            found = true;
        } else {
            alert("Scansione automatica supportata solo per Bitcoin ed Ethereum al momento.");
        }

        if (found) {
            document.getElementById('asset-quantity').value = quantity;

            if (estimatedInvested > 0) {
                document.getElementById('asset-invested').value = estimatedInvested.toFixed(2);
                alert(`Saldo recuperato: ${quantity} ${apiId.toUpperCase()}\nCosto stimato (parziale): €${estimatedInvested.toFixed(2)}`);
            } else {
                // Fallback: Set Invested to Current Value (0% P/L)
                const currentPrice = await fetchTransactionPrice(apiId, new Date().toISOString().split('T')[0]);
                if (currentPrice) {
                    document.getElementById('asset-invested').value = (quantity * currentPrice).toFixed(2);
                    alert(`Saldo recuperato: ${quantity} ${apiId.toUpperCase()}\nInvestito impostato al valore attuale (modificabile).`);
                } else {
                    alert(`Saldo recuperato: ${quantity} ${apiId.toUpperCase()}`);
                }
            }

            // Trigger auto calculation of current value if needed
            triggerAutoPrice();
        }

    } catch (e) {
        console.error(e);
        alert("Errore scansione wallet: " + e.message);
    } finally {
        icon.className = originalIcon;
        btn.disabled = false;
    }
});

document.getElementById('asset-date').addEventListener('change', triggerAutoPrice);
document.getElementById('asset-quantity').addEventListener('change', triggerAutoPrice);

async function triggerAutoPrice() {
    const select = document.getElementById('asset-select');
    const dateInput = document.getElementById('asset-date');
    const qtyInput = document.getElementById('asset-quantity');
    const investedInput = document.getElementById('asset-invested');

    if (select.selectedIndex === -1) return;
    const option = select.options[select.selectedIndex];
    const apiId = option.dataset.apiId;
    const type = option.dataset.type;
    const date = dateInput.value;
    const qty = parseFloat(qtyInput.value);

    // Only proceed if we have a valid asset (crypto/stock/etf) with API ID, a date, and a quantity
    if ((type === 'crypto' || type === 'stock' || type === 'etf') && apiId && date && qty > 0) {
        // Show loading state
        investedInput.style.opacity = '0.5';

        const price = await fetchTransactionPrice(apiId, date, type);

        investedInput.style.opacity = '1';

        if (price) {
            const total = price * qty;
            investedInput.value = total.toFixed(2);
            // Optional: visual feedback
            console.log(`Historical Price for ${apiId} (${type}) on ${date}: €${price}`);
        }
    }
}



closeAmortizationModalBtn.addEventListener('click', () => amortizationModal.classList.remove('active'));
closeAssetDetailsModalBtn.addEventListener('click', () => assetDetailsModal.classList.remove('active'));

// Asset Details Function
// Asset Details Function
let currentAssetId = null;

window.showAssetDetails = function (id) {
    currentAssetId = id;
    const asset = investments.find(a => a.id === id);
    if (!asset) return;

    // Reset and Hide Form
    const formContainer = document.getElementById('add-asset-history-form-container');
    if (formContainer) formContainer.classList.add('hidden');
    const historyForm = document.getElementById('add-asset-history-form');
    if (historyForm) historyForm.reset();

    // Fill Details
    const elName = document.getElementById('detail-asset-name');
    const elQty = document.getElementById('detail-quantity');
    const elInvested = document.getElementById('detail-invested');
    const elCurrent = document.getElementById('detail-current');
    const elPl = document.getElementById('detail-pl');

    if (elName) elName.textContent = asset.name;
    if (elQty) elQty.textContent = asset.quantity;
    if (elInvested) elInvested.textContent = `€ ${asset.invested.toFixed(2)}`;
    if (elCurrent) elCurrent.textContent = `€ ${asset.current.toFixed(2)}`;

    const pl = asset.current - asset.invested;
    if (elPl) {
        elPl.textContent = `€ ${pl.toFixed(2)}`;
        elPl.className = 'detail-value ' + (pl >= 0 ? 'positive' : 'negative');
        elPl.style.color = pl >= 0 ? 'var(--success-color)' : 'var(--danger-color)';
    }

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
            <td>${entry.date ? new Date(entry.date).toLocaleDateString('it-IT') : '-'}</td>
            <td>${entry.type === 'buy' ? 'Acquisto' : 'Vendita'}</td>
            <td>${entry.quantity}</td>
            <td>€ ${(entry.price || 0).toFixed(2)}</td>
            <td>€ ${entry.invested.toFixed(2)}</td>
        `;
        assetHistoryBody.appendChild(row);
    });

    assetDetailsModal.classList.add('active');
};

// Toggle History Form
const btnShowAddHistory = document.getElementById('btn-show-add-history');
if (btnShowAddHistory) {
    btnShowAddHistory.addEventListener('click', () => {
        const formContainer = document.getElementById('add-asset-history-form-container');
        formContainer.classList.toggle('hidden');
    });
}

// Handle Add History Submit
const formAddHistory = document.getElementById('add-asset-history-form');
if (formAddHistory) {
    formAddHistory.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!currentAssetId) return;

        const asset = investments.find(a => a.id === currentAssetId);
        if (!asset) return;

        const type = document.getElementById('hist-type').value;
        const date = document.getElementById('hist-date').value;
        const qty = parseFloat(document.getElementById('hist-quantity').value);
        const totalAmount = parseFloat(document.getElementById('hist-price').value);

        // Track checks
        if (!qty || !totalAmount) {
            alert("Inserisci quantità e prezzo.");
            return;
        }

        // 1. Add to History
        asset.history.push({
            date: date,
            type: type,
            quantity: qty,
            invested: totalAmount,
            price: totalAmount / qty
        });

        // 2. Update Asset Totals
        // Calculate current price per unit to update 'current' value logically
        const currentPricePerUnit = asset.quantity > 0 ? (asset.current / asset.quantity) : 0;

        if (type === 'buy') {
            asset.quantity += qty;
            asset.invested += totalAmount;
            // For current value, we assume the purchased amount ADDS to the current value worth?
            // Or we assume Market Price rules. 
            // If it's a manual asset, we might want to update current value by adding the PURCHASE value (assuming we bought at market).
            // If it's a live asset, it will update on next fetch.
            // Let's add the purchase value to current, assuming fair value.
            asset.current += totalAmount;
        } else {
            // Sell
            if (qty > asset.quantity) {
                alert("Non puoi vendere più di quanto possiedi!");
                return; // Abort
            }

            // Proportional reduction of Invested (Cost Basis)
            const ratio = qty / asset.quantity;
            const costBasisRemoved = asset.invested * ratio;

            asset.quantity -= qty;
            asset.invested -= costBasisRemoved;

            // Reduce current value proportionally
            asset.current -= (asset.current * ratio);
        }

        // 3. Save
        localStorage.setItem('investments', JSON.stringify(investments));

        // 4. Render
        renderInvestments();
        showAssetDetails(currentAssetId); // Refresh modal
        updateAllocationChart();

        // Hide form
        document.getElementById('add-asset-history-form-container').classList.add('hidden');
        formAddHistory.reset();
    });
}

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
            <div class="empty-state" style="grid-column: 1 / -1;">
                 <i class="fas fa-play-circle"></i>
                <p>Nessun abbonamento attivo</p>
            </div>
        `;
    } else {
        subscriptions.forEach(sub => {
            const item = document.createElement('div');
            item.classList.add('debt-card'); // Use Debt Card Style

            const categoryData = allCategories[sub.category] || allCategories.other;
            const iconClass = categoryData.icon;
            const color = categoryData.color;

            item.innerHTML = `
                <div class="debt-header">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <div class="icon-circle" style="background-color: ${color}20; color: ${color}; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%;">
                            <i class="fas ${iconClass}"></i>
                        </div>
                        <div>
                            <div class="debt-title">${sub.name} <span class="badge-recurring" style="font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; background: var(--bg-secondary); color: var(--text-secondary); margin-left: 5px;">${getUrlFrequency(sub.frequency)}</span></div>
                            <div class="debt-subtitle">Prossimo rinnovo: ${formatDate(sub.nextDueDate)}</div>
                        </div>
                    </div>
                    <div class="debt-amount" style="color: var(--danger-color);">€ ${sub.amount.toFixed(2)}</div>
                </div>
                <div class="debt-actions" style="margin-top: 15px; border-top: 1px solid var(--border-color); padding-top: 10px;">
                    <button class="btn-small delete" onclick="deleteSubscription('${sub.id}')" style="color: var(--danger-color); background: none; border: none;">
                        <i class="fas fa-trash"></i> Disdici
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

// --- Wallet Management Logic ---

// Toggle Dropdown
if (walletSelector) {
    walletSelector.addEventListener('click', (e) => {
        e.stopPropagation();
        walletDropdown.classList.toggle('hidden');
    });
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (walletSelector && walletDropdown && !walletSelector.contains(e.target) && !walletDropdown.contains(e.target)) {
        walletDropdown.classList.add('hidden');
    }
});

function renderWallets() {
    if (!walletListEl) return;
    walletListEl.innerHTML = '';

    // Default Wallet
    const defaultLi = document.createElement('li');
    defaultLi.className = currentWalletId === 'default' ? 'active' : '';
    defaultLi.innerHTML = `<i class="fas fa-wallet"></i> Principale`;
    defaultLi.onclick = () => switchWallet('default', 'Principale');
    walletListEl.appendChild(defaultLi);

    wallets.forEach(wallet => {
        const li = document.createElement('li');
        li.className = currentWalletId === wallet.id ? 'active' : '';
        let icon = 'fa-wallet';
        if (wallet.type === 'bank') icon = 'fa-university';
        if (wallet.type === 'cash') icon = 'fa-money-bill-wave';
        if (wallet.type === 'savings') icon = 'fa-piggy-bank';

        li.innerHTML = `<i class="fas ${icon}"></i> ${wallet.name}`;
        li.onclick = () => switchWallet(wallet.id, wallet.name);
        walletListEl.appendChild(li);
    });

    // Update current name text on load
    const current = wallets.find(w => w.id === currentWalletId);
    if (currentWalletId === 'default') {
        currentWalletNameEl.textContent = 'Principale';
    } else if (current) {
        currentWalletNameEl.textContent = current.name;
    }
}

function switchWallet(id, name) {
    currentWalletId = id;
    localStorage.setItem('currentWalletId', id);
    currentWalletNameEl.textContent = name;

    // Hide dropdown
    walletDropdown.classList.add('hidden');

    // Update UI
    renderTransactions();
    updateValues();
    if (typeof updateChart === 'function') updateChart();
    if (typeof renderInvestments === 'function') renderInvestments();

    // Refresh List Styles
    renderWallets();
}

window.renderWallets = renderWallets; // Expose globally if needed by DB ops

// --- ETF Search & Expansion ---

// Expand ETF List with Popular Options
if (typeof assetList !== 'undefined' && assetList.etf) {
    const newETFs = [
        { name: 'S&P 500 (SPY)', apiId: 'SPY', type: 'etf' },
        { name: 'Nasdaq 100 (QQQ)', apiId: 'QQQ', type: 'etf' },
        { name: 'Gold (GLD)', apiId: 'GLD', type: 'etf' },
        { name: 'MSCI World (SWDA.MI)', apiId: 'SWDA.MI', type: 'etf' },
        { name: 'Vanguard S&P 500 (VOO)', apiId: 'VOO', type: 'etf' },
        { name: 'Vanguard FTSE All-World (VWCE.DE)', apiId: 'VWCE.DE', type: 'etf' }
    ];
    // Add if not exists
    newETFs.forEach(etf => {
        if (!assetList.etf.items.find(i => i.apiId === etf.apiId)) {
            assetList.etf.items.push(etf);
        }
    });
}

// Search Logic
const btnToggleSearch = document.getElementById('btn-toggle-search-asset');
const containerSearch = document.getElementById('asset-search-container');
const inputSearch = document.getElementById('asset-search-input');
const btnSearchApi = document.getElementById('btn-search-asset-api');
const resultsList = document.getElementById('asset-search-results');

if (btnToggleSearch) {
    btnToggleSearch.addEventListener('click', () => {
        containerSearch.classList.toggle('hidden');
        inputSearch.focus();
    });
}

if (btnSearchApi) {
    btnSearchApi.addEventListener('click', async () => {
        const query = inputSearch.value.trim();
        if (!query) return;

        resultsList.innerHTML = '<li style="color:var(--text-secondary); padding:5px;">Ricerca in corso...</li>';

        try {
            // Finnhub Search API
            if (!FINNHUB_API_KEY || FINNHUB_API_KEY.includes('YOUR_API_KEY')) {
                resultsList.innerHTML = '<li style="color:var(--danger-color); padding:5px;">API Key mancante</li>';
                return;
            }

            const url = `https://finnhub.io/api/v1/search?q=${query}&token=${FINNHUB_API_KEY}`;
            const res = await fetch(url);
            const data = await res.json();

            resultsList.innerHTML = '';

            if (data.count === 0) {
                resultsList.innerHTML = '<li style="color:var(--text-secondary); padding:5px;">Nessun risultato</li>';
                return;
            }

            // Filter relevant types (Common Stock, ETF) if possible, but Finnhub returns mixed.
            // We take top 10
            data.result.slice(0, 10).forEach(item => {
                const li = document.createElement('li');
                li.style.cssText = 'padding: 8px; border-bottom: 1px solid var(--border-color); cursor: pointer; display: flex; justify-content: space-between; align-items: center;';
                li.innerHTML = `
                    <div>
                        <span style="font-weight: bold; color: var(--primary-color);">${item.symbol}</span>
                        <span style="font-size: 0.85rem; color: var(--text-secondary); margin-left:10px;">${item.description}</span>
                    </div>
                    <span style="font-size: 0.7rem; background: var(--card-bg); padding: 2px 4px; border-radius: 4px;">${item.type}</span>
                `;

                li.onclick = () => {
                    selectSearchedAsset(item);
                };

                resultsList.appendChild(li);
            });

        } catch (e) {
            console.error(e);
            resultsList.innerHTML = '<li style="color:var(--danger-color); padding:5px;">Errore API</li>';
        }
    });
}

function selectSearchedAsset(item) {
    const select = document.getElementById('asset-select');
    const customInput = document.getElementById('asset-name-custom');

    // Determine type mapping
    let type = 'stock';
    if (item.type && item.type.toUpperCase().includes('ETF')) type = 'etf';

    // Add option to select
    const option = document.createElement('option');
    option.text = `${item.symbol} - ${item.description}`;
    option.dataset.apiId = item.symbol;
    option.dataset.type = type;
    option.value = 'custom_api';

    select.add(option);
    select.value = 'custom_api';

    // Trigger change
    select.dispatchEvent(new Event('change'));

    // Hide search
    containerSearch.classList.add('hidden');
    inputSearch.value = '';
    resultsList.innerHTML = '';

    triggerAutoPrice();
}


const standardAssets = [
    { name: 'Bitcoin (BTC)', apiId: 'bitcoin', type: 'crypto' },
    { name: 'Ethereum (ETH)', apiId: 'ethereum', type: 'crypto' },
    { name: 'Solana (SOL)', apiId: 'solana', type: 'crypto' },
    { name: 'Cardano (ADA)', apiId: 'cardano', type: 'crypto' },
    { name: 'Ripple (XRP)', apiId: 'ripple', type: 'crypto' },
    { name: 'Polkadot (DOT)', apiId: 'polkadot', type: 'crypto' },
    { name: 'Dogecoin (DOGE)', apiId: 'dogecoin', type: 'crypto' },
    { name: 'Avalanche (AVAX)', apiId: 'avalanche-2', type: 'crypto' },
    { name: 'Chainlink (LINK)', apiId: 'chainlink', type: 'crypto' },
    { name: 'Polygon (MATIC)', apiId: 'matic-network', type: 'crypto' }
];

function populateAssetSelect() {
    const select = document.getElementById('asset-select');
    if (!select) return;

    select.innerHTML = '';

    // Standard Options
    standardAssets.forEach(asset => {
        const option = document.createElement('option');
        option.text = asset.name;
        option.value = asset.apiId; // For backward compatibility if used as ID
        option.dataset.apiId = asset.apiId;
        option.dataset.type = asset.type;
        select.add(option);
    });

    // Custom Option
    const customOption = document.createElement('option');
    customOption.text = 'Altro (Inserimento Manuale)';
    customOption.value = 'custom';
    select.add(customOption);
}

// --- Auto-Price Logic for Adding Assets ---

async function triggerAutoPrice() {
    const select = document.getElementById('asset-select');
    const option = select.options[select.selectedIndex];
    const currentInput = document.getElementById('asset-current');
    const quantityInput = document.getElementById('asset-quantity');
    const investedInput = document.getElementById('asset-invested');

    if (!option || !option.dataset.apiId) return;

    const apiId = option.dataset.apiId;
    const type = option.dataset.type || 'crypto';

    // Visual feedback
    const originalPlaceholder = currentInput.placeholder;
    currentInput.placeholder = "Caricamento prezzo...";

    try {
        const price = await fetchAssetPrice(apiId, type);

        if (price) {
            // Store unit price on the quantity input for easy access
            quantityInput.dataset.unitPrice = price;

            // Auto-calculate if quantity exists
            updateAssetTotal();

            // Also suggest invested amount if empty (assuming buy now)
            if (!investedInput.value) {
                // investedInput.value = currentInput.value; // Will be set by updateAssetTotal
            }

            currentInput.placeholder = originalPlaceholder;
        }
    } catch (e) {
        console.error("Auto-price failed:", e);
        currentInput.placeholder = "Inserisci manualmente";
    }
}

async function fetchAssetPrice(apiId, type) {
    // 1. Crypto (CoinGecko)
    if (type === 'crypto' || !type) {
        try {
            const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${apiId.toLowerCase()}&vs_currencies=eur`);
            const data = await response.json();
            if (data[apiId.toLowerCase()] && data[apiId.toLowerCase()].eur) {
                return data[apiId.toLowerCase()].eur;
            }
        } catch (e) {
            console.error("CoinGecko Error:", e);
        }
    }

    // 2. Stocks/ETF (Finnhub)
    if ((type === 'stock' || type === 'etf') && FINNHUB_API_KEY && !FINNHUB_API_KEY.includes('YOUR_API_KEY')) {
        try {
            const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${apiId}&token=${FINNHUB_API_KEY}`);
            const data = await response.json();
            if (data && data.c) {
                return data.c; // Current price
            }
        } catch (e) {
            console.error("Finnhub Error:", e);
        }
    }

    return null;
}

function updateAssetTotal() {
    const quantityInput = document.getElementById('asset-quantity');
    const currentInput = document.getElementById('asset-current');
    const investedInput = document.getElementById('asset-invested');

    const quantity = parseFloat(quantityInput.value);
    const unitPrice = parseFloat(quantityInput.dataset.unitPrice);

    if (!isNaN(quantity) && !isNaN(unitPrice)) {
        const totalValue = (quantity * unitPrice).toFixed(2);
        currentInput.value = totalValue;

        // If invested is empty, assume it's a new purchase at current price
        if (investedInput.value === '') {
            investedInput.value = totalValue;
        }
    }
}

// Event Listeners for Auto-Price
document.addEventListener('DOMContentLoaded', () => {
    const quantityInput = document.getElementById('asset-quantity');
    if (quantityInput) {
        quantityInput.addEventListener('input', updateAssetTotal);
    }

    const assetSelect = document.getElementById('asset-select');
    if (assetSelect) {
        assetSelect.addEventListener('change', triggerAutoPrice);
    }
});

init();

// --- Budget Logic ---

function showBudget() {
    hideAllViews();
    budgetView.classList.remove('hidden');
    navBudget.classList.add('active');

    // Bottom nav active state
    document.querySelectorAll('.bottom-nav .nav-item').forEach(el => el.classList.remove('active'));
    // Searching by text content is fragile, better to rely on index order if needed or add IDs
    // For now assuming it works or we add id to bottom nav items later. 
    // Let's assume the user clicks it works. To highlight:
    const budgetNav = Array.from(document.querySelectorAll('.bottom-nav .nav-item')).find(el => el.innerText.includes('Budget'));
    if (budgetNav) budgetNav.classList.add('active');

    renderBudgets();
}

function renderBudgets() {
    budgetListEl.innerHTML = '';
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let globalLimit = 0;
    let globalSpent = 0;

    // Filter transactions for current month
    const monthTransactions = transactions.filter(t => {
        const d = new Date(t.date);
        return t.type === 'expense' && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    if (budgets.length === 0) {
        budgetListEl.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-wallet"></i>
                <p>Nessun budget impostato</p>
            </div>
        `;
    }

    budgets.forEach(budget => {
        globalLimit += parseFloat(budget.amount);
        const startDay = budget.startDay || 1;

        // Calculate Period Dates
        let periodStart = new Date(currentYear, currentMonth, startDay);
        // If today is before the start day, we are in the previous month's cycle
        if (now.getDate() < startDay) {
            periodStart = new Date(currentYear, currentMonth - 1, startDay);
        }

        let periodEnd = new Date(periodStart);
        periodEnd.setMonth(periodEnd.getMonth() + 1);
        periodEnd.setDate(periodEnd.getDate() - 1); // Day before next start

        // Calculate spent strictly within this period
        let spent = 0;
        const periodTransactions = transactions.filter(t => {
            const d = new Date(t.date);
            return t.type === 'expense' && d >= periodStart && d <= periodEnd;
        });

        if (budget.categories.includes('all')) {
            spent = periodTransactions.reduce((sum, t) => sum + t.amount, 0);
        } else {
            spent = periodTransactions
                .filter(t => budget.categories.includes(t.category))
                .reduce((sum, t) => sum + t.amount, 0);
        }
        globalSpent += spent;

        const percentage = Math.min(100, (spent / budget.amount) * 100);
        let statusColor = 'var(--success-color)';
        if (percentage > 90) statusColor = 'var(--danger-color)';
        else if (percentage > 75) statusColor = 'var(--warning-color)';

        // Calculate Daily Limit
        const remaining = budget.amount - spent;
        const oneDay = 24 * 60 * 60 * 1000;
        // Days remaining until end of period (inclusive of today? usually yes)
        // Let's count days from NOW to periodEnd
        const diffDays = Math.ceil((periodEnd - now) / oneDay);
        const daysLeft = diffDays > 0 ? diffDays : 0; // If exact end date?
        let dailyLimit = 0;
        if (daysLeft > 0 && remaining > 0) {
            dailyLimit = remaining / daysLeft;
        }

        const card = document.createElement('div');
        card.className = 'budget-card';

        let catBadges = '';
        if (budget.categories.includes('all')) {
            catBadges = '<span class="category-tag">Tutte</span>';
        } else {
            catBadges = budget.categories.map(c => {
                const label = allCategories[c] ? allCategories[c].label : c;
                return `<span class="category-tag">${label}</span>`;
            }).join('');
        }

        card.innerHTML = `
            <div class="budget-header">
                <div>
                    <div class="debt-title">${budget.name}</div>
                    <small style="color: var(--text-secondary); font-size: 0.75rem;">
                        Dal ${periodStart.toLocaleDateString()} al ${periodEnd.toLocaleDateString()}
                    </small>
                </div>
                <div class="budget-actions">
                    <button class="btn-small" onclick="editBudget('${budget.id}')" style="color: var(--primary-color); background: none; border: none; margin-right: 5px;">
                        <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button class="btn-small delete" onclick="deleteBudget('${budget.id}')" style="color: var(--text-secondary); background: none; border: none;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            
            <div class="debt-amount">
                € ${spent.toFixed(2)} 
                <span style="font-size: 0.9rem; color: var(--text-secondary);">/ € ${parseFloat(budget.amount).toFixed(2)}</span>
            </div>
            
            <div class="budget-progress-container">
                <div class="budget-progress-bar" style="width: ${percentage}%; background-color: ${statusColor};"></div>
            </div>
            
            <div class="budget-stats" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div style="font-size: 0.85rem; color: var(--text-secondary);">
                    Rimanente: <span style="color: var(--text-primary); font-weight: bold;">€ ${remaining.toFixed(2)}</span>
                </div>
                <div style="font-size: 0.85rem; color: var(--text-secondary); text-align: right;">
                    Giornaliero: <span style="color: var(--primary-color); font-weight: bold;">€ ${dailyLimit.toFixed(2)}</span>
                </div>
            </div>
            
            <div class="category-tags" style="margin-top: 10px;">
                ${catBadges}
            </div>
        `;
        budgetListEl.appendChild(card);
    });

    budgetTotalAmountEl.innerText = `€ ${globalLimit.toFixed(2)}`;
    budgetTotalSpentEl.innerText = `€ ${globalSpent.toFixed(2)}`;
    budgetTotalRemainingEl.innerText = `€ ${(globalLimit - globalSpent).toFixed(2)}`;
}

// Editing State
let currentEditingBudgetId = null;

async function addBudget(e) {
    e.preventDefault();
    const name = document.getElementById('budget-name').value;
    const amount = parseFloat(document.getElementById('budget-amount').value);
    const startDay = parseInt(document.getElementById('budget-start-day').value) || 1;

    // Get selected categories
    const selected = [];
    if (document.getElementById('budget-cat-all').checked) {
        selected.push('all');
    } else {
        document.querySelectorAll('#budget-categories-list input:checked').forEach(cb => {
            selected.push(cb.value);
        });
    }

    if (selected.length === 0) {
        alert("Seleziona almeno una categoria.");
        return;
    }

    const budgetData = {
        name,
        amount,
        categories: selected,
        startDay
    };

    try {
        if (currentEditingBudgetId) {
            // Update
            await window.dbOps.updateBudget(currentEditingBudgetId, budgetData);
        } else {
            // Create
            await window.dbOps.addBudget(budgetData);
        }
        budgetModal.classList.remove('active');
        budgetForm.reset();
        currentEditingBudgetId = null; // Reset
    } catch (err) {
        alert("Errore salvataggio budget: " + err.message);
    }
}

window.editBudget = function (id) {
    const budget = budgets.find(b => b.id === id);
    if (!budget) return;

    currentEditingBudgetId = id;
    document.getElementById('budget-name').value = budget.name;
    document.getElementById('budget-amount').value = budget.amount;
    document.getElementById('budget-start-day').value = budget.startDay || 1;

    populateBudgetCategories();

    // Pre-select categories
    if (budget.categories.includes('all')) {
        document.getElementById('budget-cat-all').checked = true;
        document.querySelectorAll('#budget-categories-list input').forEach(i => i.disabled = true);
    } else {
        budget.categories.forEach(cat => {
            const cb = document.querySelector(`#budget-categories-list input[value="${cat}"]`);
            if (cb) cb.checked = true;
        });
    }

    budgetModal.classList.add('active');
};

async function deleteBudget(id) {
    if (confirm("Eliminare questo budget?")) {
        await window.dbOps.deleteBudget(id);
    }
}

function populateBudgetCategories() {
    const list = document.getElementById('budget-categories-list');
    list.innerHTML = '';
    const allCheckbox = document.getElementById('budget-cat-all');
    allCheckbox.checked = false;
    allCheckbox.addEventListener('change', () => {
        const inputs = list.querySelectorAll('input');
        inputs.forEach(i => i.disabled = allCheckbox.checked);
        if (allCheckbox.checked) {
            inputs.forEach(i => i.checked = false);
        }
    });

    Object.keys(allCategories).forEach(key => {
        const cat = allCategories[key];
        const label = document.createElement('label');
        label.className = 'checkbox-container';
        label.innerHTML = `
            <input type="checkbox" value="${key}">
            <span class="checkmark"></span>
            ${cat.label}
        `;
        list.appendChild(label);
    });
}

// Event Listeners
navBudget.addEventListener('click', showBudget);
btnAddBudget.addEventListener('click', () => {
    currentEditingBudgetId = null; // Ensure new
    document.getElementById('budget-form').reset();
    document.getElementById('budget-start-day').value = 1;
    populateBudgetCategories();
    budgetModal.classList.add('active');
});
closeBudgetModalBtn.addEventListener('click', () => budgetModal.classList.remove('active'));
budgetForm.addEventListener('click', (e) => {
    if (e.target === budgetForm) budgetModal.classList.remove('active'); // Close on backdrop not needed if we have modal-content
});
// Using generic modal close logic or specific:
budgetModal.addEventListener('click', (e) => {
    if (e.target === budgetModal) budgetModal.classList.remove('active');
});

budgetForm.addEventListener('submit', addBudget);

// Add to Init


document.getElementById('btn-export-csv').addEventListener('click', exportCSV);
const csvInput = document.getElementById('csv-file-input');
document.getElementById('btn-import-csv-trigger').addEventListener('click', () => csvInput.click());
csvInput.addEventListener('change', importCSV);

function exportCSV() {
    if (transactions.length === 0) {
        alert("Nessuna transazione da esportare.");
        return;
    }

    const headers = ['Date', 'Type', 'Amount', 'Category', 'Description', 'Wallet'];
    const rows = transactions.map(t => {
        // Escape quotes and wrap in quotes if necessary
        const escape = (text) => {
            if (!text) return '';
            const data = String(text);
            if (data.includes(',') || data.includes('"') || data.includes('\n')) {
                return `"${data.replace(/"/g, '""')}"`;
            }
            return data;
        };

        const categoryLabel = allCategories[t.category] ? allCategories[t.category].label : t.category;

        return [
            t.date,
            t.type,
            t.amount,
            escape(categoryLabel),
            escape(t.description),
            escape(t.walletId)
        ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `portafoglio_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

async function importCSV(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        const text = e.target.result;
        const lines = text.split('\n').map(l => l.trim()).filter(l => l);

        if (lines.length < 2) {
            alert("File CSV non valido o vuoto.");
            return;
        }

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        // Simple validation of headers (check if required columns exist)
        const required = ['date', 'type', 'amount', 'category'];
        const isValid = required.every(r => headers.includes(r));

        if (!isValid) {
            alert(`Formato CSV non valido. Colonne richieste: ${required.join(', ')}`);
            return;
        }

        let addedCount = 0;
        let errorCount = 0;

        // Determine indices
        const idxDate = headers.indexOf('date');
        const idxType = headers.indexOf('type');
        const idxAmount = headers.indexOf('amount');
        const idxCategory = headers.indexOf('category'); // We expect Label or Key
        const idxDesc = headers.indexOf('description');
        const idxWallet = headers.indexOf('wallet');

        // Helper to parse CSV line respecting quotes
        // Simple regex split for CSV: /,(?=(?:(?:[^"]*"){2})*[^"]*$)/

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            // Split by comma, handling quotes
            const row = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(val => {
                return val.replace(/^"|"$/g, '').replace(/""/g, '"').trim();
            });

            if (row.length < required.length) continue;

            const date = row[idxDate];
            const type = row[idxType];
            const amount = parseFloat(row[idxAmount]);
            let categoryLabel = row[idxCategory];
            const description = idxDesc > -1 ? row[idxDesc] : '';
            const walletId = idxWallet > -1 ? row[idxWallet] : currentWalletId;

            // Try to find category key from label, otherwise use 'other'
            let categoryKey = 'other';
            // Reverse lookup for category
            const foundCat = Object.entries(allCategories).find(([key, val]) => val.label === categoryLabel || key === categoryLabel);
            if (foundCat) categoryKey = foundCat[0];

            if (!date || !type || isNaN(amount)) {
                errorCount++;
                continue;
            }

            const newTransaction = {
                walletId: walletId || currentWalletId, // Fallback
                type: type.toLowerCase() === 'entrata' || type.toLowerCase() === 'income' ? 'income' : 'expense',
                amount: Math.abs(amount),
                category: categoryKey,
                date: date,
                description: description || 'Imported via CSV',
                isRecurring: false,
                sourceType: 'wallet' // Default
            };

            try {
                await window.dbOps.addTransactionToDb(newTransaction);
                addedCount++;
            } catch (err) {
                console.error("Import error row " + i, err);
                errorCount++;
            }
        }

        alert(`Importazione completata.\nAggiunti: ${addedCount}\nErrori/Saltati: ${errorCount}`);
        event.target.value = ''; // Reset input
    };
    reader.readAsText(file);
}

// Projection Input Listener
document.addEventListener('DOMContentLoaded', () => {
    // Wait for DOM
    const projectionInput = document.getElementById('monthly-contribution');
    if (projectionInput) {
        projectionInput.addEventListener('input', () => {
            if (typeof updateProjectionChart === 'function') updateProjectionChart();
        });
    }
});

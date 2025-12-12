// Firestore Database Operations

// Collection References
const getUserRef = () => {
    const user = firebase.auth().currentUser;
    if (!user) return null;
    return db.collection('users').doc(user.uid);
};

// --- Wallets ---

// Get all wallets
const getWallets = async () => {
    const userRef = getUserRef();
    if (!userRef) return [];

    try {
        const snapshot = await userRef.collection('wallets').orderBy('createdAt', 'asc').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting wallets:', error);
        return [];
    }
};

// Create new wallet
const createWallet = async (walletData) => {
    const userRef = getUserRef();
    if (!userRef) return null;

    try {
        const docRef = await userRef.collection('wallets').add({
            ...walletData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return { id: docRef.id, ...walletData };
    } catch (error) {
        console.error('Error creating wallet:', error);
        throw error;
    }
};

// --- Transactions ---

// Add transaction
const addTransactionToDb = async (transaction) => {
    const userRef = getUserRef();
    if (!userRef) return null;

    try {
        const docRef = await userRef.collection('transactions').add({
            ...transaction,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return { id: docRef.id, ...transaction };
    } catch (error) {
        console.error('Error adding transaction:', error);
        throw error;
    }
};

// Get transactions (real-time listener)
const subscribeToTransactions = (callback) => {
    const userRef = getUserRef();
    if (!userRef) return () => { };

    return userRef.collection('transactions')
        .orderBy('date', 'desc')
        .onSnapshot((snapshot) => {
            const transactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(transactions);
        }, (error) => {
            console.error('Error subscribing to transactions:', error);
        });
};

// Delete transaction
const deleteTransactionFromDb = async (id) => {
    const userRef = getUserRef();
    if (!userRef) return;

    try {
        await userRef.collection('transactions').doc(id).delete();
    } catch (error) {
        console.error('Error deleting transaction:', error);
        throw error;
    }
};

// --- Investments ---

// Add investment
const addInvestmentToDb = async (investment) => {
    const userRef = getUserRef();
    if (!userRef) return null;

    try {
        const docRef = await userRef.collection('investments').add({
            ...investment,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return { id: docRef.id, ...investment };
    } catch (error) {
        console.error('Error adding investment:', error);
        throw error;
    }
};

// Subscribe to investments
const subscribeToInvestments = (callback) => {
    const userRef = getUserRef();
    if (!userRef) return () => { };

    return userRef.collection('investments')
        .onSnapshot((snapshot) => {
            const investments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(investments);
        });
};

// Delete investment
const deleteInvestmentFromDb = async (id) => {
    const userRef = getUserRef();
    if (!userRef) return;

    try {
        await userRef.collection('investments').doc(id).delete();
    } catch (error) {
        console.error('Error deleting investment:', error);
        throw error;
    }
};

// --- Loans & Revolving ---

// Add loan
const addLoanToDb = async (loan) => {
    const userRef = getUserRef();
    if (!userRef) return null;

    try {
        const docRef = await userRef.collection('loans').add({
            ...loan,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return { id: docRef.id, ...loan };
    } catch (error) {
        console.error('Error adding loan:', error);
        throw error;
    }
};

// Subscribe to loans
const subscribeToLoans = (callback) => {
    const userRef = getUserRef();
    if (!userRef) return () => { };

    return userRef.collection('loans')
        .onSnapshot((snapshot) => {
            const loans = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(loans);
        });
};

// Delete Loan
const deleteLoanFromDb = async (id) => {
    const userRef = getUserRef();
    if (!userRef) return;
    try {
        await userRef.collection('loans').doc(id).delete();
    } catch (error) {
        console.error('Error deleting loan:', error);
        throw error;
    }
};

// Update Loan
const updateLoan = async (id, updates) => {
    const userRef = getUserRef();
    if (!userRef) return;
    try {
        await userRef.collection('loans').doc(id).update(updates);
    } catch (error) {
        console.error('Error updating loan:', error);
        throw error;
    }
};

// Add revolving card
const addRevolvingToDb = async (card) => {
    const userRef = getUserRef();
    if (!userRef) return null;

    try {
        const docRef = await userRef.collection('revolvingCards').add({
            ...card,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return { id: docRef.id, ...card };
    } catch (error) {
        console.error('Error adding revolving card:', error);
        throw error;
    }
};

// Subscribe to revolving cards
const subscribeToRevolving = (callback) => {
    const userRef = getUserRef();
    if (!userRef) return () => { };

    return userRef.collection('revolvingCards')
        .onSnapshot((snapshot) => {
            const cards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(cards);
        });
};

// Update Revolving Card
const updateRevolving = async (id, updates) => {
    const userRef = getUserRef();
    if (!userRef) return;
    try {
        await userRef.collection('revolvingCards').doc(id).update(updates);
    } catch (error) {
        console.error('Error updating revolving card:', error);
        throw error;
    }
};

// Export functions
window.dbOps = {
    getWallets,
    createWallet,
    addTransactionToDb,
    subscribeToTransactions,
    deleteTransactionFromDb,
    addInvestmentToDb,
    subscribeToInvestments,
    deleteInvestmentFromDb,
    addLoanToDb,
    subscribeToLoans,
    deleteLoanFromDb,
    updateLoan,
    addRevolvingToDb,
    subscribeToRevolving,
    updateRevolving,

    // Installments
    addInstallmentPlanToDb: async (plan) => {
        const userRef = getUserRef();
        if (!userRef) return null;
        try {
            const docRef = await userRef.collection('installmentPlans').add({
                ...plan,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { id: docRef.id, ...plan };
        } catch (error) {
            console.error('Error adding installment plan:', error);
            throw error;
        }
    },

    subscribeToInstallmentPlans: (callback) => {
        const userRef = getUserRef();
        if (!userRef) return () => { };
        return userRef.collection('installmentPlans')
            .onSnapshot((snapshot) => {
                const plans = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                callback(plans);
            });
    },

    updateInstallmentPlan: async (id, updates) => {
        const userRef = getUserRef();
        if (!userRef) return;
        try {
            await userRef.collection('installmentPlans').doc(id).update(updates);
        } catch (error) {
            console.error('Error updating installment plan:', error);
            throw error;
        }
    },

    deleteInstallmentPlan: async (id) => {
        const userRef = getUserRef();
        if (!userRef) return;
        try {
            await userRef.collection('installmentPlans').doc(id).delete();
        } catch (error) {
            console.error('Error deleting installment plan:', error);
            throw error;
        }
    },

    // Subscriptions
    addSubscriptionToDb: async (sub) => {
        const userRef = getUserRef();
        if (!userRef) return null;
        try {
            const docRef = await userRef.collection('subscriptions').add({
                ...sub,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { id: docRef.id, ...sub };
        } catch (error) {
            console.error('Error adding subscription:', error);
            throw error;
        }
    },

    subscribeToSubscriptions: (callback) => {
        const userRef = getUserRef();
        if (!userRef) return () => { };
        return userRef.collection('subscriptions')
            .onSnapshot((snapshot) => {
                const subs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                callback(subs);
            });
    },

    deleteSubscriptionFromDb: async (id) => {
        const userRef = getUserRef();
        if (!userRef) return;
        try {
            await userRef.collection('subscriptions').doc(id).delete();
        } catch (error) {
            console.error('Error deleting subscription:', error);
            throw error;
        }
    },

    updateSubscription: async (id, updates) => {
        const userRef = getUserRef();
        if (!userRef) return;
        try {
            await userRef.collection('subscriptions').doc(id).update(updates);
        } catch (error) {
            console.error('Error updating subscription:', error);
            throw error;
        }
    },
    // --- Budgets ---
    addBudget: async (budget) => {
        const userRef = getUserRef();
        if (!userRef) return null;
        try {
            const docRef = await userRef.collection('budgets').add({
                ...budget,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { id: docRef.id, ...budget };
        } catch (error) {
            console.error('Error adding budget:', error);
            throw error;
        }
    },

    deleteBudget: async (id) => {
        const userRef = getUserRef();
        if (!userRef) return;
        try {
            await userRef.collection('budgets').doc(id).delete();
        } catch (error) {
            console.error('Error deleting budget:', error);
            throw error;
        }
    },

    subscribeToBudgets: (callback) => {
        const userRef = getUserRef();
        if (!userRef) return () => { };
        return userRef.collection('budgets')
            .onSnapshot((snapshot) => {
                const budgets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                callback(budgets);
            });
    }
};

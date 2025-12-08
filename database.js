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
    addRevolvingToDb,
    subscribeToRevolving
};

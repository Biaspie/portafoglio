
// Helper Recalculation after Deletion
window.deleteAssetHistoryItem = async function (assetId, index) {
    if (!confirm('Eliminare questa voce dallo storico? Il totale verrà ricalcolato.')) return;

    const asset = investments.find(a => a.id === assetId);
    if (!asset || !asset.history) {
        alert('Asset o storico non trovato.');
        return;
    }

    // Remove item
    const deletedItem = asset.history[index];
    const newHistory = asset.history.filter((_, i) => i !== index);

    // Recalculate Totals
    let newInvested = 0;
    let newQuantity = 0;

    newHistory.forEach(h => {
        const qty = parseFloat(h.quantity) || 0;
        const inv = parseFloat(h.invested) || 0;

        if (h.type === 'buy') {
            newQuantity += qty;
            newInvested += inv;
        } else if (h.type === 'sell') {
            newQuantity -= qty;
            newInvested -= inv; // Usually profit taking
        }
    });

    // Validations (Optional: don't allow neg quantity?)
    if (newQuantity < 0) newQuantity = 0;

    // Recalculate Current Value (Quantity * Current Price)
    let currentPrice = 0;
    if (asset.quantity > 0) {
        currentPrice = asset.current / asset.quantity;
    }
    const newCurrent = newQuantity * currentPrice;

    try {
        await window.dbOps.updateInvestment(assetId, {
            history: newHistory,
            quantity: newQuantity,
            invested: newInvested,
            current: newCurrent
        });

        // Refresh UI
        setTimeout(() => {
            if (document.getElementById('asset-details-modal').classList.contains('active')) {
                showAssetDetails(getAssetGroupId(asset));
            }
        }, 500);

    } catch (e) {
        console.error(e);
        alert('Errore durante la cancellazione: ' + e.message);
    }
};

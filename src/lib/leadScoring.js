export function calculateLeadScore(budget) {
    const amount = Number(budget);

    if (amount > 20000000) return "High";
    if (amount >= 10000000 && amount <= 20000000) return "Medium";
    return "Low";
}
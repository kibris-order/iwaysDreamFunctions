import {Expenses} from "../../shared/models";


export function generateGraphData(expenses: Expenses[]) {
    const totalAmount = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

    // Group expenses by `expenseAccount` and calculate totals
    const groupedData: Record<string, { count: number; totalAmount: number }> = {};
    expenses.forEach((expense) => {
        const account = expense.expenseAccount;
        if (!groupedData[account]) {
            groupedData[account] = {count: 0, totalAmount: 0};
        }
        groupedData[account].count++;
        groupedData[account].totalAmount += Number(expense.amount);
    });

    // Convert grouped data into labels and counts for the graph
    const _totalAllCat = Object.entries(groupedData)
        .reduce((acc, [account, {totalAmount, count}]) => {
            return acc + totalAmount;
        }, 0);
    // Convert grouped data into labels and counts for the graph
    const graphData = Object.entries(groupedData)
        .map(([account, {totalAmount, count}]) => ({
            label: account,
            percentage: ((totalAmount / _totalAllCat) * 100), // Percentage of total amount
            totalAmount,
            count,
        }))
        .sort((a, b) => b.percentage - a.percentage); // Sort by percentage descending

    const labels = graphData.map(
        ({label, percentage}) => `${label} - ${percentage.toFixed(0)}%`
    );
    const expenseCountData = graphData.map(({totalAmount}) => totalAmount.toFixed(2));

    return {labels, expenseCountData, _totalAllCat};
}

/*
export function generateExpenseGraphData() {
    const data = generateGraphData(expensesData);

    console.log(data);

}*/

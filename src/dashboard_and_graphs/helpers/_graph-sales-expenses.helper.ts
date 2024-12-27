import {format, parse} from 'date-fns';


// Function to get totals and labels
export function calculateMonthlyTotals(expenses: any[], invoices: any[], currentMonth: string) {
    console.log('calculate monthly totals started');
    const expenseByMonth = groupByMonth(expenses, 'date');
    const invoiceByMonth = groupByMonth(invoices, 'date');
    console.log('calculate monthly totals expense and invoice groupByMonth completed');
    // Define all months of the year
    const monthOrder = [
        'January', 'February', 'March', 'April', 'May',
        'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Filter months to include only up to the current month
    const filteredMonths = monthOrder.slice(0, monthOrder.indexOf(currentMonth) + 1);
    console.log('calculate monthly totals filtered months completed');
    // Prepare labels and data
    const labels = filteredMonths;
    const expenseData = labels.map(month => expenseByMonth[month] || 0);
    const invoiceData = labels.map(month => invoiceByMonth[month] || 0);

    console.log('label maps completed');

    console.log('calculate monthly totals ended');
    return {labels, invoiceData, expenseData};
}


// Function to group data by month
export function groupByMonth(data: any[], dateField: string): Record<string, number> {
    return data.reduce((acc, item) => {
        console.log(item[dateField]);
        const date = parse(item[dateField], 'dd MMM yyyy', new Date());
        const monthKey = format(date, 'MMMM'); // Get full month name
        acc[monthKey] = (acc[monthKey] || 0) + Number(item.amount);
        return acc;
    }, {} as Record<string, number>);
}


// Sample data

/*
export function generateSalesExpensesGraph() {
    const currentMonth = 'December'; // Change this dynamically based on the current date if required
    const data = calculateMonthlyTotals(expensesData, invoiceData, currentMonth);

    console.log(data);

}*/

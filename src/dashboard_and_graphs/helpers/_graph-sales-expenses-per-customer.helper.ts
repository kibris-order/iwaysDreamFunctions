import {calculateMonthlyTotals} from "./_graph-sales-expenses.helper";
import {getCurrentMonth} from "./_shared";

export function generateSalesExpensesPerCustomerGraph(customerId: string, expenses: any[], invoices: any[]) {
    console.log('aew in where we are supposed to be');
    const currentMonth = getCurrentMonth();// Change this dynamically based on the current date if required
    const customerExpenses = expenses.filter(expense => expense.customer?.id === customerId);
    const customerInvoice = invoices.filter(invoice => invoice.customer?.id === customerId);

    console.log('finished filtering our stuff');
    return calculateMonthlyTotals(customerExpenses, customerInvoice, currentMonth);


}



export type ExpenseData = {
  id: string;
  title: string;
  amount: number;
  category: string;
  notes: string;
  createdAt: number;
};

export type ExpensesDataResponse = {
  data: ExpenseData[];
};

export type ExpenseDataResponse = {
  data: ExpenseData;
};

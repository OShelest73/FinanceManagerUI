import { Category } from "./Category"

export interface FinancialGoal {
    id: number,
    moneyAmount: number,
    startDate: Date,
    dueDate: Date,
    currentTotal: number,
    category: Category,
    isIncome: Boolean
}

export interface FinancialGoalPreview {
    id: number,
    moneyAmount: number,
    currentTotal: number,
    category: Category
}

export interface CreateFinancialGoal {
    moneyAmount: number,
    startDate: string,
    dueDate: string,
    categoryId: number,
    userId: number
}

export interface UpdateFinancialGoal {
    id: string,
    moneyAmount: number,
    startDate: string,
    dueDate: string,
    categoryId: number,
    userId: number
}
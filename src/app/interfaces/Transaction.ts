import { Category } from "./Category";

export interface Transaction {
    id: number,
    amount: number,
    comment: string,
    createdAt: Date,
    category: Category 
}

export interface TransactionPreview {
    id: number,
    amount: number,
    createdAt: string,
    category: Category
}

export interface CreateTransaction {
    amount: number,
    comment: string,
    categoryId: number,
    walletId: Number
}
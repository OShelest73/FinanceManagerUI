import { Category } from "./Category";

export interface Transaction {
    id: number,
    amount: number,
    comment: string,
    createdAt: string,
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
    createdAt: string | null,
    categoryId: number,
    walletId: Number
}

export interface UpdateTransaction {
    id: string,
    amount: number,
    comment: string,
    createdAt: string | null,
    categoryId: number,
    walletId: Number
}
import { ReactNode, useEffect, useState, useCallback } from 'react'
import { createContext } from 'use-context-selector'
import { api } from '../lib/axios'

interface Transaction {
  id: number
  description: string
  type: 'income' | 'outcome'
  price: number
  category: string
  createdAt: string
}

interface CreateTransactionData {
  description: string
  type: 'income' | 'outcome'
  price: number
  category: string
}

interface TransactionsContextType {
  transactions: Transaction[]
  createTransaction: (data: CreateTransactionData) => Promise<void>
  fetchTransactions: (query?: string) => Promise<void>
}

export const TransactionsContext = createContext<TransactionsContextType>(
  {} as TransactionsContextType,
)

interface TransactionsProviderProps {
  children: ReactNode
}

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const fetchTransactions = useCallback(async (query?: string) => {
    const { data } = await api.get('/transactions', {
      params: {
        _sort: 'createdAt',
        _order: 'desc',
        q: query,
      },
    })

    setTransactions(data)
  }, [])

  const createTransaction = useCallback(async (data: CreateTransactionData) => {
    const { description, category, price, type } = data

    const response = await api.post('/transactions', {
      description,
      category,
      price,
      type,
      createdAt: new Date(),
    })

    setTransactions((oldTransactions) => [response.data, ...oldTransactions])
  }, [])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return (
    <TransactionsContext.Provider
      value={{ transactions, createTransaction, fetchTransactions }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}

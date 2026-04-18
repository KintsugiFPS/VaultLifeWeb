"use client";

import { useState } from "react";
import { useTransitionRouter } from "@/components/PageTransition";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/Card";
import { SectionHeader } from "@/components/SectionHeader";
import { Badge } from "@/components/Badge";
import { theme } from "@/theme";
import { useVaultLife } from "@/context/VaultLifeContext";
import type { TransactionCategory } from "@/types";

export default function TransactionsPage() {
  const router = useTransitionRouter();
  const { financial, isLoading } = useVaultLife();
  const [selectedCategory, setSelectedCategory] =
    useState<TransactionCategory | null>(null);

  if (isLoading || !financial) {
    return (
      <>
        <Navbar />
        <div className="p-8">Loading...</div>
      </>
    );
  }

  const categories: TransactionCategory[] = [
    "food",
    "transport",
    "rent",
    "shopping",
    "utilities",
    "subscriptions",
    "education",
    "other",
  ];

  const filteredTransactions = selectedCategory
    ? financial.transactions.filter((t) => t.category === selectedCategory)
    : financial.transactions;

  const totalFiltered = filteredTransactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  return (
    <>
      <Navbar />
      <main className="w-full pb-12">
        <div className="p-8 max-w-7xl mx-auto space-y-8">
          <div>
            <SectionHeader
              title="Transactions"
              subtitle={`${filteredTransactions.length} transactions`}
            />
          </div>

          {/* Category Filter */}
          <Card>
            <p className="text-sm font-medium text-gray-400 mb-3">Filter by category:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === null
                    ? "bg-accent-purple/30 text-accent-light"
                    : "bg-dark-border/30 text-gray-400 hover:text-gray-200"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                    selectedCategory === cat
                      ? "bg-accent-purple/30 text-accent-light"
                      : "bg-dark-border/30 text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {theme.categoryEmoji[cat]} {cat}
                </button>
              ))}
            </div>
          </Card>

          {/* Stats */}
          <Card>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Total Spent</p>
                <p className="text-2xl font-bold text-accent-light">
                  ${totalFiltered.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Count</p>
                <p className="text-2xl font-bold text-blue-400">
                  {filteredTransactions.length}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Average</p>
                <p className="text-2xl font-bold text-green-400">
                  ${
                    filteredTransactions.length > 0
                      ? (totalFiltered / filteredTransactions.length).toFixed(2)
                      : "0.00"
                  }
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Anomalies</p>
                <p className="text-2xl font-bold text-red-400">
                  {
                    filteredTransactions.filter((t) => t.isAnomaly).length
                  }
                </p>
              </div>
            </div>
          </Card>

          {/* Transaction List */}
          <Card>
            <SectionHeader title="Recent Activity" />
            <div className="space-y-2">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-dark-border/20 hover:bg-dark-border/40 transition-smooth border border-dark-border/30"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {theme.categoryEmoji[transaction.category]}
                        </span>
                        <div>
                          <p className="font-semibold">{transaction.merchant}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(transaction.date).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )}{" "}
                            • {transaction.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-accent-light">
                        -${transaction.amount.toFixed(2)}
                      </p>
                      {transaction.isAnomaly && (
                        <Badge variant="warning" size="sm">
                          Unusual
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No transactions found
                </p>
              )}
            </div>
          </Card>

          {/* Add Transaction CTA */}
          <Card className="border-accent-purple/30 bg-accent-purple/5 text-center py-8">
            <p className="text-lg font-semibold mb-2">💳 Add a transaction</p>
            <p className="text-gray-400 mb-4">
              Keep track of your spending by logging transactions
            </p>
            <button
              onClick={() => router.navigate("/transactions/add")}
              className="px-6 py-2 bg-accent-purple hover:bg-accent-light text-white rounded-lg font-medium transition-smooth"
            >
              + Add Transaction
            </button>
          </Card>
        </div>
      </main>
    </>
  );
}

"use client";

import { useState } from "react";
import { useTransitionRouter } from "@/components/PageTransition";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/Card";
import { SectionHeader } from "@/components/SectionHeader";
import { theme } from "@/theme";
import { useVaultLife } from "@/context/VaultLifeContext";
import type { TransactionCategory, Transaction } from "@/types";

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

export default function AddTransactionPage() {
  const router = useTransitionRouter();
  const { addTransaction } = useVaultLife();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    category: "food" as TransactionCategory,
    merchant: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        userId: "user123",
        amount: parseFloat(formData.amount),
        category: formData.category,
        merchant: formData.merchant,
        description: formData.description,
        date: formData.date,
        timestamp: new Date(formData.date).getTime(),
        isAnomaly: false,
      };

      addTransaction(newTransaction);
      router.navigate("/transactions");
    } catch (error) {
      console.error("Error adding transaction:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="w-full pb-12">
        <div className="p-8 max-w-2xl mx-auto">
          <SectionHeader
            title="Add Transaction"
            subtitle="Log a new transaction"
          />

          <Card className="mt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                  className="w-full px-4 py-2 bg-dark-border/30 border border-dark-border/50 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-accent-purple/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-dark-border/30 border border-dark-border/50 rounded-lg text-gray-200 focus:outline-none focus:border-accent-purple/50"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-gray-900">
                      {theme.categoryEmoji[cat]} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Merchant
                </label>
                <input
                  type="text"
                  name="merchant"
                  value={formData.merchant}
                  onChange={handleChange}
                  placeholder="e.g., Starbucks, Uber, etc."
                  required
                  className="w-full px-4 py-2 bg-dark-border/30 border border-dark-border/50 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-accent-purple/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Optional notes about this transaction"
                  className="w-full px-4 py-2 bg-dark-border/30 border border-dark-border/50 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-accent-purple/50 resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-dark-border/30 border border-dark-border/50 rounded-lg text-gray-200 focus:outline-none focus:border-accent-purple/50"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-2 bg-accent-purple hover:bg-accent-light text-white rounded-lg font-medium transition-smooth disabled:opacity-50"
                >
                  {isSubmitting ? "Adding..." : "Add Transaction"}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-6 py-2 bg-dark-border/30 hover:bg-dark-border/50 text-gray-300 rounded-lg font-medium transition-smooth"
                >
                  Cancel
                </button>
              </div>
            </form>
          </Card>
        </div>
      </main>
    </>
  );
}

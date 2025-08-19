"use client";

import { useEffect, useState } from "react";
import EmptyState from "../EmptyState";
import LoadingState from "../LoadingState";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [userID, setUserID] = useState("");
  const [loading, setLoading] = useState(true);
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  );

  useEffect(() => {
    const userID = localStorage.getItem("userID");
    setUserID(Number(userID));
  }, []);

  useEffect(() => {
    if (!userID) return;
    setLoading(true);
    const [year, month] = selectedMonth.split("-").map(Number);
    const base = process.env.NEXT_PUBLIC_API_ENDPOINT;
    const fetchMonth = async () => {
      try {
        const data = await fetch(
          `${base}/expense/all?token=${userID}&month=${month}`
        );
        const expenses = await data.json();
        setExpenses(Array.isArray(expenses) ? expenses : []);
      } catch (e) {
        setExpenses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMonth();
  }, [userID, selectedMonth]);

  const handleDelete = async (id) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/expense/remove`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: Number(id), token: Number(userID) }),
    });

    const result = await res.json();

    if (result.code == 200) {
      setExpenses(expenses.filter((expense) => expense.id !== id));
    }
  };

  const filteredExpenses = expenses.filter((expense) => {
    // API now returns flat date fields: year, month
    const y = expense?.year;
    const m = expense?.month;
    if (!y || !m) return false;
    const key = `${y}-${String(m).padStart(2, "0")}`;
    return key === selectedMonth;
  });

  return (
    <section className="mt-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Expenses by month</h2>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="rounded-md border px-3 py-2 text-sm"
        />
      </div>
      {loading ? (
        <LoadingState />
      ) : filteredExpenses.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="space-y-3">
        {filteredExpenses.map((expense, index) => (
          <li
            className={`flex items-center justify-between p-4 rounded-md border ${
              index % 2 === 0 ? "bg-muted" : ""
            }`}
            key={expense.id}
          >
            <div>
              <p className="text-xl font-extrabold text-red-600">
                LKR {expense.amount}
              </p>
              <p className="capitalize">{expense.name}</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="mt-2">
                  <Trash />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete expense?</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete “{expense.name}”? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button variant="destructive" onClick={() => handleDelete(expense.id)}>
                      Delete
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </li>
        ))}
        </ul>
      )}
    </section>
  );
}

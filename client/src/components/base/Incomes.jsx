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

export default function Incomes() {
  const [incomes, setIncomes] = useState([]);
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
          `${base}/income/all?token=${userID}&month=${month}`
        );
        const incomes = await data.json();
        setIncomes(Array.isArray(incomes) ? incomes : []);
      } catch (e) {
        setIncomes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMonth();
  }, [userID, selectedMonth]);

  const handleDelete = async (id) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/income/remove`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: Number(id), token: Number(userID) }),
    });

    const result = await res.json();

    if (result.code == 200) {
      setIncomes(incomes.filter((income) => income.id !== id));
    }
  };

  const filteredIncomes = incomes.filter((income) => {
    // API now returns flat date fields: year, month
    const y = income?.year;
    const m = income?.month;
    if (!y || !m) return false;
    const key = `${y}-${String(m).padStart(2, "0")}`;
    return key === selectedMonth;
  });

  return (
    <section className="mt-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Incomes by month</h2>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="rounded-md border px-3 py-2 text-sm"
        />
      </div>
      {loading ? (
        <LoadingState />
      ) : filteredIncomes.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="space-y-3">
        {filteredIncomes.map((income, index) => (
          <li
            className={`flex items-center justify-between p-4 rounded-md border ${
              index % 2 === 0 ? "bg-muted" : ""
            }`}
            key={income.id}
          >
            <div>
              <p className="text-xl font-extrabold text-green-600">
                LKR {income.amount}
              </p>
              <p className="capitalize">{income.name}</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="mt-2">
                  <Trash />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete income?</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete “{income.name}”? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button variant="destructive" onClick={() => handleDelete(income.id)}>
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

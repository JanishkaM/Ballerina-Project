"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function DashBoard() {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("userID");
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_ENDPOINT;
        const [incomeRes, expenseRes] = await Promise.all([
          fetch(`${base}/income/all?token=${token}`),
          fetch(`${base}/expense/all?token=${token}`),
        ]);
        const [incomeData, expenseData] = await Promise.all([
          incomeRes.json(),
          expenseRes.json(),
        ]);
        setIncomes(Array.isArray(incomeData) ? incomeData : []);
        setExpenses(Array.isArray(expenseData) ? expenseData : []);
      } catch (e) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12

  const firstDayDow = useMemo(() => new Date(currentYear, currentMonth - 1, 1).getDay(), [currentYear, currentMonth]);
  const daysInMonth = useMemo(() => new Date(currentYear, currentMonth, 0).getDate(), [currentYear, currentMonth]);
  const weeksInMonth = useMemo(() => Math.ceil((daysInMonth + firstDayDow) / 7), [daysInMonth, firstDayDow]);

  function getWeekOfMonth(year, month, day) {
    const firstDow = new Date(year, month - 1, 1).getDay(); // 0=Sun
    return Math.ceil((day + firstDow) / 7);
  }

  const { monthIncomeTotal, monthExpenseTotal, weeklyData } = useMemo(() => {
    const monthIncomes = incomes.filter(
      (i) => i?.date?.year === currentYear && i?.date?.month === currentMonth
    );
    const monthExpenses = expenses.filter(
      (e) => e?.date?.year === currentYear && e?.date?.month === currentMonth
    );

    const monthIncomeTotal = monthIncomes.reduce((sum, x) => sum + Number(x.amount || 0), 0);
    const monthExpenseTotal = monthExpenses.reduce((sum, x) => sum + Number(x.amount || 0), 0);

    const byWeek = Array.from({ length: weeksInMonth }, (_, idx) => ({
      week: `W${idx + 1}`,
      income: 0,
      expense: 0,
    }));

    for (const inc of monthIncomes) {
      const w = getWeekOfMonth(inc.date.year, inc.date.month, inc.date.day);
      if (byWeek[w - 1]) byWeek[w - 1].income += Number(inc.amount || 0);
    }
    for (const exp of monthExpenses) {
      const w = getWeekOfMonth(exp.date.year, exp.date.month, exp.date.day);
      if (byWeek[w - 1]) byWeek[w - 1].expense += Number(exp.amount || 0);
    }

    return { monthIncomeTotal, monthExpenseTotal, weeklyData: byWeek };
  }, [incomes, expenses, currentYear, currentMonth, weeksInMonth]);

  const balance = monthIncomeTotal - monthExpenseTotal;

  const chartConfig = {
    income: {
      label: "Income",
      color: "var(--chart-1)",
    },
    expense: {
      label: "Expense",
      color: "var(--chart-2)",
    },
  };

  if (loading) {
    return (
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">Loading...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-red-600">{error}</p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Current Month Income</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-extrabold text-green-600">LKR {monthIncomeTotal.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Current Month Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-extrabold text-red-600">LKR {monthExpenseTotal.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-extrabold ${balance >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              LKR {balance.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Income vs Expense</CardTitle>
          <p className="text-sm text-muted-foreground">
            {now.toLocaleString("default", { month: "long" })} {currentYear}
          </p>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="w-full">
            <BarChart accessibilityLayer data={weeklyData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="week"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
              <Bar dataKey="income" fill="var(--color-income)" radius={4} />
              <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </section>
  );
}

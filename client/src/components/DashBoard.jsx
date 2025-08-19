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
  // Month selector for stat cards (default: current month)
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12
  const [statsMonthStr, setStatsMonthStr] = useState(
    `${currentYear}-${String(currentMonth).padStart(2, "0")}`
  );

  // For charts, fetch all data once on mount (for multi-month aggregation)
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

  // For stat cards, fetch only selected month data
  const [statsIncomes, setStatsIncomes] = useState([]);
  const [statsExpenses, setStatsExpenses] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("userID");
    if (!token) return;
    const [year, month] = statsMonthStr.split("-").map(Number);
    const base = process.env.NEXT_PUBLIC_API_ENDPOINT;
    const fetchMonth = async () => {
      try {
        const [incomeRes, expenseRes] = await Promise.all([
          fetch(`${base}/income/all?token=${token}&month=${month}`),
          fetch(`${base}/expense/all?token=${token}&month=${month}`),
        ]);
        const [incomeData, expenseData] = await Promise.all([
          incomeRes.json(),
          expenseRes.json(),
        ]);
        setStatsIncomes(Array.isArray(incomeData) ? incomeData : []);
        setStatsExpenses(Array.isArray(expenseData) ? expenseData : []);
      } catch (e) {
        setStatsIncomes([]);
        setStatsExpenses([]);
      }
    };
    fetchMonth();
  }, [statsMonthStr]);

  // Derive selected stats month/year from the month input value
  const [statsYear, statsMonth] = useMemo(() => {
    const [y, m] = (statsMonthStr || "").split("-").map(Number);
    return [y || currentYear, m || currentMonth];
  }, [statsMonthStr, currentYear, currentMonth]);

  const firstDayDow = useMemo(() => new Date(currentYear, currentMonth - 1, 1).getDay(), [currentYear, currentMonth]);
  const daysInMonth = useMemo(() => new Date(currentYear, currentMonth, 0).getDate(), [currentYear, currentMonth]);
  const weeksInMonth = useMemo(() => Math.ceil((daysInMonth + firstDayDow) / 7), [daysInMonth, firstDayDow]);

  function getWeekOfMonth(year, month, day) {
    const firstDow = new Date(year, month - 1, 1).getDay(); // 0=Sun
    return Math.ceil((day + firstDow) / 7);
  }

  const { monthIncomeTotal, monthExpenseTotal, weeklyData } = useMemo(() => {
    // API now returns flat date fields: year, month, day
    const monthIncomes = incomes.filter(
      (i) => i?.year === currentYear && i?.month === currentMonth
    );
    const monthExpenses = expenses.filter(
      (e) => e?.year === currentYear && e?.month === currentMonth
    );

    const monthIncomeTotal = monthIncomes.reduce((sum, x) => sum + Number(x.amount || 0), 0);
    const monthExpenseTotal = monthExpenses.reduce((sum, x) => sum + Number(x.amount || 0), 0);

    const byWeek = Array.from({ length: weeksInMonth }, (_, idx) => ({
      week: `W${idx + 1}`,
      income: 0,
      expense: 0,
    }));

    for (const inc of monthIncomes) {
      const w = getWeekOfMonth(inc.year, inc.month, inc.day);
      if (byWeek[w - 1]) byWeek[w - 1].income += Number(inc.amount || 0);
    }
    for (const exp of monthExpenses) {
      const w = getWeekOfMonth(exp.year, exp.month, exp.day);
      if (byWeek[w - 1]) byWeek[w - 1].expense += Number(exp.amount || 0);
    }

    return { monthIncomeTotal, monthExpenseTotal, weeklyData: byWeek };
  }, [incomes, expenses, currentYear, currentMonth, weeksInMonth]);

  // Totals for stat cards based on the selected month
  // Stat cards use only the month data from the new API
  const statsIncomeTotal = statsIncomes.reduce((sum, x) => sum + Number(x.amount || 0), 0);
  const statsExpenseTotal = statsExpenses.reduce((sum, x) => sum + Number(x.amount || 0), 0);
  // ...existing code...
  const statsBalance = statsIncomeTotal - statsExpenseTotal;

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

  // Compute monthly balances for the last 6 months (including current)
  const monthlyBalancesData = useMemo(() => {
    const count = 6; // show last 6 months
    const out = [];
    for (let i = count - 1; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - 1 - i, 1);
      const y = d.getFullYear();
      const m = d.getMonth() + 1; // 1-12
  // Label as short month only (e.g., "May")
  const label = d.toLocaleString("default", { month: "short" });

      const incTotal = incomes
        .filter((it) => it?.year === y && it?.month === m)
        .reduce((sum, it) => sum + Number(it.amount || 0), 0);
      const expTotal = expenses
        .filter((it) => it?.year === y && it?.month === m)
        .reduce((sum, it) => sum + Number(it.amount || 0), 0);
      out.push({ month: label, balance: incTotal - expTotal });
    }
    return out;
  }, [incomes, expenses, currentYear, currentMonth]);

  const balanceChartConfig = {
    balance: {
      label: "Balance",
      color: "var(--chart-3)",
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <div className="flex items-center gap-2">
          <label htmlFor="stats-month" className="text-sm text-muted-foreground">Stats month</label>
          <input
            id="stats-month"
            type="month"
            value={statsMonthStr}
            onChange={(e) => setStatsMonthStr(e.target.value)}
            className="rounded-md border px-3 py-1.5 text-sm"
          />
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Current Month Income</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-extrabold text-green-600">LKR {statsIncomeTotal.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Current Month Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-extrabold text-red-600">LKR {statsExpenseTotal.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-extrabold ${statsBalance >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              LKR {statsBalance.toLocaleString()}
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
              <Bar dataKey="income" fill="#16a34a" radius={4} />
              <Bar dataKey="expense" fill="#dc2626" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Monthly balance chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Balance (last 6 months)</CardTitle>
          <p className="text-sm text-muted-foreground">Single bar shows income - expense per month</p>
        </CardHeader>
        <CardContent>
          <ChartContainer config={balanceChartConfig} className="w-full">
            <BarChart accessibilityLayer data={monthlyBalancesData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
              <Bar dataKey="balance" fill="var(--color-balance)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </section>
  );
}

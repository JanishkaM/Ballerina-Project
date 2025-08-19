"use client";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import ErrorState from "./ErrorState";
import SuccessState from "./SuccessState";

export default function Form({ apiEndpoint }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userID = localStorage.getItem("userID");
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const currentDate = new Date().getDate();

    const date = {
      year: currentYear,
      month: currentMonth,
      day: currentDate,
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}${apiEndpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, amount, date, token: Number(userID) }),
    });

    const result = await res.json();
    console.log(result);

    if (result.code == 200) {
      setSuccess("Data saved successfully");
      setName("");
      setAmount("");
    } else {
      setError("Sorry, Data not saved successfully. Try again");
    }
  };

  return (
    <form
      method="post"
      className="mt-4 space-y-3 rounded-lg border bg-card p-4 shadow-sm"
      onSubmit={handleSubmit}
    >
      <Input
        type="text"
        name="name"
        placeholder="Name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        type="number"
        name="amount"
        placeholder="Amount"
        required
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <div className="pt-2">
        <Button type="submit" className="w-full">Add</Button>
      </div>
      {error && <ErrorState message={error} />}
      {success && <SuccessState message={success} />}
    </form>
  );
}

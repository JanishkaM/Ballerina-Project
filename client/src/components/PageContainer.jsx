import React from "react";
import Header from "./Header";

export default function PageContainer({ children }) {
  return (
    <>
      <Header />
  <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">{children}</main>
    </>
  );
}

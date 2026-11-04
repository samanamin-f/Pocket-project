import { useState, useEffect } from "react";
import "./App.css";

const initialBudgets = [
  { id: "snapp", name: "اسنپ", budget: 4000000, icon: "🚕" },
  { id: "installment", name: "قسط", budget: 2000000, icon: "💳" },
  { id: "coffee", name: "قهوه", budget: 1200000, icon: "☕" },
  { id: "cigarette", name: "سیگار", budget: 1800000, icon: "🚬" },
  { id: "misc", name: "متفرقه", budget: 500000, icon: "🛍️" },
  { id: "saving", name: "ذخیره", budget: 500000, icon: "🐷" },
];

const formatMoney = (value) =>
  new Intl.NumberFormat("fa-IR").format(value);

function App() {
  const [transactions, setTransactions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("pocket-transactions")) || [];
    } catch {
      return [];
    }
  });

  const [category, setCategory] = useState("snapp");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    localStorage.setItem(
      "pocket-transactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  const totalBudget = 10000000;

  const totalSpent = transactions.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const remaining = totalBudget - totalSpent;

  const addTransaction = (e) => {
    e.preventDefault();

    const value = Number(amount);

    if (!Number.isSafeInteger(value) || value <= 0) return;

    const selectedBudget = initialBudgets.find(
      (item) => item.id === category
    );

    const categorySpent = transactions
      .filter((item) => item.category === category)
      .reduce((sum, item) => sum + item.amount, 0);

    if (value > selectedBudget.budget - categorySpent) {
      alert("بودجه این دسته کافی نیست!");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      category,
      amount: value,
      description: description.trim() || selectedBudget.name,
      date: new Date().toLocaleDateString("fa-IR"),
    };

    setTransactions((prev) => [newTransaction, ...prev]);

    setAmount("");
    setDescription("");
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">POCKET<span>.</span></div>
        <div className="period">۱۳ آبان — ۱۰ آذر</div>
      </header>

      <main>
        <section className="hero">
          <p>بودجه کل شما</p>
          <h1>{formatMoney(totalBudget)} <small>تومان</small></h1>

          <div className="progress-info">
            <span>هزینه شده</span>
            <span>{formatMoney(totalSpent)} تومان</span>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${Math.min(
                  (totalSpent / totalBudget) * 100,
                  100
                )}%`,
              }}
            />
          </div>

          <div className="remaining">
            <span>موجودی باقی‌مانده</span>
            <strong>{formatMoney(remaining)} تومان</strong>
          </div>
        </section>

        <section className="section">
          <h2>بودجه‌بندی</h2>

          <div className="budget-grid">
            {initialBudgets.map((item) => {
              const spent = transactions
                .filter((t) => t.category === item.id)
                .reduce((sum, t) => sum + t.amount, 0);

              const left = item.budget - spent;

              return (
                <div className="budget-card" key={item.id}>
                  <div className="card-top">
                    <span className="icon">{item.icon}</span>
                    <span>{item.name}</span>
                  </div>

                  <h3>{formatMoney(left)}</h3>
                  <small>از {formatMoney(item.budget)} تومان</small>

                  <div className="small-progress">
                    <div
                      style={{
                        width: `${Math.min(
                          (spent / item.budget) *100, 100)}%` , }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section> 
        <section className="section">
          <h2>ثبت هزینه جدید</h2>
          <form className="expense-form" onSubmit={addTransaction}>
            <label>دسته بندی</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {initialBudgets.map((item) => (
                <option value={item.id} key={item.id}>{item.icon} {item.name}</option>
              ))}
            </select>
            <label>مبلغ به تومان</label>
            <input type="number"
            placeholder="???"
            onChange={(e) =>setAmount(e.target.value)}
            min="1"
            step="1"
            required
             />
             <label>توضیحات اختیاری</label>
             <input type="text"
             placeholder="???"
             value={description}
             onChange={(e) => setDescription(e.target.value)} />
             <button type="submit">ثبت هزینه</button>
          </form>
        </section>
        </main>
        <footer>POCKET. -- MANAGE YOUR MONEY.</footer>
        </div>
  );
}
export default App;












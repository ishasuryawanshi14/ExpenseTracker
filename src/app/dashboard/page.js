"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
        fetchExpenses(user.id);
      }

      setLoading(false);
    };

    checkUser();
  }, []);

  const fetchExpenses = async (userId) => {
    const { data } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    setExpenses(data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (editId) {
      await supabase
        .from("expenses")
        .update({
          title,
          amount: Number(amount),
          category,
        })
        .eq("id", editId);

      setEditId(null);
    } else {
      await supabase.from("expenses").insert([
        {
          title,
          amount: Number(amount),
          category,
          user_id: user.id,
        },
      ]);
    }

    setTitle("");
    setAmount("");
    setCategory("");

    fetchExpenses(user.id);
  };

  const handleEdit = (expense) => {
    setTitle(expense.title);
    setAmount(expense.amount);
    setCategory(expense.category);
    setEditId(expense.id);
  };

  const handleDelete = async (id) => {
    await supabase.from("expenses").delete().eq("id", id);
    fetchExpenses(user.id);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) return <div className="p-6">Loading...</div>;

  const totalAmount = expenses.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50 px-6">
      <div className="w-full max-w-5xl bg-white p-10 rounded-2xl shadow-lg border border-sky-100">

        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">
            Expense Manager
          </h1>

          <button
            onClick={handleLogout}
            className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>

       
        <div className="bg-sky-50 rounded-xl p-6 mb-8 flex justify-between items-center border border-sky-100">
          <div>
            <p className="text-gray-500 text-sm">Total Expenses</p>
            <h2 className="text-3xl font-bold text-gray-800">
              ₹ {totalAmount.toLocaleString()}
            </h2>
          </div>

          <div className="text-sm text-gray-400">
            {expenses.length} records
          </div>
        </div>

      
        <div className="grid md:grid-cols-2 gap-8">

        
          <div className="bg-white p-6 rounded-xl border border-sky-100 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              {editId ? "Edit Expense" : "Add New Expense"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">

             
              <input
                type="text"
                placeholder="Title"
                className="w-full bg-sky-50 border border-sky-200 p-3 rounded-lg
                           text-gray-900 placeholder-gray-500
                           dark:text-gray-900 dark:placeholder-gray-500
                           focus:ring-2 focus:ring-sky-300 outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

             
              <input
                type="number"
                placeholder="Amount"
                className="w-full bg-sky-50 border border-sky-200 p-3 rounded-lg
                           text-gray-900 placeholder-gray-500
                           dark:text-gray-900 dark:placeholder-gray-500
                           focus:ring-2 focus:ring-sky-300 outline-none appearance-none"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Category"
                className="w-full bg-sky-50 border border-sky-200 p-3 rounded-lg
                           text-gray-900 placeholder-gray-500
                           dark:text-gray-900 dark:placeholder-gray-500
                           focus:ring-2 focus:ring-sky-300 outline-none"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />

              <button
                type="submit"
                className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-lg transition"
              >
                {editId ? "Update Expense" : "Add Expense"}
              </button>

              {editId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditId(null);
                    setTitle("");
                    setAmount("");
                    setCategory("");
                  }}
                  className="w-full bg-gray-100 hover:bg-gray-200 py-3 rounded-lg transition  text-black"
                >
                  Cancel
                </button>
              )}
            </form>
          </div>

          
          <div className="bg-white p-6 rounded-xl border border-sky-100 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Expense History
            </h3>

            {expenses.length === 0 ? (
              <p className="text-gray-400">No expenses yet.</p>
            ) : (
              expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex justify-between items-center border-b border-sky-100 py-3"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {expense.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      ₹{expense.amount} • {expense.category}
                    </p>
                  </div>

                  <div className="space-x-3">
                    <button
                      onClick={() => handleEdit(expense)}
                      className="text-sky-500 hover:underline text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="text-red-400 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
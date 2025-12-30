import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { PageWrapper } from "../components/page-wrapper.jsx";
import { API_BASE } from "../config.js";

export function AdminDashboardPage() {
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [chores, setChores] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const authHeaders = token
    ? { Authorization: `Bearer ${token}` }
    : undefined;

  const loadAll = async () => {
    if (!token) {
      toast.error("You must be logged in as admin.");
      setLoading(false);
      return;
    }

    try {
      const [ov, us, ch] = await Promise.all([
        axios.get(`${API_BASE}/api/admin/overview`, { headers: authHeaders }),
        axios.get(`${API_BASE}/api/admin/users`, { headers: authHeaders }),
        axios.get(`${API_BASE}/api/admin/chores`, { headers: authHeaders }),
      ]);

      setOverview(ov.data);
      setUsers(us.data);
      setChores(ch.data);
    } catch (err) {
      console.error("Admin dashboard error:", err);
      toast.error(
        err.response?.data?.message || "Failed to load admin dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const updateChoreStatus = async (id, status) => {
    try {
      await axios.patch(
        `${API_BASE}/api/admin/chores/${id}/status`,
        { status },
        { headers: authHeaders }
      );
      toast.success("Chore updated.");
      loadAll();
    } catch (err) {
      console.error("Update chore status error:", err);
      toast.error("Failed to update chore status.");
    }
  };

  return (
    <PageWrapper>
      <section className="section">
        <h1 className="page-title">Admin Dashboard</h1>

        {loading || !overview ? (
          <p className="muted">Loading...</p>
        ) : (
          <>
            <div className="dash-stat-grid">
              <StatCard label="Users" value={overview.users} />
              <StatCard label="Bookings" value={overview.bookings} />
              <StatCard label="Orders" value={overview.orders} />
              <StatCard label="Quotes" value={overview.quotes} />
              <StatCard label="Chores" value={overview.chores} />
            </div>

            <h2 className="mt-lg">Chores</h2>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Posted By</th>
                    <th>Budget</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Update</th>
                  </tr>
                </thead>
                <tbody>
                  {chores.map((c) => (
                    <tr key={c.id}>
                      <td>{c.title}</td>
                      <td>{c.category}</td>
                      <td>
                        {c.user
                          ? `${c.user.name || ""} (${c.user.email})`
                          : "—"}
                      </td>
                      <td>{c.budget != null ? `$${c.budget}` : "-"}</td>
                      <td>{c.status}</td>
                      <td>{new Date(c.createdAt).toLocaleString()}</td>
                      <td>
                        <select
                          className="form-input"
                          value={c.status}
                          onChange={(e) =>
                            updateChoreStatus(c.id, e.target.value)
                          }
                        >
                          <option value="OPEN">OPEN</option>
                          <option value="IN_PROGRESS">IN_PROGRESS</option>
                          <option value="DONE">DONE</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className="mt-lg">Users</h2>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>City</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.phone || "-"}</td>
                      <td>{u.city || "-"}</td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </PageWrapper>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="dash-stat-card">
      <p className="stat-val">{value ?? 0}</p>
      <p className="stat-label">{label}</p>
    </div>
  );
}

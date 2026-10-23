import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/contacts";

const emptyForm = { name: "", email: "", phone: "" };

function App() {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  async function fetchContacts() {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load contacts.");
      setContacts(data);
    } catch {
      setMessage("Could not load contacts. Is the backend server running?");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setMessage("Please enter a valid email address.");
      return;
    }

    try {
      const res = await fetch(editingId ? `${API_URL}/${editingId}` : API_URL, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong.");

      if (editingId) {
        setContacts(contacts.map((contact) => (contact._id === editingId ? data : contact)));
      } else {
        setContacts([data, ...contacts]);
      }

      setForm(emptyForm);
      setEditingId(null);
    } catch (err) {
      setMessage(err.message);
    }
  }

  function handleEdit(contact) {
    setForm({ name: contact.name, email: contact.email, phone: contact.phone });
    setEditingId(contact._id);
    setMessage("");
  }

  function handleCancel() {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this contact?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong.");

      setContacts(contacts.filter((contact) => contact._id !== id));
      if (editingId === id) handleCancel();
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <div className="app">
      <header>
        <h1>Contact Manager</h1>
        <p>Add, update and delete your contacts in one place.</p>
      </header>

      <main>
        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <h2>{editingId ? "Edit Contact" : "Add Contact"}</h2>

          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
          />

          <div className="form-actions">
            <button type="submit">
              {editingId ? "Update Contact" : "Add Contact"}
            </button>
            {editingId && (
              <button type="button" className="secondary" onClick={handleCancel}>
                Cancel
              </button>
            )}
          </div>

          {message && <p className="message">{message}</p>}
        </form>

        <section className="contacts">
          <h2>Contacts ({contacts.length})</h2>

          {loading ? (
            <p className="loading">Loading contacts...</p>
          ) : contacts.length === 0 ? (
            <p className="empty">No contacts yet. Add your first contact.</p>
          ) : (
            <ul>
              {contacts.map((contact) => (
                <li key={contact._id}>
                  <div>
                    <strong>{contact.name}</strong>
                    <span>{contact.email}</span>
                    <span>{contact.phone}</span>
                  </div>
                  <div className="actions">
                    <button type="button" onClick={() => handleEdit(contact)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => handleDelete(contact._id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;

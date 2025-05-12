"use client"

import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"
import { useState, useEffect } from "react"
import axios from "axios"
import { Trash2, Pencil, Plus } from "lucide-react"

const baseURL = "http://localhost:3001"

interface Admin {
  admin_id: number
  email: string
  password: string
}

export default function AccountsPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [form, setForm] = useState({ email: "", password: "" })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const fetchAdmins = async () => {
    const res = await axios.get(`${baseURL}/api/admins`)
    setAdmins(res.data)
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      if (editingId) {
        await axios.put(`${baseURL}/api/admins/${editingId}`, form)
      } else {
        await axios.post(`${baseURL}/api/admins`, form)
      }
      setForm({ email: "", password: "" })
      setEditingId(null)
      setShowModal(false)
      fetchAdmins()
    } catch (err) {
      console.error(err)
    }
  }

  const handleEdit = (admin: Admin) => {
    setForm({ email: admin.email, password: admin.password })
    setEditingId(admin.admin_id)
    setShowModal(true)
  }

  const confirmDelete = (id: number) => {
    setDeleteId(id)
  }

  const handleDeleteConfirmed = async () => {
    try {
      await axios.delete(`${baseURL}/api/admins/${deleteId}`)
      setDeleteId(null)
      fetchAdmins()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <Navbar title="Accounts" />
        <main className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Admin Management</h2>
            <button
              onClick={() => {
                setForm({ email: "", password: "" })
                setEditingId(null)
                setShowModal(true)
              }}
              className="flex items-center gap-2 bg-[#a4d273] hover:bg-[#8abb5e] text-white font-medium py-2 px-4 rounded"
            >
              <Plus size={18} /> Add Admin
            </button>
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
              <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">{editingId ? "Edit Admin" : "Add Admin"}</h3>
                <div className="grid grid-cols-1 gap-4">
                  <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    className="border p-2 rounded w-full"
                  />
                  <div className="flex justify-end gap-2 mt-4">
                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800">Cancel</button>
                    <button type="submit" className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white">{editingId ? "Update" : "Add"}</button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {deleteId !== null && (
            <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded shadow w-full max-w-sm">
                <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
                <p className="mb-4">Are you sure you want to delete this admin?</p>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800">Cancel</button>
                  <button onClick={handleDeleteConfirmed} className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white">Delete</button>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3">Email</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.admin_id} className="border-t">
                    <td className="p-3">{admin.email}</td>
                    <td className="p-3 flex gap-2">
                      <button onClick={() => handleEdit(admin)} className="text-blue-500 hover:text-blue-700">
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => confirmDelete(admin.admin_id)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  )
}
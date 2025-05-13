"use client"

import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"
import { useEffect, useState } from "react"
import axios from "axios"
import { Trash2, Plus, Pencil } from "lucide-react"

const baseURL = "https://ii-3240-kel9-bounty-hunter.vercel.app"

interface Reward {
  reward_id: number
  name: string
  description: string
  point_cost: number
  stock: number
}

export default function RewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [form, setForm] = useState<{ name: string, description: string, point_cost: string, stock: string }>({
    name: "",
    description: "",
    point_cost: "",
    stock: "",
  })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const fetchRewards = async () => {
    const res = await axios.get(`${baseURL}/api/rewards`)
    setRewards(res.data)
  }

  useEffect(() => {
    fetchRewards()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const payload = {
        ...form,
        point_cost: parseInt(form.point_cost),
        stock: parseInt(form.stock),
      }

      if (editingId) {
        await axios.put(`${baseURL}/api/rewards/${editingId}`, payload)
      } else {
        await axios.post(`${baseURL}/api/rewards`, payload)
      }

      setForm({ name: "", description: "", point_cost: "", stock: "" })
      setEditingId(null)
      setShowModal(false)
      fetchRewards()
    } catch (err) {
      console.error(err)
    }
  }

  const handleEdit = (reward: Reward) => {
    setForm({
      name: reward.name,
      description: reward.description,
      point_cost: reward.point_cost.toString(),
      stock: reward.stock.toString()
    })
    setEditingId(reward.reward_id)
    setShowModal(true)
  }

  const confirmDelete = (id: number) => {
    setDeleteId(id)
  }

  const handleDeleteConfirmed = async () => {
    try {
      await axios.delete(`${baseURL}/api/rewards/${deleteId}`)
      setDeleteId(null)
      fetchRewards()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <Navbar title="Rewards" />

        <main className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Rewards Management</h2>
            <button
              onClick={() => {
                setEditingId(null)
                setForm({ name: "", description: "", point_cost: "", stock: "" })
                setShowModal(true)
              }}
              className="flex items-center gap-2 bg-[#a4d273] hover:bg-[#8abb5e] text-white font-medium py-2 px-4 rounded"
            >
              <Plus size={18} /> Add Reward
            </button>
          </div>

          {/* Modal Form */}
          {showModal && (
            <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
              <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">{editingId ? "Edit Reward" : "Add Reward"}</h3>
                <div className="grid grid-cols-1 gap-4">
                  <input type="text" placeholder="Reward Name" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required className="border p-2 rounded w-full" />
                  <input type="text" placeholder="Description" value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="border p-2 rounded w-full" />
                  <input type="number" placeholder="Point Cost" value={form.point_cost}
                    onChange={(e) => setForm({ ...form, point_cost: e.target.value })}
                    required className="border p-2 rounded w-full" />
                  <input type="number" placeholder="Stock" value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    required className="border p-2 rounded w-full" />
                  <div className="flex justify-end gap-2 mt-4">
                    <button type="button" onClick={() => setShowModal(false)}
                      className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800">Cancel</button>
                    <button type="submit"
                      className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white">{editingId ? "Update" : "Add"}</button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {deleteId !== null && (
            <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded shadow w-full max-w-sm">
                <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
                <p className="mb-4">Are you sure you want to delete this reward?</p>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setDeleteId(null)}
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800">Cancel</button>
                  <button onClick={handleDeleteConfirmed}
                    className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white">Delete</button>
                </div>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3">Name</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Point</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rewards.map((reward) => (
                  <tr key={reward.reward_id} className="border-t">
                    <td className="p-3">{reward.name}</td>
                    <td className="p-3">{reward.description}</td>
                    <td className="p-3">{reward.point_cost}</td>
                    <td className="p-3">{reward.stock}</td>
                    <td className="p-3 flex gap-2">
                      <button onClick={() => handleEdit(reward)}
                        className="text-blue-500 hover:text-blue-700">
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => confirmDelete(reward.reward_id)}
                        className="text-red-500 hover:text-red-700">
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
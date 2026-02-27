// src/pages/CategoriesPage.tsx
import { useState } from 'react'
import BottomNav from '../components/BottomNav'
import { useCategories } from '../hooks/useCategories'
import { useCategoryMutations } from '../hooks/useCategoryMutations'
import type { CategoryWithActivities, Activity } from '../types/database'

export default function CategoriesPage() {
  const { categories, isLoading } = useCategories()
  const { createCategory, deleteCategory, createActivity, deleteActivity } = useCategoryMutations()

  const [newCategoryName, setNewCategoryName] = useState('')
  const [newActivityNames, setNewActivityNames] = useState<Record<string, string>>({})

  function handleActivityInputChange(categoryId: string, value: string) {
    setNewActivityNames(prev => ({ ...prev, [categoryId]: value }))
  }

  async function handleCreateCategory() {
    if (!newCategoryName.trim()) return
    await createCategory.mutateAsync(newCategoryName.trim())
    setNewCategoryName('')
  }

  async function handleCreateActivity(categoryId: string) {
    const name = newActivityNames[categoryId]?.trim()
    if (!name) return
    await createActivity.mutateAsync({ name, categoryId })
    setNewActivityNames(prev => ({ ...prev, [categoryId]: '' }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f172a] pb-24">

      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-md mx-auto px-4 pt-8">

        {/* Header */}
        <h1 className="text-2xl font-black text-white tracking-tight mb-8">
          My <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">Categories</span>
        </h1>

        {/* Categories List */}
        <div className="flex flex-col gap-6">
          {!categories || categories.length === 0 ? (
            <div className="bg-slate-800/40 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 text-center">
              <p className="text-slate-400">No categories yet. Add one below!</p>
            </div>
          ) : (
            categories.map((category: CategoryWithActivities) => (
              <div key={category.id} className="bg-slate-800/40 backdrop-blur-2xl rounded-3xl p-6 border border-white/10">

                {/* Category Header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white font-bold text-lg">{category.name}</h2>
                  <button
                    onClick={() => deleteCategory.mutate(category.id)}
                    className="text-slate-500 hover:text-red-400 transition-all text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>

                {/* Activities */}
                <div className="flex flex-col gap-2 mb-4">
                  {category.activities?.length === 0 ? (
                    <p className="text-slate-500 text-sm">No activities yet.</p>
                  ) : (
                    category.activities?.map((activity: Activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between bg-slate-900/50 rounded-xl px-4 py-3"
                      >
                        <span className="text-slate-300 text-sm font-medium">{activity.name}</span>
                        <button
                          onClick={() => deleteActivity.mutate(activity.id)}
                          className="text-slate-600 hover:text-red-400 transition-all text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Activity Input */}
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={newActivityNames[category.id] ?? ''}
                    onChange={e => handleActivityInputChange(category.id, e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleCreateActivity(category.id)}
                    placeholder="New activity..."
                    className="flex-1 p-3 rounded-xl bg-slate-900/50 text-white border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all placeholder:text-slate-600 text-sm"
                  />
                  <button
                    onClick={() => handleCreateActivity(category.id)}
                    disabled={createActivity.isPending}
                    className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-4 rounded-xl transition-all disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

        {/* Add Category */}
        <div className="mt-6 bg-slate-800/40 backdrop-blur-2xl rounded-3xl p-6 border border-white/10">
          <h2 className="text-slate-300 text-xs font-bold uppercase tracking-widest mb-4">New Category</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={e => setNewCategoryName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreateCategory()}
              placeholder="e.g. Language Learning"
              className="flex-1 p-3 rounded-xl bg-slate-900/50 text-white border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all placeholder:text-slate-600 text-sm"
            />
            <button
              onClick={handleCreateCategory}
              disabled={createCategory.isPending}
              className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-4 rounded-xl transition-all disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>

      </div>

      <BottomNav />
    </div>
  )
}
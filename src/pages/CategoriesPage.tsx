// src/pages/CategoriesPage.tsx
import { useState } from 'react'
import BottomNav from '../components/BottomNav'
import { useCategories } from '../hooks/useCategories'
import { useCategoryMutations } from '../hooks/useCategoryMutations'
import type { CategoryWithActivities, ActivityWithSessions } from '../types/database'

// --- Icons ---
const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
)

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
)

const FolderIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
  </svg>
)

const LayersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
    <polyline points="2 17 12 22 22 17"></polyline>
    <polyline points="2 12 12 17 22 12"></polyline>
  </svg>
)

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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-orange-500 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-28 text-slate-100 font-sans selection:bg-orange-500/30">

      {/* Background Effects (Matching Dashboard) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-500/10 blur-[100px] rounded-full mix-blend-screen animate-pulse duration-[4000ms]" />
        <div className="absolute top-[20%] right-[-20%] w-[400px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full mix-blend-screen" />
        {/* Noise Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
      </div>

      <div className="relative max-w-md mx-auto px-5 pt-8 animate-in slide-in-from-bottom-5 duration-700 fade-in">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center border border-white/5">
                <FolderIcon />
            </div>
            <h1 className="text-3xl font-black tracking-tight italic">
            MANAGE
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400 ml-2">
                ITEMS
            </span>
            </h1>
        </div>

        {/* Add Category Section (Top for quick access) */}
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-[1.5rem] p-6 border border-white/10 shadow-xl mb-8 group hover:border-orange-500/20 transition-colors">
            <h2 className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                Create New Category
            </h2>
            <div className="flex gap-2">
            <input
                type="text"
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreateCategory()}
                placeholder="e.g. Work, Fitness, Hobby..."
                className="flex-1 bg-slate-950/50 text-white text-sm px-4 py-3 rounded-xl border border-slate-700/50 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-slate-600"
            />
            <button
                onClick={handleCreateCategory}
                disabled={createCategory.isPending || !newCategoryName.trim()}
                className="bg-gradient-to-tr from-orange-600 to-amber-500 text-white p-3 rounded-xl shadow-lg shadow-orange-900/20 hover:shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
            >
                <PlusIcon />
            </button>
            </div>
        </div>

        {/* Categories List */}
        <div className="flex flex-col gap-6">
          {!categories || categories.length === 0 ? (
            <div className="bg-slate-900/40 border-2 border-dashed border-slate-800 rounded-3xl p-10 flex flex-col items-center text-center">
               <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-600 mb-4">
                    <LayersIcon />
               </div>
              <p className="text-slate-400 font-medium">No categories yet</p>
              <p className="text-slate-600 text-xs mt-1">Create one above to get started.</p>
            </div>
          ) : (
            categories.map((category: CategoryWithActivities, index) => (
              <div 
                key={category.id} 
                className="bg-slate-900/40 backdrop-blur-md rounded-3xl p-1 border border-white/5 animate-in slide-in-from-bottom-5 duration-500 fill-mode-backwards"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                 {/* Card Content */}
                <div className="p-5">
                    {/* Category Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
                            <h2 className="text-white font-bold text-lg tracking-tight">{category.name}</h2>
                        </div>
                        <button
                            onClick={() => deleteCategory.mutate(category.id)}
                            className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                            title="Delete Category"
                        >
                            <TrashIcon />
                        </button>
                    </div>

                    {/* Activities List */}
                    <div className="space-y-2 mb-6">
                    {category.activities?.length === 0 ? (
                         <div className="py-4 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/20">
                             <p className="text-slate-600 text-xs italic">No activities added</p>
                         </div>
                    ) : (
                        category.activities?.map((activity: ActivityWithSessions) => (
                        <div
                            key={activity.id}
                            className="group flex items-center justify-between bg-slate-950/40 border border-slate-800/50 hover:border-slate-700 rounded-xl px-4 py-3 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-orange-500 transition-colors"></div>
                                <span className="text-slate-300 text-sm font-medium">{activity.name}</span>
                            </div>
                            <button
                                onClick={() => deleteActivity.mutate(activity.id)}
                                className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 p-1 rounded transition-all"
                                title="Delete Activity"
                            >
                                <TrashIcon />
                            </button>
                        </div>
                        ))
                    )}
                    </div>

                    {/* Add Activity Input */}
                    <div className="flex gap-2 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                        </div>
                        <input
                            type="text"
                            value={newActivityNames[category.id] ?? ''}
                            onChange={e => handleActivityInputChange(category.id, e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleCreateActivity(category.id)}
                            placeholder="Add new activity..."
                            className="flex-1 bg-slate-950/80 text-white text-xs px-4 py-3 pl-8 rounded-xl border border-slate-800 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all placeholder:text-slate-600"
                        />
                        <button
                            onClick={() => handleCreateActivity(category.id)}
                            disabled={createActivity.isPending}
                            className="bg-slate-800 hover:bg-orange-500 hover:text-white text-slate-400 p-2.5 rounded-xl border border-slate-700 transition-all disabled:opacity-50"
                        >
                            <PlusIcon />
                        </button>
                    </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      <BottomNav />
    </div>
  )
}
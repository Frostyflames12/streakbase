// src/pages/CategoriesPage.tsx
import { useState } from 'react'
import BottomNav from '../components/BottomNav'
import PageBackground from '../components/PageBackground'
import ConfirmModal from '../components/ConfirmModal'
import { PlusIcon, TrashIcon } from '../components/Icons'
import { useCategories } from '../hooks/useCategories'
import { useCategoryMutations } from '../hooks/useCategoryMutations'
import type { CategoryWithActivities, ActivityWithSessions } from '../types/database'

// --- Page-specific icons ---
const FolderIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
  </svg>
)

const LayersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
    <polyline points="2 17 12 22 22 17"></polyline>
    <polyline points="2 12 12 17 22 12"></polyline>
  </svg>
)

type ModalState = {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
}

const CLOSED_MODAL: ModalState = {
  isOpen: false,
  title: '',
  message: '',
  onConfirm: () => {},
}

export default function CategoriesPage() {
  const { categories, isLoading } = useCategories()
  const { createCategory, deleteCategory, createActivity, deleteActivity } = useCategoryMutations()

  const [newCategoryName, setNewCategoryName] = useState('')
  const [newActivityNames, setNewActivityNames] = useState<Record<string, string>>({})
  const [modal, setModal] = useState<ModalState>(CLOSED_MODAL)

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

  function handleDeleteCategory(category: CategoryWithActivities) {
    const activityCount = category.activities?.length ?? 0
    const sessionCount = category.activities?.reduce(
      (acc, act) => acc + (act.sessions?.length ?? 0), 0
    ) ?? 0

    const message = activityCount === 0
      ? `"${category.name}" will be permanently removed.`
      : `"${category.name}" and its ${activityCount} activit${activityCount !== 1 ? 'ies' : 'y'} and ${sessionCount} session${sessionCount !== 1 ? 's' : ''} will be permanently removed.`

    setModal({
      isOpen: true,
      title: 'Delete Category?',
      message,
      onConfirm: () => {
        deleteCategory.mutate(category.id)
        setModal(CLOSED_MODAL)
      },
    })
  }

  function handleDeleteActivity(activity: ActivityWithSessions) {
    const sessionCount = activity.sessions?.length ?? 0

    const message = sessionCount === 0
      ? `"${activity.name}" will be permanently removed.`
      : `"${activity.name}" and its ${sessionCount} session${sessionCount !== 1 ? 's' : ''} will be permanently removed.`

    setModal({
      isOpen: true,
      title: 'Delete Activity?',
      message,
      onConfirm: () => {
        deleteActivity.mutate(activity.id)
        setModal(CLOSED_MODAL)
      },
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col gap-4 items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-orange-500 animate-spin" />
          <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-orange-500/20 blur-sm" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-28 text-slate-100 font-sans selection:bg-orange-500/30">
      <PageBackground />

      <div className="relative max-w-md mx-auto px-5 pt-8 animate-in slide-in-from-bottom-5 duration-700 fade-in">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-md rounded-full" />
            <div className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center border border-white/5 relative z-10">
              <FolderIcon />
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tight italic">
            MANAGE
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400 ml-2">
              ITEMS
            </span>
          </h1>
        </div>

        {/* Add Category Section */}
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-[1.5rem] p-6 border border-white/10 shadow-xl mb-8 hover:border-orange-500/20 transition-colors">
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
              className="flex-1 bg-slate-950/50 text-white text-sm px-4 py-3 rounded-xl border border-slate-700/50 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-slate-600 [&:-webkit-autofill]:shadow-[0_0_0_1000px_#020617_inset] [&:-webkit-autofill]:-webkit-text-fill-color-white"
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
            <div className="bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-3xl p-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-600 mb-4">
                <LayersIcon />
              </div>
              <p className="text-slate-400 font-bold mb-1">No categories yet</p>
              <p className="text-slate-600 text-xs">Create one above to get started.</p>
            </div>
          ) : (
            categories.map((category: CategoryWithActivities, index) => (
              <div
                key={category.id}
                className="group relative bg-slate-900/40 backdrop-blur-md rounded-3xl p-1 border border-white/5 animate-in slide-in-from-bottom-5 duration-500 fill-mode-backwards transition-all hover:border-white/10 hover:shadow-lg"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-3xl" />

                <div className="p-5 relative z-10">
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-6 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                      <h2 className="text-white font-bold text-lg tracking-tight">{category.name}</h2>
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(category)}
                      className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                      title="Delete Category"
                    >
                      <TrashIcon />
                    </button>
                  </div>

                  {/* Activities List */}
                  <div className="space-y-2 mb-6">
                    {category.activities?.length === 0 ? (
                      <div className="py-6 text-center border border-dashed border-slate-800 rounded-xl bg-slate-950/20">
                        <p className="text-slate-600 text-xs italic">No activities added</p>
                      </div>
                    ) : (
                      category.activities?.map((activity: ActivityWithSessions) => (
                        <div
                          key={activity.id}
                          className="flex items-center justify-between bg-slate-950/40 border border-slate-800/50 hover:border-slate-700 rounded-xl px-4 py-3 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
                            <span className="text-slate-300 text-sm font-medium">{activity.name}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteActivity(activity)}
                            className="text-slate-600 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-all"
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
                      className="flex-1 bg-slate-950/80 text-white text-xs px-4 py-3 pl-8 rounded-xl border border-slate-800 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all placeholder:text-slate-600 [&:-webkit-autofill]:shadow-[0_0_0_1000px_#020617_inset] [&:-webkit-autofill]:-webkit-text-fill-color-white"
                    />
                    <button
                      onClick={() => handleCreateActivity(category.id)}
                      disabled={createActivity.isPending}
                      className="bg-slate-800 hover:bg-orange-500 hover:text-white text-slate-400 p-2.5 rounded-xl border border-slate-700 transition-all disabled:opacity-50 active:scale-95"
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

      <ConfirmModal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
        onCancel={() => setModal(CLOSED_MODAL)}
      />

      <BottomNav />
    </div>
  )
}
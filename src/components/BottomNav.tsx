// src/components/BottomNav.tsx
import { NavLink } from 'react-router-dom'

const HomeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

const CategoriesIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
)

const ProfileIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-xl border-t border-white/10 z-50">
      <div className="max-w-md mx-auto flex items-center justify-around py-3">
        
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-6 py-1 transition-all ${
              isActive ? 'text-orange-500' : 'text-slate-500 hover:text-slate-300'
            }`
          }
        >
          <HomeIcon />
          <span className="text-xs font-medium">Dashboard</span>
        </NavLink>

        <NavLink
          to="/categories"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-6 py-1 transition-all ${
              isActive ? 'text-orange-500' : 'text-slate-500 hover:text-slate-300'
            }`
          }
        >
          <CategoriesIcon />
          <span className="text-xs font-medium">Categories</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-6 py-1 transition-all ${
              isActive ? 'text-orange-500' : 'text-slate-500 hover:text-slate-300'
            }`
          }
        >
          <ProfileIcon />
          <span className="text-xs font-medium">Profile</span>
        </NavLink>

      </div>
    </nav>
  )
}
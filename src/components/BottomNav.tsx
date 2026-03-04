// src/components/BottomNav.tsx
import { NavLink } from 'react-router-dom';

const HomeIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const CategoriesIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const HistoryIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v5h5" />
    <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
  </svg>
);

const ProfileIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const navItems = [
  { to: "/", label: "Home", Icon: HomeIcon, end: true },
  { to: "/categories", label: "Cats", Icon: CategoriesIcon, end: false },
  { to: "/history", label: "History", Icon: HistoryIcon, end: false },
  { to: "/profile", label: "Profile", Icon: ProfileIcon, end: false },
];

export default function BottomNav() {
  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav className="pointer-events-auto bg-slate-900/90 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] rounded-2xl px-6 py-3 flex items-center gap-8 md:gap-12">
        {navItems.map(({ to, label, Icon, end }) => (
          <NavLink key={to} to={to} end={end}>
            {({ isActive }) => (
              <div className="relative group flex flex-col items-center">
                {isActive && (
                  <div className="absolute inset-0 bg-orange-500/20 blur-lg rounded-full" />
                )}
                <div className={`relative transition-colors duration-300 ${isActive ? 'text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]' : 'text-slate-500 group-hover:text-slate-300'}`}>
                  <Icon active={isActive} />
                </div>
                <span className={`text-[10px] font-bold mt-1 transition-colors duration-300 ${isActive ? 'text-orange-400' : 'text-slate-500'}`}>
                  {label}
                </span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
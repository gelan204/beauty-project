import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Bell, LogOut } from 'lucide-react';
import { Logo } from './Logo.jsx';

export function PortalShell({
  title,
  subtitle,
  navItems,
  userInitial,
  onLogout,
  children,
  headerExtra,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="portal flex min-h-screen">
      <aside className={`portal-sidebar flex w-[275px] shrink-0 flex-col p-5 ${open ? 'open' : ''}`}>
        <div className="flex items-center justify-between">
          <Logo />
          <button type="button" className="lg:hidden text-white" onClick={() => setOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <p className="mt-2 text-xs uppercase tracking-widest text-[#c9a27c] font-bold">{subtitle}</p>
        <nav className="mt-8 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `portal-link ${isActive ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button type="button" className="mt-auto portal-link" onClick={onLogout}>
          <LogOut size={18} />
          Exit portal
        </button>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-[#e7ddd2] bg-[#fffdf9] px-5 py-4 lg:px-8">
          <button type="button" className="lg:hidden" onClick={() => setOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="hidden text-sm text-[#746a61] lg:block">{headerExtra || title}</div>
          <div className="ml-auto flex items-center gap-4">
            <Bell size={18} />
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#e8d3bd] text-sm font-bold">
              {userInitial}
            </span>
          </div>
        </header>
        <div className="p-5 lg:p-8 rise">{children}</div>
      </div>
    </div>
  );
}

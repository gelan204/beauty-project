import { Link, NavLink, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Logo, Button } from '@elaris/shared-ui';

export default function PublicLayout() {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-[#eee5da] bg-[#fbf8f3ee] backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link to="/" aria-label="Go to Elaris home">
            <Logo />
          </Link>
          <nav className="desktop-nav flex gap-7" aria-label="Main navigation">
            <NavLink to="/" className="nav-link" end>
              Home
            </NavLink>
            <NavLink to="/services" className="nav-link">
              Services
            </NavLink>
            <NavLink to="/salons" className="nav-link">
              Salons
            </NavLink>
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <Link to="/dashboard" className="text-sm font-semibold text-[#6f655c]">
                My Elaris
              </Link>
            ) : (
              <Link to="/login" className="text-sm font-semibold text-[#6f655c]">
                Sign in
              </Link>
            )}
            <Link to="/book">
              <Button variant="luxury" className="hidden sm:inline-flex">Book Appointment</Button>
            </Link>
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="border-t border-[#e8dfd4] bg-[#f2ebe1]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-9 lg:px-8">
          <div>
            <Logo className="h-14 w-14 object-contain" />
            <p className="mt-2 text-sm text-[#665c53]">
              Making time for beauty feel beautifully simple.
            </p>
          </div>
          <Link to="/portal" className="text-sm font-semibold text-[#a16e45]">
            Elaris portal →
          </Link>
        </div>
      </footer>
    </>
  );
}

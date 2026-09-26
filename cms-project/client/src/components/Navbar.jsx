import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b border-ink-100 bg-ink-900">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-serif text-xl font-semibold tracking-tight text-white">
          Desk
        </Link>
        <nav className="flex items-center gap-6 text-sm text-ink-100/80">
          <Link to="/" className="hover:text-white">
            Published
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-white">
                Dashboard
              </Link>
              <span className="hidden text-ink-100/50 sm:inline">{user.name}</span>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="rounded-sm bg-white/10 px-3 py-1.5 text-white hover:bg-white/20"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link to="/login" className="rounded-sm bg-brass-500 px-3 py-1.5 text-ink-900 hover:bg-brass-400">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

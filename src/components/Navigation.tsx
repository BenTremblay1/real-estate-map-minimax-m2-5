// @ts-nocheck
import { NavLink } from 'react-router-dom';
import { Map, TrendingUp } from 'lucide-react';

export default function Navigation() {
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-6">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            isActive
              ? 'bg-emerald-100 text-emerald-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`
        }
      >
        <Map className="w-5 h-5" />
        <span>Property Analytics</span>
      </NavLink>

      <NavLink
        to="/investment"
        className={({ isActive }) =>
          `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            isActive
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`
        }
      >
        <TrendingUp className="w-5 h-5" />
        <span>Investment Intelligence</span>
      </NavLink>
    </nav>
  );
}

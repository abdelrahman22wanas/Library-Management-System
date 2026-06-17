import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/books', label: 'Books' },
  { to: '/users', label: 'Users' },
  { to: '/loans', label: 'Loans' },
]

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-2">
      <span className="text-lg font-bold text-indigo-700 mr-3">📚 LMS</span>
      {links.map(l => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.to === '/'}
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`
          }
        >
          {l.label}
        </NavLink>
      ))}
    </nav>
  )
}

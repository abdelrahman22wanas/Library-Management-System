import { NavLink } from 'react-router-dom'

export default function Navbar() {
  const link = (to, label) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? 'bg-indigo-100 text-indigo-700'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`
      }
    >
      {label}
    </NavLink>
  )

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4">
      <span className="text-lg font-bold text-indigo-700 mr-4">📚 LMS</span>
      {link('/books', 'Books')}
      {link('/users', 'Users')}
      {link('/loans', 'Loans')}
    </nav>
  )
}

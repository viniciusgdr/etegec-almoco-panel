import Link from 'next/link'

export const Navbar = () => {
  return (
    <div className="w-full navbar bg-base-300 text-white">
      <Link
        className="flex-1 px-2 mx-2"
        href="/"
      >Almoço ETEGEC</Link>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/dashboard">Painel do Monitor</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
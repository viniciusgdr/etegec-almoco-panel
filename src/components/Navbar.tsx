import Link from 'next/link'

export const Navbar = () => {
  return (
    <div className="w-full navbar bg-base-300">
      <Link
        className="flex-1 px-2 mx-2"
        href="/"
      >Monitoria Almoço ETEGEC</Link>
    </div>
  )
}
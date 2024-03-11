import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export const Navbar = () => {
  const router = useRouter()
  const { data: session } = useSession()
  return (
    <div className="w-full navbar bg-base-300 text-white">
      <Link
        className="flex-1 px-2 mx-2"
        href="/"
      >Almoço ETEGEC</Link>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            {
              session ? (
                <Link href="/dashboard">Painel do Monitor</Link>
              ) : (
                <Link href="/account/login">Login</Link>
              )
            }
          </li>
        </ul>
      </div>
    </div>
  )
}
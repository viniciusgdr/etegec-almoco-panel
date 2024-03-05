import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router'
import { FaUserAlt } from 'react-icons/fa';
import { RxCaretLeft, RxCaretRight } from 'react-icons/rx';
import { Session } from '@viniciusgdr/models/session';
import { Button } from './Button';

export const Header = ({
  children,
  className = '',
  gradientColor = 'bg-gradient-to-b from-primary-500 to-primary-600'
}: {
  children?: React.ReactNode;
  className?: string;
  gradientColor?: string;
}) => {
  const { data: session } = useSession() as {
    data: Session | null
  };
  const router = useRouter()
  return (
    <div className={'h-fit p-6 pb-12 transition duration-[5000ms] ' + className + ' ' + gradientColor}>
      <div className="w-full mb-4 flex items-center justify-between flex-row">
        <div className="hidden lg:flex items-center gap-x-2">
          <button
            onClick={() => {
              try {
                router.back()
              } catch {
              }
            }}
            className="cursor-pointer hover:opacity-75 transition rounded-full bg-black flex items-center justify-center "
          >
            <RxCaretLeft size={35} className="text-white" />
          </button>
          <button
            onClick={() => {
              try {
                router.forward()
              } catch {
                router.push('/')
              }
            }}
            className="cursor-pointer hover:opacity-75 transition rounded-full bg-black flex items-center justify-center"
          >
            <RxCaretRight size={35} className="text-white" />
          </button>
        </div>
        <div className="flex lg:hidden gap-x-2 items-center">
          <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </label>
        </div>
        <div className="md:hidden flex justify-between items-center gap-x-4">
          {session ? (
            <div className={"dropdown"}>
              <div tabIndex={0} role="img" className="">
                <FaUserAlt />
              </div>
              <ul tabIndex={0} className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-4">
                <li>
                  <a onClick={() => signOut({
                    callbackUrl: '/'
                  })}>Sair</a>
                </li>
              </ul>
            </div>
          ) : (
            <div>
              <Button
                onClick={() => (document as any).getElementById('modal-login').showModal()}
                className="bg-white px-6 py-2"
              >
                Log In
              </Button>
            </div>
          )}
        </div>
        <div className="hidden md:flex justify-between items-center gap-x-4">
          {session && (
            <div className={"dropdown dropdown-end"}>
              <div tabIndex={0} role="img" className="">
                <Button className="bg-white px-3.5 py-3.5">
                  <FaUserAlt />
                </Button>
              </div>
              <ul tabIndex={0} className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-4">
                <li>
                  <a onClick={() => signOut({
                    callbackUrl: '/'
                  })}>Sair</a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}
import { AppProps } from 'next/app'
import Link from 'next/link'
import { FaHome } from 'react-icons/fa'
import { SiJusteat } from 'react-icons/si'
import NextNProgress from 'nextjs-progressbar';

const dashboardItems = [
  {
    name: 'Home',
    href: '/dashboard',
    icon: <FaHome size={20} />
  },
  {
    name: 'Descidas do Almoço',
    href: '/dashboard/decive-lunch',
    icon: <SiJusteat size={20} />
  }
]

export const DashboardLayout = ({ Component, pageProps }: AppProps) => {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col  bg-black h-full min-h-screen md:max-h-screen font-sora">
        <NextNProgress color='linear-gradient(90deg, #ff0080, #7928ca)' />
        <div className='bg-site bg-cover bg-no-repeat h-full w-full transition duration-[5000ms]'>
          <Component {...pageProps} />
        </div>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200">
          {dashboardItems.map((item, index) => (
            <li key={index}>
              <Link href={item.href} className="flex flex-row items-center text-xl">
                {item.icon}
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
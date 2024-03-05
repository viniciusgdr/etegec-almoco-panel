import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { Header } from '@viniciusgdr/components/Header';


export default function Home() {
  return (
    <div>
      <Header />
      <div className="flex flex-col gap-3 p-4">
        <h1 className='text-4xl font-bold w-full break-all'>
          Olá, monitor!
        </h1>
      </div>
    </div>
  );
}

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.writeHead(302, { Location: "/account/login" });
    res.end();
    return { props: {} }
  }
  return {
    props: {
      session
    }
  }
}
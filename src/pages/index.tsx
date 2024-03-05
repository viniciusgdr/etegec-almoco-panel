import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Session } from '@viniciusgdr/models/session';


export default function Home() {
  const router = useRouter()
  const { data } = useSession() as { data: Session | null }
  if (data?.user) {
    router.push('/dashboard')
  } else {
    router.push('/account/login')
  }
  return null
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
  } else {
    res.writeHead(302, { Location: "/dashboard" });
    res.end();
    return { props: {} }
  }
}
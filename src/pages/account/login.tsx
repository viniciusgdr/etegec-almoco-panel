import React, { useState } from 'react'
import validator from 'validator'
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const redirectUrl = (router.query.redirect || '/dashboard') as string
  return (
    <div className="flex h-screen bg-base-100 justify-center">
      <div className="flex flex-col justify-center pr-[15px] pl-[15px] max-w-xl container">
        <div className="bg-base-200 rounded-3xl border-4 border-slate-700">
          <form className="flex flex-col items-center justify-center w-full p-5 rounded shadow-xl">
            <h1 className="mb-4 text-3xl font-bold text-center">Login</h1>
            <div className="flex flex-col w-full">
              <label htmlFor="email" className="mb-2 text-sm">Email</label>
              <input
                id="email"
                type="email"
                className="w-full p-2 mb-4 border border-slate-600 rounded shadow-sm bg-base-100"
                value={email}
                onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="password" className="mb-2 text-sm">Senha</label>
              <input
                id="password"
                type="password"
                className="w-full p-2 mb-4 border border-slate-600 rounded shadow-sm bg-base-100"
                value={password}
                minLength={8}
                onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button
              disabled={email === '' || password === ''}
              type="submit"
              className="w-full py-2 mb-4 text-sm font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded shadow-sm hover:bg-blue-600 disabled:opacity-50 "
              onClick={
                async (e) => {
                  e.preventDefault()
                  const isEmail = validator.isEmail(email)
                  if (!isEmail) {
                    setError('Email inválido')
                    return
                  }
                  const signResponse = await signIn('credentials', {
                    email,
                    password,
                    callbackUrl: window.location.origin,
                    redirect: false
                  })
                  if (signResponse?.error) {
                    setError(signResponse.error)
                  } else {
                    router.push(redirectUrl.replaceAll('"', ''))
                  }
                }
              }
            >
              Entrar
            </button>
            <ToastContainer />
            {error !== '' && (
              <div className="alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{error}</span>
                <button
                  className="ml-auto"
                  onClick={() => setError('')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

              </div>
            )}
            <div className="flex items-center justify-between w-full">
              <Link
                href={"/account/register" + (redirectUrl !== '/' ? `?redirect=${redirectUrl}` : '')}
                className="text-sm text-blue-500 hover:underline"
              >Criar conta</Link>
              <Link
                href="/account/forgot-password"
                className="text-sm text-blue-500 hover:underline"
              >Esqueci minha senha</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const session = await getServerSession(req, res, authOptions)

  if (session) {
    res.writeHead(302, { Location: "/dashboard" });
    res.end();
    return { props: {} }
  }
  return {
    props: {
      data: session
    }
  }
}
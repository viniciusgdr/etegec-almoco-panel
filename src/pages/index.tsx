import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Session } from '@viniciusgdr/models/session';
import { useEffect, useState } from 'react';
import { DescentTimeDaily, DescentTimeDailyHasClass, Class } from '@prisma/client'
import prismaClient from '@viniciusgdr/db/prismaClient';

type DeciveLunch = DescentTimeDailyHasClass & {
  class: Class
}

interface HomeProps {
  deciveLunch: DeciveLunch[]
}

export default function Home({ deciveLunch: initialDeciveLunch }: HomeProps) {
  // const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [deciveLunch, setDeciveLunch] = useState<DeciveLunch[]>(initialDeciveLunch)
  const [dateNow, setDateNow] = useState<Date>()

  useEffect(() => {
    const interval = setInterval(() => {
      setDateNow(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  // useEffect(() => {
  //   (async () => {
  //     if (!selectedDate) return
  //     const request = await fetch(`/api/decive-lunch?date=${selectedDate.toISOString().split('T')[0]}`)
  //     const response = await request.json()
  //     setDeciveLunch(response)
  //   })()
  // }, [selectedDate])

  return (
    <div className="container mx-auto justify-center w-full mt-12 pb-12">
      <div className="flex flex-col justify-center items-center text-center mb-12">
        <h1 className="text-2xl md:text-4xl text-white mb-4">Hora Agora</h1>
        <h1 className="text-5xl md:text-8xl text-white">{dateNow?.toLocaleTimeString('pt-BR') ?? '00:00:00'}</h1>
        <span className='text-sm'>
          Horário de Brasília
        </span>
      </div>
      <div className="flex flex-col justify-center items-center text-center">
        <h1 className="text-xl md:text-2xl text-white mb-4">Horários de Descida Programados</h1>
        <table className="table table-zebra bg-base-300 text-white shadow-xl rounded-3xl">
          <thead className="bg-base-200 text-white">
            <tr>
              <th>#</th>
              <th>Horário</th>
              <th>Turma</th>
            </tr>
          </thead>
          <tbody>
            {deciveLunch
              .sort((a, b) => {
                if (a.hour < b.hour) return -1
                if (a.hour > b.hour) return 1
                if (a.minute < b.minute) return -1
                if (a.minute > b.minute) return 1
                if (a.priority < b.priority) return -1
                if (a.priority > b.priority) return 1
                return 0
              })
              .map((deciveLunch, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    {deciveLunch?.hour?.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) ?? '00'}:
                    {deciveLunch?.minute?.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumIntegerDigits: 2 }) ?? '00'}
                  </td>
                  <td>{deciveLunch.class.name}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const dateOnly = new Date(new Date().toISOString().split('T')[0])
  const decivesLunch = await prismaClient.descentTimeDailyHasClass.findMany({
    where: {
      descentTimeDaily: {
        date: dateOnly
      }
    },
    include: {
      class: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })
  return {
    props: {
      deciveLunch: JSON.parse(JSON.stringify(decivesLunch.map((deciveLunch) => deciveLunch))),
    }
  }
}
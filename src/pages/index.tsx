import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Session } from '@viniciusgdr/models/session';
import { useEffect, useState } from 'react';
import { DescentTimeDaily, DescentTimeDailyHasClass, Class } from '@prisma/client'

type DeciveLunch = DescentTimeDailyHasClass & {
  class: Class
}
export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [deciveLunch, setDeciveLunch] = useState<DeciveLunch[]>([])
  const [dateNow, setDateNow] = useState<Date>()

  useEffect(() => {
    const interval = setInterval(() => {
      setDateNow(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  useEffect(() => {
    (async () => {
      if (!selectedDate) return
      const request = await fetch(`/api/decive-lunch?date=${selectedDate.toISOString().split('T')[0]}`)
      const response = await request.json()
      setDeciveLunch(response)
    })()
  }, [selectedDate])

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
                const dateA = new Date(a.hour ?? 0, a.minute ?? 0)
                const dateB = new Date(b.hour ?? 0, b.minute ?? 0)
                return dateA.getTime() - dateB.getTime()
              })
              .sort((a, b) => {
                return a.priority - b.priority
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

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { MRT_Localization_PT_BR } from 'material-react-table/locales/pt-BR';
import {
  MaterialReactTable,
  MRT_ColumnDef,
  useMaterialReactTable
} from "material-react-table";
import { Box, IconButton, Tooltip } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import prismaClient from '@viniciusgdr/db/prismaClient';
import { DescentTimeDaily, DescentTimeDailyHasClass, Class } from '@prisma/client'
import { useEffect, useMemo, useState } from 'react';
import { Header } from '@viniciusgdr/components/Header';

interface DeciveLunchProps {
  decivesLunch: DescentTimeDaily[]
}

export default function DeciveLunch({ decivesLunch }: DeciveLunchProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  )
  useEffect(() => {
    if (!selectedDate) return
    const deciveLunch = decivesLunch.filter((deciveLunch) => {
      return deciveLunch.date.toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0]
    })
    console.log(deciveLunch)
  }, [selectedDate])
  const columns = useMemo<MRT_ColumnDef<DescentTimeDailyHasClass & {
    class: Class
  }>[]>(
    () => [
      {
        accessorFn: (row) => row.class.name,
        header: 'Sala',
      },
      {
        accessorFn: (row) => `${row.hour.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}:${row.minute.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}`,
        header: 'Horário de Descida',
      }
    ],
    []
  );

  const table = useMaterialReactTable({
    localization: MRT_Localization_PT_BR,
    columns,
    data: [],
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableGrouping: true,
    enableColumnPinning: true,
    enableFacetedValues: true,
    enableRowActions: true,
    enableRowSelection: true,
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Editar">
          <IconButton onClick={() => (document as any).getElementById(`edit_${row.original.id}`).showModal()}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Deletar">
          <IconButton onClick={() => (document as any).getElementById(`delete_${row.original.id}`).showModal()}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  })
  return (
    <div>
      <Header />
      <div className="flex flex-col gap-3 p-4">
        <h1 className='text-4xl font-bold w-full break-all text-white'>
          Descidas para o Almoço
        </h1>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-4">
          <div>
            <h2 className='text-2xl font-bold w-full break-all'>
              Selecionar data
            </h2>
            <input
              type="date"
              value={selectedDate?.toISOString().split('T')[0]}
              onChange={(e) => {
                if (e.target.value === '') {
                  setSelectedDate(undefined)
                  return
                }
                setSelectedDate(new Date(e.target.value))
              }}
              className='w-full md:w-64 p-2 border border-slate-600 rounded shadow-sm bg-base-100'
            />
          </div>
          <div>
            <button
              className='btn btn-primary w-full md:btn-wide mt-8 md:mt-0'
              onClick={() => (document as any).getElementById('addDescentTimeDailyHasClass').showModal()}
            >
              Adicionar
            </button>
          </div>
        </div>
        <MaterialReactTable table={table} />
      </div>
    </div>
  )
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
  const decivesLunch = await prismaClient.descentTimeDaily.findMany()
  return {
    props: {
      session,
      decivesLunch: JSON.parse(JSON.stringify(decivesLunch))
    }
  }
}
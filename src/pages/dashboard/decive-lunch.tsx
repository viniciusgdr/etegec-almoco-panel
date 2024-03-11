import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { MRT_Localization_PT_BR } from 'material-react-table/locales/pt-BR';
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_RowSelectionState,
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
import Dropdown from '@viniciusgdr/components/Dropdown';

interface DeciveLunchProps {
  decivesLunch: DescentTimeDaily[]
  classes: {
    id: string
    name: string
  }[]
}

type DeciveLunch = DescentTimeDailyHasClass & {
  class: Class
}


export default function DeciveLunch({ classes }: DeciveLunchProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [deciveLunch, setDeciveLunch] = useState<DeciveLunch[]>([])

  const [selectedClasses, setSelectedClasses] = useState<string[]>([])
  const [hour, setHour] = useState<number>(0)
  const [minute, setMinute] = useState<number>(0)

  useEffect(() => {
    (async () => {
      if (!selectedDate) return
      const request = await fetch(`/api/decive-lunch?date=${selectedDate.toISOString().split('T')[0]}`)
      const response = await request.json()
      setDeciveLunch(response)
    })()
  }, [selectedDate])
  const columns = useMemo<MRT_ColumnDef<DeciveLunch>[]>(
    () => [
      {
        accessorFn: (row) => row.class.name,
        header: 'Sala',
      },
      {
        accessorFn: (row) => `${row?.hour?.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) ?? '00'}:${row?.minute?.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumIntegerDigits: 2 }) ?? '00'}`,
        header: 'Horário de Descida',
      },
      {
        accessorFn: (row) => row.priority,
        header: 'Prioridade',
      },
    ],
    []
  );
  const [editedDeciveLunch, setEditedDeciveLunch] = useState<DeciveLunch[]>(deciveLunch)
  useEffect(() => {
    setEditedDeciveLunch(deciveLunch)
  }, [deciveLunch])
  const [dropdown, setDropdown] = useState(false);
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const table = useMaterialReactTable({
    localization: MRT_Localization_PT_BR,
    columns,
    data: deciveLunch,
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableGrouping: true,
    enableColumnPinning: true,
    enableFacetedValues: true,
    enableRowActions: true,
    enableRowSelection: true,
    state: {
      rowSelection,
    },
    onRowSelectionChange: (rows) => {
      setRowSelection(rows)
    },
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
        <dialog id={`edit_${row.original.id}`} className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              Editar Descida para o Almoço
            </h3>
            <p className="py-4">
              Formulário de edição de descida para o almoço
            </p>
            <div className="form-control">
              <label className="label">
                Sala
              </label>
              <input
                type="text"
                value={row.original.class.name}
                disabled
                className='input input-bordered input-disabled'
              />
            </div>
            <div className="form-control">
              <label className="label">
                Horário de Descida
              </label>
              <div className="flex flex-row gap-4">
                <input
                  type="number"
                  value={editedDeciveLunch.find(d => d.id === row.original.id)?.hour ?? 0}
                  min={0}
                  max={23}
                  onChange={(e) => {
                    if (parseInt(e.target.value) > 23) {
                      setEditedDeciveLunch(editedDeciveLunch.map(d => {
                        if (d.id === row.original.id) {
                          return {
                            ...d,
                            hour: Number(e.target.value.slice(0, 2))
                          }
                        }
                        return d
                      }))
                      return
                    }
                    setEditedDeciveLunch(editedDeciveLunch.map(d => {
                      if (d.id === row.original.id) {
                        return {
                          ...d,
                          hour: parseInt(e.target.value)
                        }
                      }
                      return d
                    }))
                  }}
                  className='w-full p-2 border border-slate-600 rounded shadow-sm bg-base-100'
                />
                <input
                  type="number"
                  value={editedDeciveLunch.find(d => d.id === row.original.id)?.minute ?? 0}
                  min={0}
                  max={59}
                  onChange={(e) => {
                    if (parseInt(e.target.value) > 59) {
                      setEditedDeciveLunch(editedDeciveLunch.map(d => {
                        if (d.id === row.original.id) {
                          return {
                            ...d,
                            minute: Number(e.target.value.slice(0, 2))
                          }
                        }
                        return d
                      }))
                      return
                    }
                    setEditedDeciveLunch(editedDeciveLunch.map(d => {
                      if (d.id === row.original.id) {
                        return {
                          ...d,
                          minute: parseInt(e.target.value)
                        }
                      }
                      return d
                    }))
                  }}
                  className='w-full p-2 border border-slate-600 rounded shadow-sm bg-base-100'
                />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                Prioridade
              </label>
              <input
                type="number"
                value={editedDeciveLunch.find(d => d.id === row.original.id)?.priority ?? 0}
                className='input input-bordered'
                onChange={(e) => {
                  if (parseInt(e.target.value) < 1) {
                    setEditedDeciveLunch(editedDeciveLunch.map(d => {
                      if (d.id === row.original.id) {
                        return {
                          ...d,
                          priority: 1
                        }
                      }
                      return d
                    }))
                    return
                  }
                  setEditedDeciveLunch(editedDeciveLunch.map(d => {
                    if (d.id === row.original.id) {
                      return {
                        ...d,
                        priority: parseInt(e.target.value)
                      }
                    }
                    return d
                  }))
                }}
              />
            </div>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn">Fechar</button>
              </form>
              <form method="dialog" onClick={async () => {
                const request = await fetch("/api/decive-lunch", {
                  method: 'PUT',
                  body: JSON.stringify({
                    id: row.original.id,
                    hour: editedDeciveLunch.find(d => d.id === row.original.id)?.hour,
                    minute: editedDeciveLunch.find(d => d.id === row.original.id)?.minute,
                    priority: editedDeciveLunch.find(d => d.id === row.original.id)?.priority
                  }),
                  headers: new Headers({
                    'Content-Type': 'application/json'
                  })
                })
                if (request.status !== 200) return
                setDeciveLunch(deciveLunch.map(d => {
                  if (d.id === row.original.id) {
                    return {
                      ...d,
                      hour: editedDeciveLunch.find(d => d.id === row.original.id)?.hour ?? 0,
                      minute: editedDeciveLunch.find(d => d.id === row.original.id)?.minute ?? 0,
                      priority: editedDeciveLunch.find(d => d.id === row.original.id)?.priority ?? 0
                    }
                  }
                  return d
                }))
              }}>
                <button className="btn btn-success">Salvar</button>
              </form>
            </div>
          </div>
        </dialog>
        <dialog id={`delete_${row.original.id}`} className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              Deletar Descida para o Almoço
            </h3>
            <p className="py-4">
              Você tem certeza que deseja deletar a descida para o almoço?
            </p>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn">Cancelar</button>
              </form>
              <form method="dialog" onClick={async () => {
                await fetch("/api/decive-lunch", {
                  method: 'DELETE',
                  body: JSON.stringify({
                    id: row.original.id
                  }),
                  headers: new Headers({
                    'Content-Type': 'application/json'
                  })
                })
                setDeciveLunch(deciveLunch.filter(d => d.id !== row.original.id))
              }}>
                <button className="btn btn-danger">Deletar</button>
              </form>
            </div>
          </div>
        </dialog>
      </Box>
    ),
  })

  const toogleDropdown = () => {
    setDropdown(!dropdown)
  };
  // adds new item to multiselect 
  const addTag = (item: string) => {
    setSelectedClasses([...selectedClasses, item]);
    setDropdown(false);
  };
  // removes item from multiselect
  const removeTag = (item: string) => {
    const filtered = selectedClasses.filter(tag => tag !== item)
    setSelectedClasses(filtered);
  }
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
                setSelectedDate(new Date(new Date(e.target.value).toISOString().split('T')[0]))
              }}
              className='w-full md:w-64 p-2 border border-slate-600 rounded shadow-sm bg-base-100'
            />
          </div>
          <div>
            <button
              className='btn btn-primary w-full md:btn-wide mt-8 md:mt-0'
              disabled={!selectedDate}
              onClick={() => (document as any).getElementById('addDescentTimeDailyHasClass').showModal()}
            >
              Adicionar
            </button>
            <dialog id="addDescentTimeDailyHasClass" className="modal modal-bottom sm:modal-middle">
              <div className="modal-box md:min-w-[700px]">
                <h3 className="font-bold text-lg">
                  Adicionar Descida para o Almoço
                </h3>
                <p className="py-4">
                  Formulário de adição de descida para o almoço
                </p>
                <div className="form-control">
                  <label className="label">
                    Salas Selecionadas
                  </label>
                  <div className="autcomplete-wrapper px-4">
                    <div className="autcomplete">
                      <div className="w-full flex flex-col items-center mx-auto">
                        <div className="w-full">
                          <div className="flex flex-col items-center relative">
                            <div className="w-full ">
                              <div className="my-2 p-1 flex border border-gray-400 bg-base-200 rounded ">
                                <div className="flex flex-auto flex-wrap">
                                  {
                                    selectedClasses.map((tag, index) => {
                                      return (
                                        <div key={index} className="flex justify-center items-center m-1 font-medium py-1 px-2 rounded-full text-teal-700 bg-teal-100 border border-teal-300 ">
                                          <div className="text-xs font-normal leading-none max-w-full flex-initial">{
                                            classes.find(c => c.id === tag)?.name
                                          }</div>
                                          <div className="flex flex-auto flex-row-reverse">
                                            <div onClick={() => removeTag(tag)}>
                                              <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                                className="feather feather-x cursor-pointer hover:text-teal-400 rounded-full w-4 h-4 ml-2">
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                              </svg>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    })
                                  }
                                  <div className="flex-1">
                                    <input placeholder="" className="bg-transparent p-1 px-2 appearance-none outline-none h-full w-full text-gray-800" />
                                  </div>
                                </div>
                                <div className="text-gray-300 w-8 py-1 pl-2 pr-1 border-l flex items-center border-gray-200" onClick={toogleDropdown}>
                                  <button className="cursor-pointer w-6 h-6 text-white-600 outline-none focus:outline-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-up w-4 h-4">
                                      <polyline points="18 15 12 9 6 15"></polyline>
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          {dropdown ? <Dropdown list={
                            classes.filter(c => !selectedClasses.includes(c.id))
                          } addItem={addTag}></Dropdown> : null}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      A ordem de prioridade das salas é na ordem em que foram adicionadas, a primeira sala adicionada será a primeira a ser descida.
                    </span>
                  </div>
                </div>
                <div className="form-control">
                  <label className="label">
                    Horário de Descida
                  </label>
                  <div className="flex flex-row gap-4">
                    <input
                      type="number"
                      value={hour}
                      min={0}
                      max={23}
                      onChange={(e) => {
                        if (parseInt(e.target.value) > 23) {
                          setHour(Number(e.target.value.slice(0, 2)))
                          return
                        }
                        setHour(parseInt(e.target.value))
                      }}
                      className='w-full p-2 border border-slate-600 rounded shadow-sm bg-base-100'
                    />
                    <input
                      type="number"
                      value={minute}
                      min={0}
                      max={59}
                      onChange={(e) => {
                        if (parseInt(e.target.value) > 59) {
                          setMinute(Number(e.target.value.slice(0, 2)))
                          return
                        }
                        setMinute(parseInt(e.target.value))
                      }}
                      className='w-full p-2 border border-slate-600 rounded shadow-sm bg-base-100'
                    />
                  </div>
                </div>
                <div className="modal-action">
                  <form method="dialog">
                    <button className="btn">Fechar</button>
                  </form>
                  <form method="dialog" onClick={async () => {
                    const request = await fetch('/api/decive-lunch', {
                      method: 'POST',
                      body: JSON.stringify({
                        descentTimeDaily: selectedDate,
                        classesId: selectedClasses,
                        hour,
                        minute
                      }),
                      headers: new Headers({
                        'Content-Type': 'application/json'
                      })
                    })
                    const response: DeciveLunch[] = await request.json()
                    setDeciveLunch([...deciveLunch, ...response])
                    setHour(0)
                    setMinute(0)
                    setSelectedClasses([])
                  }}>
                    <button className="btn btn-success md:btn-wide">Criar</button>
                  </form>
                </div>
              </div>
            </dialog>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <button
              className='btn btn-primary w-full md:btn-wide'
              onClick={() => (document as any).getElementById('deleteSelected').showModal()}
              disabled={!Object.keys(rowSelection).length}
            >
              Remover Selecionados
            </button>
            <dialog id="deleteSelected" className="modal modal-bottom sm:modal-middle">
              <div className="modal-box">
                <h3 className="font-bold text-lg">
                  Deletar Descida para o Almoço
                </h3>
                <p className="py-4">
                  Você tem certeza que deseja deletar as descidas para o almoço selecionadas?
                </p>
                {
                  Object.keys(rowSelection).map((id) => {
                    const row = deciveLunch.find((_, index) => index === Number(id))
                    if (!row) {
                      return null
                    }
                    return (
                      <div key={id} className="flex flex-row gap-4">
                        <div className="form-control">
                          <label className="label">
                            Sala
                          </label>
                          <input
                            type="text"
                            value={row!.class.name}
                            disabled
                            className='input input-bordered input-disabled'
                          />
                        </div>
                        <div className="form-control">
                          <label className="label">
                            Horário de Descida
                          </label>
                          <div className="flex flex-row gap-4">
                            <input
                              type="number"
                              value={row!.hour}
                              disabled
                              className='w-full p-2 border border-slate-600 rounded shadow-sm bg-base-100'
                            />
                            <input
                              type="number"
                              value={row!.minute}
                              disabled
                              className='w-full p-2 border border-slate-600 rounded shadow-sm bg-base-100'
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })
                }
                <div className="modal-action">
                  <form method="dialog">
                    <button className="btn">Cancelar</button>
                  </form>
                  <form method="dialog" onClick={async () => {
                    await fetch("/api/decive-lunch", {
                      method: 'DELETE',
                      body: JSON.stringify({
                        ids: Object.keys(rowSelection).map(id => deciveLunch[Number(id)].id)
                      }),
                      headers: new Headers({
                        'Content-Type': 'application/json'
                      })
                    })
                    setDeciveLunch(deciveLunch.filter((_, index) => !Object.keys(rowSelection).includes(index.toString())))
                    setRowSelection({})
                  }}>
                    <button className="btn btn-error">Deletar</button>
                  </form>
                </div>
              </div>
            </dialog>
          </div>
        </div>
        <MaterialReactTable table={table} />
        <span className="text-xs text-gray-400">
          Quanto menor a prioridade, mais cedo a sala será descida. Exemplo: Prioridade 1 será descida antes da prioridade 2.
        </span>
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
  const classes = await prismaClient.class.findMany({
    select: {
      id: true,
      name: true
    }
  })
  return {
    props: {
      session,
      classes
    }
  }
}
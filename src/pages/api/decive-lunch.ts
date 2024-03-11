import prismaClient from '@viniciusgdr/db/prismaClient';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import validator from 'validator';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return POST(req, res)
    case 'GET':
      return GET(req, res)
    case 'PUT':
      return PUT(req, res)
    case 'DELETE':
      return DELETE(req, res)
    default:
      res.status(405).json({ error: 'Method not allowed' })
  }
}

async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { descentTimeDaily, classesId, hour, minute } = req.body as {
    descentTimeDaily: string,
    classesId: string[],
    hour: number,
    minute: number
  }
  if (!descentTimeDaily) {
    res.status(400).json({ error: 'Missing descentTimeDaily' })
    return
  }
  if (!classesId) {
    res.status(400).json({ error: 'Missing classesId' })
    return
  }
  if (!validator.isInt(hour.toString(), { min: 0, max: 23 })) {
    res.status(400).json({ error: 'Invalid hour' })
    return
  }
  if (!validator.isInt(minute.toString(), { min: 0, max: 59 })) {
    res.status(400).json({ error: 'Invalid minute' })
    return
  }
  if (!validator.isISO8601(descentTimeDaily)) {
    res.status(400).json({ error: 'Invalid descentTimeDaily' })
    return
  }
  const date = new Date(new Date(descentTimeDaily).toISOString().split('T')[0])
  let descentTimeDailyExists = await prismaClient.descentTimeDaily.findFirst({
    where: {
      date
    }
  })
  if (!descentTimeDailyExists) {
    descentTimeDailyExists = await prismaClient.descentTimeDaily.create({
      data: {
        date
      }
    })
  }
  for (let i = 0; i < classesId.length; i++) {
    await prismaClient.descentTimeDailyHasClass.create({
      data: {
        descentTimeDailyId: descentTimeDailyExists.id,
        classId: classesId[i],
        hour,
        minute,
        priority: i
      }
    })
  }
  const decivesLunch = await prismaClient.descentTimeDailyHasClass.findMany({
    where: {
      descentTimeDailyId: descentTimeDailyExists.id
    },
    include: {
      class: true
    }
  })
  res.status(200).json(decivesLunch)
}

async function GET(req: NextApiRequest, res: NextApiResponse) {
  const date = req.query.date as string
  if (!date) {
    res.status(400).json({ error: 'Missing date' })
    return
  }
  if (!validator.isISO8601(date)) {
    res.status(400).json({ error: 'Invalid date' })
    return
  }
  const dateOnly = new Date(new Date(date).toISOString().split('T')[0])
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
  res.status(200).json(decivesLunch.map((deciveLunch) => deciveLunch))
}

async function PUT(req: NextApiRequest, res: NextApiResponse) {
  const { id, hour, minute, priority } = req.body as {
    id: string,
    hour: number,
    minute: number
    priority: number
  }
  if (!id) {
    res.status(400).json({ error: 'Missing id' })
    return
  }
  if (!validator.isInt(hour.toString(), { min: 0, max: 23 })) {
    res.status(400).json({ error: 'Invalid hour' })
    return
  }
  if (!validator.isInt(minute.toString(), { min: 0, max: 59 })) {
    res.status(400).json({ error: 'Invalid minute' })
    return
  }
  if (typeof id !== 'string') {
    res.status(400).json({ error: 'Invalid id' })
    return
  }
  const updated = await prismaClient.descentTimeDailyHasClass.update({
    where: {
      id
    },
    data: {
      hour,
      minute,
      priority
    },
    include: {
      class: true
    }
  })
  res.status(200).json(updated)
}

async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  const { id, ids } = req.body
  if (id) {
    if (typeof id !== 'string') {
      res.status(400).json({ error: 'Invalid id' })
      return
    }
    await prismaClient.descentTimeDailyHasClass.delete({
      where: {
        id
      }
    })
  } else if (ids) {
    if (!Array.isArray(ids)) {
      res.status(400).json({ error: 'Invalid ids' })
      return
    }
    if (ids.length === 0) {
      res.status(400).json({ error: 'Invalid ids' })
      return
    }
    for (const id of ids) {
      if (typeof id !== 'string') {
        res.status(400).json({ error: 'Invalid id' })
        return
      }
    }
    await prismaClient.descentTimeDailyHasClass.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    })
  }
  res.status(200).json({ message: 'Deleted' })
}
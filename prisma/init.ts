import { PrismaClient } from '@prisma/client'
const classes = [
  '1° ADM A',
  '1° ADM B',
  '1° Redes A',
  '1° Redes B',
  '2° ADM A',
  '2° ADM B',
  '2° Redes A',
  '2° Redes B',
  '3° ADM A',
  '3° ADM B',
  '3° Redes A',
  '3° Redes B'
]
void (async () => {
  const prismaClient = new PrismaClient()
  for (const className of classes) {
    await prismaClient.class.create({
      data: {
        name: className
      }
    })
  }
  console.log('Classes created')
})()
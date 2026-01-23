import { hash } from 'bcryptjs'

import { PrismaClient } from '../generated/client'

const prisma = new PrismaClient()

async function seed() {
  const passwordHash = await hash('robinrecruit', 6)

  await prisma.user.create({
    data: {
      name: 'Leonardo Theodoro',
      email: 'leonardo@recruitrobin.com',
      username: 'leotheodoro',
      password_hash: passwordHash,
    },
  })
}

seed().then(() => {
  console.log('Database seeded! 🌱')
})

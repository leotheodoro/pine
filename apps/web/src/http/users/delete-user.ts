import { api } from '@/lib/ky'

export async function deleteUser(id: string) {
  await api.delete(`users/${id}`)
}

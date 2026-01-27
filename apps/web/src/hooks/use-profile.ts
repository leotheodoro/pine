import { useQuery } from '@tanstack/react-query'

import { getProfile } from '@/http/users/get-profile'

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

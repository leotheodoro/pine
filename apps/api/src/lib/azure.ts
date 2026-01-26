import axios from 'axios'

export function createAzureDevOpsClient(org: string, pat: string) {
  const auth = Buffer.from(`:${pat}`).toString('base64')

  return axios.create({
    baseURL: `https://dev.azure.com/${org}`,
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: 'application/json',
    },
    timeout: 15000,
  })
}

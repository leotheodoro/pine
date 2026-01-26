import axios from 'axios'

export function createBitbucketClient(email: string, apiToken: string) {
  const auth = Buffer.from(`${email}:${apiToken}`).toString('base64')

  return axios.create({
    baseURL: 'https://api.bitbucket.org/2.0',
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: 'application/json',
    },
    timeout: 15000,
  })
}

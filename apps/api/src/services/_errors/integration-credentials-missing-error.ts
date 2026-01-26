export class IntegrationCredentialsMissingError extends Error {
  constructor(integration: string) {
    super(`${integration} credentials are missing. Please configure your integration settings.`)
  }
}

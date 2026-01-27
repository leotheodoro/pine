'use client'

import { Loader2, Plus, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { updateProfileAction } from '@/app/dashboard/settings/actions'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useFormState } from '@/hooks/use-form-state'
import { useProfile } from '@/hooks/use-profile'

interface Repository {
  provider: 'bitbucket' | 'azure'
  identifier: string
}

interface UserProfile {
  name: string
  email: string
  bitbucket_email?: string
  bitbucket_api_token?: string
  bitbucket_workspace?: string
  azure_devops_org?: string
  azure_devops_pat?: string
  azure_devops_project?: string
  repositories?: Repository[]
}

export function SettingsForm() {
  const { data: profile, isLoading } = useProfile()
  const router = useRouter()
  const [repositories, setRepositories] = useState<Repository[]>([])

  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(updateProfileAction, () => {
    toast.success('Settings updated successfully')
    router.refresh()
  })

  useEffect(() => {
    if (success === false && message) {
      toast.error(message)
    }
  }, [success, message])

  useEffect(() => {
    if (profile?.user) {
      const user = profile.user as unknown as UserProfile
      if (user.repositories) {
        setRepositories(user.repositories)
      }
    }
  }, [profile])

  if (isLoading) {
    return <div>Loading...</div>
  }

  const user = profile?.user as unknown as UserProfile

  const handleAddRepository = () => {
    setRepositories([...repositories, { provider: 'bitbucket', identifier: '' }])
  }

  const handleRemoveRepository = (index: number) => {
    setRepositories(repositories.filter((_, i) => i !== index))
  }

  const handleRepositoryChange = (index: number, field: keyof Repository, value: string) => {
    const newRepositories = [...repositories]
    newRepositories[index] = { ...newRepositories[index], [field]: value }
    setRepositories(newRepositories)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {success === false && message && (
        <Alert variant="destructive">
          <AlertTitle>Save failed!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      {repositories.map((repo, index) => (
        <div key={index} className="hidden">
          <input name={`repositories[${index}][provider]`} value={repo.provider} readOnly />
          <input name={`repositories[${index}][identifier]`} value={repo.identifier} readOnly />
        </div>
      ))}

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={user?.name} placeholder="Your name" />
            {errors?.name && <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.name[0]}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              defaultValue={user?.email}
              placeholder="Your email"
              readOnly
              className="bg-muted"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bitbucket Configuration</CardTitle>
          <CardDescription>Enter your Bitbucket credentials and workspace details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="bitbucket_email">Bitbucket Email</Label>
            <Input
              id="bitbucket_email"
              name="bitbucket_email"
              defaultValue={user?.bitbucket_email}
              placeholder="bitbucket@example.com"
            />
            {errors?.bitbucket_email && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.bitbucket_email[0]}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bitbucket_api_token">Bitbucket API Token</Label>
            <Input
              id="bitbucket_api_token"
              name="bitbucket_api_token"
              type="password"
              defaultValue={user?.bitbucket_api_token}
              placeholder="Your API Token"
            />
            {errors?.bitbucket_api_token && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.bitbucket_api_token[0]}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bitbucket_workspace">Bitbucket Workspace</Label>
            <Input
              id="bitbucket_workspace"
              name="bitbucket_workspace"
              defaultValue={user?.bitbucket_workspace}
              placeholder="Workspace ID"
            />
            {errors?.bitbucket_workspace && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.bitbucket_workspace[0]}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Azure DevOps Configuration</CardTitle>
          <CardDescription>Enter your Azure DevOps organization and project details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="azure_devops_org">Organization</Label>
            <Input
              id="azure_devops_org"
              name="azure_devops_org"
              defaultValue={user?.azure_devops_org}
              placeholder="Organization Name"
            />
            {errors?.azure_devops_org && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.azure_devops_org[0]}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="azure_devops_pat">Personal Access Token (PAT)</Label>
            <Input
              id="azure_devops_pat"
              name="azure_devops_pat"
              type="password"
              defaultValue={user?.azure_devops_pat}
              placeholder="Your PAT"
            />
            {errors?.azure_devops_pat && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.azure_devops_pat[0]}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="azure_devops_project">Project</Label>
            <Input
              id="azure_devops_project"
              name="azure_devops_project"
              defaultValue={user?.azure_devops_project}
              placeholder="Project Name"
            />
            {errors?.azure_devops_project && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.azure_devops_project[0]}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Repositories</CardTitle>
          <CardDescription>Manage your repositories.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {repositories.map((repo, index) => (
            <div key={index} className="flex items-end gap-2">
              <div className="grid gap-2 flex-1 min-w-0">
                <Label>Provider</Label>
                <Select
                  value={repo.provider}
                  onValueChange={(value) => handleRepositoryChange(index, 'provider', value as 'bitbucket' | 'azure')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bitbucket">Bitbucket</SelectItem>
                    <SelectItem value="azure">Azure DevOps</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2 flex-1 min-w-0">
                <Label>Identifier (Slug/Name)</Label>
                <Input
                  value={repo.identifier}
                  onChange={(e) => handleRepositoryChange(index, 'identifier', e.target.value)}
                  placeholder="e.g. project/repo"
                />
              </div>
              <Button type="button" variant="destructive" size="icon" onClick={() => handleRemoveRepository(index)}>
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={handleAddRepository} className="w-full">
            <Plus className="mr-2 size-4" /> Add Repository
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
          {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}

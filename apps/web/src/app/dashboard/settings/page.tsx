import { SettingsForm } from '@/components/settings-form'
import { Separator } from '@/components/ui/separator'

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 p-10 pb-16 block">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings and set up integrations.</p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8">
        <div className="flex-1">
          <SettingsForm />
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    organizationName: "Proto",
    timezone: "UTC",
    aiModule: "gpt-4",
    smtpHost: "smtp.example.com",
    smtpPort: "587",
    smtpUser: "user@example.com",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle settings update
    console.log("Settings updated:", settings)
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-foreground">Global Settings</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <form onSubmit={handleSubmit} className="space-y-8 p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-medium text-foreground">Organization Settings</h2>
              <p className="text-sm text-muted-foreground">
                Configure your organization's basic information.
              </p>
            </div>
            
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="organizationName">Organization Name</Label>
                <Input
                  id="organizationName"
                  value={settings.organizationName}
                  onChange={(e) =>
                    setSettings({ ...settings, organizationName: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={settings.timezone}
                  onValueChange={(value) =>
                    setSettings({ ...settings, timezone: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="EST">EST</SelectItem>
                    <SelectItem value="PST">PST</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-medium text-foreground">AI Configuration</h2>
              <p className="text-sm text-muted-foreground">
                Select which AI model to use for content generation.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="aiModule">AI Module</Label>
                <Select
                  value={settings.aiModule}
                  onValueChange={(value) =>
                    setSettings({ ...settings, aiModule: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
                    <SelectItem value="claude">Claude</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-medium text-foreground">Email Settings</h2>
              <p className="text-sm text-muted-foreground">
                Configure your SMTP settings for sending newsletters.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="smtpHost">SMTP Host</Label>
                <Input
                  id="smtpHost"
                  value={settings.smtpHost}
                  onChange={(e) =>
                    setSettings({ ...settings, smtpHost: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="smtpPort">SMTP Port</Label>
                <Input
                  id="smtpPort"
                  value={settings.smtpPort}
                  onChange={(e) =>
                    setSettings({ ...settings, smtpPort: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="smtpUser">SMTP Username</Label>
                <Input
                  id="smtpUser"
                  value={settings.smtpUser}
                  onChange={(e) =>
                    setSettings({ ...settings, smtpUser: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  )
} 
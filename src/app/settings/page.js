"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    apiKey: "sk-•••••••••••••••••••••••••••••••",
    emailSender: "notifications@proto.ai",
    signature: "The Proto AI Team",
    enableWeeklyDigest: true,
    enableErrorAlerts: true,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Save settings
    alert("Settings saved!")
  }

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-light tracking-tight mb-2">Global Settings</h1>
        <p className="text-gray-400">Manage application settings and preferences</p>
      </div>

      <div className="bg-[#111] rounded-lg border border-gray-800 p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-xl font-light">API Configuration</h2>
            
            <div className="space-y-3">
              <Label htmlFor="apiKey" className="text-white">OpenAI API Key</Label>
              <Input
                id="apiKey"
                value={formData.apiKey}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                className="bg-[#181818] border-gray-700 text-white"
              />
              <p className="text-sm text-gray-400">Your OpenAI API key for content generation</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-xl font-light">Email Settings</h2>
            
            <div className="space-y-3">
              <Label htmlFor="emailSender" className="text-white">Email Sender</Label>
              <Input
                id="emailSender"
                value={formData.emailSender}
                onChange={(e) => setFormData({ ...formData, emailSender: e.target.value })}
                className="bg-[#181818] border-gray-700 text-white"
              />
              <p className="text-sm text-gray-400">The email address that will be used to send newsletters</p>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="signature" className="text-white">Email Signature</Label>
              <Textarea
                id="signature"
                value={formData.signature}
                onChange={(e) => setFormData({ ...formData, signature: e.target.value })}
                className="bg-[#181818] border-gray-700 text-white"
                rows={3}
              />
              <p className="text-sm text-gray-400">Signature to append to the end of each email</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-xl font-light">Notifications</h2>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weeklyDigest" className="text-white">Weekly Digest</Label>
                <p className="text-sm text-gray-400">Receive a weekly summary of insights</p>
              </div>
              <Switch
                id="weeklyDigest"
                checked={formData.enableWeeklyDigest}
                onCheckedChange={(checked) => setFormData({ ...formData, enableWeeklyDigest: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="errorAlerts" className="text-white">Error Alerts</Label>
                <p className="text-sm text-gray-400">Get notified when scraping jobs fail</p>
              </div>
              <Switch
                id="errorAlerts"
                checked={formData.enableErrorAlerts}
                onCheckedChange={(checked) => setFormData({ ...formData, enableErrorAlerts: checked })}
              />
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button 
              type="submit"
              className="bg-white text-black hover:bg-gray-200 font-light"
            >
              Save Settings
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 
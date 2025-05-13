"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function NewsletterScheduleForm({ projectId, initialData, onSubmit }) {
  const [formData, setFormData] = useState({
    frequency: 'weekly',
    time: '09:00',
    days: ['monday'],
    active: true,
    ...initialData
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  const toggleDay = (day) => {
    if (formData.days.includes(day)) {
      setFormData({
        ...formData,
        days: formData.days.filter(d => d !== day)
      });
    } else {
      setFormData({
        ...formData,
        days: [...formData.days, day]
      });
    }
  };
  
  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const daysOfMonth = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="frequency" className="text-gray-300 font-light">Frequency</Label>
        <RadioGroup 
          value={formData.frequency} 
          onValueChange={(value) => setFormData({...formData, frequency: value})}
          className="flex flex-col space-y-2 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="daily" id="daily" />
            <Label htmlFor="daily" className="text-white">Daily</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="weekly" id="weekly" />
            <Label htmlFor="weekly" className="text-white">Weekly</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="monthly" id="monthly" />
            <Label htmlFor="monthly" className="text-white">Monthly</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="custom" id="custom" />
            <Label htmlFor="custom" className="text-white">Custom</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div>
        <Label htmlFor="time" className="text-gray-300 font-light">Time</Label>
        <Input
          type="time"
          id="time"
          value={formData.time}
          onChange={(e) => setFormData({...formData, time: e.target.value})}
          className="bg-[#111] border border-gray-800 text-white mt-2"
        />
      </div>
      
      {formData.frequency === 'weekly' && (
        <div>
          <Label className="text-gray-300 font-light">Days of Week</Label>
          <div className="grid grid-cols-7 gap-2 mt-2">
            {daysOfWeek.map(day => (
              <Button
                key={day}
                type="button"
                className={`capitalize ${formData.days.includes(day) ? 'bg-blue-600' : 'bg-gray-800'}`}
                onClick={() => toggleDay(day)}
              >
                {day.substring(0, 1)}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {formData.frequency === 'monthly' && (
        <div>
          <Label className="text-gray-300 font-light">Days of Month</Label>
          <div className="grid grid-cols-7 gap-2 mt-2 max-h-48 overflow-y-auto">
            {daysOfMonth.map(day => (
              <Button
                key={day}
                type="button"
                className={`${formData.days.includes(day) ? 'bg-blue-600' : 'bg-gray-800'}`}
                onClick={() => toggleDay(day)}
              >
                {day}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {formData.frequency === 'custom' && (
        <div className="space-y-4">
          <div>
            <Label className="text-gray-300 font-light">Custom Schedule</Label>
            <p className="text-sm text-gray-400 mt-1">
              For custom schedules, please specify the days in the weekly section.
              You can select multiple days for a custom schedule.
            </p>
          </div>
          
          <div>
            <Label className="text-gray-300 font-light">Days of Week</Label>
            <div className="grid grid-cols-7 gap-2 mt-2">
              {daysOfWeek.map(day => (
                <Button
                  key={day}
                  type="button"
                  className={`capitalize ${formData.days.includes(day) ? 'bg-blue-600' : 'bg-gray-800'}`}
                  onClick={() => toggleDay(day)}
                >
                  {day.substring(0, 1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        <Switch
          id="active"
          checked={formData.active}
          onCheckedChange={(checked) => setFormData({...formData, active: checked})}
        />
        <Label htmlFor="active" className="text-white">Enable automatic scheduling</Label>
      </div>
      
      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
        Save Schedule
      </Button>
    </form>
  );
}

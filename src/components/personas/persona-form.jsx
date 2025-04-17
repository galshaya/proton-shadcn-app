'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { personasApi } from '@/lib/apiClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { ReloadIcon } from '@radix-ui/react-icons';

export function PersonaForm({ id }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingPersona, setLoadingPersona] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    prompt: ''
  });
  const isEditing = !!id;

  // Load persona data if editing
  useEffect(() => {
    if (isEditing) {
      const loadPersona = async () => {
        try {
          setLoadingPersona(true);
          setError(null);
          const data = await personasApi.getById(id);
          setFormData({
            name: data.name || '',
            description: data.description || '',
            prompt: data.prompt || ''
          });
        } catch (err) {
          console.error('Failed to load persona:', err);
          setError(err.message || 'Failed to load persona');
          toast({
            variant: 'destructive',
            title: 'Error',
            description: `Failed to load persona: ${err.message}`,
          });
        } finally {
          setLoadingPersona(false);
        }
      };

      loadPersona();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Validate form
      if (!formData.name.trim()) {
        throw new Error('Name is required');
      }
      
      if (!formData.prompt.trim()) {
        throw new Error('Prompt is required');
      }
      
      // Submit form
      if (isEditing) {
        await personasApi.update(id, formData);
        toast({
          title: 'Success',
          description: 'Persona updated successfully',
        });
      } else {
        await personasApi.create(formData);
        toast({
          title: 'Success',
          description: 'Persona created successfully',
        });
      }
      
      // Redirect to personas list
      router.push('/personas');
    } catch (err) {
      console.error('Failed to save persona:', err);
      setError(err.message || 'Failed to save persona');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to save persona: ${err.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingPersona) {
    return (
      <div className="flex items-center justify-center py-10">
        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
        Loading persona...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Persona' : 'Create Persona'}</CardTitle>
          <CardDescription>
            {isEditing 
              ? 'Update the details of your persona' 
              : 'Configure a new persona to customize newsletter generation'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md">
              <p className="font-semibold">Error:</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Growth Marketer"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g., High-level overview focused on trends"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt *</Label>
            <Textarea
              id="prompt"
              name="prompt"
              value={formData.prompt}
              onChange={handleChange}
              placeholder="e.g., Summarize key industry shifts with a growth marketing focus"
              rows={5}
              required
            />
            <p className="text-sm text-muted-foreground">
              This prompt will be used to guide the AI when generating newsletters with this persona.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/personas')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Update Persona' : 'Create Persona'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

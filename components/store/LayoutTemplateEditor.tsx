'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle, GripVertical, Eye, EyeOff } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { LayoutTemplate, useLayoutStore } from '@/lib/store/layout-store';

interface LayoutTemplateEditorProps {
  templateId?: string;
  onSave?: () => void;
}

export function LayoutTemplateEditor({ templateId, onSave }: LayoutTemplateEditorProps) {
  const { templates, addTemplate, updateTemplate } = useLayoutStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const template = templateId 
    ? templates.find(t => t.id === templateId)
    : {
        name: '',
        sections: [
          { id: 'title', type: 'title', visible: true, order: 0 },
          { id: 'description', type: 'description', visible: true, order: 1 },
          { id: 'pricing', type: 'pricing', visible: true, order: 2 },
          { id: 'gallery', type: 'gallery', visible: true, order: 3 },
          { id: 'specs', type: 'specs', visible: true, order: 4 },
          { id: 'reviews', type: 'reviews', visible: true, order: 5 }
        ]
      };

  const [formData, setFormData] = useState<Partial<LayoutTemplate>>(template);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const sections = Array.from(formData.sections || []);
    const [removed] = sections.splice(result.source.index, 1);
    sections.splice(result.destination.index, 0, removed);

    // Update order values
    const updatedSections = sections.map((section, index) => ({
      ...section,
      order: index
    }));

    setFormData({ ...formData, sections: updatedSections });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.name) {
        throw new Error('Template name is required');
      }

      if (templateId) {
        updateTemplate(templateId, formData);
      } else {
        addTemplate(formData as Omit<LayoutTemplate, 'id'>);
      }

      toast({
        title: 'Success',
        description: `Template ${templateId ? 'updated' : 'created'} successfully`,
      });

      onSave?.();
    } catch (error) {
      console.error('Failed to save template:', error);
      setError(error instanceof Error ? error.message : 'Failed to save template');
    } finally {
      setLoading(false);
    }
  };

  const toggleSectionVisibility = (sectionId: string) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections?.map(section =>
        section.id === sectionId
          ? { ...section, visible: !section.visible }
          : section
      )
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Template Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Default Layout"
              required
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Section Order</h3>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="sections">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {formData.sections?.sort((a, b) => a.order - b.order).map((section, index) => (
                      <Draggable
                        key={section.id}
                        draggableId={section.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`flex items-center justify-between p-3 rounded-lg border ${
                              snapshot.isDragging ? 'bg-accent' : 'bg-card'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                {...provided.dragHandleProps}
                                className="cursor-grab"
                              >
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <span className="capitalize">{section.type}</span>
                            </div>
                            <Switch
                              checked={section.visible}
                              onCheckedChange={() => toggleSectionVisibility(section.id)}
                              aria-label={`Toggle ${section.type} visibility`}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {templateId ? 'Update Template' : 'Create Template'}
        </Button>
      </div>
    </form>
  );
}
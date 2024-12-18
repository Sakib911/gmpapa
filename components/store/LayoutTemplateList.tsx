'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Check } from 'lucide-react';
import { useLayoutStore } from '@/lib/store/layout-store';
import { LayoutTemplateEditor } from './LayoutTemplateEditor';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function LayoutTemplateList() {
  const { templates, activeTemplate, deleteTemplate, setActiveTemplate } = useLayoutStore();
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [isNewTemplateDialogOpen, setIsNewTemplateDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Layout Templates</h2>
        <Dialog open={isNewTemplateDialogOpen} onOpenChange={setIsNewTemplateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Template</DialogTitle>
              <DialogDescription>
                Create a new layout template for your products
              </DialogDescription>
            </DialogHeader>
            <LayoutTemplateEditor
              onSave={() => setIsNewTemplateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id} className="relative">
            {template.id === activeTemplate && (
              <div className="absolute -top-2 -right-2">
                <Badge className="bg-green-500">
                  <Check className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle>{template.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  {template.sections.map((section) => (
                    <div
                      key={section.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="capitalize">{section.type}</span>
                      <Badge variant={section.visible ? 'default' : 'secondary'}>
                        {section.visible ? 'Visible' : 'Hidden'}
                      </Badge>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingTemplate(template.id)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Template</DialogTitle>
                        <DialogDescription>
                          Modify your layout template settings
                        </DialogDescription>
                      </DialogHeader>
                      <LayoutTemplateEditor
                        templateId={template.id}
                        onSave={() => setEditingTemplate(null)}
                      />
                    </DialogContent>
                  </Dialog>

                  <div className="space-x-2">
                    {template.id !== activeTemplate && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveTemplate(template.id)}
                      >
                        Set Active
                      </Button>
                    )}

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="px-3"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Template</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this template? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteTemplate(template.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {templates.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No templates created yet</p>
            <Button
              variant="outline"
              onClick={() => setIsNewTemplateDialogOpen(true)}
              className="mt-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Template
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle, Palette, RotateCcw } from 'lucide-react';
import { useThemeStore } from '@/lib/store/theme-store';

interface ThemeCustomizerProps {
  onSave: (theme: any) => Promise<void>;
}

export function ThemeCustomizer({ onSave }: ThemeCustomizerProps) {
  const { colors, setColor, resetColors, generatePalette } = useThemeStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSave(colors);
      toast({
        title: 'Success',
        description: 'Theme settings saved successfully',
      });
    } catch (error) {
      console.error('Failed to save theme:', error);
      setError(error instanceof Error ? error.message : 'Failed to save theme');
    } finally {
      setLoading(false);
    }
  };

  const handleColorChange = (key: keyof typeof colors, value: string) => {
    if (key === 'primary') {
      generatePalette(value);
    } else {
      setColor(key, value);
    }
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
          <div className="flex items-center justify-between">
            <CardTitle>Theme Colors</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={resetColors}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(colors).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label className="capitalize">{key}</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={value}
                    onChange={(e) => handleColorChange(key as keyof typeof colors, e.target.value)}
                    className="w-12 p-1 h-10"
                  />
                  <Input
                    type="text"
                    value={value}
                    onChange={(e) => handleColorChange(key as keyof typeof colors, e.target.value)}
                    pattern="^#[0-9A-Fa-f]{6}$"
                    className="flex-1 font-mono"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Preview</h3>
            <div 
              className="p-6 rounded-lg border"
              style={{ backgroundColor: colors.background }}
            >
              <div className="space-y-4">
                <Button
                  style={{ 
                    backgroundColor: colors.primary,
                    color: colors.text
                  }}
                >
                  Primary Button
                </Button>
                <Button
                  variant="outline"
                  style={{ 
                    borderColor: colors.secondary,
                    color: colors.secondary
                  }}
                >
                  Secondary Button
                </Button>
                <div 
                  className="p-4 rounded-lg"
                  style={{ 
                    backgroundColor: colors.accent + '20',
                    color: colors.accent
                  }}
                >
                  Accent Element
                </div>
                <p style={{ color: colors.text }}>
                  Regular text content
                </p>
                <p style={{ color: colors.muted }}>
                  Muted text content
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Theme
        </Button>
      </div>
    </form>
  );
}
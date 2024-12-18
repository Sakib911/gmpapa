'use client';

import { LayoutTemplateList } from '@/components/store/LayoutTemplateList';

export default function StoreLayoutPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Layout Templates</h1>
        <p className="text-muted-foreground">
          Create and manage product layout templates for your store
        </p>
      </div>

      <LayoutTemplateList />
    </div>
  );
}
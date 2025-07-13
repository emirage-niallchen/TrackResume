"use client";

import { CustomFieldList } from "@/components/CustomFields/CustomFieldList";
import { CustomFieldForm } from "@/components/CustomFields/CustomFieldForm";

export default function CustomFieldsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">自定义字段管理</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">添加字段</h2>
          <CustomFieldForm
            onSubmit={async (data) => {
              await fetch("/api/custom-fields", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
              });
            }}
          />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">字段列表</h2>
          <CustomFieldList />
        </div>
      </div>
    </div>
  );
} 
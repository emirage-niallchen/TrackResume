import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomField } from "@/lib/types";

export function CustomFieldsDisplay({ fields }: { fields: CustomField[] }) {
  if (!fields || fields.length === 0) {
    return (
      <section className="py-16" id="custom-fields">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">自定义字段</h2>
          <div className="text-center text-muted-foreground py-8">
            暂无自定义字段
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16" id="custom-fields">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">自定义字段</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fields.map((field) => (
            <Card key={field.id}>
              <CardHeader>
                <CardTitle>{field.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{field.value}</p>
                {field.description && <p className="text-muted-foreground">{field.description}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
} 
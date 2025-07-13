import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AboutSection({ data }: { data: { title: string; description: string } }) {
  return (
    <section className="py-16" id="about">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">关于我</h2>
        <Card>
          <CardHeader>
            <CardTitle>{data.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line">{data.description}</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
} 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Location } from "@prisma/client";


export function LocationMap({ location }: { location: Location }) {
  return (
    <section className="py-16" id="location">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">位置</h2>
        <Card>
          <CardHeader>
            <CardTitle>地图位置</CardTitle>
          </CardHeader>
          <CardContent>
            <p>地址: {location.address}</p>
            <p>描述: {location.description}</p>
            {/* 这里可以嵌入地图组件 */}
          </CardContent>
        </Card>
      </div>
    </section>
  );
} 
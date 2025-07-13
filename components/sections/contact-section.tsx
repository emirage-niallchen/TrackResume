import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactForm } from "@/components/ContactForm";
import { ContactInfo } from "@/components/ContactInfo";

export function ContactSection() {
  return (
    <section className="py-16" id="contact">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">联系我</h2>
        <Card>
          <CardHeader>
            <CardTitle>联系方式</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <ContactForm />
              </div>
              <div className="space-y-4">
                <ContactInfo />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
} 
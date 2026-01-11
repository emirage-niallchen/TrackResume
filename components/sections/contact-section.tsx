import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactForm } from "@/components/ContactForm";
import { ContactInfo } from "@/components/ContactInfo";
import { useTranslation } from "react-i18next";

export function ContactSection() {
  const { t } = useTranslation();
  return (
    <section className="py-16" id="contact">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">{t('home.section.contact')}</h2>
        <Card>
          <CardHeader>
            <CardTitle>{t('home.label.contactInfo')}</CardTitle>
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
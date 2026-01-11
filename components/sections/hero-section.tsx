import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Admin, CustomField } from "@prisma/client";
import Image from "next/image";
import type { FileVO } from "@/lib/types";
import { FileDownloads } from "./file-downloads";

export function HeroSection({ adminData, customFields, files }: { adminData: Admin, customFields: CustomField[], files: FileVO[] }) {
  return (
    <section className="relative bg-gradient-to-r from-primary/20 to-primary/5 py-24 overflow-hidden">
      {/* 背景图层 */}
      {adminData.background && adminData.background.trim() !== "" && (
        <Image
          src={adminData.background}
          alt=""
          fill
          className="object-cover object-center w-full h-full blur-sm"
          priority
          aria-hidden="true"
        />
      )}

      {/* 内容层 */}
      <div className="relative container mx-auto px-4 flex flex-col md:flex-row items-center gap-8 z-10">
        <Avatar className="w-32 h-32 md:w-48 md:h-48 border-4 border-primary/20">
          <AvatarImage
            src={adminData.avatar && adminData.avatar.trim() !== "" ? adminData.avatar : undefined}
          />
          <AvatarFallback>{adminData.name?.substring(0, 2) || "CV"}</AvatarFallback>
        </Avatar>

        <div className="space-y-4">
          <h2 className="text-4xl md:text-6xl font-bold">{adminData.name || "简历"}</h2>
          <p
            className="text-lg md:text-xl text-muted-foreground whitespace-pre-line indent-8 drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]"
            dangerouslySetInnerHTML={{
              __html: `&emsp;${adminData.description?.replace(/\n/g, '<br>') || ''}`
            }}
          />

          {/* <div className="flex gap-4">
            {adminData.email && adminData.email.trim() !== "" && (
              <Card className="inline-flex items-center px-4 py-2">
                <CardContent className="p-0">
                  {`个人邮箱：` + adminData.email}
                </CardContent>
              </Card>
            )}
          </div> */}

          {/* Custom Fields: card, text, link */}
          {(() => {
            // 先排序
            const sortedFields = [...(customFields || [])].sort((a, b) => {
              const order: Record<'card' | 'text' | 'link', number> = { card: 0, text: 1, link: 2 };
              return (order[a.type as 'card' | 'text' | 'link'] ?? 99) - (order[b.type as 'card' | 'text' | 'link'] ?? 99);
            });
            const cardFields = sortedFields.filter(f => f.type === 'card');
            const textFields = sortedFields.filter(f => f.type === 'text');
            const linkFields = sortedFields.filter(f => f.type === 'link');
            return (
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {/* card 类型 */}
                {cardFields.map(field => (
                  <Card key={field.id} className="inline-flex items-center px-4 py-2">
                    <CardContent className="p-0">
                      {field.value}
                    </CardContent>
                  </Card>
                ))}
                {cardFields.length > 0 && <div className="w-full h-0" />}
                {/* text 类型 */}
                {textFields.map(field => (
                  <div key={field.id} className="flex items-center space-x-1 px-4 py-2">
                    <span className="font-semibold">{field.label}：</span>
                    <span>{field.value}</span>
                  </div>
                ))}
                {textFields.length > 0 && <div className="w-full h-0" />}
                {/* link 类型 */}
                {linkFields.map(field => (
                  <div key={field.id} className="flex items-center space-x-1 px-4 py-2">
                    <span className="font-semibold">{field.label}：</span>
                    <a
                      href={field.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline break-all"
                    >
                      {field.value}
                    </a>
                  </div>
                ))}
              </div>
            );
          })()}

          <div className="w-full flex justify-center flex-wrap mt-8 z-10">
            <FileDownloads files={files || []} />
          </div>
        </div>

      </div>

    </section>
  );
} 
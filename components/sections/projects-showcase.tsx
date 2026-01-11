import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { ProjectVO } from "@/app/api/projects/route";
import { useTranslation } from "react-i18next";

export function ProjectsShowcase({ projects }: { projects: ProjectVO[] }) {
  const { t, i18n } = useTranslation();
  const handleViewDetail = (projectId: string) => {
    window.open(`/projects/${projectId}/detail`, '_blank');
  };

  if (!Array.isArray(projects) || projects.length === 0) {
    return (
      <section className="py-16" id="projects">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">{t('home.section.projects')}</h2>
          <div className="text-center text-muted-foreground py-8">
            {t('home.empty.projects')}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16" id="projects">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">{t('home.section.projects')}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden h-full flex flex-col">
              <CardHeader className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 z-10 flex items-center gap-2"
                  onClick={() => handleViewDetail(project.id)}
                >
                  <FileText className="h-4 w-4" />
                  <span>{t('home.label.detail')}</span>
                </Button>
                <CardTitle className="text-2xl">{project.name}</CardTitle>
                {project.jobRole && (
                  <div className="text-lg font-medium">
                    {t('home.label.projectRole')}
                    {project.jobRole}
                  </div>
                )}
                {(project.startTime || project.endTime) && (
                  <div className="text-sm text-muted-foreground">
                    {t('home.label.projectDuration')}
                    {project.startTime &&
                      format(
                        new Date(project.startTime),
                        i18n.resolvedLanguage === 'en' ? 'MMM yyyy' : 'yyyy-MM'
                      )}
                    {project.endTime
                      ? ` ${t('home.label.to')} ${format(
                          new Date(project.endTime),
                          i18n.resolvedLanguage === 'en' ? 'MMM yyyy' : 'yyyy-MM'
                        )}`
                      : ` ${t('home.label.present')}`}
                  </div>
                )}
              </CardHeader>

              {project.images.length > 0 && (
                <Carousel className="w-full">
                  <CarouselContent>
                    {project.images.map((image) => (
                      <CarouselItem key={image.id}>
                        <div
                          className="relative aspect-video cursor-pointer group"
                          onClick={() => handleViewDetail(project.id)}
                        >
                          <Image
                            src={image.path}
                            alt={image.alt || project.name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowUpRight className="h-4 w-4" />
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              )}

              <CardContent className="pt-6">

                {project.jobTech && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">{t('home.label.techSelection')}</h4>
                    <p className="line-clamp-2">{project.jobTech}</p>
                  </div>
                )}

                <CardDescription className="text-base whitespace-pre-line line-clamp-5">
                  {project.description}
                </CardDescription>

              </CardContent>



              {project.links.length > 0 && (
                <CardFooter className="flex flex-wrap gap-3">
                  {project.links.map((link) => (
                    <Button
                      key={link.id}
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        {link.label}
                      </a>
                    </Button>
                  ))}
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
} 
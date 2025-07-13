import { Github, Heart } from "lucide-react";
import Link from "next/link";

export const FooterSection = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t py-6 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="flex items-center space-x-2">
            <span>Powered by</span>
            <Link 
              href="https://nextjs.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Next.js
            </Link>
            <span>and</span>
            <Link 
              href="https://github.com/shadcn-ui/ui" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              shadcn/ui
            </Link>
          </div>
          
          <div className="flex items-center space-x-2">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500" />
            Artithm
            <span>by</span>
            <Link 
              href="https://github.com/emirage-niallchen/cv" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center space-x-1"
            >
              <Github className="h-4 w-4" />
              <span>Emirage</span>
            </Link>
          </div>

          <div className="text-sm text-muted-foreground">
            © {currentYear} All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}; 
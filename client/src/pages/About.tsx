import { useApp } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User } from 'lucide-react';
import { Link } from 'wouter';

export default function About() {
  const { t } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h2 className="text-2xl font-heading font-bold">{t.about.title}</h2>
      </div>

      <Card className="p-8 border-none bg-white dark:bg-card shadow-lg rounded-3xl flex flex-col items-center text-center space-y-6">
        <div className="h-24 w-24 bg-gradient-to-br from-primary to-blue-300 rounded-full flex items-center justify-center shadow-xl shadow-primary/20">
          <User className="h-10 w-10 text-white" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-bold">{t.appTitle}</h3>
          <p className="text-sm text-primary font-medium bg-primary/10 py-1 px-3 rounded-full inline-block">
            {t.about.version}
          </p>
        </div>

        <p className="text-muted-foreground leading-relaxed max-w-xs">
          {t.about.description}
        </p>

        <div className="pt-6 w-full">
          <Button className="w-full rounded-xl" variant="outline">
            Check for Updates
          </Button>
        </div>
      </Card>
    </div>
  );
}

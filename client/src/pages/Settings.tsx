import { useApp } from '@/lib/store';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChevronRight, Globe, Wifi, Info, FlaskConical, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { cn } from '@/lib/utils';

export default function Settings() {
  const { t, fakeMode, toggleFakeMode, language, setLanguage } = useApp();

  const SettingsItem = ({ 
    icon: Icon, 
    label, 
    action, 
    isDestructive = false 
  }: { 
    icon: any, 
    label: string, 
    action: React.ReactNode,
    isDestructive?: boolean 
  }) => (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-card rounded-2xl border border-border/50 shadow-sm hover:border-primary/20 transition-colors">
      <div className="flex items-center gap-3">
        <div className={cn(
          "p-2 rounded-xl",
          isDestructive ? "bg-red-50 text-red-500" : "bg-slate-50 dark:bg-slate-800 text-primary"
        )}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="font-medium text-foreground">{label}</span>
      </div>
      {action}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h2 className="text-2xl font-heading font-bold">{t.settings.title}</h2>
      </div>

      <div className="space-y-3">
        <SettingsItem
          icon={FlaskConical}
          label={t.settings.fakeMode}
          action={
            <Switch checked={fakeMode} onCheckedChange={toggleFakeMode} />
          }
        />

        <Dialog>
          <DialogTrigger asChild>
             <div className="cursor-pointer">
               <SettingsItem
                 icon={Globe}
                 label={t.settings.language}
                 action={
                   <div className="flex items-center gap-2 text-muted-foreground">
                     <span className="text-sm">{language === 'MN' ? 'Монгол' : 'English'}</span>
                     <ChevronRight className="h-4 w-4" />
                   </div>
                 }
               />
             </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle>{t.settings.changeLanguage}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-2 py-4">
              <Button 
                variant={language === 'MN' ? 'default' : 'outline'} 
                onClick={() => setLanguage('MN')}
                className="justify-start h-12 text-lg rounded-xl"
              >
                🇲🇳 Монгол
              </Button>
              <Button 
                variant={language === 'EN' ? 'default' : 'outline'} 
                onClick={() => setLanguage('EN')}
                className="justify-start h-12 text-lg rounded-xl"
              >
                🇺🇸 English
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <SettingsItem
          icon={Wifi}
          label={t.settings.reconnect}
          action={
            <Button variant="ghost" size="sm">
               {t.settings.sendWifi}
            </Button>
          }
        />

        <Link href="/about">
          <div className="cursor-pointer">
             <SettingsItem
               icon={Info}
               label={t.settings.aboutDev}
               action={<ChevronRight className="h-4 w-4 text-muted-foreground" />}
             />
          </div>
        </Link>
      </div>
    </div>
  );
}

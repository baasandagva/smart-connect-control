import { Link, useLocation } from 'wouter';
import { useApp } from '@/lib/store';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Settings, Info, Wifi, Home as HomeIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function Layout({ children }: { children: React.ReactNode }) {
  const { t, connectionStatus } = useApp();
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: HomeIcon, label: t.menu.connect, path: '/' }, // Reuse connect label for home
    { icon: Settings, label: t.menu.settings, path: '/settings' },
    { icon: Info, label: t.menu.about, path: '/about' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-border/40 px-4 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="-ml-2">
                <Menu className="h-6 w-6 text-foreground" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0 border-r-0">
              <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900">
                <SheetHeader className="p-6 text-left border-b">
                  <SheetTitle className="text-2xl font-heading font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    {t.appTitle}
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex-1 p-4 space-y-2">
                  {menuItems.map((item) => (
                    <Link key={item.path} href={item.path}>
                      <a 
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                          location === item.path 
                            ? "bg-primary/10 text-primary" 
                            : "text-muted-foreground hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </a>
                    </Link>
                  ))}
                </nav>
                <div className="p-4 border-t text-xs text-center text-muted-foreground">
                   v1.0.0
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <h1 className="text-xl font-heading font-semibold text-foreground tracking-tight">
            {t.appTitle}
          </h1>
        </div>
        
        <div className="flex items-center">
            {/* Status indicator could go here */}
            <div className={cn(
              "h-2.5 w-2.5 rounded-full animate-pulse",
              connectionStatus.includes('No') || connectionStatus.includes('байхгүй') 
                ? "bg-red-500" 
                : "bg-emerald-500"
            )} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container max-w-md mx-auto p-4 md:p-6 pb-24">
        {children}
      </main>
    </div>
  );
}

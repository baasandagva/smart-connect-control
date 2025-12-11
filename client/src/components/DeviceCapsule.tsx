import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Pencil, Trash2, Power } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Device, useApp } from '@/lib/store';

interface DeviceCapsuleProps {
  device: Device;
}

export function DeviceCapsule({ device }: DeviceCapsuleProps) {
  const { toggleDevice, updateDeviceName, removeDevice, t } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(device.name);

  const handleSave = () => {
    if (newName.trim()) {
      updateDeviceName(device.id, newName);
      setIsEditing(false);
    }
  };

  return (
    <>
      <motion.div 
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={cn(
          "relative flex items-center justify-between p-4 mb-3 rounded-2xl transition-all duration-300 shadow-sm",
          device.isOn 
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
            : "bg-white dark:bg-card border border-border text-foreground hover:bg-slate-50 dark:hover:bg-slate-900"
        )}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 shrink-0 rounded-full opacity-60 hover:opacity-100 transition-opacity",
              device.isOn ? "text-primary-foreground hover:bg-primary-foreground/20" : "text-muted-foreground hover:bg-muted"
            )}
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          
          <span className="font-medium text-lg truncate select-none">
            {device.name}
          </span>
        </div>

        <div className="flex items-center gap-2 pl-2">
           {/* Custom Switch wrapper to match the aesthetic */}
           <div className="scale-110">
              <Switch
                checked={device.isOn}
                onCheckedChange={() => toggleDevice(device.id)}
                className={cn(
                  "data-[state=unchecked]:bg-slate-200 dark:data-[state=unchecked]:bg-slate-700",
                  "data-[state=checked]:bg-white/90 data-[state=checked]:opacity-100" // Inverse color when active since container is primary
                )}
                thumbClassName={cn(
                  device.isOn ? "bg-primary" : "bg-white"
                )}
              />
           </div>
        </div>
      </motion.div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>{t.dialogs.rename}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center space-x-2 py-4">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Device Name"
              className="flex-1"
            />
          </div>
          <DialogFooter className="flex-row justify-between sm:justify-between gap-2">
            <Button 
              variant="destructive" 
              size="icon"
              onClick={() => {
                if(confirm(t.dialogs.confirmDelete)) {
                  removeDevice(device.id);
                  setIsEditing(false);
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  {t.dialogs.cancel}
                </Button>
              </DialogClose>
              <Button type="submit" onClick={handleSave}>
                {t.dialogs.save}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

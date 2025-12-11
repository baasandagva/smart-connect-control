import { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { DeviceCapsule } from '@/components/DeviceCapsule';
import { Button } from '@/components/ui/button';
import { QrCode, WifiOff, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';

export default function Home() {
  const { t, devices, connectionStatus, addDevice, fakeMode } = useApp();
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    if (fakeMode) {
      setIsScanning(true);
      setTimeout(() => {
        setIsScanning(false);
        addDevice(`Arzetk ${devices.length + 1}`);
      }, 1500);
    } else {
      alert("Real QR scanning not implemented in web demo");
    }
  };

  const isConnected = !connectionStatus.includes(t.status.noConnection) && !connectionStatus.includes('No connection');

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-6 flex flex-col items-center justify-center bg-white dark:bg-card border-none shadow-sm rounded-3xl text-center space-y-4 min-h-[160px]">
           {isScanning ? (
             <div className="flex flex-col items-center text-primary">
               <Loader2 className="h-10 w-10 animate-spin mb-2" />
               <p className="font-medium animate-pulse">{t.status.connecting}</p>
             </div>
           ) : !isConnected && devices.length === 0 ? (
             <div className="flex flex-col items-center text-muted-foreground">
               <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-3">
                 <WifiOff className="h-8 w-8 text-slate-400" />
               </div>
               <p className="font-medium">{t.status.noConnection}</p>
             </div>
           ) : (
             <div className="flex flex-col items-center">
                <p className="text-lg font-medium text-foreground">{connectionStatus}</p>
                {fakeMode && <p className="text-xs text-muted-foreground mt-1">Simulated Environment</p>}
             </div>
           )}
           
           <Button 
             onClick={handleScan} 
             disabled={isScanning}
             className="w-full max-w-[200px] rounded-xl h-12 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-105 active:scale-95"
           >
             <QrCode className="mr-2 h-5 w-5" />
             {t.home.scanQr}
           </Button>
        </Card>
      </motion.div>

      {/* Device List */}
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-3">
          My Devices
        </h3>
        <AnimatePresence mode="popLayout">
          {devices.map((device) => (
             <DeviceCapsule key={device.id} device={device} />
          ))}
        </AnimatePresence>
        
        {devices.length === 0 && !isScanning && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-center py-12 text-muted-foreground border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl"
          >
            <p>No devices found.</p>
            <p className="text-sm">Scan QR to add a device.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

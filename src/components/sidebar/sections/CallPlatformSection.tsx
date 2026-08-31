import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Video } from 'lucide-react';
import { PlatformIcon } from '@/components/icons/PlatformIcons';
import { CallPlatform } from '@/types/chat';
import { cn } from '@/lib/utils';

interface CallPlatformSectionProps {
  platform: CallPlatform;
  onPlatformChange: (platform: CallPlatform) => void;
}

const callPlatforms: Array<{
  id: CallPlatform;
  name: string;
  color: string;
  activeColor: string;
}> = [
  { id: 'whatsapp', name: 'WhatsApp', color: 'text-[#25d366] border-[#25d366]/30 bg-[#25d366]/10', activeColor: 'bg-[#25d366] border-[#25d366] text-white' },
  { id: 'discord', name: 'Discord', color: 'text-[#5865f2] border-[#5865f2]/30 bg-[#5865f2]/10', activeColor: 'bg-[#5865f2] border-[#5865f2] text-white' },
  { id: 'facetime', name: 'FaceTime', color: 'text-[#34c759] border-[#34c759]/30 bg-[#34c759]/10', activeColor: 'bg-[#34c759] border-[#34c759] text-white' },
  { id: 'zoom', name: 'Zoom', color: 'text-[#2d8cff] border-[#2d8cff]/30 bg-[#2d8cff]/10', activeColor: 'bg-[#2d8cff] border-[#2d8cff] text-white' },
  { id: 'meet', name: 'Google Meet', color: 'text-[#1a73e8] border-[#1a73e8]/30 bg-[#1a73e8]/10', activeColor: 'bg-[#1a73e8] border-[#1a73e8] text-white' },
];

export function CallPlatformSection({ platform, onPlatformChange }: CallPlatformSectionProps) {
  return (
    <AccordionItem value="app" className="border rounded-xl bg-card shadow-sm overflow-hidden">
      <AccordionTrigger className="hover:no-underline px-3 py-3 hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Video className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="text-base font-semibold">Call app</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-3 pb-3 pt-1">
        <div className="grid grid-cols-2 gap-2">
          {callPlatforms.map(item => {
            const active = item.id === platform;
            return (
              <button
                key={item.id}
                onClick={() => onPlatformChange(item.id)}
                className={cn(
                  'h-9 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-colors',
                  item.id === 'meet' && 'col-span-2',
                  active ? item.activeColor : item.color
                )}
              >
                {item.id === 'whatsapp' || item.id === 'discord'
                  ? <PlatformIcon platform={item.id} className="w-4 h-4" />
                  : item.id === 'meet'
                    ? <span className="grid h-4 w-4 grid-cols-2 overflow-hidden rounded-sm"><span className="bg-[#4285f4]" /><span className="bg-[#34a853]" /><span className="bg-[#fbbc04]" /><span className="bg-[#ea4335]" /></span>
                    : <Video className="w-4 h-4" />}
                {item.name}
              </button>
            );
          })}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

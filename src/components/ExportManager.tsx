import { useState } from "react";
import * as htmlToImage from "html-to-image";
import { Download, Copy, Image as ImageIcon, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface Props {
  previewRef: React.RefObject<HTMLDivElement | null>;
  fileName: string;
}

export default function ExportManager({ previewRef, fileName }: Props) {
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  const getSafeFileName = () => {
    return (fileName || "diff").split("/").pop()?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || "diff";
  };

  const handleExport = async (scale: number, format: 'png' | 'svg' = 'png') => {
    if (!previewRef.current) return;
    
    try {
      setIsExporting(true);
      
      const node = previewRef.current;
      const options = {
        pixelRatio: scale,
        skipFonts: false,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        }
      };

      let dataUrl = '';
      if (format === 'svg') {
        dataUrl = await htmlToImage.toSvg(node, options);
      } else {
        dataUrl = await htmlToImage.toPng(node, options);
      }

      const link = document.createElement('a');
      link.download = `${getSafeFileName()}-export.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export failed", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopy = async () => {
    if (!previewRef.current) return;
    
    try {
      setIsExporting(true);
      const blob = await htmlToImage.toBlob(previewRef.current, { pixelRatio: 2 });
      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Copy failed", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleCopy}
        disabled={isExporting}
        className="bg-neutral-900 border-neutral-800 hover:bg-neutral-800 text-neutral-300"
      >
        {copied ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
        {copied ? 'Copied' : 'Copy'}
      </Button>
      
      <Popover>
        <PopoverTrigger className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold h-9 px-3">
            <Download className="w-4 h-4 mr-2" />
            Export
        </PopoverTrigger>
        <PopoverContent align="end" className="w-48 bg-neutral-900 border-neutral-800 p-2">
          <div className="space-y-1">
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider px-2 py-1.5">PNG</p>
            <Button variant="ghost" size="sm" className="w-full justify-start text-neutral-300 hover:text-white hover:bg-neutral-800" onClick={() => handleExport(2)}>
              <ImageIcon className="w-4 h-4 mr-2" /> 2x (Standard)
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start text-neutral-300 hover:text-white hover:bg-neutral-800" onClick={() => handleExport(4)}>
              <ImageIcon className="w-4 h-4 mr-2" /> 4x (High Res)
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start text-neutral-300 hover:text-white hover:bg-neutral-800" onClick={() => handleExport(8)}>
              <ImageIcon className="w-4 h-4 mr-2" /> 8K (Ultra)
            </Button>
            
            <div className="my-1 border-t border-neutral-800"></div>
            
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider px-2 py-1.5">Vector</p>
            <Button variant="ghost" size="sm" className="w-full justify-start text-neutral-300 hover:text-white hover:bg-neutral-800" onClick={() => handleExport(1, 'svg')}>
              <ImageIcon className="w-4 h-4 mr-2" /> SVG
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

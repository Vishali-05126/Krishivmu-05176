'use client';

import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PreviewPanelProps {
  htmlContent: string;
  cssContent: string;
}

export const PreviewPanel: FC<PreviewPanelProps> = ({ htmlContent, cssContent }) => {
  const [srcDoc, setSrcDoc] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (htmlContent.includes('</head>')) {
        setSrcDoc(htmlContent.replace('</head>', `<style>${cssContent}</style></head>`));
      } else {
        // Fallback for HTML without a head tag
        setSrcDoc(`
          <!DOCTYPE html>
          <html>
          <head>
            <style>${cssContent}</style>
          </head>
          <body>
            ${htmlContent}
          </body>
          </html>
        `);
      }
    }, 300); // Debounce to avoid re-rendering on every keystroke

    return () => clearTimeout(timeout);
  }, [htmlContent, cssContent]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Live Preview</CardTitle>
        <CardDescription>A real-time view of your landing page.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pb-6">
        <iframe
          srcDoc={srcDoc}
          title="Preview"
          sandbox="allow-scripts"
          className="w-full h-full border rounded-lg bg-white shadow-inner"
        />
      </CardContent>
    </Card>
  );
};

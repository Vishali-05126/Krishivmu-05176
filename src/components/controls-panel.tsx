'use client';

import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FilePlus2, Palette, Bot, Download } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

interface ControlsPanelProps {
  onGenerateHtml: () => void;
  onGenerateCss: () => void;
  onExplainCode: () => void;
  onDownloadFiles: () => void;
  explanation: string;
  isLoading: boolean;
  isExplainLoading: boolean;
}

export const ControlsPanel: FC<ControlsPanelProps> = ({
  onGenerateHtml,
  onGenerateCss,
  onExplainCode,
  onDownloadFiles,
  explanation,
  isLoading,
  isExplainLoading,
}) => {
  return (
    <div className="flex flex-col gap-6 h-full">
      <Card>
        <CardHeader>
          <CardTitle>Controls</CardTitle>
          <CardDescription>Generate, customize, and export your site.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <Button onClick={onGenerateHtml} disabled={isLoading}>
            <FilePlus2 /> New HTML
          </Button>
          <Button onClick={onGenerateCss} disabled={isLoading}>
            <Palette /> AI CSS
          </Button>
          <Button onClick={onExplainCode} disabled={isLoading} variant="secondary">
            <Bot /> Explain Code
          </Button>
          <Button onClick={onDownloadFiles} disabled={isLoading} variant="secondary">
            <Download /> Download
          </Button>
        </CardContent>
      </Card>
      <Card className="flex-grow flex flex-col">
        <CardHeader>
          <CardTitle>AI Code Explanation</CardTitle>
          <CardDescription>How the HTML and CSS work together.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow overflow-y-auto">
          {isExplainLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {explanation || "Click 'Explain Code' to get an AI-powered analysis of your HTML and CSS."}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

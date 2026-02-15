'use client';

import { useEffect, useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ControlsPanel } from './controls-panel';
import { EditorPanel } from './editor-panel';
import { PreviewPanel } from './preview-panel';
import { generateCssAction, explainCodeAction } from '@/app/actions';
import { DEFAULT_HTML } from '@/lib/default-code';

export function Builder() {
  const { toast } = useToast();
  const [isCssLoading, startCssTransition] = useTransition();
  const [isExplainLoading, startExplainTransition] = useTransition();

  const [htmlContent, setHtmlContent] = useState(DEFAULT_HTML);
  const [cssContent, setCssContent] = useState('');
  const [explanation, setExplanation] = useState('');

  useEffect(() => {
    handleGenerateCss(true);
  }, []);

  const handleGenerateHtml = () => {
    setHtmlContent(DEFAULT_HTML);
    toast({
      title: 'HTML Scaffold Generated',
      description: 'The default HTML structure has been loaded into the editor.',
    });
  };

  const handleGenerateCss = (isInitial = false) => {
    startCssTransition(async () => {
      const result = await generateCssAction();
      if (result.success && result.css) {
        setCssContent(result.css);
        if (!isInitial) {
          toast({
            title: 'AI CSS Generated',
            description: 'New styles have been generated and applied.',
          });
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'CSS Generation Failed',
          description: result.error,
        });
      }
    });
  };

  const handleExplainCode = () => {
    setExplanation('');
    startExplainTransition(async () => {
      const result = await explainCodeAction(htmlContent, cssContent);
      if (result.success && result.explanation) {
        setExplanation(result.explanation);
        toast({
          title: 'Code Explained',
          description: 'AI analysis is now available.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Explanation Failed',
          description: result.error,
        });
      }
    });
  };

  const handleDownloadFiles = () => {
    const download = (filename: string, text: string) => {
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    };

    download('index.html', htmlContent);
    download('style.css', cssContent);

    toast({
      title: 'Files Downloaded',
      description: 'index.html and style.css have been saved.',
    });
  };

  const isLoading = isCssLoading || isExplainLoading;

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" style={{ height: 'calc(100vh - 160px)' }}>
        <div className="lg:col-span-3 h-full">
          <ControlsPanel
            onGenerateHtml={handleGenerateHtml}
            onGenerateCss={() => handleGenerateCss()}
            onExplainCode={handleExplainCode}
            onDownloadFiles={handleDownloadFiles}
            explanation={explanation}
            isLoading={isLoading}
            isExplainLoading={isExplainLoading}
          />
        </div>
        <div className="lg:col-span-5 h-full">
          <EditorPanel
            htmlContent={htmlContent}
            setHtmlContent={setHtmlContent}
            cssContent={cssContent}
            setCssContent={setCssContent}
          />
        </div>
        <div className="lg:col-span-4 h-full">
          <PreviewPanel htmlContent={htmlContent} cssContent={cssContent} />
        </div>
      </div>
    </div>
  );
}

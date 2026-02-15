'use client';

import type { FC, Dispatch, SetStateAction } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

interface EditorPanelProps {
  htmlContent: string;
  setHtmlContent: Dispatch<SetStateAction<string>>;
  cssContent: string;
  setCssContent: Dispatch<SetStateAction<string>>;
}

export const EditorPanel: FC<EditorPanelProps> = ({
  htmlContent,
  setHtmlContent,
  cssContent,
  setCssContent,
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Code Editor</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <Tabs defaultValue="html" className="flex-grow flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="html">index.html</TabsTrigger>
            <TabsTrigger value="css">style.css</TabsTrigger>
          </TabsList>
          <TabsContent value="html" className="flex-grow mt-4">
            <Textarea
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
              placeholder="Enter your HTML here..."
              className="h-full w-full resize-none font-mono text-sm"
            />
          </TabsContent>
          <TabsContent value="css" className="flex-grow mt-4">
            <Textarea
              value={cssContent}
              onChange={(e) => setCssContent(e.target.value)}
              placeholder="Enter your CSS here..."
              className="h-full w-full resize-none font-mono text-sm"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

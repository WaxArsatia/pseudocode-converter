'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleConvert = async () => {
    setSubmitting(true);
    const data = { pseudocode: input };
    await fetch('/api/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log({ data });
        setOutput(data.code || data.errorMessage);
      })
      .catch((err) => console.error(err));
    setSubmitting(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Code Converter</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-2">Input</h2>
          <Textarea
            placeholder="Enter your code here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="h-[300px] mb-2"
          />
        </div>
        <div className="flex flex-col justify-center items-center">
          <Button
            onClick={handleConvert}
            className="px-8 w-32"
            disabled={submitting}
          >
            {submitting ? 'Converting...' : 'Convert →'}
          </Button>
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-2">Output</h2>
          <div>
            {submitting ? (
              <div className="h-[300px] space-y-2 bg-gray-100 rounded-md px-4 py-5 flex flex-col">
                <Skeleton className="h-4 w-[300px]" />
                <div className="h-4"></div>
                <Skeleton className="h-4 w-[300px]" />
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[300px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[275px]" />
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[300px]" />
                <Skeleton className="h-4 w-[225px]" />
              </div>
            ) : (
              <Textarea
                value={output}
                readOnly
                className="h-[300px] bg-gray-100"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

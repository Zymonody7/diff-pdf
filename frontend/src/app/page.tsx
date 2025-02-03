'use client'
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useRef, useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

export default function Home() {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const file1InputRef = useRef<HTMLInputElement>(null);
  const file2InputRef = useRef<HTMLInputElement>(null);
  const [diffPdfUrl, setDiffPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile1Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile1(event.target.files[0]);
    }
  };

  const handleFile2Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile2(event.target.files[0]);
    }
  };

  // diff pdf processing
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!file1 || !file2) {
      setError('Please upload both PDF files.');
      return;
    }

    setLoading(true);
    setError(null);
    setDiffPdfUrl(null);

    const formData = new FormData();
    formData.append('file1', file1);
    formData.append('file2', file2);
    try {
      const response = await axios.post('http://127.0.0.1:8000/compare-pdfs/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      setDiffPdfUrl(url);
      setDrawerOpen(true)
    } catch (err) {
      setError('An error occurred while processing the files.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // drawer
  const [drawerOpen, setDrawerOpen] = useState(false)
  const handleDrawerClose = ()=>{
    setFile1(null)
    setFile2(null)
    if(file1InputRef.current){
      file1InputRef.current.value=''
    }
    if(file2InputRef.current){
      file2InputRef.current.value=''
    }
    setDiffPdfUrl(null)
    setDrawerOpen(false)
  }
  return (
    <div className='w-screen h-screen flex justify-center items-center bg-gray-50'>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">PDF Diff Tool</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file1">Upload PDF 1</Label>
              <Input id="file1" type="file" ref={file1InputRef} accept="application/pdf" onChange={handleFile1Change} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file2">Upload PDF 2</Label>
              <Input id="file2" type="file" ref={file2InputRef} accept="application/pdf" onChange={handleFile2Change} required />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {loading ? 'Processing...' : 'Compare PDFs'}
            </Button>
          </form>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Drawer open={drawerOpen} onClose={handleDrawerClose}>
            <DrawerContent>
              <DrawerHeader className=' flex justify-between'>
                <DrawerTitle>Diff PDF Result:</DrawerTitle>
                <DrawerDescription>by diff-pdf</DrawerDescription>
                <DrawerClose asChild>
                  <Button variant="outline">Close</Button>
                </DrawerClose>
              </DrawerHeader>
              <div className="mt-4">
                <iframe
                  src={diffPdfUrl}
                  width="100%"
                  height="600px"
                  title="PDF Viewer"
                />
                <Button variant="link" className="mt-2">
                  <a href={diffPdfUrl} download="diff.pdf">
                    Download Diff PDF
                  </a>
                </Button>
              </div>
            </DrawerContent>
          </Drawer>

        </CardContent>
      </Card>
    </div>
  );
}
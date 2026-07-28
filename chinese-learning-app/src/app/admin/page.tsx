"use client";

import { useState } from "react";
import { Upload, Database, Settings } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function AdminPage() {
  const [dragActive, setDragActive] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Fake upload process
      setStatus(`Uploading ${e.dataTransfer.files[0].name}...`);
      setTimeout(() => {
        setStatus("Successfully imported data to Supabase!");
      }, 1500);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage textbook chapters, vocabulary, and grammar.</p>
        </div>
        <Button variant="outline"><Settings className="w-4 h-4 mr-2" /> Settings</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold">Database Status</h2>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex justify-between"><span>Books</span> <span className="font-medium text-foreground">1</span></li>
            <li className="flex justify-between"><span>Chapters</span> <span className="font-medium text-foreground">15</span></li>
            <li className="flex justify-between"><span>Vocabulary</span> <span className="font-medium text-foreground">342</span></li>
            <li className="flex justify-between"><span>Grammar Points</span> <span className="font-medium text-foreground">48</span></li>
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Import Data (JSON)</h2>
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dragActive ? "border-primary bg-primary/5" : "border-border"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
            <p className="font-medium mb-1">Drag and drop JSON file here</p>
            <p className="text-xs text-muted-foreground mb-4">or click to browse</p>
            <Button variant="secondary" size="sm">Select File</Button>
          </div>
          {status && (
            <p className={`mt-4 text-sm font-medium text-center ${status.includes("Success") ? "text-green-500" : "text-primary"}`}>
              {status}
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}

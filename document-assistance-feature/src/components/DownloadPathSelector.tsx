
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FolderOpen } from "lucide-react";

const DownloadPathSelector = () => {
  const [path, setPath] = useState("~/Downloads");

  const handlePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPath(e.target.value);
  };

  // Note: In a real app with backend integration, we would handle directory selection
  // Here we're just simulating the functionality
  const handleBrowse = () => {
    // For demo purposes, just setting a mock path
    const newPath = path === "~/Downloads" ? "/Users/documents" : "~/Downloads";
    setPath(newPath);
  };

  return (
    <div className="mb-6">
      <Label htmlFor="download-path" className="mb-2 block font-medium">
        Download Location
      </Label>
      <div className="flex gap-2">
        <Input 
          id="download-path"
          value={path}
          onChange={handlePathChange}
          placeholder="Select download location"
          className="flex-1"
        />
        <Button 
          variant="outline" 
          type="button" 
          onClick={handleBrowse}
          className="flex items-center gap-2"
        >
          <FolderOpen size={16} />
          <span className="hidden sm:inline">Browse</span>
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        Select where to save your generated document
      </p>
    </div>
  );
};

export default DownloadPathSelector;

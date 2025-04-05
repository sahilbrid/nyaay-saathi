
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Download, FileEdit, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/lib/toast";
import { getCategoryById } from "@/lib/document-categories";
import { useDocumentState } from "@/hooks/use-document-state";
import { generateDocumentByCategory } from "@/lib/document-templates";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const documentStyles = `
  .document {
    font-family: 'Times New Roman', serif;
    line-height: 1.5;
    color: #000;
    padding: 2rem;
    max-width: 100%;
  }
  
  .header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .header h1 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  .date {
    text-align: right;
    margin-bottom: 1.5rem;
  }
  
  .address-block {
    margin-bottom: 2rem;
  }
  
  h2, h3 {
    font-weight: bold;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
  }
  
  h2 {
    font-size: 18px;
  }
  
  h3 {
    font-size: 16px;
  }
  
  p {
    margin-bottom: 1rem;
  }
  
  ul {
    margin-bottom: 1rem;
    list-style-type: disc;
    padding-left: 2rem;
  }
  
  li {
    margin-bottom: 0.5rem;
  }
  
  .indented {
    padding-left: 1.5rem;
  }
  
  .signature {
    margin-top: 3rem;
  }
  
  .signature p {
    margin-bottom: 0.25rem;
  }
  
  @media print {
    body {
      padding: 0;
      margin: 0;
    }
    
    .document {
      padding: 2.5cm;
    }
    
    button, .no-print {
      display: none !important;
    }
  }
`;

const DocumentPreview = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { documentData } = useDocumentState();
  const [documentHtml, setDocumentHtml] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const documentRef = useRef<HTMLDivElement>(null);
  const categoryInfo = category ? getCategoryById(category) : null;

  useEffect(() => {
    if (!category || !documentData.formData || Object.keys(documentData.formData).length === 0) {
      navigate(`/form/${category}`);
      return;
    }

    // Generate document HTML
    const html = generateDocumentByCategory(category, documentData.formData);
    setDocumentHtml(html);
  }, [category, documentData, navigate]);

  const handleEditForm = () => {
    navigate(`/form/${category}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!documentRef.current || !categoryInfo) return;
    
    try {
      setIsDownloading(true);
      toast.success("Preparing your document for download...");
      
      const fileName = `${categoryInfo.title.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      
      // Create the PDF
      const element = documentRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // If content spans multiple pages
      let heightLeft = imgHeight;
      let position = 0;
      
      while (heightLeft > pageHeight) {
        position = heightLeft - pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, -position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Save the PDF
      pdf.save(fileName);
      
      toast.success(`${fileName} has been downloaded successfully!`);
    } catch (error) {
      console.error("Error downloading document:", error);
      toast.error("Failed to download document. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!categoryInfo) {
    return (
      <Alert className="max-w-xl mx-auto mt-12">
        <AlertDescription>
          Category not found. Please go back and select a valid document category.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6 no-print">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(`/form/${category}`)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{categoryInfo.title} Preview</h1>
            <p className="text-muted-foreground">
              Review your document before downloading
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-6 no-print">
          <Button variant="outline" onClick={handleEditForm}>
            <FileEdit className="mr-2 h-4 w-4" />
            Edit Document
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button 
            onClick={handleDownload} 
            disabled={isDownloading}
          >
            <Download className="mr-2 h-4 w-4" />
            {isDownloading ? "Processing..." : "Download PDF"}
          </Button>
        </div>

        <Separator className="my-6 no-print" />

        <style>{documentStyles}</style>
        
        <div className="border rounded-lg overflow-hidden bg-white mb-8">
          <div className="p-4 bg-muted/30 border-b flex items-center justify-between no-print">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-sm text-muted-foreground">
              {categoryInfo.title} Document
            </div>
            <div></div>
          </div>
          
          <div 
            ref={documentRef}
            dangerouslySetInnerHTML={{ __html: documentHtml }} 
            className="document-preview document"
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;


import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/lib/toast";
import { getCategoryById } from "@/lib/document-categories";
import { 
  getDefaultValuesByCategory, 
  getFormFieldsByCategory, 
  getSchemaByCategory 
} from "@/lib/form-schemas";
import { useDocumentState } from "@/hooks/use-document-state";
import FormSection from "@/components/FormSection";

const DocumentForm = () => {
  const { category } = useParams<{ category: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setFormData, documentData } = useDocumentState();
  const categoryInfo = category ? getCategoryById(category) : null;
  
  // Get schema, form fields, and default values based on the category
  const schema = getSchemaByCategory(category || "");
  const formFields = getFormFieldsByCategory(category || "");
  
  // Initialize form with pre-filled values if they exist, otherwise use defaults
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: documentData.category === category && Object.keys(documentData.formData).length > 0
      ? documentData.formData
      : getDefaultValuesByCategory(category || ""),
  });

  // Save form data when values change
  useEffect(() => {
    const subscription = form.watch((value) => {
      setFormData(value);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, setFormData]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      setFormData(data);
      toast.success("Form data saved successfully");
      navigate(`/preview/${category}`);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
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
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{categoryInfo.title} Form</h1>
            <p className="text-muted-foreground">
              Fill out the form to generate your {categoryInfo.title.toLowerCase()} document
            </p>
          </div>
        </div>

        <Separator className="my-6" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {formFields.map((section, index) => (
              <FormSection 
                key={section.name} 
                section={section} 
                form={form} 
                isLast={index === formFields.length - 1}
              />
            ))}

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/")}
                className="order-2 sm:order-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Categories
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="order-1 sm:order-2 sm:ml-auto"
              >
                {isLoading ? (
                  "Processing..."
                ) : (
                  <>
                    Preview Document <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              <Button 
                type="button"
                variant="secondary"
                onClick={() => {
                  setFormData(form.getValues());
                  toast.success("Form data saved");
                }}
                className="order-3"
              >
                <Save className="mr-2 h-4 w-4" /> Save Form
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default DocumentForm;

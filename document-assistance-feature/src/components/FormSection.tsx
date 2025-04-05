
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormSectionProps {
  section: {
    name: string;
    title: string;
    description: string;
    fields: {
      name: string;
      label: string;
      type: string;
      required: boolean;
    }[];
  };
  form: any;
  isLast?: boolean;
}

const FormSection = ({ section, form, isLast = false }: FormSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const getFieldErrors = (fieldName: string) => {
    return form.formState.errors[fieldName];
  };

  return (
    <Card className={cn("mb-6 overflow-hidden transition-all duration-300", {
      "mb-8": isLast
    })}>
      <CardHeader 
        className="flex flex-row items-center justify-between cursor-pointer py-5"
        onClick={toggleExpand}
      >
        <div>
          <CardTitle className="text-xl">{section.title}</CardTitle>
          <CardDescription className="mt-1">{section.description}</CardDescription>
        </div>
        <div className="text-muted-foreground">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </CardHeader>
      
      <div 
        className={cn("transition-height duration-300 ease-in-out", {
          "h-0": !isExpanded,
          "h-auto": isExpanded
        })}
      >
        <CardContent className={cn("grid grid-cols-1 md:grid-cols-2 gap-6", {
          "pb-6": isExpanded,
          "hidden": !isExpanded
        })}>
          {section.fields.map((field) => (
            <FormField
              key={field.name}
              control={form.control}
              name={field.name}
              render={({ field: formField }) => (
                <FormItem className={field.type === "textarea" ? "md:col-span-2" : ""}>
                  <FormLabel>
                    {field.label}
                    {field.required && <span className="text-destructive ml-1">*</span>}
                  </FormLabel>
                  <FormControl>
                    {field.type === "textarea" ? (
                      <Textarea
                        {...formField}
                        className="min-h-[120px] resize-none"
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    ) : field.type === "date" ? (
                      <Input
                        {...formField}
                        type="date"
                        placeholder={`Select ${field.label.toLowerCase()}`}
                      />
                    ) : (
                      <Input
                        {...formField}
                        type={field.type}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </CardContent>
      </div>
    </Card>
  );
};

export default FormSection;


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { documentCategories } from "@/lib/document-categories";
import { useDocumentState } from "@/hooks/use-document-state";

const CategorySelection = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [animateCards, setAnimateCards] = useState(false);
  const navigate = useNavigate();
  const { setDocumentCategory } = useDocumentState();

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setAnimateCards(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleContinue = () => {
    if (selectedCategory) {
      setDocumentCategory(selectedCategory);
      navigate(`/form/${selectedCategory}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
        <h1 className="text-3xl font-bold mb-4">Select Document Category</h1>
        <p className="text-muted-foreground">
          Choose the type of legal document you need to generate. Each category contains
          templates designed for specific legal situations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {documentCategories.map((category, index) => {
          const isSelected = selectedCategory === category.id;
          
          return (
            <div
              key={category.id}
              className={`border rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                isSelected ? "border-primary shadow-md" : "border-border/60 hover:border-primary/50"
              } ${
                animateCards 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-8"
              }`}
              style={{ 
                transitionDelay: `${index * 50}ms`
              }}
              onClick={() => handleCategorySelect(category.id)}
            >
              <div className={`h-12 w-12 rounded-lg ${category.color} flex items-center justify-center mb-4`}>
                <category.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium mb-2">{category.title}</h3>
              <p className="text-muted-foreground mb-4">{category.description}</p>
              
              <div className="flex justify-end">
                <Button 
                  variant={isSelected ? "default" : "ghost"} 
                  size="sm"
                  className={isSelected ? "" : "opacity-0 group-hover:opacity-100"}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCategorySelect(category.id);
                    handleContinue();
                  }}
                >
                  Select <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center mt-12 animate-fade-in" style={{ animationDelay: "500ms" }}>
        <Button 
          size="lg" 
          onClick={handleContinue}
          disabled={!selectedCategory}
        >
          Continue to Form
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default CategorySelection;

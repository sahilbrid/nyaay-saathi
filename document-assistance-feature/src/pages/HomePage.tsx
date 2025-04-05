import { useState, useEffect, useRef } from "react";
import { ChevronDown, FileText, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({
    hero: false,
    features: false,
    benefits: false,
    cta: false,
  });
  const sectionsRef = useRef<Record<string, HTMLElement | null>>({
    hero: null,
    features: null,
    benefits: null,
    cta: null,
  });

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.15,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        if (id && Object.keys(isVisible).includes(id)) {
          setIsVisible((prev) => ({ ...prev, [id]: entry.isIntersecting }));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    Object.entries(sectionsRef.current).forEach(([id, ref]) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      title: "Multiple Document Categories",
      description: "Generate documents for eviction, wage theft, discrimination and more",
      icon: FileText,
    },
    {
      title: "Legally Sound Templates",
      description: "All documents are based on proper legal standards and requirements",
      icon: Shield,
    },
    {
      title: "Instant Generation",
      description: "Create custom legal documents in minutes instead of hours",
      icon: Clock,
    },
  ];

  const benefits = [
    {
      title: "Save Time",
      description: "Complete legal documents in minutes instead of hours spent researching formats.",
    },
    {
      title: "Reduce Costs",
      description: "Avoid expensive legal consultation fees for standard document preparation.",
    },
    {
      title: "Ensure Compliance",
      description: "Templates follow legal standards to help ensure document validity.",
    },
    {
      title: "Customize Documents",
      description: "Tailor documents to your specific situation with guided form inputs.",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section 
        id="hero" 
        ref={(el) => (sectionsRef.current.hero = el)}
        className="min-h-[90vh] flex flex-col justify-center relative overflow-hidden"
      >
        <div 
          className={`container-tight py-20 transition-all duration-700 ${
            isVisible.hero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <span>Simple • Accessible • Reliable</span>
            </div>
            <h1 className="h1">
              Generate Legal Documents <br /> 
              <span className="text-primary">With Precision and Ease</span>
            </h1>
            <p className="p1 text-muted-foreground max-w-2xl mx-auto">
              Create professionally formatted legal documents for various situations without the complexity. 
              Our platform simplifies the document creation process with guided form inputs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button size="lg" asChild>
                <Link to="/categories">Get Started Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/categories">View Document Types</Link>
              </Button>
            </div>
          </div>

          <div className="mt-16 flex justify-center">
            <div className="glassmorphism rounded-xl shadow-lg p-1 max-w-[90%] md:max-w-[80%] mx-auto">
              <img 
                src="/placeholder.svg" 
                alt="LegalClaim App Interface" 
                className="rounded-lg w-full"
                style={{ height: "auto", aspectRatio: "16/9" }}
              />
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-0 right-0 flex justify-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="animate-bounce"
            onClick={() => {
              document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <ChevronDown className="h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section 
        id="features" 
        ref={(el) => (sectionsRef.current.features = el)}
        className="py-20 bg-secondary/50"
      >
        <div 
          className={`container-tight transition-all duration-700 ${
            isVisible.features ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-16">
            <h2 className="h2">Powerful Document Generation</h2>
            <p className="p1 text-muted-foreground max-w-2xl mx-auto mt-4">
              Our platform offers a range of features designed to make legal document creation 
              straightforward and efficient.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="glassmorphism p-6 rounded-xl transition-all hover:shadow-md"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section 
        id="benefits" 
        ref={(el) => (sectionsRef.current.benefits = el)}
        className="py-20"
      >
        <div 
          className={`container-tight transition-all duration-700 ${
            isVisible.benefits ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-16">
            <h2 className="h2">Why Choose LegalClaim</h2>
            <p className="p1 text-muted-foreground max-w-2xl mx-auto mt-4">
              Our document generator provides numerous advantages over traditional legal document preparation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="border border-border/60 p-6 rounded-xl">
                <h3 className="text-xl font-medium mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        id="cta" 
        ref={(el) => (sectionsRef.current.cta = el)}
        className="py-20 bg-primary/5"
      >
        <div 
          className={`container-tight text-center transition-all duration-700 ${
            isVisible.cta ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="h2 mb-6">Ready to Create Your Document?</h2>
          <p className="p1 text-muted-foreground max-w-2xl mx-auto mb-8">
            Start generating professional legal documents in minutes with our 
            simple, guided process.
          </p>
          <Button size="lg" asChild>
            <Link to="/categories">Get Started Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

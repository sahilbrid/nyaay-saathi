
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Bot, FileText, Users, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { useTheme } from "@/components/theme-provider";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  // const { theme, setTheme } = useTheme();

  const navItems = [
    { path: "http://localhost:3000/", label: "Home", icon: null },
    { path: "http://localhost:3000/analyzer", label: "AI Case Analyzer", icon: null },
    { path: "http://localhost:3000/chatbot", label: "NyaayBot", icon: null },
    { path: "http://localhost:5001/", label: "Document Generator", icon: null },
    { path: "http://localhost:5173/", label: "Pro Bono Lawyers", icon: null },
    { path: "/about", label: "About", icon: null },
  ];

  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 sm:px-6">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Nyaay<span className="font-hindi">साथी</span>
            </span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2 md:ml-auto">
          {navItems.map((item) => (
            <Button
              key={item.path}
              asChild
              variant={isActiveLink(item.path) ? "default" : "ghost"}
              size="sm"
            >
              <Link to={item.path} className="flex items-center">
                {item.icon}
                {item.label}
              </Link>
            </Button>
          ))}
          
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button> */}
        </nav>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden ml-auto flex items-center">
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="mr-2"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button> */}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden container pb-4">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.path}
                asChild
                variant={isActiveLink(item.path) ? "default" : "ghost"}
                onClick={() => setIsMenuOpen(false)}
                className="justify-start"
              >
                <Link to={item.path} className="flex items-center">
                  {item.icon}
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;

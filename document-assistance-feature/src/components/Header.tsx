
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  const links = [
    { text: "Home", to: "/" },
    { text: "Categories", to: "/categories" },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled ? "py-3 glassmorphism" : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-primary font-medium text-xl transition-opacity hover:opacity-80"
        >
          <span className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-white font-semibold">LC</span>
          <span className="hidden sm:inline-block">LegalClaim</span>
        </Link>

        {isMobile ? (
          <>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={toggleMenu} 
              className="z-50"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>

            {isMenuOpen && (
              <div className="fixed inset-0 bg-background animate-fade-in z-40">
                <div className="flex flex-col items-center justify-center h-full space-y-8">
                  {links.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="text-2xl font-medium hover:text-primary transition-colors"
                      onClick={closeMenu}
                    >
                      {link.text}
                    </Link>
                  ))}
                  <Button className="mt-4" asChild>
                    <Link to="/categories">Get Started</Link>
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center space-x-8">
            <nav className="hidden md:flex items-center space-x-8">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`p2 hover:text-primary transition-colors ${
                    location.pathname === link.to ? "text-primary font-medium" : ""
                  }`}
                >
                  {link.text}
                </Link>
              ))}
            </nav>
            <Button asChild>
              <Link to="/categories">Get Started</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

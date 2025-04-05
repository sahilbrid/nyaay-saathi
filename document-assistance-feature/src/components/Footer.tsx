
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <Link
              to="/"
              className="flex items-center space-x-2 text-primary font-medium text-xl mb-4"
            >
              <span className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-white font-semibold">
                LC
              </span>
              <span>LegalClaim</span>
            </Link>
            <p className="text-muted-foreground max-w-xs">
              Automated legal document generation platform designed to make legal processes more accessible.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-muted-foreground hover:text-foreground transition-colors">
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-lg mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} LegalClaim. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground mt-3 md:mt-0">
            <span className="opacity-75">
              This service provides document templates only and is not a substitute for legal advice.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


import { FileText, Building, Briefcase, Users, ShoppingBag, Home, Globe } from "lucide-react";

export interface Category {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
}

export const documentCategories: Category[] = [
  {
    id: "eviction-notice",
    title: "Eviction Notice",
    description: "Create formal notices for tenant eviction based on legal grounds",
    icon: Building,
    color: "bg-red-50 text-red-500 border-red-100"
  },
  {
    id: "wage-theft",
    title: "Wage Theft Complaint",
    description: "Generate documents to claim unpaid wages or labor violations",
    icon: Briefcase,
    color: "bg-yellow-50 text-yellow-600 border-yellow-100"
  },
  {
    id: "employment-discrimination",
    title: "Employment Discrimination",
    description: "Prepare documents for workplace discrimination claims",
    icon: Users,
    color: "bg-blue-50 text-blue-500 border-blue-100"
  },
  {
    id: "contract-dispute",
    title: "Contract Dispute",
    description: "Create documents for breach of contract or contractual disputes",
    icon: FileText,
    color: "bg-purple-50 text-purple-500 border-purple-100"
  },
  {
    id: "consumer-rights",
    title: "Consumer Rights",
    description: "Generate documents for consumer protection and rights claims",
    icon: ShoppingBag,
    color: "bg-green-50 text-green-500 border-green-100"
  },
  {
    id: "family-law",
    title: "Family Law",
    description: "Prepare documents for family-related legal matters",
    icon: Home,
    color: "bg-pink-50 text-pink-500 border-pink-100"
  },
  {
    id: "immigration-petition",
    title: "Immigration Petition",
    description: "Create immigration-related documents and petitions",
    icon: Globe,
    color: "bg-indigo-50 text-indigo-500 border-indigo-100"
  },
];

export const getCategoryById = (id: string): Category | undefined => {
  return documentCategories.find(category => category.id === id);
};

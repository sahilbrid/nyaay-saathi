
import { Loader2 } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[50vh]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground mt-4">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;

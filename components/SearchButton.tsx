import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Search } from "lucide-react";

interface SearchButtonProps {
  brandName: string;
  userId: number | null;
  queriesLeft: number | null;
  setSearchedBrand: (brand: string) => void;
  refreshQueries: () => void;
  selectedApi: string;
  setSelectedApi: (api: string) => void;
}

export default function SearchButton({
  brandName,
  userId,
  queriesLeft,
  setSearchedBrand,
  refreshQueries,
}: SearchButtonProps) {
  const handleSearch = async () => {
    if (!userId || queriesLeft === 0) return;
    setSearchedBrand(brandName);
    await fetch("/api/queries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    refreshQueries();
  };

  // Disabled state
  if (queriesLeft === 0) {
    return (
      <div className="flex items-center gap-1 sm:gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <button
                className="p-2 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gray-300 text-gray-600 cursor-not-allowed opacity-70 flex items-center justify-center shadow-sm"
                disabled
              >
                <Search size={16} className="sm:size-18" />
              </button>
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[200px] sm:max-w-xs">
            <p className="text-xs sm:text-sm text-gray-700">
              Your queries reached the limit
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <button
        onClick={handleSearch}
        disabled={!brandName || queriesLeft === 0}
        className={`p-2 w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shadow-sm transition-colors duration-200 
          ${
            !brandName || queriesLeft === 0
              ? "bg-slate-400 cursor-not-allowed text-white"
              : "bg-slate-800 hover:bg-slate-900 text-white"
          }`}
      >
        <Search size={16} className="sm:size-18" />
      </button>
    </div>
  );
}

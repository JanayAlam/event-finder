import { Button, TButtonProps } from "@/components/shared/atoms/button";
import { Kbd } from "@/components/shared/atoms/kdb";
import { SearchIcon } from "lucide-react";
import React from "react";

const SearchButton: React.FC<TButtonProps> = (props) => {
  return (
    <Button variant="outline" {...props}>
      <div className="sm:hidden">
        <SearchIcon />
      </div>
      <div className="hidden sm:flex justify-between items-center gap-4">
        <span className="text-gray-400">Search Trips</span>
        <span>
          <Kbd>Ctrl</Kbd>
          <span className="text-gray-400">+</span>
          <Kbd>k</Kbd>
        </span>
      </div>
    </Button>
  );
};

export default SearchButton;

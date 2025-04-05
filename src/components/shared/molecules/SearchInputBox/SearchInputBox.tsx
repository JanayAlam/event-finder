"use client";

import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import React from "react";
import { Control, Controller } from "react-hook-form";

interface SearchInputProps {
  control: Control<any>;
  searchTerm: string;
  onClear: () => void;
  placeholder?: string;
  allowClear?: boolean;
  className?: string;
  size?: "small" | "medium" | "large";
}

const SearchInputBox: React.FC<SearchInputProps> = ({
  control,
  searchTerm,
  onClear,
  placeholder = "Search...",
  allowClear = true,
  className = "",
  size = "medium"
}) => {
  const sizeClasses = {
    small: "h-8 text-sm",
    medium: "h-10 text-base",
    large: "h-12 text-lg"
  };

  return (
    <div className={`relative inline-block w-full ${className}`}>
      <div
        className={`flex items-center relative rounded-md border border-gray-300 bg-white hover:border-primary focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all ${sizeClasses[size]}`}
      >
        <Controller
          name="searchTerm"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="w-full h-full px-3 outline-none bg-transparent"
              placeholder={placeholder}
            />
          )}
        />

        <div className="flex items-center pr-2">
          {allowClear && searchTerm && (
            <button
              type="button"
              onClick={onClear}
              className="p-1 text-gray-400 hover:text-warning focus:outline-none"
              aria-label="Clear search"
            >
              <CloseOutlined style={{ height: 16, width: 16 }} />
            </button>
          )}

          <div className="p-1 text-gray-400 pointer-events-none">
            <SearchOutlined style={{ height: 16, width: 16 }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchInputBox;

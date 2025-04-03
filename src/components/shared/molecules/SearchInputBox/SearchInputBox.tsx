"use client";

import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import React from "react";
import { Controller, useForm } from "react-hook-form";

interface SearchFormValues {
  searchTerm: string;
}

interface SearchInputProps {
  placeholder?: string;
  allowClear?: boolean;
  onSearch: (value: string) => void;
  className?: string;
  size?: "small" | "medium" | "large";
  defaultValue?: string;
}

const SearchInputBox: React.FC<SearchInputProps> = ({
  placeholder = "Search...",
  allowClear = true,
  onSearch,
  className = "",
  size = "medium",
  defaultValue = ""
}) => {
  const { control, handleSubmit, setValue, watch } = useForm<SearchFormValues>({
    defaultValues: {
      searchTerm: defaultValue
    }
  });

  const searchTerm = watch("searchTerm");

  const handleClear = () => {
    setValue("searchTerm", "");
  };

  const onSubmit = (data: SearchFormValues) => {
    onSearch(data.searchTerm);
  };

  const sizeClasses = {
    small: "h-8 text-sm",
    medium: "h-10 text-base",
    large: "h-12 text-lg"
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`relative inline-block w-full ${className}`}
    >
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
              onClick={handleClear}
              className="p-1 text-gray-400 hover:text-warning focus:outline-none"
              aria-label="Clear search"
            >
              <CloseOutlined style={{ height: 16, width: 16 }} />
            </button>
          )}

          <button
            type="submit"
            className="p-1 text-gray-400 hover:text-primary focus:outline-none"
            aria-label="Search"
          >
            <SearchOutlined style={{ height: 16, width: 16 }} />
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchInputBox;

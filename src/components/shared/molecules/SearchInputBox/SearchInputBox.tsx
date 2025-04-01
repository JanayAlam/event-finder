"use client";

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
  placeholder = "Search",
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
        className={`flex items-center relative rounded-md border border-gray-300 bg-white hover:border-blue-400 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-all ${sizeClasses[size]}`}
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
              className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label="Clear search"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          <button
            type="submit"
            className="p-1 text-gray-400 hover:text-blue-500 focus:outline-none"
            aria-label="Search"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchInputBox;

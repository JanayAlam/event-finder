"use client";

import { InputField } from "@/components/shared/molecules/form";
import {
  Button,
  TButtonProps
} from "@/components/shared/shadcn-components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/shared/shadcn-components/dialog";
import {
  Empty,
  EmptyContent,
  EmptyMedia
} from "@/components/shared/shadcn-components/empty";
import { Kbd } from "@/components/shared/shadcn-components/kdb";
import { Paragraph } from "@/components/shared/shadcn-components/typography";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileX2, Search, SearchIcon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { useDebounce } from "use-debounce";
import { SearchSchema } from "../../../../common/validation-schemas";

const SearchButton: React.FC<TButtonProps> = (props) => {
  const form = useForm({
    defaultValues: {
      search: ""
    },
    resolver: zodResolver(SearchSchema)
  });

  const search = form.watch("search");

  const [debouncedSearch] = useDebounce(search, 500);

  return (
    <Dialog>
      <DialogTrigger asChild>
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
      </DialogTrigger>
      <DialogContent hideClose className="pt-2">
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <InputField
          autoFocus
          name="search"
          className="h-12"
          control={form.control}
          placeholder="Enter title or location"
        />
        <div>
          <Empty className="gap-1">
            <EmptyMedia>
              {debouncedSearch ? (
                <FileX2 className="size-6" />
              ) : (
                <Search className="size-6" />
              )}
            </EmptyMedia>
            <EmptyContent>
              {debouncedSearch ? (
                <Paragraph>No results found</Paragraph>
              ) : (
                <Paragraph>Start typing to search</Paragraph>
              )}
              <div className="flex items-center gap-1">
                <Kbd>Esc</Kbd> to close
              </div>
            </EmptyContent>
          </Empty>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchButton;

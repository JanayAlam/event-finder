"use client";

import { InputField } from "@/components/shared/molecules/form";
import TMCard from "@/components/shared/molecules/tm-card";
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
import { Spinner } from "@/components/shared/shadcn-components/spinner";
import { Paragraph } from "@/components/shared/shadcn-components/typography";
import EventRepository from "@/repositories/event.repository";
import { PUBLIC_DYNAMIC_PAGE_ROUTE } from "@/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, ListX, MapPin, Search, SearchIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounce } from "use-debounce";
import { SearchSchema } from "../../../../common/validation-schemas";

const SearchButton: React.FC<TButtonProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm({
    defaultValues: {
      search: ""
    },
    resolver: zodResolver(SearchSchema)
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const search = form.watch("search");

  const [debouncedSearch] = useDebounce(search, 500);

  const { data: results, isFetching } = useQuery({
    queryKey: ["search-events", debouncedSearch],
    queryFn: () => EventRepository.search(debouncedSearch),
    enabled: !!debouncedSearch
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
          autoComplete="off"
          name="search"
          className="h-12"
          control={form.control}
          placeholder="Enter title or location"
        />
        <div className="flex flex-col gap-2 min-h-[25vh] max-h-[60vh] overflow-y-auto">
          {isFetching ? (
            <Empty className="gap-1">
              <EmptyMedia>
                <Spinner
                  className="size-6"
                  color="dark:text-primary-foreground!"
                />
              </EmptyMedia>
              <EmptyContent>
                <Paragraph>Searching for events...</Paragraph>
              </EmptyContent>
            </Empty>
          ) : results?.length ? (
            results.map((event) => (
              <Link
                key={event._id.toString()}
                href={PUBLIC_DYNAMIC_PAGE_ROUTE.EVENT_DETAILS(
                  event._id.toString()
                )}
                className="block"
                onClick={() => {
                  setIsOpen(false);
                  form.reset();
                }}
              >
                <TMCard bodyClassName="!p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-semibold">{event.title}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="size-3" /> {event.placeName}
                      </p>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </div>
                </TMCard>
              </Link>
            ))
          ) : (
            <Empty className="gap-1">
              <EmptyMedia>
                {debouncedSearch ? (
                  <ListX className="size-6" />
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
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchButton;

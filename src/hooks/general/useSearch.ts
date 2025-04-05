import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounce } from "use-debounce";

interface SearchFormValues {
  searchTerm: string;
}

const useSearch = (defaultValue = "", debounceDelay = 300) => {
  const { control, watch, setValue } = useForm<SearchFormValues>({
    defaultValues: {
      searchTerm: defaultValue
    }
  });

  const searchTerm = watch("searchTerm");
  const [debouncedSearchTerm] = useDebounce(searchTerm, debounceDelay);

  const [finalSearchTerm, setFinalSearchTerm] = useState(defaultValue);

  useEffect(() => {
    setFinalSearchTerm(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  const handleClear = () => {
    setValue("searchTerm", "");
  };

  return {
    control,
    searchTerm,
    debouncedSearchTerm: finalSearchTerm,
    setSearchTerm: setValue,
    handleClear
  };
};

export default useSearch;

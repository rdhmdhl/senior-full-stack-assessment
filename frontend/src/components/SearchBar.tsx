import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { serverRes } from "@/types/types";
import { searchVinyl } from "@/utils/searchRecord";

type Props = {
  setResults: (result: serverRes) => void;
  setIsLoading: (_: boolean) => void;
  setErr: (message: string) => void;
};

const filter = createFilterOptions<Record>();

export default function SearchBar({ setResults, setIsLoading, setErr }: Props) {
  const [value, setValue] = React.useState<Record | null>(null);

  return (
    <Autocomplete
      className="mt-10 bg-white"
      value={value}
      onChange={(_, newValue) => {
        let selectedTitle = "";
        let selectedArtist = "";
        let id = Math.floor(Math.random() * 100000); // fallback

        if (typeof newValue === "string") {
          setValue({ title: newValue, artist: "", id });
          selectedTitle = newValue;
        } else if (newValue?.inputValue) {
          setValue({ title: newValue.inputValue, artist: "", id });
          selectedTitle = newValue.inputValue;
        } else if (newValue) {
          setValue(newValue);
          selectedTitle = newValue.title;
          selectedArtist = newValue.artist ?? "";
          id = newValue.id ?? id;
        }

        if (!selectedTitle) return;

        searchVinyl(
          { title: selectedTitle, id },
          setResults,
          setErr,
          setIsLoading,
        );
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        const isExisting = options.some(
          (option) => inputValue === option.title,
        );
        if (inputValue !== "" && !isExisting) {
          filtered.push({
            inputValue,
            title: `Add "${inputValue}"`,
            id: Math.floor(Math.random() * 10000), // create new id for non-existing record
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="free-solo-with-text-demo"
      options={vinylOptions}
      getOptionLabel={(option) => {
        if (typeof option === "string") {
          return option;
        }
        if (option.inputValue) {
          return option.inputValue;
        }
        return option.title;
      }}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            {option.title}
          </li>
        );
      }}
      sx={{ width: 300 }}
      freeSolo
      renderInput={(params) => (
        <TextField {...params} label="Search for record" />
      )}
    />
  );
}

const vinylOptions: readonly Record[] = [
  { title: "Abbey Road", artist: "The Beatles", id: 1 },
  { title: "Dark Side of the Moon", artist: "Pink Floyd", id: 2 },
  { title: "Thriller", artist: "Michael Jackson", id: 3 },
  { title: "Back in Black", artist: "AC/DC", id: 4 },
  { title: "Rumours", artist: "Fleetwood Mac", id: 5 },
];

interface Record {
  inputValue?: string;
  title: string;
  artist?: string;
  id: number;
}

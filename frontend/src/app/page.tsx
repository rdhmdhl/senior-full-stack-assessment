"use client";

import SearchBar from "../components/SearchBar";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import { serverRes } from "@/types/types";
import { useState } from "react";

export default function Home() {
  const [results, setResults] = useState<serverRes>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string>();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-white">
      <SearchBar
        setResults={setResults}
        setIsLoading={setIsLoading}
        setErr={setErr}
      />

      {err && (
        <div className="text-center text-red-600">
          <p className="mb-2">{err}</p>
          <Button
            variant="contained"
            onClick={() => {
              setErr("");
              setResults(undefined);
            }}
          >
            Back to Search
          </Button>
        </div>
      )}

      {isLoading && !err && <CircularProgress />}

      {!isLoading && !err && results && (
        <div className="record-info flex flex-col items-center text-black">
          <h2 className="text-2xl font-bold">{results.title}</h2>
          {results.available ? (
            <>
              <p>{results.authentic ? "Authentic" : "Not authentic"}</p>
              <p>Pickup at {results.store}</p>
            </>
          ) : (
            <p>Record not available</p>
          )}
        </div>
      )}
    </div>
  );
}

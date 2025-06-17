export const searchVinyl = async (
  vinyl: { title: string; id: number },
  setResults: (res: any) => void,
  setErr: (err: string) => void,
  setIsLoading: (b: boolean) => void,
) => {
  setIsLoading(true);

  try {
    const searchRes = await fetch("http://localhost:3001/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vinylRecords: [vinyl] }),
    });

    const { runId } = await searchRes.json();

    let attempts = 0;
    const poll = async () => {
      if (attempts++ > 30) {
        setErr("Request timed out");
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch(`http://localhost:3001/status/${runId}`);
        console.log("polling..");
        const json = await res.json();

        if (json.status === "processing") {
          setTimeout(poll, 1500);
        } else if (json.status === "complete") {
          if (json.data?.vinylRecords?.length > 0) {
            console.log("record found: ", json.data.vinylRecords[0]);
            setResults(json.data.vinylRecords[0]);
            setIsLoading(false);
          } else {
            setErr("No records found");
            setIsLoading(false);
          }
        } else {
          setErr(json.error ?? "Unknown error");
          setIsLoading(false);
        }
      } catch (err) {
        setErr("Error polling status");
        setIsLoading(false);
      }
    };

    poll();
  } catch (err) {
    console.error("Search failed:", err);
    setErr("Could not fetch record at this time.");
    setIsLoading(false);
  }
};

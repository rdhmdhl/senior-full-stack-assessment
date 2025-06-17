const results: Record<string, any> = {};

export function saveResult(runId: string, data: any) {
  results[runId] = data;
}

export function getResult(runId: string) {
  return results[runId] || null;
}

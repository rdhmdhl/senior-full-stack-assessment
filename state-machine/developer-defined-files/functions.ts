import { VinylRecord, StoreResult, VerifiedResult } from "./types";
import {
  apiAvailability1,
  apiAvailability2,
  apiAvailability3,
  apiDetails,
} from "../mockAPI";

type AsyncFunction<T> = () => Promise<T>;

function wait(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

function createCircuitBreaker<T>(
  maxFailures: number,
  cooldownMs: number,
  maxRetries = 5,
) {
  let failureCount = 0;
  let circuitOpen = false;
  let nextTryTime = 0;

  return async function withRetryAndCircuitBreaker(
    fn: AsyncFunction<T>,
  ): Promise<T> {
    const now = Date.now();

    if (circuitOpen && now < nextTryTime) {
      throw new Error("Circuit breaker is open");
    }

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const result = await fn();
        failureCount = 0;
        circuitOpen = false;
        return result;
      } catch (err) {
        failureCount++;
        console.error(
          "retrying after failed attempt: ",
          failureCount,
          "err: ",
          err,
        );
        if (failureCount >= maxFailures) {
          circuitOpen = true;
          nextTryTime = now + cooldownMs;
          console.error("max retry attempts reached, circut breaker triggered");
        }
        const delay = Math.pow(2, attempt) * 100 + Math.random() * 100;
        await wait(delay);
      }
    }

    throw new Error("Max retries exceeded");
  };
}

const withRetryStore1: <T>(fn: () => Promise<T>) => Promise<T> =
  createCircuitBreaker(3, 5000);
const withRetryStore2: <T>(fn: () => Promise<T>) => Promise<T> =
  createCircuitBreaker(3, 5000);
const withRetryStore3: <T>(fn: () => Promise<T>) => Promise<T> =
  createCircuitBreaker(3, 5000);

type VinylDetails = VerifiedResult["metadata"];
type FullDetails = Awaited<
  ReturnType<typeof apiDetails.fetchVinylRecordDetails>
> & {
  isAuthentic: boolean;
};

const withRetryDetails = createCircuitBreaker<VinylDetails>(3, 5000);
export const functions = {
  checkStore1: async (record: VinylRecord): Promise<StoreResult> => {
    const available = await withRetryStore1(() =>
      apiAvailability1.isVinylRecordAvailable(record.id),
    );
    return { ...record, available, store: "Store 1" };
  },

  checkStore2: async (record: VinylRecord): Promise<StoreResult> => {
    const available = await withRetryStore2(() =>
      apiAvailability2.isVinylRecordAvailable(record.id),
    );
    return { ...record, available, store: "Store 2" };
  },

  checkStore3: async (record: VinylRecord): Promise<StoreResult> => {
    const available = await withRetryStore3(() =>
      apiAvailability3.isVinylRecordAvailable(record.id),
    );
    return { ...record, available, store: "Store 3" };
  },

  verifyAuthenticity: async (record: StoreResult): Promise<VerifiedResult> => {
    const details = (await withRetryDetails(() =>
      apiDetails.fetchVinylRecordDetails(record.id.toString()),
    )) as FullDetails;

    return {
      ...record,
      authentic: details.isAuthentic,
      metadata: {
        publishingId: details.publishingId,
        metadataVersion: details.metadataVersion,
      },
    };
  },

  markUnavailable: async (record: VinylRecord): Promise<VerifiedResult> => {
    return {
      ...record,
      available: false,
      store: "None",
      authentic: false,
      metadata: {
        publishingId: -1,
        metadataVersion: 0,
      },
    };
  },
};

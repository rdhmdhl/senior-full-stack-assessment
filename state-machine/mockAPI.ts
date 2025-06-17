const hasChanceOfFailure = process.env.MOCK_API_FAILURE === "true";
const timeout = 1000;

export const apiAvailability1 = {
  isVinylRecordAvailable: async (recordId: number): Promise<boolean> => {
    console.log("API 1 Checking availability for record ID:", recordId);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (hasChanceOfFailure && Math.random() < 0.3) {
          return reject(new Error("Error 429: Too Many Requests"));
        }

        let isAvailable = true;
        if ([1, 2, 3].includes(recordId)) {
          isAvailable = false;
        }
        console.log(
          `Record ID ${recordId} availability: ${
            isAvailable ? "Available" : "Not Available"
          }`,
        );
        resolve(isAvailable);
      }, timeout);
    });
  },
};

export const apiAvailability2 = {
  isVinylRecordAvailable: async (recordId: number): Promise<boolean> => {
    console.log("API 2 Checking availability for record ID:", recordId);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (hasChanceOfFailure && Math.random() < 0.3) {
          return reject(new Error("Error 429: Too Many Requests"));
        }

        let isAvailable = true;
        if ([1, 3].includes(recordId)) {
          isAvailable = false;
        }
        console.log(
          `Record ID ${recordId} availability: ${
            isAvailable ? "Available" : "Not Available"
          }`,
        );
        resolve(isAvailable);
      }, timeout);
    });
  },
};

export const apiAvailability3 = {
  isVinylRecordAvailable: async (recordId: number): Promise<boolean> => {
    console.log("API 3 Checking availability for record ID:", recordId);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (hasChanceOfFailure && Math.random() < 0.3) {
          return reject(new Error("Error 429: Too Many Requests"));
        }

        let isAvailable = true;
        if ([1].includes(recordId)) {
          isAvailable = false;
        }
        console.log(
          `Record ID ${recordId} availability: ${
            isAvailable ? "Available" : "Not Available"
          }`,
        );
        resolve(isAvailable);
      }, timeout);
    });
  },
};

export const apiDetails = {
  fetchVinylRecordDetails: async (
    recordId: string,
  ): Promise<{ publishingId: number; metadataVersion: number }> => {
    console.log("Fetching details for record ID:", recordId);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (hasChanceOfFailure && Math.random() < 0.3) {
          return reject(new Error("Error 429: Too Many Requests"));
        }
        const recordDetails = {
          isAuthentic: Math.random() < 0.5,
          publishingId: Math.floor(Math.random() * 1000),
          metadataVersion: Math.floor(Math.random() * 10) + 1,
        };
        console.log(
          `Fetched details for record ID ${recordId}:`,
          recordDetails,
        );
        resolve(recordDetails);
      }, timeout);
    });
  },
};

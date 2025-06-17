export type VinylRecord = {
  id: number;
  title: string;
  artist: string;
};

export type StoreResult = VinylRecord & {
  available: boolean;
  store?: string;
  price?: number;
};

export type VerifiedResult = StoreResult & {
  authentic: boolean;
  metadata: {
    publishingId: number;
    metadataVersion: number;
  };
};

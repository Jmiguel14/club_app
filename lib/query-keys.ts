export const queryKeys = {
  me: ["me"] as const,
  apartments: {
    all: ["apartments"] as const,
    detail: (id: number) => ["apartments", id] as const,
  },
  products: {
    all: ["products"] as const,
  },
  invoices: {
    all: ["invoices"] as const,
    detail: (id: number) => ["invoices", id] as const,
  },
};

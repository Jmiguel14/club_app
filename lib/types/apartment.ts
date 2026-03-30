/** Apartment record from club_api (roster / floor profiles). */
export type Apartment = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  created_at?: string;
  updated_at?: string;
};

export type ApartmentInput = {
  name: string;
  email: string;
  phone: string;
};

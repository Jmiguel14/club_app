"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import {
  createApartment,
  deleteApartment,
  updateApartment,
} from "@/lib/apartments-api";
import type { ApartmentInput } from "@/lib/types/apartment";
import { queryKeys } from "@/lib/query-keys";

export function useCreateApartmentMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (input: ApartmentInput) => createApartment(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.apartments.all });
      router.push("/dashboard/apartments");
    },
  });
}

export function useUpdateApartmentMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: number;
      input: ApartmentInput;
    }) => updateApartment(id, input),
    onSuccess: (_data, { id }) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.apartments.all });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.apartments.detail(id),
      });
      router.push("/dashboard/apartments");
    },
  });
}

export function useDeleteApartmentMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (apartmentId: number) => deleteApartment(apartmentId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.apartments.all });
      router.push("/dashboard/apartments");
    },
  });
}

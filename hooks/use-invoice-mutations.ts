"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import {
  createInvoice,
  deleteInvoice,
  updateInvoice,
  type InvoiceUpsertInput,
} from "@/lib/invoices-api";
import { queryKeys } from "@/lib/query-keys";

export function useCreateInvoiceMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (input: InvoiceUpsertInput) => createInvoice(input),
    onSuccess: (invoice) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all });
      router.push(`/dashboard/invoices/${invoice.id}/edit`);
    },
  });
}

export function useUpdateInvoiceMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: number;
      input: InvoiceUpsertInput;
    }) => updateInvoice(id, input),
    onSuccess: (_data, { id }) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.invoices.detail(id),
      });
      router.push("/dashboard/invoices");
    },
  });
}

export function useDeleteInvoiceMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: number) => deleteInvoice(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all });
      router.push("/dashboard/invoices");
    },
  });
}

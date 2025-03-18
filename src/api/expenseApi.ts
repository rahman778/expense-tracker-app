import {
  useInfiniteQuery,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

import apiFactory from "../base/apiFactory";
import {
  ExpenseData,
  ExpenseDataResponse,
  ExpensesDataResponse,
} from "../types/ExpenseData";
import { queryClient } from "../base/queryClient";
import { PAGE_LIMIT } from "../constants";

const URL = "expenses";

const api = apiFactory<ExpenseData>(URL);

export const {
  getOne: getExpenseById,
  getAll: getExpenses,
  create: createExpense,
  update: updateExpense,
  delete: deleteExpense,
} = api;

const createResourceHooks = <T>(resourceUrl: string) => {
  return {
    // Query to fetch all expenses (infinity option)
    useFetchExpenses: (
      category = "",
      sortBy = "createdAt",
      order = "desc",
      options?: any
    ) =>
      useInfiniteQuery<ExpensesDataResponse, AxiosError>({
        queryKey: [resourceUrl, category, sortBy, order],

        queryFn: ({ pageParam = 1 }) =>
          getExpenses({
            category,
            page: pageParam,
            limit: PAGE_LIMIT,
            sortBy,
            order,
          }),
        getNextPageParam: (lastPage, pages) => {
          const nextPage = pages.length + 1;
          return lastPage.data.length === PAGE_LIMIT ? nextPage : undefined;
        },
        ...options,
      }),

    // Query to fetch a single expense by ID
    useFetchExpenseById: (
      id: number,
      options?: UseQueryOptions<ExpenseDataResponse, AxiosError>
    ) =>
      useQuery<ExpenseDataResponse, AxiosError>({
        queryKey: [resourceUrl, id],
        queryFn: () => getExpenseById(id),
        ...options,
      }),

    // Mutation to create an expense
    useCreateExpense: (
      options?: UseMutationOptions<ExpenseDataResponse, AxiosError, Partial<T>>
    ) =>
      useMutation<ExpenseDataResponse, AxiosError, Partial<T>>({
        mutationFn: (data: Partial<T>) => createExpense(data),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [resourceUrl] });
          toast.success("Expense added successfully");
        },
        ...options,
      }),

    // Mutation to update an expense
    useUpdateExpense: (
      options?: UseMutationOptions<
        ExpenseDataResponse,
        AxiosError,
        { id: number; data: Partial<T> }
      >
    ) =>
      useMutation<
        ExpenseDataResponse,
        AxiosError,
        { id: number; data: Partial<T> }
      >({
        mutationFn: ({ id, data }) => updateExpense(id, data),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [resourceUrl] });
          toast.success("Expense updated successfully");
        },
        ...options,
      }),

    // Mutation to delete an expense
    useDeleteExpense: (
      options?: UseMutationOptions<number, AxiosError, number>
    ) =>
      useMutation<any, AxiosError, number>({
        mutationFn: (id: number) => deleteExpense(id),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [resourceUrl] });
          toast.success("Expense has been deleted");
        },
        ...options,
      }),
  };
};

export const expenseApiHooks = createResourceHooks<ExpenseData>(URL);

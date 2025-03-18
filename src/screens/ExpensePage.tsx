import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { toast, Zoom } from "react-toastify";

import Table from "../components/core/Table";
import AnimateSpin from "../components/indicators/AnimateSpin";
import OverlayIndicator from "../components/indicators/OverlayIndicator";
import { Column } from "../types/Column";
import { ExpenseData } from "../types/ExpenseData";
import useQueryParams from "../hooks/useQueryParams";
import { getCurrentUnixTimestamp } from "../utils/dateUtils";
import { expenseApiHooks } from "../api/expenseApi";
import { categoryOptions } from "../data/options";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import Error from "../components/core/Error";
import ExpenseHeader from "../components/headers/ExpenseHeader";

const ExpenseDialog = lazy(() => import("../components/dialogs/ExpenseDialog"));

const ExpensePage: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedExpenseID, setSelectedExpenseID] = useState<number | null>(
    null
  );

  const {
    useFetchExpenses,
    useCreateExpense,
    useUpdateExpense,
    useDeleteExpense,
  } = expenseApiHooks;

  const expenseFormControl = useForm({ mode: "onSubmit" });

  const { updateQueryParam, getQueryParam } = useQueryParams();

  const sort = getQueryParam("sort") || "createdAt_desc";
  const category = getQueryParam("category") || "";

  const [sortBy, order] = sort.split("_");

  const {
    data: expenseData,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useFetchExpenses(category, sortBy, order);

  const { mutate: addExpense, isPaused } = useCreateExpense();

  const { mutate: updateExpense } = useUpdateExpense();

  const { mutate: deleteExpense, isPending: isDeleting } = useDeleteExpense();

  useEffect(() => {
    if (isPaused) {
      toast.info("Offline mode: Expense data will sync when you're online", {
        position: "bottom-right",
        transition: Zoom,
        hideProgressBar: true,
      });
    }
  }, [isPaused]);

  const onSubmit = async (values: ExpenseData) => {
    try {
      if (selectedExpenseID) {
        updateExpense({ id: Number(selectedExpenseID), data: values });
      } else {
        const expenseData = {
          ...values,
          createdAt: getCurrentUnixTimestamp(), // Add the createdAt field in unix format
        };
        await addExpense(expenseData);
      }
    } catch (error) {
    } finally {
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    setIsDialogOpen(false);
  };

  const handleAddExpense = () => {
    setSelectedExpenseID(null);
    expenseFormControl.reset({
      title: "",
      amount: "",
      category: "",
      notes: "",
    });
    setIsDialogOpen(true);
  };

  const columns: Column<ExpenseData>[] = useMemo(
    () => [
      { header: "Title", key: "title" },
      {
        header: "Amount",
        key: "amount",
        render: (row) => {
          const amount = parseFloat(String(row?.amount));
          return isNaN(amount) ? "$ 0.00" : `$ ${amount.toFixed(2)}`;
        },
      },
      {
        header: "Category",
        key: "category",
        render: (row) => {
          const categoryLabel = categoryOptions.find(
            (option) => option.value === row.category
          )?.label;
          return categoryLabel || "Unknown";
        },
      },
      { header: "Notes", key: "notes" },
      {
        header: "Date",
        key: "createdAt",
        render: (row) => dayjs.unix(row.createdAt).format("MMM D YYYY, h:mm A"),
      },
      {
        header: "Actions",
        key: "actions",
        render: (row) => (
          <div className="flex items-center gap-4">
            <a
              onClick={() => {
                setSelectedExpenseID(Number(row.id));
                setIsDialogOpen(true);
              }}
            >
              <PencilSquareIcon className="h-5 w-5 transition-transform duration-300 text-[#757D8A] hover:text-slate-600 cursor-pointer" />
            </a>
            <a
              onClick={() => {
                deleteExpense(Number(row.id));
              }}
            >
              <TrashIcon className="h-5 w-5 transition-transform duration-300 text-red-500 hover:text-red-600 stroke-1 cursor-pointer" />
            </a>
          </div>
        ),
      },
    ],
    []
  );

  const flattenedData = expenseData?.pages.flatMap((page) => page.data) || [];

  if (error) {
    return (
      <Error
        onRetry={() => {
          updateQueryParam("category", null);
          refetch();
        }}
      />
    );
  }

  return (
    <>
      {(isLoading || isDeleting) && <OverlayIndicator />}
      <div className="m-3 md:m-5">
        {/* Expense header section */}
        <ExpenseHeader handleAddExpense={handleAddExpense} />

        {/* List of expenses */}
        <Table columns={columns} data={flattenedData} isLoading={isLoading} />

        {/* Load More button */}
        {hasNextPage && (
          <div className="text-center">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="button primary-btn-outline click-transition mt-5 w-32"
            >
              {isFetchingNextPage ? <AnimateSpin /> : "Load More"}
            </button>
          </div>
        )}

        {/* Expense Dialog lazy import*/}
        <Suspense fallback={null}>
          <ExpenseDialog
            modalIsOpen={isDialogOpen}
            onClose={() => handleCloseModal()}
            formControl={expenseFormControl}
            expenseID={selectedExpenseID}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
        </Suspense>
      </div>
    </>
  );
};

export default ExpensePage;

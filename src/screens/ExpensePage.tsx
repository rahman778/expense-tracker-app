import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Table from "../components/core/Table";
import { Column } from "../types/Column";
import { ExpenseData } from "../types/ExpenseData";
import { expenseApiHooks } from "../api/expenseApi";

import {
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import ExpenseDialog from "../components/dialogs/ExpenseDialog";
import { useForm } from "react-hook-form";
import Dropdown from "../components/forms/Dropdown";
import useQueryParams from "../hooks/useQueryParams";
import { getCurrentUnixTimestamp } from "../utils/dateUtils";
import AnimateSpin from "../components/indicators/AnimateSpin";
import { categoryOptions, sortingOptions } from "../data/options";

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
  } = useFetchExpenses(category, sortBy, order);

  const { mutate: addExpense } = useCreateExpense();

  const { mutate: updateExpense } = useUpdateExpense();

  const { mutate: deleteExpense } = useDeleteExpense();

  const onSubmit = async (values: ExpenseData) => {
    try {
      if (selectedExpenseID) {
        updateExpense({ id: Number(selectedExpenseID), data: values });
      } else {
        const expenseData = {
          ...values,
          createdAt: getCurrentUnixTimestamp(), // Add the createdAt field in unix format
        };
        addExpense(expenseData);
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
      { header: "Amount", key: "amount" },
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
  return (
    <div className="m-5">
      <div className="flex justify-between items-center mb-8 flex-wrap">
        <div className="max-w-[300px] flex gap-x-2 items-center mt-3 md:mt-0 relative">
          <label className="label text-md w-[70px]" htmlFor="category">
            Category
          </label>
          <Dropdown
            options={categoryOptions}
            name="category"
            selectedItem={category}
            placeholder="Select"
            className="py-2 cursor-pointer"
            onChange={(value: any) => {
              updateQueryParam("category", value);
            }}
            position="top-[40px]"
            hoverExpand
          />
        </div>

        <div className="max-w-[280px] flex gap-x-2 items-center mt-3 md:mt-0">
          <label className="label text-md w-[70px]" htmlFor="sort">
            Sort by
          </label>
          <Dropdown
            options={sortingOptions}
            name="sort"
            selectedItem={sort}
            placeholder="Sort By"
            className="py-2 cursor-pointer"
            onChange={(value: any) => {
              updateQueryParam("sort", value);
            }}
            position="top-[40px]"
            hoverExpand
          />
        </div>

        <button
          onClick={handleAddExpense}
          className="button primary-btn flex gap-1 mt-3 md:mt-0"
        >
          <PlusIcon className="h-5 w-5 text-white stroke-2" />
          <span className="text-md">Add Expenses</span>
        </button>
      </div>

      <Table columns={columns} data={flattenedData} />

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

      {(error || flattenedData.length < 1) && !isLoading && (
        <div>No data found</div>
      )}

      {/* Initial loading indicator */}
      {isLoading && <div>Loading...</div>}

      <ExpenseDialog
        modalIsOpen={isDialogOpen}
        onClose={() => handleCloseModal()}
        formControl={expenseFormControl}
        expenseID={selectedExpenseID}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ExpensePage;

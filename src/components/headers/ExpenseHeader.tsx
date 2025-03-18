import React from "react";
import Dropdown from "../forms/Dropdown";
import { categoryOptions, sortingOptions } from "../../data/options";
import useQueryParams from "../../hooks/useQueryParams";

import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

type Props = {
  handleAddExpense: () => void;
};

const ExpenseHeader: React.FC<Props> = ({ handleAddExpense }: Props) => {
  const { updateQueryParam, getQueryParam } = useQueryParams();

  const sort = getQueryParam("sort") || "createdAt_desc";
  const category = getQueryParam("category") || "";

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
      <div className="w-full sm:max-w-[300px] flex flex-col md:flex-row gap-1 md:items-center mt-3 md:mt-0 relative">
        <label htmlFor="category" className="label">
          Category
        </label>
        <Dropdown
          options={categoryOptions}
          name="category"
          selectedItem={category}
          placeholder="Select"
          className="py-2 cursor-pointer pr-14"
          onChange={(value: any) => {
            updateQueryParam("category", value);
          }}
          position="top-[40px]"
          hoverExpand
        />
        {category && (
          <span
            className="absolute bottom-2.5 md:inset-y-0 right-10 flex items-center cursor-pointer"
            onClick={() => updateQueryParam("category", null)}
          >
            <XMarkIcon className="text-stone-400 h-4 w-4 stroke-[3] hover:text-stone-500" />
          </span>
        )}
      </div>

      <div className="w-full sm:max-w-[300px] flex flex-col md:flex-row gap-1 md:items-center mt-3 md:mt-0">
        <label htmlFor="sort" className="label min-w-14">
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
        className="button primary-btn flex gap-1 mt-5 md:mt-0 w-full md:w-auto"
      >
        <PlusIcon className="h-5 w-5 text-white stroke-2" />
        <span className="text-md">Add Expenses</span>
      </button>
    </div>
  );
};

export default ExpenseHeader;

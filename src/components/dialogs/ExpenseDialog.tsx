import React, { useEffect } from "react";
import ReactModal from "react-modal";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Input from "../forms/Input";
import { ExpenseData } from "../../types/ExpenseData";
import TextArea from "../forms/TextArea";
import Dropdown from "../forms/Dropdown";
import { expenseApiHooks } from "../../api/expenseApi";
import { Controller } from "react-hook-form";
import { categoryOptions } from "../../data/options";

type Props = {
  modalIsOpen: boolean;
  onClose: (data?: boolean) => void;
  expenseID: number | null;
  formControl: any;
  onSubmit: (data: ExpenseData) => void;
  isLoading: boolean;
};

const ExpenseDialog: React.FC<Props> = ({
  modalIsOpen,
  onClose,
  expenseID,
  formControl,
  onSubmit,
  isLoading,
}: Props) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    clearErrors,
  } = formControl;

  const { useFetchExpenseById } = expenseApiHooks;

  const { data: expense } = useFetchExpenseById(Number(expenseID), {
    enabled: !!expenseID,
    queryKey: ["expense", expenseID],
  });

  useEffect(() => {
    if (expense) {
      reset(expense.data);
    }
  }, [expense, reset]);

  useEffect(() => {
    if (modalIsOpen) {
      clearErrors();
    }
  }, [modalIsOpen, reset, clearErrors]);

  function closeModal() {
    onClose(false);
  }

  return (
    <div>
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className="modal"
        overlayClassName="overlay"
        closeTimeoutMS={200}
        ariaHideApp={false}
      >
        <div className="relative">
          <h2 className="text-xl text-[#333] font-medium">
            {expenseID ? "Update Expense" : "Add Expense"}
          </h2>
          <button className="absolute top-0 right-0" onClick={closeModal}>
            <XMarkIcon className="text-stone-700 h-5 w-5 stroke-[3] hover:text-stone-900" />
          </button>

          <form
            className="space-y-5 mt-2"
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <Input
                {...register("title", {
                  required: "Please enter title",
                })}
                name="title"
                placeholder="Type your title"
                labelText="Title"
                requiredMarker
                error={errors.title ? true : false}
                helperText={errors.title ? errors.title.message : null}
              />
            </div>
            <div>
              <Input
                {...register("amount", {
                  required: "Please enter amount",
                })}
                name="amount"
                placeholder="Type your amount"
                labelText="Amount"
                requiredMarker
                type="number"
                error={errors.amount ? true : false}
                helperText={errors.amount ? errors.amount.message : null}
              />
            </div>

            <div>
              

              <Controller
                name="category"
                control={control}
                rules={{
                  required: "Please select a category",
                }}
                render={({ field }) => (
                  <Dropdown
                    options={categoryOptions}
                    name="category"
                    placeholder="Select your category"
                    selectedItem={field.value}
                    onChange={field.onChange}
                    labelText="Category"
                    requiredMarker
                    error={errors.category ? true : false}
                    helperText={
                      errors.category ? errors.category.message : null
                    }
                    
                  />
                )}
              />
            </div>

            <div>
              <TextArea
                {...register("notes")}
                name="notes"
                placeholder="Type your notes"
                labelText="Notes"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                className="button primary-btn-outline click-transition py-1.5 min-w-24 mt-4"
                disabled={isLoading}
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="button primary-btn click-transition py-1.5 min-w-24 mt-4"
                disabled={isLoading}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </ReactModal>
    </div>
  );
};

export default ExpenseDialog;

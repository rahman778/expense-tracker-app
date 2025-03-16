import React from "react";
import { Column } from "../../types/Column";

type Props<T> = {
  columns: Column<T>[];
  data: T[] | undefined;
};

const Table = <T,>({ columns, data }: Props<T>) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow-md">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-md font-medium text-gray-700 tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`${
                rowIndex % 2 === 0 ? "bg-[#F8F8F8]" : "bg-white"
              } hover:bg-gray-100 transition-colors`}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className="px-6 py-5 whitespace-nowrap text-sm text-[#404D61]"
                >
                  {column.render
                    ? column.render(row)
                    : (row[column.key as keyof T] as React.ReactNode) || "N/A"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

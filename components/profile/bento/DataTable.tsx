"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";

interface DataTableProps<T> {
  data: T[];
  columns: {
    key: keyof T;
    header: string;
    render?: (value: any, item: T) => ReactNode;
    className?: string;
  }[];
  onRowClick?: (item: T) => void;
  className?: string;
  emptyMessage?: string;
}

export function DataTable<T>({
  data,
  columns,
  onRowClick,
  className,
  emptyMessage = "No data available",
}: DataTableProps<T>) {
  return (
    <div className={cn("w-full overflow-hidden", className)}>
      {data.length > 0 ? (
        <div className="w-full overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className={cn(
                      "px-4 py-3 text-left text-xs font-medium text-[#645b4b] uppercase tracking-wider",
                      column.className
                    )}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={cn(
                    "border-b border-white/10 hover:bg-white/5 transition-colors",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick && onRowClick(item)}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={cn(
                        "px-4 py-3 text-sm",
                        column.className
                      )}
                    >
                      {column.render
                        ? column.render(item[column.key], item)
                        : (item[column.key] as ReactNode)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <FileText className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-[#645b4b]">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
}

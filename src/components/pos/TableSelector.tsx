import React from "react";
import { useTable } from "../../context/TableContext";
import { Users } from "lucide-react";

interface TableSelectorProps {
  selectedTableId: string | undefined;
  onSelectTable: (tableId: string) => void;
}

const TableSelector: React.FC<TableSelectorProps> = ({
  selectedTableId,
  onSelectTable,
}) => {
  const { tables } = useTable();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "occupied":
        return "bg-red-100 text-red-800";
      case "reserved":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-4 border-b border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Select Table</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {tables.map((table) => (
          <button
            key={table.id}
            onClick={() => onSelectTable(table.id)}
            disabled={
              table.status === "occupied" && table.id !== selectedTableId
            }
            className={`p-3 rounded-lg border ${
              selectedTableId === table.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            } ${
              table.status === "occupied" && table.id !== selectedTableId
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            <div className="text-lg font-medium">Table {table.number}</div>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Users className="h-4 w-4 mr-1" />
              {table.capacity}
            </div>
            <span
              className={`mt-2 inline-block px-2 py-0.5 text-xs rounded-full ${getStatusColor(
                table.status
              )}`}
            >
              {table.status}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TableSelector;

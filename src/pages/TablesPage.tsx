import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import { useTable } from "../context/TableContext";
import { useOrder } from "../context/OrderContext";
import { Plus, Users, Edit2, Trash2 } from "lucide-react";
import TableForm from "../components/tables/TableForm";

const TablesPage: React.FC = () => {
  const { tables, deleteTable } = useTable();
  const { orders } = useOrder();
  const [showTableForm, setShowTableForm] = useState(false);
  const [editingTable, setEditingTable] = useState<
    (typeof tables)[0] | undefined
  >();

  const handleEditTable = (table: (typeof tables)[0]) => {
    setEditingTable(table);
    setShowTableForm(true);
  };

  const handleDeleteTable = (id: string) => {
    const table = tables.find((t) => t.id === id);
    if (table?.status === "occupied") {
      alert("Cannot delete a table that is currently occupied");
      return;
    }
    if (window.confirm("Are you sure you want to delete this table?")) {
      deleteTable(id);
    }
  };

  const getTableStatusColor = (status: string) => {
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

  const getCurrentOrder = (tableId: string) => {
    return orders.find(
      (order) => order.tableId === tableId && order.status === "pending"
    );
  };

  return (
    <Layout title="Tables">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Table Management</h1>
          <p className="text-gray-600">Manage restaurant tables and seating</p>
        </div>

        <button
          onClick={() => {
            setEditingTable(undefined);
            setShowTableForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add Table
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tables.map((table) => {
          const currentOrder = getCurrentOrder(table.id);

          return (
            <div
              key={table.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Table {table.number}
                    </h3>
                    <div className="flex items-center mt-1">
                      <Users className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-500">
                        Capacity: {table.capacity}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full capitalize ${getTableStatusColor(
                      table.status
                    )}`}
                  >
                    {table.status}
                  </span>
                </div>

                {currentOrder && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-md">
                    <p className="text-sm font-medium text-blue-900">
                      Current Order: #{currentOrder.id.slice(-5)}
                    </p>
                    <p className="text-sm text-blue-700">
                      Items: {currentOrder.items.length}
                    </p>
                    <p className="text-sm text-blue-700">
                      Total: ${currentOrder.total.toFixed(2)}
                    </p>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleEditTable(table)}
                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTable(table.id)}
                    className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                    disabled={table.status === "occupied"}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showTableForm && (
        <TableForm
          table={editingTable}
          onSave={() => {
            setShowTableForm(false);
            setEditingTable(undefined);
          }}
          onCancel={() => {
            setShowTableForm(false);
            setEditingTable(undefined);
          }}
        />
      )}
    </Layout>
  );
};

export default TablesPage;

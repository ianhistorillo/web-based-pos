import React, { createContext, useContext, useState, useEffect } from "react";
import { Table } from "../types";

interface TableContextType {
  tables: Table[];
  addTable: (table: Omit<Table, "id">) => void;
  updateTable: (id: string, table: Partial<Table>) => void;
  deleteTable: (id: string) => void;
  getTableById: (id: string) => Table | undefined;
}

const TableContext = createContext<TableContextType | undefined>(undefined);

// Sample initial data
const INITIAL_TABLES: Table[] = [
  { id: "1", number: 1, capacity: 4, status: "available" },
  { id: "2", number: 2, capacity: 2, status: "available" },
  { id: "3", number: 3, capacity: 6, status: "available" },
  { id: "4", number: 4, capacity: 4, status: "available" },
];

export const TableProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tables, setTables] = useState<Table[]>([]);

  useEffect(() => {
    const savedTables = localStorage.getItem("posTables");
    setTables(savedTables ? JSON.parse(savedTables) : INITIAL_TABLES);
  }, []);

  useEffect(() => {
    if (tables.length > 0) {
      localStorage.setItem("posTables", JSON.stringify(tables));
    }
  }, [tables]);

  const addTable = (table: Omit<Table, "id">) => {
    const newTable = { ...table, id: Date.now().toString() };
    setTables([...tables, newTable]);
  };

  const updateTable = (id: string, table: Partial<Table>) => {
    setTables(tables.map((t) => (t.id === id ? { ...t, ...table } : t)));
  };

  const deleteTable = (id: string) => {
    setTables(tables.filter((table) => table.id !== id));
  };

  const getTableById = (id: string) => {
    return tables.find((table) => table.id === id);
  };

  return (
    <TableContext.Provider
      value={{
        tables,
        addTable,
        updateTable,
        deleteTable,
        getTableById,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};

export const useTable = (): TableContextType => {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error("useTable must be used within a TableProvider");
  }
  return context;
};

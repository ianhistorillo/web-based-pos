import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import MenuSelector from "../components/pos/MenuSelector";
import OrderSummary from "../components/pos/OrderSummary";
import TableSelector from "../components/pos/TableSelector";
import { useOrder } from "../context/OrderContext";

const POSPage: React.FC = () => {
  const { addItemToOrder, currentOrder, setTableForOrder } = useOrder();
  const [selectedTableId, setSelectedTableId] = useState<string | undefined>(
    currentOrder?.tableId
  );

  const handleTableSelect = (tableId: string) => {
    setSelectedTableId(tableId);
    setTableForOrder(tableId);
  };

  return (
    <Layout title="Point of Sale">
      <div className="h-[calc(100vh-10rem)] grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
          <TableSelector
            selectedTableId={selectedTableId}
            onSelectTable={handleTableSelect}
          />
          <MenuSelector onSelectItem={addItemToOrder} />
        </div>

        <div>
          <OrderSummary />
        </div>
      </div>
    </Layout>
  );
};

export default POSPage;

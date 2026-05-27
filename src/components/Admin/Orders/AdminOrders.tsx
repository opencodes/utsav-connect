import React, { useState, useEffect } from 'react';
import { fetchAdminOrders, updateAdminOrderStatus, type AdminOrderRow } from '../../../api/admin';
import { KanbanBoard } from './KanbanBoard';
import { OrderDetailsDrawer } from './OrderDetailsDrawer';
import { AssignRiderModal } from './AssignRiderModal';
import { AdminEmptyState } from '../AdminEmptyState';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<AdminOrderRow[]>([]);

  const [selectedOrder, setSelectedOrder] = useState<AdminOrderRow | null>(null);

  const loadOrders = () => {
    void fetchAdminOrders()
      .then(setOrders)
      .catch(() => setOrders([]));
  };

  useEffect(() => {
    loadOrders();
  }, []);
  const [showRiderModal, setShowRiderModal] = useState<string | null>(null);

  const ridersList: string[] = [];
  const kanbanStages = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'];

  const handleStageAdvance = (orderId: string, currentStatus: string) => {
    const idx = kanbanStages.indexOf(currentStatus);
    if (idx < kanbanStages.length - 1) {
      const nextStatus = kanbanStages[idx + 1];
      void updateAdminOrderStatus(orderId, nextStatus)
        .then(() => {
          const updatedOrders = orders.map((o) =>
            o.id === orderId ? { ...o, status: nextStatus } : o
          );
          setOrders(updatedOrders);
          if (selectedOrder && selectedOrder.id === orderId) {
            setSelectedOrder({ ...selectedOrder, status: nextStatus });
          }
        })
        .catch(() => alert('Failed to update order status'));
    }
  };

  const handleAssignRider = (orderId: string, rider: string) => {
    const updatedOrders = orders.map((o) => (o.id === orderId ? { ...o, partner: rider } : o));
    setOrders(updatedOrders);
    setShowRiderModal(null);

    // Update selected drawer if open
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, partner: rider });
    }
    alert(`Success! Satvik rider ${rider} assigned on high priority to order ${orderId}.`);
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300" id="admin-orders-tab">
      {orders.length === 0 ? (
        <AdminEmptyState
          title="No orders yet"
          description="Orders from the platform will appear here for fulfillment tracking."
        />
      ) : null}
      <KanbanBoard
        orders={orders}
        stages={kanbanStages}
        onSelectOrder={setSelectedOrder}
        onAdvanceStage={handleStageAdvance}
        onOpenRiderModal={setShowRiderModal}
      />

      <OrderDetailsDrawer
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onAdvanceStage={handleStageAdvance}
      />

      <AssignRiderModal
        orderId={showRiderModal}
        onClose={() => setShowRiderModal(null)}
        ridersList={ridersList}
        onAssignRider={handleAssignRider}
      />
    </div>
  );
};

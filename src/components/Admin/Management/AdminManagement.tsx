import React, { useState, useEffect } from 'react';
import { Restaurant } from '../../../types';
import { fetchRestaurants } from '../../../api/restaurants';
import { createRestaurant, deleteRestaurant } from '../../../api/admin';
import { RestaurantSearchBar } from './RestaurantSearchBar';
import { RestaurantTable } from './RestaurantTable';
import { AddRestaurantModal } from './AddRestaurantModal';

export const AdminManagement: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [statusMap, setStatusMap] = useState<Record<string, boolean>>({});

  const reload = () => {
    void fetchRestaurants().then((list) => {
      setRestaurants(list);
      const statuses: Record<string, boolean> = {};
      list.forEach((r) => {
        statuses[r.id] = true;
      });
      setStatusMap(statuses);
    });
  };

  useEffect(() => {
    reload();
  }, []);

  const handleToggleStatus = (id: string) => {
    setStatusMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDeleteStore = (id: string) => {
    if (confirm('Are you sure you want to pull this kitchen joint off Noida databases?')) {
      void deleteRestaurant(id)
        .then(() => reload())
        .catch(() => alert('Failed to delete restaurant'));
    }
  };

  const handleCreateRestaurant = (
    newRestData: Omit<Restaurant, 'id' | 'rating' | 'ratingCount' | 'distance' | 'featuredDishes' | 'menu'>
  ) => {
    void createRestaurant({
      id: `rest-${Date.now()}`,
      name: newRestData.name,
      cuisine: newRestData.cuisine,
      rating: 4.5,
      ratingCount: 1,
      deliveryTime: newRestData.deliveryTime,
      distance: 2.3,
      costForTwo: newRestData.costForTwo,
      image: newRestData.image,
      featuredDishes: ['Festival Feast Thali'],
      menu: [],
    })
      .then(() => {
        reload();
        setShowAddModal(false);
        alert('Kitchen store registered and pushed into active Satvik approval grid pipeline.');
      })
      .catch(() => alert('Failed to create restaurant'));
  };

  const filtered = restaurants.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.cuisine.join(' ').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300" id="admin-management-tab">
      <RestaurantSearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAddModal={() => setShowAddModal(true)}
      />

      <RestaurantTable
        restaurants={filtered}
        statusMap={statusMap}
        onToggleStatus={handleToggleStatus}
        onDeleteRestaurant={handleDeleteStore}
      />

      <AddRestaurantModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleCreateRestaurant}
      />
    </div>
  );
};

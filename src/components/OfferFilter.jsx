import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

const OfferFilter = ({ onFilterChange, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    dateRange: '',
    materialType: '',
    route: ''
  });

  const statusOptions = [
    'All',
    'PENDING',
    'ACCEPTED',
    'REJECTED'
  ];

  const materialTypes = [
    'All',
    'Electronics & Technology',
    'Automotive Parts',
    'Machinery & Equipment',
    'Textiles & Clothing',
    'Food & Beverages',
    'Pharmaceuticals',
    'Chemicals',
    'Raw Materials',
    'Construction Materials',
    'Furniture & Home Goods',
    'Books & Documents',
    'Hazardous Materials',
    'Fragile Items',
    'Perishable Goods',
    'Others'
  ];

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    onFilterChange({ status, ...advancedFilters });
  };

  const handleAdvancedFilterChange = (key, value) => {
    const newFilters = { ...advancedFilters, [key]: value };
    setAdvancedFilters(newFilters);
    onFilterChange({ status: selectedStatus, ...newFilters });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedStatus('All');
    setAdvancedFilters({
      dateRange: '',
      materialType: '',
      route: ''
    });
    onSearch('');
    onFilterChange({ status: 'All', dateRange: '', materialType: '', route: '' });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      {/* Main Filter Row */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by Shipment ID"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
          />
        </div>

        {/* Status Dropdown */}
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="appearance-none bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>
                Status: {status}
              </option>
            ))}
          </select>
        </div>

        {/* Advanced Filter Toggle */}
        <button
          onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <Filter size={20} />
          Advanced Filter
        </button>

        {/* Clear Filter */}
        <button
          onClick={clearAllFilters}
          className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          Clear Filter
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilter && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <select
                value={advancedFilters.dateRange}
                onChange={(e) => handleAdvancedFilterChange('dateRange', e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>

            {/* Material Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Material Type
              </label>
              <select
                value={advancedFilters.materialType}
                onChange={(e) => handleAdvancedFilterChange('materialType', e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {materialTypes.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Route */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Route
              </label>
              <input
                type="text"
                placeholder="e.g., Mumbai to Delhi"
                value={advancedFilters.route}
                onChange={(e) => handleAdvancedFilterChange('route', e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferFilter;
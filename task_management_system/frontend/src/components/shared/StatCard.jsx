// src/components/shared/StatCard.jsx
import React from "react";

const StatCard = ({ title, value, unit }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {unit && <p className="text-sm text-gray-500">{unit}</p>}
    </div>
  );
};

export default StatCard;

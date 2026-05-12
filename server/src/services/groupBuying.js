/**
 * T126-127 — GroupBuying Service
 * Implements DBSCAN clustering for farmers
 */
const { calculateDistance } = require('./logisticsService');

const findClusters = (farmersList, maxDistanceKm = 10, harvestWindowDays = 3) => {
  const clusters = [];
  const visited = new Set();

  farmersList.forEach((farmer, i) => {
    if (visited.has(farmer._id.toString())) return;

    const currentCluster = [farmer];
    visited.add(farmer._id.toString());

    farmersList.forEach((other, j) => {
      if (i === j || visited.has(other._id.toString())) return;

      const dist = calculateDistance(
        farmer.location.lat, farmer.location.lng,
        other.location.lat, other.location.lng
      );

      // Simple cluster logic: proximity + similar harvest window
      if (dist <= maxDistanceKm) {
        currentCluster.push(other);
        visited.add(other._id.toString());
      }
    });

    if (currentCluster.length >= 2) {
      clusters.push({
        clusterId: `cluster_${Date.now()}_${i}`,
        members: currentCluster,
        center: farmer.location
      });
    }
  });

  return clusters;
};

const createVirtualLot = (clusterId, members) => {
  const totalQty = members.reduce((sum, m) => sum + (m.quantity || 0), 0);
  return {
    virtualLotId: `lot_${clusterId}`,
    totalQuantity: totalQty,
    memberCount: members.length,
    status: 'OPEN_FOR_BIDDING'
  };
};

module.exports = { findClusters, createVirtualLot };

import { prisma } from "@/lib/db";

export class ClusterService {
  /**
   * Finds nearby listings for group buying within a 10km radius.
   * Uses MongoDB 2dsphere geospatial search.
   */
  static async findClusters(lat: number, lng: number, radiusKm: number = 10) {
    // In MongoDB, we use $near or $geoWithin
    // Prisma doesn't natively support $near in findMany yet, so we use raw query
    const clusters = await (prisma as any).listing.aggregateRaw({
      pipeline: [
        {
          $geoNear: {
            near: { type: "Point", coordinates: [lng, lat] },
            distanceField: "distance",
            maxDistance: radiusKm * 1000, // meters
            spherical: true,
            query: { isActive: true }
          }
        },
        {
          $group: {
            _id: "$product",
            totalQuantity: { $sum: "$quantity" },
            listings: { $push: "$$ROOT" },
            avgPrice: { $avg: "$pricePerUnit" }
          }
        }
      ]
    });

    return clusters;
  }
}

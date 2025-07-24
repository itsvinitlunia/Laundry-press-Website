// 🔥 data/orders.js // assumed to be a static version or fetched in advance
import clothingRates from "./clothingrates.js";

const serviceNameMap = {
  "Wash & Fold": "washFold",
  "Dry Clean": "dryClean",
  "Iron Only": "ironOnly",
  "Wash + Iron": "washIron"
};

const generateOrders = (userIds, driverIds, Timestamp) => {
  const orders = [];

  const services = Object.keys(serviceNameMap);

  const statuses = [
    "Requested",
    "Picked Up",
    "In Laundry",
    "Ready for Delivery",
    "Out for Delivery",
    "Delivered"
  ];

  const clothingTypes = Object.keys(clothingRates); // e.g., ["Shirt", "Trouser", ...]

  for (let i = 0; i < Math.min(15, userIds.length); i++) {
    const service = services[i % services.length];
    const serviceKey = serviceNameMap[service];

    const now = Timestamp.now();

    // Create items dynamically from known clothingTypes
    const items = clothingTypes
      .slice(0, 2 + (i % 3)) // 2–4 items per order
      .map(type => ({
        type,
        quantity: Math.floor(Math.random() * 3) + 1 // 1–3 qty
      }));

    // Compute total service price based on clothingRates
    let servicePrice = 0;
    for (const item of items) {
      const rateEntry = clothingRates[item.type];
      const ratePerItem = rateEntry?.rates?.[serviceKey] ?? 0;
      servicePrice += ratePerItem * item.quantity;
    }

    const deliveryFee = 20;
    const total = servicePrice + deliveryFee;

    // Timings
    const pickupETA = Timestamp.fromDate(new Date(Date.now() + (3 + Math.random() * 2) * 60000));
    const laundryDuration = 8 + Math.floor(Math.random() * 3);
    const laundryReadyAt = Timestamp.fromDate(new Date(pickupETA.toDate().getTime() + laundryDuration * 60000));
    const deliveryETA = Timestamp.fromDate(new Date(laundryReadyAt.toDate().getTime() + (3 + Math.random() * 2) * 60000));

    const totalTime = Math.round((deliveryETA.toDate().getTime() - now.toDate().getTime()) / 60000);

    orders.push({
      orderId: `LD${String(i + 1).padStart(4, "0")}`,
      userId: userIds[i],
      driverId: driverIds[i % driverIds.length],

      serviceType: service,
      servicePrice,
      deliveryFee,
      total,
      items,

      status: statuses[i % statuses.length],
      priority: i % 3 === 0 ? "express" : "normal",

      orderPlacedAt: now,
      pickupETA,
      laundryReadyAt,
      deliveryETA,
      estimatedTotalTime: `${totalTime} minutes`,

      specialInstructions: i % 4 === 0 ? "Handle with care - delicate items" : "",

      statusHistory: [
        {
          status: "Requested",
          timestamp: now,
          note: "Order placed successfully"
        }
      ]
    });
  }

  return orders;
};

export default generateOrders;

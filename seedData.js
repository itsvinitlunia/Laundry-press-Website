import db from "./firebase.js";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import addresses from "./data/users.js";
import driversData from "./data/drivers.js";
import generateOrders from "./data/orders.js";

const driverIds = [];
const userIds = [];

async function addDrivers() {
  for (let driver of driversData) {
    const res = await addDoc(collection(db, "drivers"), {
      ...driver,
      status: "available",
      currentLocation: { area: "Powai", lastUpdated: Timestamp.now() },
      totalOrders: Math.floor(Math.random() * 50) + 10,
      rating: (4 + Math.random()).toFixed(1),
      isOnline: true,
      createdAt: Timestamp.now()
    });
    driverIds.push(res.id);
  }
  console.log("✅ Drivers added");
}

async function addUsers() {
  for (let i = 0; i < addresses.length; i++) {
    const res = await addDoc(collection(db, "users"), {
      name: `User ${i + 1}`,
      phone: `90000${10000 + i}`,
      email: `user${i + 1}@example.com`,
      address: addresses[i],
      totalOrders: Math.floor(Math.random() * 10),
      createdAt: Timestamp.now(),
      isActive: true
    });
    userIds.push(res.id);
  }
  console.log("✅ Users added");
}

async function addServices() {
  const services = [
    { serviceId: "wash-fold", name: "Wash & Fold", price: 80, time: 12 },
    { serviceId: "dry-clean", name: "Dry Clean", price: 150, time: 15 },
    { serviceId: "iron-only", name: "Iron Only", price: 50, time: 10 },
    { serviceId: "wash-iron", name: "Wash + Iron", price: 120, time: 8 }
  ];

  for (let service of services) {
    await addDoc(collection(db, "services"), {
      ...service,
      description: `${service.name} service`,
      isActive: true,
      displayOrder: 1
    });
  }
  console.log("✅ Services added");
}

async function addClothingRates() {
  const rates = [
    {
      type: "Shirt",
      rates: { washFold: 20, ironOnly: 15, dryClean: 120, washIron: 40 }
    },
    {
      type: "Trouser",
      rates: { washFold: 25, ironOnly: 20, dryClean: 130, washIron: 50 }
    },
    {
      type: "Dress",
      rates: { washFold: 30, ironOnly: 30, dryClean: 150, washIron: 70 }
    },
    {
      type: "Traditional",
      rates: { washFold: 35, ironOnly: 30, dryClean: 180, washIron: 80 }
    }
  ];
  for (const rate of rates) {
    await addDoc(collection(db, "clothingRates"), rate);
  }
  console.log("✅ Clothing rates added");
}

async function addOrders() {
  const orders = generateOrders(userIds, driverIds, Timestamp);
  for (let order of orders) {
    await addDoc(collection(db, "orders"), order);
  }
  console.log("✅ Orders added");
}

async function addSettings() {
  await addDoc(collection(db, "settings"), {
    deliveryRadius: 5,
    minOrderValue: 50,
    deliveryFee: 20,
    expressCharge: 40,
    operatingHours: { start: "08:00", end: "22:00" },
    estimatedTimes: { pickup: 5, laundry: 10, delivery: 5 },
    isOperational: true,
    lastUpdated: Timestamp.now()
  });
  console.log("✅ Settings added");
}

async function seed() {
  await addServices();
  await addClothingRates();
  await addDrivers();
  await addUsers();
  await addOrders();
  await addSettings();
  console.log("🎉 Database seeding complete!");
}

seed();

// 🔄 resetData.js
import db from "./firebase.js";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

async function deleteAll(collectionName) {
  try {
    const snap = await getDocs(collection(db, collectionName));
    let count = 0;
    for (let d of snap.docs) {
      await deleteDoc(doc(db, collectionName, d.id));
      count++;
    }
    console.log(`🧹 Cleared ${count} documents from '${collectionName}'`);
  } catch (error) {
    console.log(`⚠️ Error clearing collection '${collectionName}':`, error.message);
  }
}

async function reset() {
  console.log("🔄 Starting full Firestore reset...");

  const collections = ["users", "drivers", "orders", "services", "settings"];
  for (const name of collections) {
    await deleteAll(name);
  }

  console.log("🔥 Database reset complete!");
}

reset().catch((err) => console.error("❌ Reset script failed:", err));

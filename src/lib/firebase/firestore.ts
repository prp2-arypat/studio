"use server";

import { db } from "@/lib/firebase/client";
import type { SimulationInput, SimulationResult, StoredSimulation } from "@/lib/types";
import { collection, addDoc, getDocs, query, where, Timestamp, orderBy, limit } from "firebase/firestore";

export async function addSimulation(
  userId: string,
  inputs: SimulationInput,
  results: SimulationResult
): Promise<void> {
  try {
    await addDoc(collection(db, "simulations"), {
      userId,
      inputs,
      results,
      timestamp: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error adding simulation: ", error);
    throw new Error("Could not save simulation.");
  }
}

export async function getSimulationsForUser(userId: string): Promise<StoredSimulation[]> {
  const q = query(
    collection(db, "simulations"),
    where("userId", "==", userId),
    orderBy("timestamp", "desc"),
    limit(10)
  );

  const querySnapshot = await getDocs(q);
  const simulations: StoredSimulation[] = [];
  querySnapshot.forEach((doc) => {
    simulations.push({ id: doc.id, ...doc.data() } as StoredSimulation);
  });

  return simulations;
}

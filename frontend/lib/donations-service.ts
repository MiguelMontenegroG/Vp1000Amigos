import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export type PaymentMethod = "efectivo" | "transferencia";
export type BankName = "Nequi" | "Daviplata" | "Bancolombia" | "Davivienda" | "BBVA" | "Banco de Bogota" | "Otro";

export interface Donation {
  id: string;
  name: string;
  amount: number;
  paymentMethod: PaymentMethod;
  bank?: BankName;
  date: Date;
}

interface FirestoreDonation {
  name: string;
  amount: number;
  paymentMethod: PaymentMethod;
  bank?: BankName;
  createdAt: Timestamp;
}

const COLLECTION_NAME = "donations";
const donationsRef = collection(db, COLLECTION_NAME);

// Obtener todas las donaciones en tiempo real
export function subscribeToDonations(
  callback: (donations: Donation[]) => void
) {
  const q = query(donationsRef, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const donations: Donation[] = snapshot.docs.map((doc) => {
      const data = doc.data() as FirestoreDonation;
      return {
        id: doc.id,
        name: data.name,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        bank: data.bank,
        date: data.createdAt?.toDate() ?? new Date(),
      };
    });
    callback(donations);
  });
}

// Agregar una donacion
export async function addDonation(
  name: string,
  amount: number,
  paymentMethod: PaymentMethod,
  bank?: BankName
) {
  const docRef = await addDoc(donationsRef, {
    name,
    amount,
    paymentMethod,
    bank: bank ?? null,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// Eliminar una donacion
export async function deleteDonation(id: string) {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
}

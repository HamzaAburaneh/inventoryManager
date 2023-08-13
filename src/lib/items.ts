import { collection, addDoc, deleteDoc, doc, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { Item } from '../types';

export async function getItems(): Promise<Item[]> {
	const itemsQuery = collection(db, 'items');
	const snapshot = await getDocs(itemsQuery);
	return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Item));
}

export async function addItem(item: Omit<Item, 'id'>): Promise<string> {
	const itemCollection = collection(db, 'items');
	const docRef = await addDoc(itemCollection, item);
	return docRef.id;
}

export async function deleteItem(id: string): Promise<void> {
	const itemDoc = doc(db, 'items', id);
	await deleteDoc(itemDoc);
}

export async function editItemName(id: string, newName: string): Promise<void> {	
	const itemDoc = doc(db, 'items', id);
	await updateDoc(itemDoc, { name: newName });
}

export async function editItemLowCount(id: string, newLowCount: number): Promise<void> {
	const itemDoc = doc(db, 'items', id);
	await updateDoc(itemDoc, { lowCount: newLowCount });
}

export async function editItemCost(id: string, newCost: number): Promise<void> {
	const itemDoc = doc(db, 'items', id);
	await updateDoc(itemDoc, { cost: newCost });
}

//edit item barcode
export async function editItemBarcode(id: string, newBarcode: string): Promise<void> {
	const itemDoc = doc(db, 'items', id);
	await updateDoc(itemDoc, { barcode: newBarcode });
}
//edit item storage type
export async function editItemStorageType(id: string, newStorageType: string): Promise<void> {
	const itemDoc = doc(db, 'items', id);
	await updateDoc(itemDoc, { storageType: newStorageType });
}

export async function searchItems(name: string): Promise<Item[]> {
	const itemsQuery = name
		? query(collection(db, 'items'),where('name', '>=', name),where('name', '<=', name + '\uf8ff')) : collection(db, 'items');
	const snapshot = await getDocs(itemsQuery);
	return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Item));
}

import { Sale } from "../models/SalesModel"
import { api } from "../lib/axios";
 
export async function getSales(): Promise<Sale[]> {
    try {
        const response = await api.get<Sale[]>('/sales')

        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}
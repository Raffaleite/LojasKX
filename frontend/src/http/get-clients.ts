import { Client } from "../models/ClientsModel"
import { api } from "../lib/axios";
 
export async function getClients(): Promise<Client[]> {
    try {
        const response = await api.get<Client[]>('/users')

        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}
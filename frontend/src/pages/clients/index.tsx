import { useState } from 'react';
import { UserRoundPen, UserRoundX } from 'lucide-react';
import { Sidebar } from '../../components/sidebar';
import { toast } from 'sonner';
import InputMask from 'react-input-mask';
import { api } from "../../lib/axios";
import { useQuery, useQueryClient } from "react-query";
import { getClients } from '../../http/get-clients';

interface Client {
  id: number;
  name: string;
  email: string;
  cpf: string;
  celular: string;
  status: boolean;
}

export function Clients() {
  const [name, setName] = useState('');
  const [clientId, setClientId] = useState<number | undefined>();
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [celular, setCelular] = useState('');
  const [status, setStatus] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientModalName, setClientModalName] = useState('')
  const [clientModalEmail, setClientModalEmail] = useState('')
  const [clientModalCpf, setClientModalCpf] = useState('')
  const [clientModalCelular, setClientModalCelular] = useState('')
  const [clientModalStatus, setClientModalStatus] = useState(false)


  const queryClient = useQueryClient();

  const { data: clientsData, isError: isClientsError, isLoading: isClientsLoading } = useQuery("clients-list", getClients);

  const handleEditClick = async (clientId: number) => {
    try {
      const response = await api.get<Client>(`/users/${clientId}`);
      setClientId(response.data.id);
      setClientModalName(response.data.name);
      setClientModalEmail(response.data.email);
      setClientModalCpf(response.data.cpf);
      setClientModalCelular(response.data.celular);
      setClientModalStatus(response.data.status);
      setIsModalOpen(true);
    } catch (error) {
      toast.error('Erro ao buscar informações do cliente.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    try {
      const formDataToSend = {
        name,
        email,
        cpf,
        celular,
        status: status ? 1 : 0,
      };

      await api.post('/users', formDataToSend, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      toast.success('Cliente criado com sucesso!');

      setName('');
      setEmail('');
      setCpf('');
      setCelular('');
      setStatus(false);

      queryClient.invalidateQueries("clients-list");
    } catch (error: any) {
      toast.error('Erro ao criar o usuário');
    }
  };

  const handleEditSubmit = async(clientId: number | undefined) => {

    if (clientId === undefined) {
      toast.error('ID do cliente não encontrado.');
      return;
    }

    const formDataToSend = {
      name: clientModalName,
      email: clientModalEmail,
      cpf: clientModalCpf,
      celular: clientModalCelular,
      status: clientModalStatus ? 1 : 0,
    };
  
    try {
      await api.put(`/users/${clientId}`, formDataToSend, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      toast.success('Cliente atualizado com sucesso!');
      setIsModalOpen(false); 
      queryClient.invalidateQueries("clients-list");
    } catch (error: any) {
      toast.error('Erro ao atualizar o cliente.');
    }


  }

  const handleDeleteClient = async (clientId: number) => {
    const confirmDelete = window.confirm("Você tem certeza que deseja excluir este cliente?");
    if (!confirmDelete) return;
  
    try {
      await api.delete(`/users/${clientId}`);
      toast.success('Cliente excluído com sucesso!');
      
      queryClient.invalidateQueries("clients-list");
    } catch (error: any) {
      toast.error('Erro ao excluir o cliente.');
    }
  };

  if (isClientsLoading) return <p>Carregando...</p>;
  if (isClientsError) return <p>Erro ao carregar clientes.</p>;

  return (
    <>
      <div className="flex flex-col lg:flex-row h-screen bg-gray-100">
        <Sidebar />

        <div className="flex-1 p-8 overflow-auto">
          <header className="flex flex-col sm:flex-row items-center bg-blue-700 p-5 rounded-md">
            <h1 className="text-2xl font-semibold text-white">Clientes</h1>
          </header>

          <form onSubmit={handleSubmit} className="mt-6 bg-white p-6 rounded-md shadow-md space-y-4">
            <div className="flex flex-col">
              <label htmlFor="name" className="font-medium text-black">
                Nome
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 rounded-md text-black"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="font-medium text-black">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 rounded-md text-black"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="cpf" className="font-medium text-black">
                CPF
              </label>
              <InputMask
                mask="999.999.999-99"
                type="text"
                id="cpf"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                className="border p-2 rounded-md text-black"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="celular" className="font-medium text-black">
                Celular
              </label>
              <InputMask
                mask="(99)99999-9999"
                type="text"
                id="celular"
                value={celular}
                onChange={(e) => setCelular(e.target.value)}
                className="border p-2 rounded-md text-black"
                required
              />
            </div>

            <div className="flex items-center space-x-2 text-black">
              <input
                type="checkbox"
                id="status"
                checked={status}
                onChange={(e) => setStatus(e.target.checked)}
                className="cursor-pointer"
              />
              <label htmlFor="status" className="font-medium">
                Ativo
              </label>
            </div>

            <button
              type="submit"
              className="self-end w-full sm:w-auto p-2 bg-blue-500 text-white rounded-md font-inter hover:bg-blue-600"
            >
              + Cadastrar Cliente
            </button>
          </form>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-black">Clientes Cadastrados</h2>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full bg-white rounded-md shadow-md">
                <thead>
                  <tr className="bg-gray-200 text-black text-left font-inter">
                    <th className="p-3">Nome</th>
                    <th className="p-3">E-mail</th>
                    <th className="p-3">CPF</th>
                    <th className="p-3">Celular</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clientsData?.map((client) => (
                    <tr key={client.id} className="border-t text-black font-inter">
                      <td className="p-3">{client.name}</td>
                      <td className="p-3">{client.email}</td>
                      <td className="p-3">{client.cpf}</td>
                      <td className="p-3">{client.celular}</td>
                      <td className="p-3">
                        {client.status ? 'Ativo' : 'Inativo'}
                      </td>
                      <td className="p-3 text-center flex gap-3">
                        <UserRoundPen className='size-5 text-blue-400 cursor-pointer hover:text-blue-500' onClick={() => handleEditClick(client.id)} />
                        <UserRoundX className='size-5 text-red-400 cursor-pointer hover:text-red-500' onClick={() => handleDeleteClient(client.id)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-md space-y-4 w-96">
              <h2 className="text-xl font-semibold text-black">Editar Cliente</h2>
              <form onSubmit={() => handleEditSubmit(clientId)} className="space-y-4">
                <div className="flex flex-col">
                  <label htmlFor="nameModal" className="font-medium text-black">Nome</label>
                  <input
                    type="text"
                    id="nameModal"
                    value={clientModalName}
                    onChange={(e) => setClientModalName(e.target.value)}
                    className="border p-2 rounded-md text-black"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="emailModal" className="font-medium text-black">E-mail</label>
                  <input
                    type="email"
                    id="emailModal"
                    value={clientModalEmail}
                    onChange={(e) => setClientModalEmail(e.target.value)}
                    className="border p-2 rounded-md text-black"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="cpfModal" className="font-medium text-black">CPF</label>
                  <InputMask
                    mask="999.999.999-99"
                    type="text"
                    id="cpfModal"
                    value={clientModalCpf}
                    onChange={(e) => setClientModalCpf(e.target.value)}
                    className="border p-2 rounded-md text-black"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="celularModal" className="font-medium text-black">Celular</label>
                  <InputMask
                    mask="(99)99999-9999"
                    type="text"
                    id="celularModal"
                    value={clientModalCelular}
                    onChange={(e) => setClientModalCelular(e.target.value)}
                    className="border p-2 rounded-md text-black"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2 text-black">
                  <input
                    type="checkbox"
                    id="statusModal"
                    checked={clientModalStatus}
                    onChange={(e) => setClientModalStatus(e.target.checked)}
                    className="cursor-pointer"
                  />
                  <label htmlFor="statusModal" className="font-medium">Ativo</label>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
    </>
  );
}

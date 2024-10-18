import { useState } from 'react';
import { Pencil, Trash2} from 'lucide-react';
import { Sidebar } from '../../components/sidebar';
import { toast } from 'sonner';
import { api } from "../../lib/axios";
import { useQuery, useQueryClient } from "react-query";
import { getSales } from '../../http/get-sales';

interface Sales {
    id: number;                
    produto_nome: string;     
    quantidade: string;       
    preco: string;            
    data_venda: string;
}

export function Sales() {
  const [productName, setProductName] = useState('');
  const [saleId, setSalesId] = useState<number | undefined>();
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saleModalProduct, setSaleModalProduct] = useState('')
  const [saleModalQuantity, setSaleModalQuantity] = useState('')
  const [saleModalPrice, setSaleModalPrice] = useState('')



  const queryClient = useQueryClient();

  const { data: salesData, isError: isSalesError, isLoading: isSalesLoading } = useQuery("sales-list", getSales);

  const handleEditClick = async (salesId: number) => {
    try {
      const response = await api.get<Sales>(`/sales/${salesId}`);
      setSalesId(response.data.id);
      setSaleModalProduct(response.data.produto_nome);
      setSaleModalQuantity(response.data.quantidade);
      setSaleModalPrice(response.data.preco);
      setIsModalOpen(true);
    } catch (error) {
      toast.error('Erro ao buscar informações do cliente.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const produto_nome = productName;
    const quantidade = quantity;
    const preco = price

    try {
      const formDataToSend = {
        produto_nome,
        quantidade,
        preco,
      };

      await api.post('/sales', formDataToSend, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      toast.success('Venda cadastrada com sucesso!');

      setProductName('');
      setQuantity('');
      setPrice('');

      queryClient.invalidateQueries("sales-list");
    } catch (error: any) {
      toast.error('Erro ao cadastrar venda');
    }
  };

  const handleEditSubmit = async(saleId: number | undefined) => {

    if (saleId === undefined) {
      toast.error('ID do cliente não encontrado.');
      return;
    }

    const formDataToSend = {
      produto_nome: saleModalProduct,
      quantidade: saleModalQuantity,
      preco: saleModalPrice,
    };
  
    try {
      await api.put(`/sales/${saleId}`, formDataToSend, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      toast.success('Venda atualizada com sucesso!');
      setIsModalOpen(false); 
      queryClient.invalidateQueries("sales-list");
    } catch (error: any) {
      toast.error('Erro ao atualizar a venda.');
    }


  }

  const handleDeleteClient = async (saleId: number) => {
    const confirmDelete = window.confirm("Você tem certeza que deseja excluir esta venda?");
    if (!confirmDelete) return;
  
    try {
      await api.delete(`/sales/${saleId}`);
      toast.success('Venda excluída com sucesso!');
      
      queryClient.invalidateQueries("sales-list");
    } catch (error: any) {
      toast.error('Erro ao excluir a venda.');
    }
  };

  if (isSalesLoading) return <p>Carregando...</p>;
  if (isSalesError) return <p>Erro ao carregar vendas.</p>;

  return (
    <>
      <div className="flex flex-col lg:flex-row h-screen bg-gray-100">
        <Sidebar />

        <div className="flex-1 p-8 overflow-auto">
          <header className="flex flex-col sm:flex-row items-center bg-sky-500 p-5 rounded-md">
            <h1 className="text-2xl font-semibold text-white">Vendas</h1>
          </header>

          <form onSubmit={handleSubmit} className="mt-6 bg-white p-6 rounded-md shadow-md space-y-4">
            <div className="flex flex-col">
              <label htmlFor="name" className="font-medium text-black">
                Nome do Produto
              </label>
              <input
                type="text"
                id="name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="border p-2 rounded-md text-black"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="quantidade" className="font-medium text-black">
                Quantidade
              </label>
              <input
                type="number"
                id="quantidade"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="border p-2 rounded-md text-black"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="preco" className="font-medium text-black">
                Preço (un)
              </label>
              <input
                type="number"
                id="preco"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border p-2 rounded-md text-black"
                required
              />
            </div>


            <button
              type="submit"
              className="self-end w-full sm:w-auto p-2 bg-blue-500 text-white rounded-md font-inter hover:bg-blue-600"
            >
              + Cadastrar venda
            </button>
          </form>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-black">Vendas Cadastradas</h2>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full bg-white rounded-md shadow-md">
                <thead>
                  <tr className="bg-gray-200 text-black text-left font-inter">
                    <th className="p-3">Nome do produto</th>
                    <th className="p-3">Quantidade</th>
                    <th className="p-3">Preço</th>
                    <th className="p-3">Data da venda</th>
                    <th className="p-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {salesData?.map((sales) => (
                    <tr key={sales.id} className="border-t text-black font-inter">
                      <td className="p-3">{sales.produto_nome}</td>
                      <td className="p-3">{sales.quantidade}</td>
                      <td className="p-3">{sales.preco}</td>
                      <td className="p-3">{sales.data_venda}</td>
                      <td className="p-3 text-center flex gap-3">
                        <Pencil className='size-5 text-blue-400 cursor-pointer hover:text-blue-500' onClick={() => handleEditClick(sales.id)} />
                        <Trash2 className='size-5 text-red-400 cursor-pointer hover:text-red-500' onClick={() => handleDeleteClient(sales.id)} />
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
              <h2 className="text-xl font-semibold text-black">Editar Venda</h2>
              <form onSubmit={() => handleEditSubmit(saleId)} className="space-y-4">
                <div className="flex flex-col">
                  <label htmlFor="nameModal" className="font-medium text-black">Nome do Produto</label>
                  <input
                    type="text"
                    id="nameModal"
                    value={saleModalProduct}
                    onChange={(e) => setSaleModalProduct(e.target.value)}
                    className="border p-2 rounded-md text-black"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="quantityModal" className="font-medium text-black">Quantidade</label>
                  <input
                    type="number"
                    id="quantityModal"
                    value={saleModalQuantity}
                    onChange={(e) => setSaleModalQuantity(e.target.value)}
                    className="border p-2 rounded-md text-black"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="priceModal" className="font-medium text-black">Preço</label>
                  <input
                    type="number"
                    id="priceModal"
                    value={saleModalPrice}
                    onChange={(e) => setSaleModalPrice(e.target.value)}
                    className="border p-2 rounded-md text-black"
                    required
                  />
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

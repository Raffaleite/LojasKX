import { useNavigate } from "react-router-dom";

export function Sidebar(){

    const navigate = useNavigate();

    function handleClientsSection(){
        navigate('/')
    }

    function handleSalesSection(){
        navigate('/sales')
    }
    
    return(
        <aside className="w-64 bg-blue-500 shadow-md p-5">
        <div className="flex items-center space-x-3 mb-8">
          <img src="../../public/kapibara_logo_1-1.png" className="w-12 h-12 rounded-full" alt="KX logo" />
          <div>
            <p className="font-bold">Lojas KX</p>
          </div>
        </div>
        <nav>
          <ul className="space-y-3">
            <li className="font-medium font-inter cursor-pointer hover:text-zinc-300" onClick={handleClientsSection}>Clientes</li>
            <li className="font-medium font-inter cursor-pointer hover:text-zinc-300" onClick={handleSalesSection}>Vendas</li>
          </ul>
        </nav>
      </aside>
    )
}
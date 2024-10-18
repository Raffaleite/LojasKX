import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { Clients } from "./pages/clients"
import { Sales } from "./pages/sales";
import { QueryClientProvider, QueryClient } from 'react-query';
import { Toaster } from "sonner";

const queryClient = new QueryClient()


const router = createBrowserRouter([
  {
    path: "/",
    element: <Clients/>,
  },

  {
    path: "/sales",
    element: <Sales/>,
  },
]);

export function App() {
  return(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster invert richColors />
    </QueryClientProvider>
  ) 
 
}

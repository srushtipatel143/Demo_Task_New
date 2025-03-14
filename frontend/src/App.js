import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignUp from "./components/signup";
import Home from "./components/home";
import List from "./components/list";


const router = createBrowserRouter([
  {
    path: "/",
    element: <SignUp />,
  },
  {
    path:"/home",
    element:<Home/>
  },
  {
    path:"/list",
    element:<List/>
  },

]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

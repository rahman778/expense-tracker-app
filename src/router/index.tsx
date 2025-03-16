import { createBrowserRouter } from "react-router-dom";
import ExpensePage from "../screens/ExpensePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ExpensePage />,
  },
]);

export default router;

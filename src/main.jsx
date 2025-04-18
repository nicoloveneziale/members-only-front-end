import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";

//Routes
import Root from "./routes/root";
import ErrorPage from "./routes/errorPage";
import Login from "./routes/loginPage";
import Register from "./routes/registerPage";
import Join from "./routes/joinPage";
import MessageForm from "./routes/messageForm";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "join",
        element: <Join />,
      },
      {
        path: "messages/create",
        element: <MessageForm />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);

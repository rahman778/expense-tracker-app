import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

import router from "./router";
import "./App.css";
import { queryClient, persister } from "./base/queryClient";
import OfflineIndicator from "./components/indicators/OfflineIndicator";

function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
      onSuccess={() => {
        // resume mutations after initial restore from localStorage was successful
        queryClient.resumePausedMutations().then(() => {
          queryClient.invalidateQueries();
        });
      }}
    >
      <RouterProvider router={router} />
      <ToastContainer />
      <OfflineIndicator />
    </PersistQueryClientProvider>
  );
}

export default App;

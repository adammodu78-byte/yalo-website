
import React from "react";
import ReactDOM from "react-dom/client";
import { PrivyProvider } from "@privy-io/react-auth";
import { robinhoodChain } from "./network";
import App from "./App";
import "./style.css";

const appId = "cmwdo9wst01w70gl3es6ejr7v";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <PrivyProvider
      appId={appId}
      config={{
        defaultChain: robinhoodChain,
        supportedChains: [robinhoodChain]
      }}
    >
      <App />
    </PrivyProvider>
  </React.StrictMode>
);

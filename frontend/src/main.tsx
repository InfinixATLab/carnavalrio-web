import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'
import App from './App.tsx'
import { ApolloProvider } from "@apollo/client/react";

import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { API_HOST } from './constants/Host.ts';

const client = new ApolloClient({
    link: new HttpLink({ uri: `${API_HOST}g/graph`}),
    cache: new InMemoryCache(),
})

createRoot(document.getElementById('root')!).render(
  <ApolloProvider client={client}>
    <StrictMode>
      <App />
    </StrictMode>
  </ApolloProvider>
);

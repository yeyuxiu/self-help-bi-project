import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import QueryProvider from './Providers/QueryProvider';

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <QueryProvider>
        <App />
      </QueryProvider>
    </React.StrictMode>,
  );
}

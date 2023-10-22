import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { NotificationContextProvider } from './NotificationContext.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UserContextProvider } from './UserContext.jsx'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <NotificationContextProvider>
        <UserContextProvider>
          <App/>
        </UserContextProvider>
      </NotificationContextProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)

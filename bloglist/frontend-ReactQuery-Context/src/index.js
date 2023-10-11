import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import App from './App'
import { NotificationContextProvider } from './contexts/NotificationContext'
import { CurrentUserContextProvider } from './contexts/CurrentUserContext'
import { ToggleContextProvider } from './contexts/ToggleContext'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <CurrentUserContextProvider>
      <NotificationContextProvider>
        <ToggleContextProvider>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </ToggleContextProvider>
      </NotificationContextProvider>
    </CurrentUserContextProvider>
  </Router>,
)

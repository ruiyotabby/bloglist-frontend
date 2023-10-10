import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import notificationReducer from './reducers/notificationReducer.js'
import { configureStore } from '@reduxjs/toolkit'
import blogReducer from './reducers/blogReducer.js'

const store = configureStore({
  reducer: {
    blogs: blogReducer,
    notification: notificationReducer,
  }
})
console.log('store...', store.getState());

store.subscribe(() => console.log(store.getState()))

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)

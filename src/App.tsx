import { StrictMode } from 'react'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { router } from '@/lib/router'

export default function App() {
  return (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  )
}

import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import CategoriesPage from './pages/CategoriesPage'
import SessionPage from './pages/SessionPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/" element={
        <ProtectedRoute><DashboardPage /></ProtectedRoute>
      } />
      <Route path="/categories" element={
        <ProtectedRoute><CategoriesPage /></ProtectedRoute>
      } />
      <Route path="/session/:activityId" element={
        <ProtectedRoute><SessionPage /></ProtectedRoute>
      } />
    </Routes>
  )
}

export default App
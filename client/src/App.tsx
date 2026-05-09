import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import LoginPage from './pages/LoginPage'
import InventoryPage from './pages/InventoryPage'
import RecipeSuggestPage from './pages/RecipeSuggestPage'
import RecipeDetailPage from './pages/RecipeDetailPage'
import AdminIngredientPage from './pages/admin/AdminIngredientPage'
import AdminRecipePage from './pages/admin/AdminRecipePage'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth()
  return token ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<PrivateRoute><InventoryPage /></PrivateRoute>} />
        <Route path="/recipes" element={<PrivateRoute><RecipeSuggestPage /></PrivateRoute>} />
        <Route path="/recipes/:id" element={<PrivateRoute><RecipeDetailPage /></PrivateRoute>} />
        <Route path="/admin/ingredients" element={<PrivateRoute><AdminIngredientPage /></PrivateRoute>} />
        <Route path="/admin/recipes" element={<PrivateRoute><AdminRecipePage /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

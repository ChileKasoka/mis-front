import { Routes, Route } from "react-router-dom"
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AuthProvider from "./hooks/AuthProvider";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard/:id" element={<Dashboard />} />
          </Route>
          <Route path="login" element={ <Login/> } />
          <Route path="signup" element={ <Signup/> } />
        </Routes>
      </AuthProvider>
    </div>
  )
}

export default App

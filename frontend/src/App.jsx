import React from 'react'
import {Routes,Route} from 'react-router-dom'
import ProtectedRoute from './components/auth/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import { RouteDashboard, RouteEditorPage, RouteIndex, RouteLogin, RouteProfile, RouteSignup, RouteViewBook } from './helper/RouteName'
import LoginPage from './pages/LoginPage'
import Signup from './pages/Signup'
import DashboardPage from './pages/DashboardPage'
import EditorPage from './pages/EditorPage'
import ViewBookPage from './pages/ViewBookPage'
import Profile from './pages/Profile'


const App = () => {
  return (
    <div>
      <Routes>
        {/* public Routes */}
        <Route path={RouteIndex} element={<LandingPage />}/>
        <Route path={RouteLogin} element={<LoginPage />}/>
        <Route path={RouteSignup} element={<Signup />}/>

        {/* protected routes */}
        <Route path={RouteDashboard} element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}/>
        <Route path={RouteEditorPage} element={<ProtectedRoute><EditorPage /></ProtectedRoute>}/>
        <Route path={RouteViewBook} element={<ProtectedRoute><ViewBookPage /></ProtectedRoute>}/>
        <Route path={RouteProfile} element={<ProtectedRoute><Profile /></ProtectedRoute>}/>
      </Routes>
    </div>
  )
}

export default App
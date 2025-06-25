import { useEffect } from 'react'
import { Routes , Route} from 'react-router'
import { Navigate } from 'react-router'

import SignUpPage from './pages/SignUpPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx'
import Dashboard from './pages/Dashboard.jsx'

import LoadingSpinner from './components/LoadingSpinner.jsx'

import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore.js'
import AuthLayout from './layouts/AuthLayout.jsx'

// protect routes that require authentication
const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (!isAuthenticated) {
		return <Navigate to='/login' replace />;
	}

	return children;
};

// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated } = useAuthStore();

	if (isAuthenticated) {
		return <Navigate to='/' replace />;
	}

	return children;
};

function App() {
  const {isCheckingAuth , initializeAuthListener}  = useAuthStore();

  useEffect(() => {
    initializeAuthListener();
  }
  , [initializeAuthListener]);

  if (isCheckingAuth) return <LoadingSpinner />;

  

  return (
    <div>
      <Routes>
        <Route 
          path='/' 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route element={<AuthLayout />}>
          <Route 
            path='/signup' 
            element={
              <RedirectAuthenticatedUser>
                <SignUpPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route 
            path='/login' 
            element={
              <RedirectAuthenticatedUser>
                <LoginPage />
              </RedirectAuthenticatedUser>
            } 
          />
          <Route 
            path='/forgot-password' 
            element={
              <RedirectAuthenticatedUser>
                <ForgotPasswordPage />
              </RedirectAuthenticatedUser>
            } 
          />
        </Route>
        <Route 
          path='*' 
          element={
            <Navigate to='/' replace />
          } 
        />
      </Routes>
      <Toaster />

    </div>
  )
}

export default App

import Navbar from "./components/Navbar"
import Login from "./components/Login"
import "./App.css"
import { useEffect, useState } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { getLoggedInUser, LoggedUser } from "./network/timecard.api"
import MainPage from "./pages/MainPage"
import { EventProvider } from "./context/EventProvider"
import UserRelatoryPage from "./pages/UserRelatoryPage"
import CreateUserPage from "./pages/CreateUserPage"

const AppContent = () => {
  const [loggedInUser, setLoggedInUser] = useState<LoggedUser | null>(null)

  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchLoggedInUser() {
      try {
        const { user } = await getLoggedInUser()
        if (user) setLoggedInUser(user)
      } catch (error) {
        console.log("User not logged in:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchLoggedInUser()
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Navbar
        loggedInUser={loggedInUser}
        onLoginClicked={() => setShowLoginModal(true)}
        onLogoutSuccessful={() => {
          setLoggedInUser(null)
        }}
      />

      {showLoginModal && (
        <Login
          onLoginSuccessful={(user) => {
            setLoggedInUser(user)
            setShowLoginModal(false)
          }}
          onDismiss={() => setShowLoginModal(false)}
        />
      )}

      <div className="container mt-4">
        {loggedInUser ? (
          <Routes>
            <Route path="/" element={<MainPage user={loggedInUser} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
            {loggedInUser?.role === "admin" && (
              <Route path="/userinfo" element={<UserRelatoryPage />} />
            )}
            {loggedInUser?.role === "admin" && (
              <Route path="/createuser" element={<CreateUserPage />} />
            )}
          </Routes>
        ) : (
          <div className="text-center">
            <h2>Welcome to TimeCard</h2>
            <p>Please log in to access your timecard.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Componente wrapper que fornece o BrowserRouter
const App = () => {
  return (
    <EventProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </EventProvider>
  )
}

export default App

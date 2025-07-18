import AppRoutes from './utils/AppRoutes';
import { ThemeProvider, useTheme } from './utils/ThemeContext';
import { TodoProvider } from './utils/TodoProvider';
import { AuthProvider, useAuth } from './utils/AuthContext';
import useAutoLogout from './utils/useAutoLogout';
import { BrowserRouter as Router } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import './assets/index.css'

function AppWrapper() {
  const { themeMode,themeBrightness } = useTheme();
  const backgroundColor =
    themeMode === 'light'
      ? `hsl(0, 0%, ${100 - themeBrightness}%)` // 0 = pure white, 50 = light gray
      : `hsl(0, 0%, ${10 + themeBrightness * 0.3}%)`; // 0 = black, 100 = near gray

  const textColor =
    themeMode === 'light'
      ? `hsl(0, 0%, ${themeBrightness > 40 ? 20 : 10}%)` // darker text if background is too light
      : `hsl(0, 0%, ${themeBrightness > 80 ? 10 : 95}%)`; // lighter text if background is dark


  return (
    <div
      className="min-vh-100"
      style={{
        backgroundColor,
        color: textColor,
        transition: 'background-color 0.3s, color 0.3s',
      }}
    >
      <ToastContainer />
      <AppRoutes />
    </div>
  );
}

function App() {
  const { accessToken } = useAuth();

  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <TodoProvider key={accessToken}>
            <AppWrapper />
          </TodoProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;

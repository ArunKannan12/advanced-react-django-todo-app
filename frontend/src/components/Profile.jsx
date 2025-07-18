import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Moon, Sun, LogOut, KeyRound, Pen, Menu
} from 'lucide-react';
import { Spinner } from 'react-bootstrap';
import { useTheme } from '../utils/ThemeContext';
import { useAuth } from '../utils/AuthContext';
import { useTodo } from '../utils/TodoContext';
import TodoList from './TodoList';
import ProfileEditModal from './ProfileEditModal';
import { toast } from 'react-toastify';


const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, setUser, loading } = useAuth();
  const { clearTodos } = useTodo();
  const { themeMode, toggleTheme } = useTheme();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [changePassLoading, setChangePassLoading] = useState(false);

  const profilePic =
    user?.custom_user_profile ||
    user?.social_auth_pro_pic ||
    'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  const handleLogout = async () => {
    setLogoutLoading(true);
    setTimeout(async () => {
      await logout();
      clearTodos();
      navigate('/');
      setLogoutLoading(false);
      toast.success('Logout successfull')
    }, 700);
  };

  const handleChangePassword = () => {
    setChangePassLoading(true);
    setTimeout(() => {
      navigate('/change-password');
      setChangePassLoading(false);
    }, 700);
  };

  if (loading || !user) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Loading profile...</span>
      </div>
    );
  }
 

    const textColor = themeMode === 'light' ? '#000' : '#fff';


  return (
    <div className="d-flex min-vh-100">
      {/* Sidebar */}
      <aside
  className={`position-fixed shadow sidebar-transition d-flex flex-column justify-content-between ${
    sidebarOpen ? 'sidebar-open' : 'sidebar-closed'
  }`}
  style={{
    top: 0,
    left: 0,
    height: '100vh',
    zIndex: 1040,
    transition: 'all 0.3s ease-in-out',
    width: sidebarOpen ? (window.innerWidth < 768 ? '100%' : '250px') : '56px',
    backgroundColor: themeMode === 'dark' ? '#232222ff' : '#f8f9fa',
    color: themeMode === 'dark' ? '#fff' : '#000',
  }}
>
  {/* Sidebar Top - Toggle + Profile + Buttons */}
  <div>
    <div className="p-2 d-flex justify-content-center">
      <button className="btn btn-light" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <Menu size={20} />
      </button>
    </div>

    {sidebarOpen && (
      <div className="p-3 text-center">
        <h5 className="text-primary mb-3">MyTodoApp</h5>
        <div className="mx-auto mb-3 position-relative" style={{ width: 100, height: 100 }}>
          <img
            src={profilePic}
            alt="Profile"
            className="rounded-circle w-100 h-100 object-fit-cover shadow"
          />
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-sm btn-primary position-absolute bottom-0 end-0"
          >
            <Pen size={14} />
          </button>
        </div>
        <h6 className="mb-0">{user.first_name} {user.last_name}</h6>
        <small className="text-muted text-truncate d-block">{user.email}</small>

        <div className="mt-3 d-grid gap-2">
          {user?.auth_provider?.toLowerCase() === 'email' && (
            <button
              className="btn btn-info w-100"
              onClick={handleChangePassword}
              disabled={changePassLoading || logoutLoading}
            >
              {changePassLoading ? (
                <>
                  <Spinner animation="border" size="sm" /> Loading...
                </>
              ) : (
                <>
                  <KeyRound size={16} /> Change Password
                </>
              )}
            </button>
          )}
          <button
            className="btn btn-danger w-100"
            onClick={handleLogout}
            disabled={logoutLoading || changePassLoading}
          >
            {logoutLoading ? (
              <>
                <Spinner animation="border" size="sm" /> Logging out
              </>
            ) : (
              <>
                <LogOut size={16} /> Logout
              </>
            )}
          </button>
        </div>
      </div>
    )}
  </div>

  
 {/* Sidebar Bottom - Theme Toggle + Brightness Slider */}
    <div className="p-3 border-top">
      <button className="btn btn-primary w-100" onClick={toggleTheme}>
        {themeMode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}{" "}
        {sidebarOpen && (themeMode === 'dark' ? 'Light Mode' : 'Dark Mode')}
      </button>
      
    </div>

</aside>



      {/* Main content */}
      <main
          className="flex-grow-1 p-4"
          style={{
            marginLeft: sidebarOpen && window.innerWidth >= 768 ? '250px' : '56px',
            transition: 'margin 0.3s ease-in-out',
           
            color: textColor,
            minHeight: '100vh',
          }}
        >

        <h2 className="h4 text-primary mb-4">Your Todos</h2>
        <TodoList />
      </main>



      {/* Edit Modal */}
      <ProfileEditModal
        show={showModal}
        onHide={() => setShowModal(false)}
        user={user}
        setUser={setUser}
      />
    </div>
  );
};

export default Profile;
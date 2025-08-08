import React from 'react';
import {
  BrowserRouter as  Router,
  Routes,
  Route,
  Outlet,
  Navigate
} from 'react-router-dom';

// admin components 
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Dashboard from './pages/admin/Dashboard';
import ManageTasks from './pages/admin/ManageTasks';
import CreateTask from './pages/admin/CreateTask';
import ManageUsers from './pages/admin/ManageUsers';

// user components 
import UserDashboard from './pages/User/UserDashboard';
import MyTasks from './pages/User/MyTasks';
import ViewTaskDetalis from './pages/User/ViewTaskDetalis';

import PrivateRoute from './routes/PrivateRoute';
import UserProvider from './context/userContext';
import { useContext } from 'react';
import { UserContext } from './context/userContext';

function App() {
  return (
    <UserProvider>
    <div>
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin Routes */}
        <Route element={<PrivateRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/tasks" element={<ManageTasks />} />
          <Route path="/admin/create-task" element={<CreateTask />} />
          <Route path="/admin/users" element={<ManageUsers />} />
        </Route>

          {/* User Routes */}
        <Route element={<PrivateRoute allowedRoles={['admin']} />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/tasks" element={<MyTasks />} />
          <Route path="/user/task-detalis/:id" element={<ViewTaskDetalis />} />
        </Route>

        {/* Default Route */}
        <Route path="/" element={<Root />} />
      </Routes>
    </Router>
    </div>
    </UserProvider>      
  );
}

export default App

const Root = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) return <Outlet />; // Show a loading state while fetching user data

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return user.role === 'admin' ? <Navigate to="/admin/dashboard" replace/> : <Navigate to="/user/dashboard" replace/>;
};
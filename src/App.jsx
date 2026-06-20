import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Alerts from './pages/Alerts';
import AccessLog from './pages/AccessLog';
import PeopleAndAccess from './pages/PeopleAndAccess';
import EnrollUser from './pages/EnrollUser';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="access-log" element={<AccessLog />} />
          <Route path="people" element={<PeopleAndAccess />} />
          <Route path="people/enroll" element={<EnrollUser />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

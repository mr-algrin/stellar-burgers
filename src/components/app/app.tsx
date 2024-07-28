import { Routes, Route } from 'react-router-dom';

import {
  ConstructorPage,
  NotFound404,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders
} from '@pages';
import { AppHeader, Modal } from '@components';

import '../../index.css';
import styles from './app.module.css';

const App = () => (
  <div className={styles.app}>
    <AppHeader />
    <Routes>
      <Route path={''} element={<ConstructorPage />} />
      <Route path={'/feed'} element={<Feed />} />
      <Route path={'/login'} element={<Login />} />
      <Route path={'/register'} element={<Register />} />
      <Route path={'/forgot-password'} element={<ForgotPassword />} />
      <Route path={'/reset-password'} element={<ResetPassword />} />
      <Route path={'/profile'} element={<Profile />} />
      <Route path={'/profile/orders'} element={<ProfileOrders />} />
      <Route path={'*'} element={<NotFound404 />} />
    </Routes>

    <Routes>
      <Route
        path={'/feed/:number'}
        element={
          <Modal title={''} onClose={() => {}}>
            test
          </Modal>
        }
      />
    </Routes>
  </div>
);

export default App;

import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

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
import {
  Modal,
  AppHeader,
  IngredientDetails,
  OrderInfo,
  ProtectedRoute
} from '@components';
import { loadIngredientsThunk } from '@slices';

import '../../index.css';
import styles from './app.module.css';
import { useDispatch } from '../../services/store';

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const previousLocation = location.state?.background;

  const onCloseModal = () => navigate(-1);

  useEffect(() => {
    dispatch(loadIngredientsThunk());
  }, []);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={previousLocation || location}>
        <Route path={''} element={<ConstructorPage />} />
        <Route path={'/feed'} element={<Feed />} />
        <Route path={'/login'} element={<Login />} />
        <Route path={'/register'} element={<Register />} />
        <Route path={'/forgot-password'} element={<ForgotPassword />} />
        <Route path={'/reset-password'} element={<ResetPassword />} />
        <Route
          path={'/profile'}
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path={'/profile/orders'}
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path={'*'} element={<NotFound404 />} />
      </Routes>
      {previousLocation && (
        <Routes>
          <Route
            path={'/feed/:number'}
            element={
              <Modal title={'Детали заказа'} onClose={onCloseModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path={'/ingredients/:id'}
            element={
              <Modal title={'Детали ингредиента'} onClose={onCloseModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path={'/profile/orders/:number'}
            element={
              <Modal title={'Детали заказа'} onClose={onCloseModal}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;

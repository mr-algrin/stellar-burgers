import { PropsWithChildren, useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate
} from 'react-router-dom';

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
import { getUserThunk, loadIngredientsThunk } from '@slices';

import styles from './app.module.css';
import { useDispatch, useSelector } from '../../services/store';
import '../../index.css';

const UnauthorizedRoute = ({ children }: PropsWithChildren) => {
  const { user } = useSelector((state) => state.user);

  if (user) return <Navigate to={'/profile'} />;

  return children;
};

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const previousLocation = location.state?.background;

  const onCloseModal = () => navigate(-1);

  useEffect(() => {
    dispatch(loadIngredientsThunk());
    dispatch(getUserThunk());
  }, []);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={previousLocation || location}>
        <Route path={''} element={<ConstructorPage />} />
        <Route path={'/ingredients/:id'} element={<IngredientDetails />} />
        <Route path={'/feed'} element={<Feed />} />
        <Route path={'/feed/:number'} element={<OrderInfo />} />
        <Route
          path={'/login'}
          element={
            <UnauthorizedRoute>
              <Login />
            </UnauthorizedRoute>
          }
        />
        <Route
          path={'/register'}
          element={
            <UnauthorizedRoute>
              <Register />
            </UnauthorizedRoute>
          }
        />
        <Route
          path={'/forgot-password'}
          element={
            <UnauthorizedRoute>
              <ForgotPassword />
            </UnauthorizedRoute>
          }
        />
        <Route
          path={'/reset-password'}
          element={
            <UnauthorizedRoute>
              <ResetPassword />
            </UnauthorizedRoute>
          }
        />
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
        <Route
          path={'/profile/orders/:number'}
          element={
            <ProtectedRoute>
              <OrderInfo />
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

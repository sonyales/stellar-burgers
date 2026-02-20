import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import '../../index.css';
import styles from './app.module.css';

import {
  AppHeader,
  Protected,
  Modal,
  OrderInfo,
  IngredientDetails
} from '@components';
import { Preloader } from '@ui';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  NotFound404,
  Profile,
  ProfileOrders
} from '@pages';
import { useDispatch, useSelector } from '../../services/store';
import { useEffect } from 'react';
import { getIngredients } from '../../services/burgerIngredients/actions';
import {
  selectIsLoading,
  selectError
} from '../../services/burgerIngredients/slice';

import { getUser } from '../../services/userData/action';

const App = () => {
  // запрос массива ингридиентов в юзэффекте диспатчится экшен на запрос массива ингридиентов,

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const isLoading = useSelector(selectIsLoading);
  const errorMessage = useSelector(selectError);

  const background = location.state?.background;
  const onCloseFn = () => {
    navigate(-1);
  };

  useEffect(() => {
    dispatch(getIngredients());
    dispatch(getUser());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />

      {errorMessage && <div>{errorMessage}</div>}
      {isLoading && <Preloader />}
      <>
        <Routes location={background || location}>
          <Route path='/' element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />
          <Route path='/feed/:number' element={<OrderInfo />} />
          <Route path='/ingredients/:id' element={<IngredientDetails />} />
          {/* защищенный */}
          <Route
            path='/login'
            element={<Protected onlyUnAuth component={<Login />} />}
          />
          <Route
            path='/register'
            element={<Protected onlyUnAuth component={<Register />} />}
          />
          <Route
            path='/forgot-password'
            element={<Protected onlyUnAuth component={<ForgotPassword />} />}
          />
          <Route
            path='/reset-password'
            element={<Protected onlyUnAuth component={<ResetPassword />} />}
          />
          <Route
            path='/profile'
            element={<Protected component={<Profile />} />}
          />
          <Route
            path='/profile/orders'
            element={<Protected component={<ProfileOrders />} />}
          />
          <Route
            path='/profile/orders/:number'
            element={<Protected component={<OrderInfo />} />}
          />
          <Route path='*' element={<NotFound404 />} />
        </Routes>
        {background && (
          <Routes>
            <Route
              path='/feed/:number'
              element={
                <Modal title='Информация о заказе' onClose={onCloseFn}>
                  <OrderInfo />
                </Modal>
              }
            />
            <Route
              path='/ingredients/:id'
              element={
                <Modal title='Информация о ингредиенте' onClose={onCloseFn}>
                  <IngredientDetails />
                </Modal>
              }
            />
            <Route
              path='/profile/orders/:number'
              element={
                <Protected
                  component={
                    <Modal title='Информация о заказе' onClose={onCloseFn}>
                      <OrderInfo />
                    </Modal>
                  }
                />
              }
            />
          </Routes>
        )}
      </>
    </div>
  );
};

export default App;

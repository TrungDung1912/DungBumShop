import React, { useEffect, useState } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LoginPage from './pages/login';
import ContactPage from './pages/contact';
import BookPage from './pages/book';
import { Outlet } from "react-router-dom";
import Header from './components/header';
import Footer from './components/footer';
import Home from './components/home';
import RegisterPage from './pages/register';
import { fetchAccount } from './services/apiService';
import { useDispatch, useSelector } from 'react-redux';
import { doGetAccountAction } from './redux/account/accountSlice';
import Loading from './components/loading';
import NotFound from './components/notfound';
import AdminPage from './pages/admin';
import ProtectedRoute from './components/protectedroute';
import LayoutAdmin from './components/admin/index'
import ManagerOrder from './pages/order';
import UserTable from './components/admin/user/UserTable';
import BookTable from './components/admin/book/BookTable';
import './styles/global.scss'
import Payment from './components/order/Payment';
import OrderHistory from './components/order/OrderHistory';
import ManagerOrderr from './components/admin/order/ManagerOrder';

const Layout = () => {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className='layout-app'>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Outlet context={[searchTerm, setSearchTerm]} />
      <Footer />
    </div>
  )
}

export default function App() {
  const isLoading = useSelector(state => state.account.isLoading)
  const dispatch = useDispatch()

  const getAccount = async () => {
    if (window.location.pathname === '/login'
      || window.location.pathname === '/register'
      || window.location.pathname === '/') return;

    const res = await fetchAccount()
    if (res && res?.data) {
      dispatch(doGetAccountAction(res.data))
    }
  }

  useEffect(() => {
    getAccount()
  }, [])

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <NotFound />,

      children: [
        { index: true, element: <Home /> },
        {
          path: "contact",
          element: <ContactPage />,
        },
        {
          path: "book/:slug",
          element: <BookPage />,
        },
        {
          path: "order",
          element:
            <ProtectedRoute>
              <ManagerOrder />
            </ProtectedRoute>,
        },
        {
          path: "payment",
          element: <Payment />,
        },
        {
          path: "history",
          element:
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>,
        },
      ],
    },
    {
      path: "/admin",
      element: <LayoutAdmin />,
      errorElement: <NotFound />,

      children: [
        {
          index: true, element:
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
        },
        {
          path: "user",
          element: <UserTable />,
        },
        {
          path: "book",
          element: <BookTable />,
        },
        {
          path: "order",
          element: <ManagerOrderr />,
        },

      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
  ]);

  return (
    <>
      {
        !isLoading
          || window.location.pathname === '/login'
          || window.location.pathname === '/register'
          || window.location.pathname === '/' ?
          <RouterProvider router={router} />
          :
          <Loading />
      }
    </>
  )
}

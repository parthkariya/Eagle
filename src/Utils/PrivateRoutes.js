import { Outlet, Navigate } from "react-router-dom";
import { useMallContext } from "../context/mall_context";

const PrivateRoutes = () => {
  let is_token = localStorage.getItem("is_token");
  // const { is_login, is_token } = useMallContext();
   //   let auth = { isLogin: false };
  return is_token !== null ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;

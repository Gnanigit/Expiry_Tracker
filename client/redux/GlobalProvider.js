import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setIsLogged, setUser, setLoading } from "./slices/auth";
import { setProducts } from "./slices/products";
import { getCurrentUser } from "../routes/auth_api";
import { getAllProducts } from "../routes/product_api";
import { useSelector } from "react-redux";

const GlobalProvider = ({ children }) => {
  const { isLogged, user, authLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          dispatch(setIsLogged(true));
          dispatch(setUser(res));

          return getAllProducts();
        } else {
          dispatch(setIsLogged(false));
          dispatch(setUser(null));
        }
      })
      .then((products) => {
        dispatch(setProducts(products));
      })
      .catch((error) => {
        if (!isLogged) {
          dispatch(setIsLogged(false));
          dispatch(setUser(null));
        } else {
          console.error("Error fetching user:", error);
        }
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  }, [dispatch]);

  return <>{children}</>;
};

export default GlobalProvider;

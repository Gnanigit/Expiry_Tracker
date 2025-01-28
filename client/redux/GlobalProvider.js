import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setIsLogged, setUser, setLoading } from "./slices/auth";
import { addProduct } from "./slices/products";
import { getCurrentUser } from "../routes/auth_api";
import { getAllProducts } from "../routes/product_api";

const GlobalProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          dispatch(setIsLogged(true));
          dispatch(setUser(res));

          getAllProducts()
            .then((products) => {
              if (products && Array.isArray(products)) {
                products.forEach((product) => {
                  dispatch(addProduct(product));
                });
              }
            })
            .catch((error) => {
              console.error("Error fetching products:", error);
            });
        } else {
          dispatch(setIsLogged(false));
          dispatch(setUser(null));
        }
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  }, [dispatch]);

  return <>{children}</>;
};

export default GlobalProvider;

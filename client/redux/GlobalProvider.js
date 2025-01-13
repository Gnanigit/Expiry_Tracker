import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setIsLogged, setUser, setLoading } from "./slices/auth";
import { getCurrentUser } from "../routes/auth_api";

const GlobalProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          dispatch(setIsLogged(true));
          dispatch(setUser(res));
        } else {
          dispatch(setIsLogged(false));
          dispatch(setUser(null));
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  }, [dispatch]);

  return <>{children}</>;
};

export default GlobalProvider;

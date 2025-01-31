import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setIsLogged, setUser, setLoading } from "./slices/auth";
import { setProducts } from "./slices/products";
import { getCurrentUser } from "../routes/auth_api";
import { getAllProducts } from "../routes/product_api";
import { useSelector } from "react-redux";
import { Appearance } from "react-native";
import { setTheme } from "./slices/theme";
import { useColorScheme } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GlobalProvider = ({ children }) => {
  const { isLogged, user, authLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    dispatch(setTheme(Appearance.getColorScheme() || "light"));
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

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem("theme");
        if (storedTheme) {
          dispatch(setTheme(storedTheme));
        } else {
          const systemTheme = Appearance.getColorScheme() || "light";
          dispatch(setTheme(systemTheme));
          await AsyncStorage.setItem("theme", systemTheme);
        }
      } catch (error) {
        console.error("Failed to load theme:", error);
      }
    };

    loadTheme();
  }, [dispatch]);

  useEffect(() => {
    setColorScheme(theme);
    AsyncStorage.setItem("theme", theme).catch((error) =>
      console.error("Failed to save theme:", error)
    );
  }, [theme]);

  return <>{children}</>;
};

export default GlobalProvider;

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
    const fetchUserAndProducts = async () => {
      try {
        dispatch(setTheme(Appearance.getColorScheme()));
        const res = await getCurrentUser();
        if (res) {
          dispatch(setIsLogged(true));
          dispatch(setUser(res));
          const products = await getAllProducts();
          dispatch(setProducts(products));
        } else {
          dispatch(setIsLogged(false));
          dispatch(setUser(null));
        }
      } catch (error) {
        if (!isLogged) {
          dispatch(setIsLogged(false));
          dispatch(setUser(null));
        } else {
          console.error("Error fetching user:", error);
        }
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchUserAndProducts();
  }, [dispatch]);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem("theme");
        if (storedTheme === "system") {
          dispatch(setTheme(Appearance.getColorScheme() || "light"));
        } else if (storedTheme) {
          dispatch(setTheme(storedTheme));
        }
      } catch (error) {
        console.error("Failed to load theme:", error);
      }
    };

    loadTheme();
  }, [dispatch]);

  useEffect(() => {
    if (theme === "system") {
      setColorScheme(Appearance.getColorScheme());
    } else {
      setColorScheme(theme);
    }

    AsyncStorage.setItem("theme", theme).catch((error) =>
      console.error("Failed to save theme:", error)
    );
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (theme === "system") {
        dispatch(setTheme(colorScheme || "light"));
      }
    });

    AsyncStorage.setItem("theme", theme).catch((error) =>
      console.error("Failed to save theme:", error)
    );

    return () => subscription.remove();
  }, [theme]);

  return <>{children}</>;
};

export default GlobalProvider;

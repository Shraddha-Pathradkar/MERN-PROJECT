import { useState, useCallback, useEffect } from "react";
let logoutTimmer;

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();

  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    const tokenExpires =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpires);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpires.toISOString(),
      })
    );
  }, []);
  useEffect(() => {
    const storeData = JSON.parse(localStorage.getItem("userData")); // first we will have to convert it to json
    if (
      storeData &&
      storeData.token &&
      new Date(storeData.expirationDate) > new Date()
    ) {
      login(
        storeData.userId,
        storeData.token,
        new Date(storeData.expirationDate)
      );
    }
  }, [login]);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimmer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimmer);
    }
  }, [token, logout, tokenExpirationDate]);

  return { login, logout, token, userId };
};

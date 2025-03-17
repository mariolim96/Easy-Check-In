import { useEffect, useState } from "react";
import Cookies from "js-cookie";

interface AlloggiatiAuth {
  token: string | null;
  expires: string | null;
  user: string | null;
  isAuthenticated: boolean;
}

export function useAlloggiatiAuth(): AlloggiatiAuth {
  const [auth, setAuth] = useState<AlloggiatiAuth>({
    token: null,
    expires: null,
    user: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const token = Cookies.get("alloggiati_token") ?? null;
    const expires = Cookies.get("alloggiati_expires") ?? null;
    const user = Cookies.get("alloggiati_user") ?? null;

    setAuth({
      token,
      expires,
      user,
      isAuthenticated: !!token && !!user,
    });
  }, []);

  return auth;
}

import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;

  //   const handleLogin = async ({ email, password }) => {
  //     setLoading(true);
  //     try {
  //       const data = await login({ email, password });
  //       setUser(data.user);
  //     } catch (err) {
  //       console.log(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const handleLogin = async ({ email, password }) => {
    setLoading(true);

    try {
      const data = await login({ email, password });

      if (data?.user) {
        setUser(data.user);
        return true;
      }
      return false;
    } catch (err) {
      console.log(err);
      return false;
    } finally {
      setLoading(false);
    }
  };
//   const handleRegister = async ({ username, email, password }) => {
//     setLoading(true);
//     try {
//       const data = await register({ username, email, password });
//       setUser(data.user);
//     } catch (err) {
//       console.log(err);
//     } finally {
//       setLoading(false);
//     }
//   };

const handleRegister = async ({ username, email, password }) => {
    console.log("Handle Register Called");

    setLoading(true);

    try {

        const data = await register({
            username,
            email,
            password
        });

        console.log("Register Response => ", data);

        if (data?.user) {
            setUser(data.user);
            return true;
        }

        return false;

    } catch (err) {

        console.log("Register Error => ", err);
        return false;

    } finally {

        setLoading(false);

    }
};
  const handleLogout = async () => {
    setLoading(true);
    try {
      const data = await logout();
      setUser(null);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // const getAndSetUser = async () => {
    //   try {
    //     // const data = await getMe();
    //     // if (data.user) {
    //     //   setUser(data.user);
    //     // }
    //     const data = await getMe();

    //     if (data?.user) {
    //       setUser(data.user);
    //     }
    //   } catch (err) {
    //     console.log(err);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    const getAndSetUser = async () => {
  try {
    const data = await getMe()

    if (data?.user) {
      setUser(data.user)
    }
    else {
  setUser(null)
}

  } catch (err) {
    console.log(err)
    setUser(null)
  } finally {
    setLoading(false)
  }
}
    getAndSetUser();
  }, []);

  return { user, loading, handleRegister, handleLogin, handleLogout };
};

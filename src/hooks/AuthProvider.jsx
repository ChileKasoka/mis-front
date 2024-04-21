import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const navigate = useNavigate();
  const loginAction = async (data, setErrors) => {
    const newErrors = validateForm(data);
    if (Object.keys(newErrors).length === 0) {
      // Form is valid, submit data or perform other actions
      try {
        // Form is valid, send data to the server
        const response = await fetch('http://localhost:8081/v1/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(data),
        });
  
        if (response.ok) {
          // If the response is successful (status code 200-299), handle success
          console.log('Form submitted successfully');
          const { email, id, name, access_token, refresh_token} = await response.json();
          console.log(refresh_token);
          //const { email, id, name, access_token} = responseData;
          setUser({
            email: email,
            id: id,
            name: name,
            access_token: access_token,
            refresh_token: refresh_token
          }, () => {
            console.log("User state after setting:", user);
          });

          const accessToken = access_token;
          const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}` // Add this line
          };

          setToken(access_token);
          const refreshToken = setRefreshToken(refresh_token)
          console.log(refreshToken);
          const userId = id
          navigate(`/dashboard/${userId}`, {headers});
;
          return;
        } else {
          // If the response has an error (status code outside of 200-299 range), handle error
          console.error('Error submitting form:', response.statusText);
        }
      } catch (error) {
        // Handle any network or server errors
        console.error('Error submitting form:', error.message);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const validateForm = (data) => {
    let errors = {};
    if (!data.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(data.email)) {
      errors.email = 'Email is invalid';
    }
    if (!data.password.trim()) {
      errors.password = 'Password is required';
    } else if (data.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }
    return errors;
  };

  const refreshTokenHandler = async (data) => {
    try {
      const response = await fetch('http://localhost:8081/v1/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log(data)
        const { token } = await response.json();
        setUser({
          access_token: token
        }, () => {
          console.log("User state after setting:", user);
        });
        setToken(token);
      } else {
        // Handle refresh token failure
        console.error('Error refreshing token');
        // Perform logout or other appropriate actions
      }
    } catch (error) {
      console.error('Error refreshing token');
      // Perform logout or other appropriate actions
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      refreshTokenHandler();
    }, 1 * 60 * 1000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, [token]) //everytime a new token is generated


  const logOut = () => {
    setUser(null);
    setToken(null);
    // localStorage.removeItem("site");
    navigate("/login");
  };
  

  return (
    <AuthContext.Provider value={{ token, refreshToken, user, setUser, setToken, loginAction, refreshTokenHandler, logOut }}>
      {children}
    </AuthContext.Provider>
  );

};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
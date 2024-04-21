import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const navigate = useNavigate();

  const signUpAction = async (data) => {
    try {
      const response = await fetch('http://localhost:8081/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Fixed typo in Content-Type
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });
  
      if (response.ok) {
        // If the response is successful, navigate to the login page
        navigate("/login");
      } else {
        // If the response is not successful, throw an error
        throw new Error('Failed to sign up: ' + response.statusText);
      }
    } catch (error) {
      // Handle any errors that occur during the sign-up process
      console.error('Error signing up new user:', error);
    }
  }
  
  const loginAction = async (data) => {
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
          setRefreshToken(refresh_token)
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

    if (token) {
      const interval = setInterval(() => {
        refreshTokenHandler();
      }, 1 * 60 * 1000); // Refresh every 5 minutes
  
      setIntervalId(interval);
  
      return () => clearInterval(interval);
    }
  }, [token]) //everytime a new token is generated


  
  const logOut = async () => {
    try {
      const response = await fetch('http://localhost:8081/v1/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setUser(null);
        setToken(null);
        clearInterval(intervalId);
        navigate("/login");
      } else {
        console.error('Logout failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during logout:', error.message);
    }
  };
  

  return (
    <AuthContext.Provider value={{ token, refreshToken, user, setUser, setToken, signUpAction, loginAction, refreshTokenHandler, logOut }}>
      {children}
    </AuthContext.Provider>
  );

};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
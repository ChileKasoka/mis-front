import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("site") || "");
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
          const responseData = await response.json();
          console.log(responseData);
         // const { email, id, name, access_token} = responseData;
          setUser({
            email: responseData.email,
            id: responseData.id,
            name: responseData.name
          }, () => {
            console.log("User state after setting:", user);
          });
          const token = setToken(responseData.access_token);
          const userId = responseData.id
          console.log(responseData.access_token);
          localStorage.setItem("site", token);
          navigate(`/dashboard/${userId}`);
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


  const logOut = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("site");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, user, loginAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );

};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
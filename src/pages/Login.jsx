import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from "../hooks/AuthProvider";

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const auth = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.email !== "" && formData.email !== "") {
      auth.loginAction(formData);
      return;
    }
    // const newErrors = validateForm(formData);
    // if (Object.keys(newErrors).length === 0) {
    //   // Form is valid, submit data or perform other actions
    //   try {
    //     // Form is valid, send data to the server
    //     const response = await fetch('http://localhost:8081/v1/login', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       credentials: 'include',
    //       body: JSON.stringify(formData),
    //     });
  
    //     if (response.ok) {
    //       // If the response is successful (status code 200-299), handle success
    //       console.log('Form submitted successfully');
    //       const responseData = await response.json();
    //       console.log(responseData);
    //     } else {
    //       // If the response has an error (status code outside of 200-299 range), handle error
    //       console.error('Error submitting form:', response.statusText);
    //     }
    //   } catch (error) {
    //     // Handle any network or server errors
    //     console.error('Error submitting form:', error.message);
    //   }
    // } else {
    //   setErrors(newErrors);
    // }
  };

  // const validateForm = (data) => {
  //   let errors = {};
  //   if (!data.email.trim()) {
  //     errors.email = 'Email is required';
  //   } else if (!/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(data.email)) {
  //     errors.email = 'Email is invalid';
  //   }
  //   if (!data.password.trim()) {
  //     errors.password = 'Password is required';
  //   } else if (data.password.length < 6) {
  //     errors.password = 'Password must be at least 6 characters long';
  //   }
  //   return errors;
  // };

  return (
    <>
      <Navbar/>
      <div className="bg-[#c3d1d0] shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-sm w-full m-auto my-32">
      <h2 className='text-center text-2xl text-gray-700'>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
          <input
            type="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <div className="text-red-500 text-xs italic">{errors.email && <p className="error">{errors.email}</p>}</div>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
          <input
            type="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <div className="text-red-500 text-xs italic">{errors.password && <p className="error">{errors.password}</p>}</div>
        </div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-4 py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Submit</button>
      </form>
    </div>
    </>
  );
}

export default Login;

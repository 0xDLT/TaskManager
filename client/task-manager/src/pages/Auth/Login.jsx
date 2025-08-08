import React, { useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import { useNavigate, Link } from 'react-router-dom';
import Input from "../../components/inputs/input";
import {validateEmail} from '../../utils/helper'
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
import { useContext } from 'react';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const { updateUser } = useContext(UserContext);
    const navigate = useNavigate();

    //handle login from submit 
    const handelogin = async(e) => {
      e.preventDefault();

      if (!validateEmail(email)) {
        setError("Please Enter A Valid Email Address.");
        return;
      }

      if(!password){
        setError("Please Enter The Password ");
        return;
      }

      setError("");

      //login api call
      try{
        const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
          email,
          password,
        });

        const { token, role } = response.data;

        if (token){
          localStorage.setItem("token", token);
          updateUser(response.data)

          //Redirect based on user role
          if (role === "admin") {
            navigate("/admin/dashboard");
          }
          else if (role === "user") {
            navigate("/user/dashboard");
          }
        }
      }catch(error) {
        if(error.response && error.response.data.message) {
          setError(error.response.data.message);
        } else { 
          setError("An error occurred. Please try again.");
        }
    };
  };

  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-semibold test-black'>Welcome Back</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'> please enter your details</p>
      

      <form onSubmit={handelogin}>
        <Input  
        value={email} 
        onChange={({target}) => setEmail(target.value)}
        label="Email Address"
        placeholder='john@example.com'
        type='text'
        />

        <Input  
        value={password} 
        onChange={({target}) => setPassword(target.value)}
        label="Password"
        placeholder='Min 8 Characters'
        type='password'
        />

        {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

        <button type='submit' className='btn-primary'>
          Login 
        </button>

        <p className='text-[13px] text-slate-800 mt-3'>
          Don't Have An Account?{" "}
          <Link className='font-medium text-primary underline' to="/signup">signup</Link>
        </p>
      </form>
      </div>
    </AuthLayout>
    );
}

export default Login;

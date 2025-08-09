import React, { useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import Input from '../../components/inputs/input';
import { useNavigate, Link } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
import { useContext } from 'react';
import uploadImage from '../../utils/uploadimage';

function Signup() {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");


  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate(); 
  
  //Handle Signup Form Submit 
  const handleSignUp = async(e) => {
        e.preventDefault();

        let profileImageUrl = '';

        if (!fullName) {
          setError("Please Enter Full Name.");
          return;
        }

        if (!validateEmail(email)) {
          setError("Please Enter Email.");
          return;
        }
  
        if(!password){
          setError("Please Enter The Password ");
          return;
        }
  
        setError("");
  
        //signup api call
        try{
          //upload profile image if selected
          if (profilePic) {
            const imgUploadRes = await uploadImage(profilePic);
            console.log("Image upload response:", imgUploadRes);
            profileImageUrl = imgUploadRes.imageUrl || '';
          }

          const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
            name: fullName,
            email,
            password,
            adminInviteToken,
            profileImageUrl,
          });

          const { token, role } = response.data;

          if (token){
            localStorage.setItem("token", token);
            updateUser(response.data);

            //Redirect based on user role
            if (role === "admin") {
              navigate("/admin/dashboard");
            } else if (role === "user") {
              navigate("/user/dashboard");
            }
          }
        }catch(error) {
        if(error.response && error.response.data.message) {
          setError(error.response.data.message);
        } else { 
          setError("An error occurred. Please try again.");
        }
      }
    }

  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Create An Account</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6 '>Join Us Today By Entering Your Details Below.</p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              value={fullName}
              onChange={({target}) => setFullName(target.value)}
              label="Full Name"
              placeholder="john"
              type="text"
            />

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

            <Input  
              value={adminInviteToken} 
              onChange={({target}) => setAdminInviteToken(target.value)}
              label="Admin Invite Token"
              placeholder='6 Digit Code'
              type='text'
            />
          </div>

            {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
            
            <button type='submit' className='btn-primary'>
              SignUp 
            </button>
            
            <p className='text-[13px] text-slate-800 mt-3'>
              Already Have An Account?{" "}
              <Link className='font-medium text-primary underline' to="/login">login</Link>
            </p>
          
        </form>
      </div>
    </AuthLayout>
    );
}

export default Signup

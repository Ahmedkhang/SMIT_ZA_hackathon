'use client';

import { useState } from "react";
import Button from "./Button";
import { signupUser } from '@/firebase/auth'
import { writeUserData } from "@/firebase/db";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function SignupForm(){
    
    const [name,setName] = useState('')
    const [age,setAge] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [error,setError] = useState('')
    const router = useRouter()

    const signupMessage = () => {
        Swal.fire({
            title:'Signup Successful',
            text:'Thank You For Signing Up!',
            icon:'success',
            background: "#F9FAFB",
            color: "#111827",
            confirmButtonColor: "#0A84FF",
            iconColor: "#0A84FF"
        })
    }
    
    const errorMessage = (err:any) => {
        Swal.fire({
            title:'Something went wrong!!',
            text:err,
            icon:"error",
            background: "#F9FAFB",
            color: "#111827",
            confirmButtonColor: "#0A84FF",
            iconColor: "#ef4444"
        })
    }

    const handleSignup = async (e:any) => {
 
         e.preventDefault()

    const ageNumber = Number(age) 
    if(isNaN(ageNumber) || ageNumber > 120 || ageNumber < 0 || age == ""){
        errorMessage('Please enter a valid Age')
        return;
    }
    try{

       const userData = {
        name,
        email,
        age,
        createdAt: new Date().toISOString()
       }
       
       // Store in memory instead of localStorage for Claude artifacts
       const userDataStore = userData;

       if(name !== "" ){
           
           const userCredientials = await signupUser(email,password)
           const user = userCredientials.user
           
           
           await writeUserData(`users/`+ user.uid, {
               userName:name,
               userEmail:email,
               userAge:age,
               createdAt: new Date().toISOString()
               
            })
            signupMessage()
            router.push('/login')
        }else{
             errorMessage('Please Fill The Form Correctly!!')
        }
    }
    catch(err){
        console.log(err);
        errorMessage(err)
    }
}
    return(
        <>
        <div className="w-full max-w-md mx-auto flex flex-col justify-center gap-6 bg-white rounded-2xl shadow-2xl items-center p-10 border border-gray-100">
            <div className="w-full text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                <p className="text-gray-600 text-sm">Join us today and get started</p>
            </div>

            <div className="w-full flex flex-col gap-3 justify-center items-center">
                
                <form onSubmit={handleSignup} className="w-full flex flex-col gap-4 justify-center items-center">

                <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                required
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 text-gray-900 placeholder-gray-500"
                />

                <input 
                type="number"
                min={0}
                max={120}
                step={1} 
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Age"
                required
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 text-gray-900 placeholder-gray-500"
                />
                
                <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 text-gray-900 placeholder-gray-500"
                />
                
                <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 text-gray-900 placeholder-gray-500"
                />
                
                <button 
                    type="submit"
                    className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                    Sign Up
                </button>
                </form>

                {error && <p className="text-red-500 text-sm mt-2 bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}
            </div>
        </div> 
        </>
    )
}


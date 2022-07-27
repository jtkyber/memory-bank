import React, { useReducer, useRef } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';
import { setSessionStorageUser } from '../utils/sessionStorage';
import LogReg from '../components/LogReg';

const Register = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const usernameRef = useRef();
    const pwRef = useRef();
    const sumbitBtnRef = useRef();
    const errorTextRef = useRef();

    const registerUser = async (username, password) => {
        try {
            const res = await fetch('/api/register', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                "username": username,
                "password": password
              })
            });
            const user = await res.json();
            if (!user.id) {
                throw new Error('Username already exists')
            }
            const userObject = {
                userID: user.id,
                username: user.username,
                allTags: user.allTags,
                bgImage: user.bgImage
            }
            dispatch(setUser(userObject))
            setSessionStorageUser(userObject)
            router.push('/');
        } catch (err) {
            errorTextRef.current.innerText = err.message;
            console.log(err)
        } finally {
            usernameRef.current.disabled = false;
            pwRef.current.disabled = false;
            sumbitBtnRef.current.disabled = false;
        }
      }

    const handleSubmit = (e) => {
        e.preventDefault();
        usernameRef.current.disabled = true;
        pwRef.current.disabled = true;
        sumbitBtnRef.current.disabled = true;
        const username = e.target.querySelector('#username').value;
        const password = e.target.querySelector('#password').value;

        registerUser(username, password);
    }

    return (
        <LogReg 
            page='Register'
            handleSubmit={handleSubmit} 
            usernameRef={usernameRef} 
            pwRef={pwRef} 
            sumbitBtnRef={sumbitBtnRef} 
            errorTextRef={errorTextRef} 
        />
    );
};

export default Register;
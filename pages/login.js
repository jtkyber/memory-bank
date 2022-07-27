import React, { useRef } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';
import { setSessionStorageUser } from '../utils/sessionStorage';
import LogReg from '../components/LogReg';

const Login = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const usernameRef = useRef();
    const pwRef = useRef();
    const sumbitBtnRef = useRef();
    const errorTextRef = useRef();

    const logInUser = async (username, password) => {
        try {
            const res = await fetch('/api/login', {
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
                throw new Error('Incorrect Username or Password')
            }
            const userObject = {
                userID: user.id,
                username: user.username,
                allTags: user.allTags,
                bgImage: user.bgImage
            }
            dispatch(setUser(userObject))
            setSessionStorageUser(userObject);
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

        logInUser(usernameRef.current.value, pwRef.current.value);
    }

    return (
        <LogReg 
            page='Login'
            handleSubmit={handleSubmit} 
            usernameRef={usernameRef} 
            pwRef={pwRef} 
            sumbitBtnRef={sumbitBtnRef} 
            errorTextRef={errorTextRef} 
        />
    );
};

export default Login;
import React, { useRef } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';
import logRegStyles from '../styles/_LogReg.module.scss';
import { setSessionStorageUser } from '../utils/sessionStorage';

const Login = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const usernameRef = useRef();
    const pwRef = useRef();

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
                usernameRef.current.disabled = false;
                pwRef.current.disabled = false;
                throw new Error('Incorrect Username or Password')
            }
            const userObject = {
                userID: user.id,
                username: user.username,
                allTags: user.allTags
            }
            dispatch(setUser(userObject))
            setSessionStorageUser(userObject);
            router.push('/');
        } catch (err) {
            console.log(err)
        }
      }

    const handleSubmit = (e) => {
        e.preventDefault();
        usernameRef.current.disabled = true;
        pwRef.current.disabled = true;

        logInUser(usernameRef.current.value, pwRef.current.value);
    }

    return (
        <div className={logRegStyles.container}>
            <div className={logRegStyles.logRegBox}>
                <form onSubmit={handleSubmit}>
                    <h2>Login</h2>
                    <div>
                        <label htmlFor='username'>UserName</label>
                        <input ref={usernameRef} type='text' id='username'></input>
                    </div>

                    <div>
                        <label htmlFor='password'>Password</label>
                        <input ref={pwRef} type='password' id='password'></input>
                    </div>
                    <input type='submit'/>
                </form>
            </div>
        </div>
    );
};

export default Login;
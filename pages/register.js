import React from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';
import logRegStyles from '../styles/_LogReg.module.scss';
import { setSessionStorageUser } from '../utils/sessionStorage';

const Register = () => {
    const router = useRouter();
    const dispatch = useDispatch();

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
            const userObject = {
                userID: user.id,
                username: user.username,
                allTags: user.allTags
            }
            dispatch(setUser(userObject))
            setSessionStorageUser(userObject)
            router.push('/');
        } catch (err) {
            console.log(err)
        }
      }

    const handleSubmit = (e) => {
        e.preventDefault();
        const username = e.target.querySelector('#username').value;
        const password = e.target.querySelector('#password').value;

        registerUser(username, password);
    }

    return (
        <div className={logRegStyles.container}>
            <div className={logRegStyles.logRegBox}>
                <form onSubmit={handleSubmit}>
                    <h2>Register</h2>
                    <div>
                        <label htmlFor='username'>UserName</label>
                        <input type='text' id='username'></input>
                    </div>

                    <div>
                        <label htmlFor='password'>Password</label>
                        <input type='password' id='password'></input>
                    </div>
                    <input type='submit'/>
                </form>
            </div>
        </div>
    );
};

export default Register;
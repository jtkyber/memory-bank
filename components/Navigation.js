import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';
import navStyles from '../styles/_Nav.module.scss';

const Navigation = () => {
  const router = useRouter();
  const userID = useSelector(state => state.user.userID);
  const dispatch = useDispatch();

  const logOut = () => {
    dispatch(setUser({
        userID: 0,
        username: '',
        allTags: []
    }))
  }

  return (
        <nav className={ `${navStyles.container} ${router.pathname === '/tagCollection/[tagName]/[photoKey]' ? navStyles.hide : null}`}>
            <div className={ `${navStyles.navChunk} ${navStyles.leftNav}` }>
                <h1 onClick={() => router.push('/')} className={navStyles.appTitle}>MB</h1>
            </div>
            <div className={ `${navStyles.navChunk} ${navStyles.rightNav}` }>
                {
                    !userID
                    ? router.asPath === '/register' 
                        ? <Link href='/login'><a>Log In</a></Link>
                        : <Link href='/register'><a>Register</a></Link>
                    : 
                    <>
                        <Link href='/addPhotos'><a>Add Photos</a></Link>
                        <Link href='/login'><a onClick={logOut}>Log Out</a></Link>
                    </>
                }
            </div>
        </nav>
    );
};

export default Navigation;
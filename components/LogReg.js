import React from 'react';
import logRegStyles from '../styles/logReg/LogReg.module.scss';

const LogReg = ({ page, handleSubmit, usernameRef, pwRef, sumbitBtnRef, errorTextRef }) => {
    return (
        <div className={logRegStyles.container}>
            <div className={logRegStyles.logRegBox}>
                <form onSubmit={handleSubmit}>
                    <h2>{page}</h2>
                    <h5 ref={errorTextRef} className={logRegStyles.errorText}></h5>
                    <div>
                        <label htmlFor='username'>UserName</label>
                        <input ref={usernameRef} type='text' id='username'></input>
                    </div>

                    <div>
                        <label htmlFor='password'>Password</label>
                        <input ref={pwRef} type='password' id='password'></input>
                    </div>
                    <input ref={sumbitBtnRef} className={logRegStyles.submitBtn} type='submit'/>
                </form>
            </div>
        </div>
    );
};

export default LogReg;
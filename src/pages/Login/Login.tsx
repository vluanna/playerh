import React from 'react'
import { Login as RaLogin } from 'react-admin';


const Login = (props): JSX.Element => {

    return (
        <RaLogin
            backgroundImage={'https://www.fshare.vn/images/page-home/background-0.jpg'}
            {...props}
        />
    )
}

export default Login
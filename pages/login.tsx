import { Button } from '@mui/material'
import Head from 'next/head'
import React from 'react'
import styled from 'styled-components'
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase';

const StyleContainer = styled.div`
    height: 100vh;
    display: grid;
    place-items: center;
    background-color: #fff;
`
const StyleLoginContainer = styled.div`
    display: flex;
`


export default function Login() {
    const [signInWithGoogle, _user, _loading, _error] = useSignInWithGoogle(auth);

    const signGoogle = () => {
        signInWithGoogle()
    }

    return (
        <StyleContainer>
            <Head>
                <title>Login</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <StyleLoginContainer>
                <Button variant='outlined' onClick={signGoogle}>
                    Login Google
                </Button>
            </StyleLoginContainer>
        </StyleContainer>
    )
}

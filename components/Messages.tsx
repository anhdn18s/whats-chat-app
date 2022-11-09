import React from 'react'
import { IMessage } from '../types'
import styled from 'styled-components'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../config/firebase'

const StylesContainer = styled.p`
    font-size: 13px;
    width: fit-content;
    word-break: break-all;
    max-width: 90%;
    min-width: 30%;
    padding: 15px 15px 30px;
    border-radius: 10px;
    margin: 10px;
    position: relative;
    color:#000;

`
const StyleSenderMessage = styled(StylesContainer)`
    margin-left: auto;
    background-color: #00ffff;

`
const StyleReceiver = styled(StylesContainer)`
    background-color: #fff;
`

const StyleTimestamp = styled.span`
    position: absolute;
    color: gray;
    font-size: 10px;
    bottom: 10px;
    right: 10px;
    text-align: right;

`

const Messages = ({ messages }: { messages: IMessage }) => {

    const [loggedInUser, loading, _error] = useAuthState(auth);

    const MessagesType =
        loggedInUser?.email === messages.user
            ? StyleSenderMessage
            : StyleReceiver

    return <MessagesType>{messages.text}
        <StyleTimestamp>{messages.sent_at}</StyleTimestamp>
    </MessagesType>

}

export default Messages
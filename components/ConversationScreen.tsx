import React, { KeyboardEventHandler, MouseEventHandler, useRef, useState } from 'react'
import { useRecipient } from '../hooks/useRecipient';
import { Conversation, IMessage } from '../types'
import styled from 'styled-components'
import RecipientAvatar from './RecipientAvatar';
import { convertFirestoreTimestampToString, generateQueryGetMessages, transformMessage } from '../utils/getMessageInConversation';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../config/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import Messages from './Messages';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send'


const StyleRecipientHeader = styled.div`
    position: sticky;
    background-color: #fff;
    z-index: 100;
    display: flex;
    align-items: center;
    padding: 10px;
    height: 80px;
    border-bottom: 1px solid #ccc;
    top: 0;
`
const StyleHeaderInfo = styled.div`
    margin: 0 15px 0 0;
    flex-grow: 1;
    >h3 {
        margin-top: 0;
        margin-bottom: 3px;
        margin-left: 15px;
    }
    >span {
        font-size: 14px;
        color: #000;
        margin-left: 15px;
    }
`
const StyleMessageContainer = styled.div`
    padding: 30px;
    background-color: #dddd;
    min-height: 90%;

`
const StyleInputContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color: #fff;
    z-index: 100;
`
const StyleInput = styled.input`
    outline: navajowhite;
    border: none;
    width: 100%;
    padding: 10px 5px;
`
const EndOfMessagesForAutoScroll = styled.div`
	margin-bottom: 30px;
`

const ConversationScreen = ({
    conversation,
    messages
}: {
    conversation: Conversation
    messages: IMessage[]
}) => {
    const [newMessages, setNewMessages] = useState('')

    const conversationUsers = conversation.users

    const [loggedInUser, loading, _error] = useAuthState(auth);

    const { recipientEmail, recipient } = useRecipient(conversationUsers)


    const router = useRouter()
    const conversationId = router.query.id

    const queryGetMessages = generateQueryGetMessages(conversationId as string)

    const [messagesSnapshot, messagesLoading, __error] = useCollection(queryGetMessages)

    const showMessages = () => {
        if (messagesLoading) {
            return messages.map((messages, index) => <Messages key={messages.id} messages={messages} />)

        }

        if (messagesSnapshot) {
            return messagesSnapshot.docs.map((messages, index) => <Messages key={messages.id} messages={transformMessage(messages)} />)
        }

        return null

    }

    const addMessagesToDbAndUpdateLastSeen = async () => {
        //update
        await setDoc(doc(db, 'users', loggedInUser?.email as string), {
            lastSeen: serverTimestamp()
        }, { merge: true })


        //add message

        await addDoc(collection(db, "messages"), {
            conversation_id: conversationId,
            sent_at: serverTimestamp(),
            text: newMessages,
            user: loggedInUser?.email
        })
        setNewMessages('')
        scrollToBottom()
    }

    const sendMessagesOnEnter: KeyboardEventHandler<HTMLInputElement> = event => {
        if (event.key === "Enter") {
            event.preventDefault()
            if (!newMessages) return
            addMessagesToDbAndUpdateLastSeen()
        }
    }

    const sendMessageOnClick: MouseEventHandler<HTMLButtonElement> = event => {
        event.preventDefault()
        if (!newMessages) return
        addMessagesToDbAndUpdateLastSeen()
    }
    const endOfMessagesRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <>
            <StyleRecipientHeader>
                <RecipientAvatar recipient={recipient} recipientEmail={recipientEmail}></RecipientAvatar>
                <StyleHeaderInfo>
                    <h3>{recipientEmail}</h3>
                    {recipient && (
                        <span>
                            Last active:{' '}
                            {convertFirestoreTimestampToString(recipient.lastSeen)}
                        </span>
                    )}

                </StyleHeaderInfo>

            </StyleRecipientHeader>

            <StyleMessageContainer>
                {showMessages()}
                <EndOfMessagesForAutoScroll ref={endOfMessagesRef} />
            </StyleMessageContainer>

            <StyleInputContainer>
                <StyleInput placeholder='messages...' value={newMessages} onChange={event => setNewMessages(event.target.value)} onKeyDown={sendMessagesOnEnter}></StyleInput>
                <IconButton onClick={sendMessageOnClick} disabled={!newMessages}>
                    <SendIcon />
                </IconButton>
            </StyleInputContainer>
        </>
    )
}
export default ConversationScreen

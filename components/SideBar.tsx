import { signOut } from '@firebase/auth'
import { Chat, Logout, MoreVert, Search } from '@mui/icons-material'
import { Tooltip, Avatar, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from '@mui/material'
import React, { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection } from 'react-firebase-hooks/firestore'
import styled from 'styled-components'
import { auth, db } from '../config/firebase'
import * as EmailValidator from 'email-validator'
import { addDoc, collection, query, where } from 'firebase/firestore'
import { Conversation } from '../types'
import ConversationSelect from './ConversationSelect'

const StyleContainer = styled.div`
    height: 100vh;
    min-width: 300px;
    max-width: 350px;
    overflow-y: scroll;
    border-right: 1px solid #ccc;
`
const StyleHeader = styled.div`
    display: flex;
    position: sticky;
    top:0;
    background-color: #fff;
    z-index: 1;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    height: 80px;
    border-bottom: 1px solid #ccc ;
`

const StyleSearch = styled.div`
    display: flex;
    align-items: center;
    padding:15px;
    border-radius: 2px;
`
const StyleSideBarButton = styled(Button)`
    width: 100%;
    border-top:1px solid #ccc;
    border-bottom:1px solid #ccc;
`
const StyleButtonIcon = styled.div``

const StyleSearchInput = styled.input`
    outline: none;
    border: none;
    flex:1;
`

const StyleUseAvatar = styled(Avatar)`
    cursor: pointer;
    &:hover {
        opacity: 0.8;
    }
`

export default function SideBar() {

    const [loggedInUser, loading, _error] = useAuthState(auth);

    const [isOpenNewConversationDialog, setIsOpenNewConversationDialog] = useState(false)

    const [recipientEmail, setRecipientEmail] = useState('')

    const toggleNewConversationDialog = (isOpen: boolean) => {
        setIsOpenNewConversationDialog(isOpen)
        if (!isOpen) setRecipientEmail('')
    }


    const handleClose = () => {
        toggleNewConversationDialog(false)
    }

    const queryGetConversationsForCurrentUser = query(
        collection(db, 'conversations'),
        where('users', 'array-contains', loggedInUser?.email)
    )
    const [conversationsSnapshot, __loading, __error] = useCollection(
        queryGetConversationsForCurrentUser
    )

    const isConversationAlreadyExists = (recipientEmail: string) =>
        conversationsSnapshot?.docs.find(conversation =>
            (conversation.data() as Conversation).users.includes(recipientEmail)
        )
    const isInvitingSelf = recipientEmail === loggedInUser?.email

    const createConversation = async () => {
        if (!recipientEmail) return

        if (
            EmailValidator.validate(recipientEmail) &&
            !isInvitingSelf &&
            !isConversationAlreadyExists(recipientEmail)
        ) {
            // Add conversation user to db "conversations" collection
            // A conversation is between the currently logged in user and the user invited.

            await addDoc(collection(db, 'conversations'), {
                users: [loggedInUser?.email, recipientEmail]
            })
        }

        handleClose()
    }


    const logout = async () => {
        try {
            await signOut(auth)
        } catch (error) {
            console.log('error', error)
        }
    }
    return (
        <StyleContainer>
            <StyleHeader>
                <Tooltip title={loggedInUser?.email as string}>
                    <StyleUseAvatar src={loggedInUser?.photoURL || ''}></StyleUseAvatar>
                </Tooltip>
                <StyleButtonIcon>
                    <IconButton>
                        <Chat></Chat>
                    </IconButton>
                    <IconButton>
                        <MoreVert></MoreVert>
                    </IconButton>
                    <IconButton onClick={logout}>
                        <Logout></Logout>
                    </IconButton>
                </StyleButtonIcon>
            </StyleHeader>
            <StyleSearch>
                <Search></Search>
                <StyleSearchInput placeholder="Search User" type="text"></StyleSearchInput>
            </StyleSearch>
            <StyleSideBarButton onClick={() => {
                toggleNewConversationDialog(true)
            }}>
                Start A New Conversation
            </StyleSideBarButton>
            {conversationsSnapshot?.docs.map(conversation => (
                <ConversationSelect
                    key={conversation.id}
                    id={conversation.id}
                    conversationUsers={(conversation.data() as Conversation).users}
                />
            ))}

            <Dialog
                open={isOpenNewConversationDialog}
                onClose={handleClose}
            >
                <DialogTitle>New Conversation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter a Google email address for the user you wish to chat
                        with
                    </DialogContentText>
                    <TextField
                        autoFocus
                        label='Email Address'
                        type='email'
                        fullWidth
                        variant='standard'
                        value={recipientEmail}
                        onChange={event => {
                            setRecipientEmail(event.target.value)
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button disabled={!recipientEmail} onClick={createConversation}>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </StyleContainer>
    )
}

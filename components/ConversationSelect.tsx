import React from 'react'
import { Conversation } from '../types';
import styled from 'styled-components'
import { useRecipient } from '../hooks/useRecipient';


const StyleContainer = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 15px;
    word-break:break-all;
    :hover {
        background-color: #ccc;
    }
`

export default function ConversationSelect({ conversationUsers, id }: { id: string; conversationUsers: Conversation['users'] }) {
    const { recipient, recipientEmail } = useRecipient(conversationUsers)
    return (
        <StyleContainer>
            <span>{recipientEmail}</span>
        </StyleContainer>
    )
}

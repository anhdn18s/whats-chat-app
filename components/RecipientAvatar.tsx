import { Avatar } from '@mui/material'
import React from 'react'
import { useRecipient } from '../hooks/useRecipient'

type Props = ReturnType<typeof useRecipient>

export default function RecipientAvatar({ recipient, recipientEmail }: Props) {
    return (
        recipient?.photoURL ? <Avatar src={recipient.photoURL} /> : <Avatar> {recipientEmail && recipientEmail[0].toUpperCase()} </Avatar>
    )
}

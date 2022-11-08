import { User } from 'firebase/auth';
import { Conversation } from './../types/index';
export const getRecipientEmail =
    (conversationUsers: Conversation['users'],
        loggerInUser?: User | null
    ) => conversationUsers.find(useEmail => useEmail !== loggerInUser?.email)
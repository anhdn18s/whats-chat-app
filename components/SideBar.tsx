import { Chat, Logout, MoreVert, Search } from '@mui/icons-material'
import { Tooltip, Avatar, IconButton, Button } from '@mui/material'
import React from 'react'
import styled from 'styled-components'

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
    return (
        <StyleContainer>
            <StyleHeader>
                <Tooltip title="Email">
                    <StyleUseAvatar></StyleUseAvatar>
                </Tooltip>
                <StyleButtonIcon>
                    <IconButton>
                        <Chat></Chat>
                    </IconButton>
                    <IconButton>
                        <MoreVert></MoreVert>
                    </IconButton>
                    <IconButton>
                        <Logout></Logout>
                    </IconButton>
                </StyleButtonIcon>
            </StyleHeader>
            <StyleSearch>
                <Search></Search>
                <StyleSearchInput placeholder="Search User" type="text"></StyleSearchInput>
            </StyleSearch>
            <StyleSideBarButton>
                Start A New Conversation
            </StyleSideBarButton>
        </StyleContainer>
    )
}

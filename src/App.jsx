import { useState, useEffect, useRef } from 'react';
import './App.css';
import SplashPage from './Components/SplashPage';
import ChatList from './Components/ChatList';
import ChatPage from './Components/ChatPage';

function App() {

  const [page, setPage] = useState('/');
  const [displayName, setDisplayName] = useState('');
  const [selectedChat, setChat] = useState('');

  return (
    <div className="App">
      {page == '/' ? (
        <SplashPage setPage={setPage} setDisplayName={setDisplayName}/>
      ) : page == '/list' ? (
        <ChatList displayName={displayName} setPage={setPage} setChat={setChat} />
      ) : page == '/chatroom' ? (
        <ChatPage displayName={displayName} setPage={setPage} setChat={setChat} selectedChat={selectedChat}/>
      ) : (
        <>

        </>
      )}
    </div>
  );
}

export default App;

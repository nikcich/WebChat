import { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client';
import Messages from '../Messages';
import { Button, Spinner, Table, Form, InputGroup } from 'react-bootstrap';
import './chat.css';

const socket = io("ws://173.255.196.121:2022");

function ChatPage(props) {
  const { displayName, setPage, setChat, selectedChat } = props;
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState([]);
  const [roomJoined, setRoomJoined] = useState(false);
  const inputRef = useRef();

  const sendMessage = (e) => {
    e.preventDefault();
    let content = inputRef.current.value;
    let time = new Date().toISOString();
    socket.emit('message', { room: selectedChat, name: displayName, content: content, time: time });
    inputRef.current.value = '';
  }

  const handleExit = () => {
    setPage('/list');
  }


  useEffect(() => {

    if (socket.connected && roomJoined == false) {
      setRoomJoined(true);
      socket.emit('join', { room: selectedChat });
    }

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('pong', () => {

    });

    socket.on('loadMessages', (data) => {
      setMessages(data);
    });

    socket.on('newMessage', (data) => {
      setMessages((old) => {
        let tmp = [...old, data];
        return tmp;

      });
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
      socket.off('loadMessages');
      socket.off('newMessage');
    };
  }, [messages]);

  const sendPing = () => {
    socket.emit('ping');
  }

  return (
    <div className="ChatPage">
      {!isConnected &&
        <>

          <p>Connecting</p>

        </>}

      {isConnected &&
        <div className="controlContainer">
          <Button onClick={() => handleExit()}>Exit Room</Button>
          <p>Connected: {'' + isConnected}</p>
          <Messages socket={socket} messages={messages} />
          <Form onSubmit={(e) => sendMessage(e)} style={{ width: '75vw' }}>
            <InputGroup hasValidation>
              <Form.Control type="text" required isInvalid={false} placeholder="Enter a message" ref={inputRef} />
              <Button variant="primary" type="submit">
                &#8594;
              </Button>
              <Form.Control.Feedback type="invalid">
                Please enter a message.
              </Form.Control.Feedback>
            </InputGroup>
          </Form>




        </div>
      }

    </div>
  )
}

export default ChatPage

import { useState, useEffect, useRef } from 'react'
import moment from 'moment/moment';
import { Button, Spinner, Table, Form, InputGroup } from 'react-bootstrap';
import './msg.css';

const Messages = (props) => {
    // const [messages, setMessages] = useState([]);

    const { socket, messages } = props;

    const container = useRef();

    useEffect(() => {
        container.current.scrollTo(0, container.current.scrollHeight);
    }, [messages]);

    return (<div  style={{ height: '80%', width: '100%' }}>
        <div ref={container} style={{
            height: '100%', width: '100%', display: 'flex', gap: '0.5rem', overflowY: 'scroll', flexWrap: 'wrap'
        }}>
            {messages.map((msg, idx) => {
                return (
                    <div key={idx} className="messageItem">
                        <div style={{ height: '2rem', width: '100%', display: 'flex', marginTop: '0.5rem' }}>
                            <div style={{ height: '100%', width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                <h3 style={{ marginLeft: '0.5rem' }}>{msg.name}</h3>
                            </div>
                            <div style={{ height: '100%', width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <h3 style={{ marginRight: '0.5rem', fontSize: '1.1rem' }}>{moment(msg.timestamp).fromNow()}</h3>
                            </div>
                        </div>

                        <p style={{
                            overflowWrap: 'break-word', fontSize: '1.1rem', marginLeft: '1rem',
                            textAlign: 'left', width: '100%',
                        }}>
                            {msg.content}
                        </p>
                    </div>
                );
            })}
        </div>

    </div>)
}

export default Messages;
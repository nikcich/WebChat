import { useState, useEffect, useRef } from 'react'
import moment from 'moment/moment';
import { Button, Spinner, Table, Form, InputGroup } from 'react-bootstrap';

const Messages = (props) => {
    // const [messages, setMessages] = useState([]);

    const { socket, messages } = props;

    const container = useRef();

    useEffect(() => {
        container.current.scrollTo(0, container.current.scrollHeight);
    }, [messages]);

    return (<div ref={container} className="messageContainer">
        <Table striped bordered hover style={{ width: '100%' }}>
            <thead>
                <tr>
                    <th style={{ width: '15%', paddingLeft: '1rem', minWidth: '150px' }}></th>
                    <th style={{ width: '80%', maxWidth: '40vw', overflow: 'hidden' }}></th>
                    <th style={{ minWidth: '150px'}}></th>
                </tr>
            </thead>
            <tbody>
                {messages.map((msg, idx) => {
                    return (
                        <tr key={idx} >
                            <th style={{ width: '15%', paddingLeft: '1rem', minWidth: '150px', textAlign: 'right' }}>{msg.name}:</th>
                            <td style={{ width: '80%', maxWidth: '40vw', overflow: 'hidden', overflowWrap: 'break-word' }}>{msg.content}</td>
                            <td>{moment(msg.timestamp).fromNow()}</td>
                        </tr>
                    );
                })}
            </tbody>
        </Table>

    </div>)
}

export default Messages;
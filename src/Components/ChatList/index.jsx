import { useEffect, useRef, useState } from 'react';
import { Button, Spinner, Table, Form, InputGroup, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';

const ChatList = (props) => {
    const { displayName, setPage, setChat } = props;
    const [rooms, setRooms] = useState(null);
    const [show, setShow] = useState(false);
    const newNameRef = useRef();

    const [error, setError] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleRoomSelection = (room) => {
        setChat(room);
        setPage('/chatroom');
    }

    const handleCreate = async (e) => {
        e.preventDefault();
        console.log(newNameRef.current.value);

        axios({
            method: 'post',
            url: 'http://localhost:3000/createroom',
            headers: {},
            data: {
                name: newNameRef.current.value, // This is the body part
            }
        }).then((response) => response.data).then((response) => {
            if (response.msg == 'Successfully created room.') {
                handleClose();
                fetchRooms();
            } else {
                setError(response.msg);
            }
        });


    }

    const fetchRooms = () => {
        fetch("http://localhost:3000/chatlist").then((res) => res.json()).then((res) => {
            setRooms(res);
        });
    }

    useEffect(() => {
        if (rooms == null) {
            fetchRooms();
        }
    });

    return (
        <>
            <h1>Hello there {displayName}</h1>
            <br />
            <Button variant="primary" onClick={handleShow}>
                Create Chat Room
            </Button>
            <br />
            <Table striped bordered hover style={{ width: '90vw' }}>
                <thead>
                    <tr>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {rooms != null && rooms.map((room, idx) => {
                        return (
                            <tr key={idx} onClick={() => handleRoomSelection(room.name)} style={{ cursor: 'pointer' }}>
                                <td>{room.name}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>

            <Modal show={show} onHide={handleClose}>

                <Form onSubmit={(e) => handleSubmit(e)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Enter a name for the room...</Modal.Body>
                    <Form.Control type="text" required isInvalid={false} placeholder="Enter a room name" ref={newNameRef} />
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleCreate} type="submit">
                            Save Changes
                        </Button>
                    </Modal.Footer>
                    {error != false &&
                        <Alert variant={'danger'}>{error}</Alert>
                    }

                </Form>
            </Modal>
        </>
    );
}

export default ChatList;
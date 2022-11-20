import { useEffect, useRef, useState } from 'react';
import { Button, Spinner, Table, Form, InputGroup, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';

const ChatList = (props) => {
    const { displayName, setPage, setChat, version } = props;
    const [rooms, setRooms] = useState(null);
    const [show, setShow] = useState(false);
    const newNameRef = useRef();

    let panelStyle = {
        height: '100vh', width: '15vw', 
        overflow: 'hidden', position: 'absolute', left: '0',
        minWidth: '80px', zIndex: '2', padding: '0.5rem'
    }

    if(version == "standalone"){
        console.log("YEET");
        panelStyle ={

        }
    }

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
            url: 'http://173.255.196.121:2022/createroom',
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
        fetch("http://173.255.196.121:2022/chatlist").then((res) => res.json()).then((res) => {
            setRooms(res);
        });
    }

    useEffect(() => {
        if (rooms == null) {
            fetchRooms();
        }
    });

    return (
        <div style={panelStyle} className={(version == "standalone" ? "" : "listPanel")}>
            <h1 style={{fontSize: '1rem'}}>Hi {displayName}</h1>
            <br />
            <Button variant="primary" onClick={handleShow}>
                New Room
            </Button>
            <br />
            <br />
            <Table striped bordered hover style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th>Rooms</th>
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
        </div>
    );
}

export default ChatList;
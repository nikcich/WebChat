import { useEffect, useRef, useState } from 'react';
import { Button, Spinner, Table, Form, InputGroup, Modal, Alert, Nav, Navbar, Container } from 'react-bootstrap';
import './list.css';
import axios from 'axios';

const ChatList = (props) => {
    const { displayName, setPage, setChat, version } = props;
    const [rooms, setRooms] = useState(null);
    const [show, setShow] = useState(false);
    const [sidePanel, setSidePanel] = useState(false);
    const newNameRef = useRef();

    let panelStyle = {
        // height: '100vh', width: '15vw',
        // overflow: 'hidden', position: 'absolute', left: '0',
        // minWidth: '80px', zIndex: '2', padding: '0.5rem'
    }

    if (version == "standalone") {
        panelStyle = {
            minWidth: '80%'
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

    const openSidePanel = () => {

    }

    useEffect(() => {
        if (rooms == null) {
            fetchRooms();
        }
    });

    return (
        <>

            {version != "standalone" &&
                <>
                    <div style={{
                        position: 'absolute', top: '0', left: '0', width: '100%',
                        height: '3.5rem', background: 'black', zIndex: '5', display: 'flex', alignItems: 'center'
                    }}>
                        <Button onClick={() => setSidePanel(old => !old)}>{sidePanel ? "Close" : "Open"}</Button>
                    </div>

                    <div
                        className={(sidePanel ? "spOpen sp" : "spClosed sp")}
                    >
                        <Button variant="primary" onClick={handleShow} style={{
                            cursor: 'pointer', fontSize: '0.75rem',
                            width: '80%',
                        }}>
                            New Room
                        </Button>

                        {rooms != null && rooms.map((room, idx) => {
                            return (
                                <Button
                                    variant={"secondary"}
                                    onClick={() => handleRoomSelection(room.name)}
                                    style={{ cursor: 'pointer', fontSize: '0.75rem', width: '80%' }}
                                >{room.name}</Button>
                            );
                        })}
                    </div>
                </>
            }



            {version == "standalone" &&
                <div style={{ width: '80%' }}>
                    <h1 style={{ fontSize: '1rem' }}>Hi {displayName}</h1>
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
                </div>
            }

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
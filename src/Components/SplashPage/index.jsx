import { useRef, useState } from 'react';
import { Button, Spinner, Table, Form, InputGroup, Alert } from 'react-bootstrap';
import axios from 'axios';

const SplashPage = (props) => {

    const [loading, setLoading] = useState(false);
    const { setPage, setDisplayName } = props;
    const [error, setError] = useState(false);
    const nameRef = useRef();
    const passwordRef = useRef();

    const handleSignUp = () => {
        if (!loading) {
            let nm = nameRef.current.value;
            let ps = passwordRef.current.value;
            setLoading(true);

            axios({
                method: 'post',
                url: 'http://localhost:3000/signup',
                headers: {},
                data: {
                    name: nm,
                    password: ps,
                }
            }).then((response) => response.data).then((response) => {
                if (response.success) {
                    setError(false);
                    setLoading(false);
                    setDisplayName(nm);
                    setPage('/list');
                } else {
                    setLoading(false);
                    setError(response.msg);
                }
            });
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!loading) {
            let nm = nameRef.current.value;
            let ps = passwordRef.current.value;
            setLoading(true);


            axios({
                method: 'post',
                url: 'http://localhost:3000/login',
                headers: {},
                data: {
                    name: nm,
                    password: ps,
                }
            }).then((response) => response.data).then((response) => {
                if (response.success) {
                    setError(false);
                    setLoading(false);
                    setDisplayName(nm);
                    setPage('/list');
                } else {
                    setLoading(false);
                    setError(response.msg);
                }
            });
        }
    }

    return (
        <div>
            {error != false &&
                <Alert variant="danger">{error}</Alert>
            }

            <InputGroup.Text>Please Enter a Display Name</InputGroup.Text>
            <br />
            <Form onSubmit={(e) => handleSubmit(e)}>
                {!loading ? <>
                    <InputGroup hasValidation>
                        <InputGroup.Text>@</InputGroup.Text>
                        <Form.Control type="text" required isInvalid={false} placeholder="Enter a display name" ref={nameRef} />

                        <Form.Control.Feedback type="invalid">
                            Please choose a display name.
                        </Form.Control.Feedback>
                    </InputGroup>
                    <br />
                    <InputGroup hasValidation>
                        <Form.Control type="password" required isInvalid={false} placeholder="Enter a password" ref={passwordRef} />
                        <Form.Control.Feedback type="invalid">
                            Please choose a password.
                        </Form.Control.Feedback>
                    </InputGroup>
                    <br />
                    <Button variant="secondary" style={{ marginRight: '1rem' }} onClick={() => handleSignUp()}>
                        Sign Up
                    </Button>
                    <Button variant="primary" type="submit">
                        Log In
                    </Button>
                </> : <Spinner animation="border" variant="primary" />
                }
            </Form>
        </div>
    );
}

export default SplashPage;
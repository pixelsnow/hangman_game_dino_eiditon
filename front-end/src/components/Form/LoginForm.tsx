import React, { ChangeEvent, FormEvent, useContext, useState } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { signInUser } from "../../firebase/firebase";
import Board from "../../routes/Board/Board";
import { AuthContext } from "../../context/auth-context";
import { useAppDispatch } from "../../hooks/hooks";
import { setPlayerDispatch } from "../../features/PlayerSlice";

const defaultFormFields = {
  email: "",
  password: "",
};

function LoginForm() {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { email, password } = formFields;
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const dispatch = useAppDispatch();
  const resetFormFields = () => {
    return setFormFields(defaultFormFields);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      // Send the email and password to firebase
      const userCredential = await signInUser(email, password);
      if (userCredential) {
        resetFormFields();
        setCurrentUser(userCredential.user);
        dispatch(setPlayerDispatch(userCredential.user));
      }
    } catch (error: any) {}
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { type, value } = event.target;
    setFormFields({ ...formFields, [type]: value });
  };
  return !currentUser ? (
    <Form onSubmit={handleSubmit}>
      <FloatingLabel
        controlId="floatingInput"
        label="Email address"
        className="mb-3"
      >
        <Form.Control
          type="email"
          value={email}
          onChange={handleChange}
          required
        />
      </FloatingLabel>
      <FloatingLabel controlId="floatingPassword" label="Password">
        <Form.Control
          type="password"
          value={password}
          onChange={handleChange}
          required
        />
      </FloatingLabel>
      <Button variant="primary" type="submit">
        Login
      </Button>
    </Form>
  ) : (
    <Board />
  );
}

export default LoginForm;

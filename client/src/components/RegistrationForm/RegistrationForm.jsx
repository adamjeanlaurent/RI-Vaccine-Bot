import React, { useState } from 'react';
import './RegistrationForm.css';
import { withRouter } from "react-router-dom";

function RegistrationForm(props) {
    const [state, setState] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        SuccessMessage: null
    })

    const handleChange = (e) => {
        const { id, value } = e.target
        setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    }


    const sendDetailsToServer = async () => {
        // check that the user filled out form
        if (state.email.length && state.password.length) {
            props.showError(null);
            const payload = {
                email: state.email,
                password: state.password
            }

            const options =  {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            }

            const regResponse = await fetch('/api/auth/register', options);
            const authResponse = await fetch('/api/auth/authenticate', options);

            const authText = await authResponse.text();
            redirectToHome();

        } else {
            props.showError('Please enter valid email and password')
        }

    }
    const redirectToHome = () => {
        props.updateTitle('Home')
        props.history.push('/home');
    }
    const redirectToLogin = () => {
        props.updateTitle('Login')
        props.history.push('/login');
    }

    const handleSubmitClick = (e) => {
        e.preventDefault();
        if (state.password === state.confirmPassword) {
            sendDetailsToServer()
        } else {
            props.showError('Passwords do not match');
        }
    }

    return (
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
            <form>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputEmail">Email Address</label>
                    <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" value={state.email} onChange={handleChange} />
                    <small id="emailHelp" className="form-text text-muted">we'll never share your information with anyone else</small>
                </div>

                <div className="form-group text-left">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input type="password" className="form-control" id="password" placeholder="Password" value={state.password} onChange={handleChange} />
                </div>

                <div className="form-group text-left">
                    <label htmlFor="exampleInputPassword1">Confirm Password</label>
                    <input type="password" className="form-control" id="confirmPassword" placeholder="Confirm Password" value={state.confirmPassword} onChange={handleChange} />
                </div>

                <button type="submit" className="btn btn-primary" onClick={handleSubmitClick}> Register</button>
            </form>
            <div className="alert alert-success mt-2" style={{ display: state.successMessage ? 'block' : 'none' }} role="alert">
                {state.successMessage}
            </div>
            <div className="mt-2">
                <span>Already have an account? </span>
                <span className="loginText" onClick={() => redirectToLogin()}>Login here</span>
            </div>
        </div>
    )
}

export default withRouter(RegistrationForm);
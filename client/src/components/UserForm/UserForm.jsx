import React, { useState } from 'react';
import axios from 'axios';
import './UserForm.css';
import { withRouter } from "react-router-dom";

function UserForm(props) {
    const [state, setState] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        datePicked: '',
        startTime: '',
        endTime: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target
        setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    }

    const handleSubmitClick = (e) => {
        e.preventDefault();
        if (state.phone && state.datePicked && state.startTime && state.endTime && state.firstName && state.lastName) {
            sendDetailsToServer()
        } else {
            props.showError('please fill out all fields');
        }
    }

    const sendDetailsToServer = async () => {
        if(state.phone && state.datePicked && state.startTime && state.endTime && state.firstName && state.lastName) {
            props.showError(null);
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    f_name: state.firstName,
                    l_name: state.lastName,
                    phone: state.phone,
                    date_picked: state.datePicked,
                    start_time: state.startTime,
                    end_time: state.endTime
                })
            }

            await fetch('/api/task/addTask', options);
        }
    }

    return (
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
        <form>
            <div className="form-group text-left">
                <label htmlFor="exampleInputEmail">First Name</label>
                <input type="text" className="form-control" id="firstName" aria-describedby="firstName" placeholder="Enter first name" value={state.firstName} onChange={handleChange} />
                <small id="firstNameHelp" className="form-text text-muted">we'll never share your information with anyone else</small>
            </div>

            <div className="form-group text-left">
                <label htmlFor="exampleInputEmail">Last Name</label>
                <input type="text" className="form-control" id="lastName" aria-describedby="lastName" placeholder="Enter last name" value={state.lastName} onChange={handleChange} />
                <small id="lastNameHelp" className="form-text text-muted">we'll never share your information with anyone else</small>
            </div>

            <div className="form-group text-left">
                <label htmlFor="exampleInputEmail">phone</label>
                <input type="tel" className="form-control" id="phone" aria-describedby="phoneHelp" placeholder="Enter phone" value={state.phone} onChange={handleChange} />
                <small id="phoneHelp" className="form-text text-muted">we'll never share your information with anyone else</small>
            </div>

            <div className="form-group text-left">
                <label htmlFor="exampleInputEmail">date</label>
                <input type="text" className="form-control" id="datePicked" aria-describedby="dateHelp" placeholder="Enter date" value={state.datePicked} onChange={handleChange} />
                <small id="dateHelp" className="form-text text-muted">we'll never share your information with anyone else</small>
            </div>

            <div className="form-group text-left">
                <label htmlFor="exampleInputEmail">start time</label>
                <input type="text" className="form-control" id="startTime" aria-describedby="startTimeHelp" placeholder="Enter start time" value={state.email} onChange={handleChange} />
                <small id="startTimeHelp" className="form-text text-muted">we'll never share your information with anyone else</small>
            </div>

            <div className="form-group text-left">
                <label htmlFor="exampleInputEmail">end time</label>
                <input type="text" className="form-control" id="endTime" aria-describedby="endTimeHelp" placeholder="Enter end time" value={state.endTime} onChange={handleChange} />
                <small id="endTimeHelp" className="form-text text-muted">we'll never share your information with anyone else</small>
            </div>


            <button type="submit" className="btn btn-primary" onClick={handleSubmitClick}> Register</button>
        </form>
        <div className="alert alert-success mt-2" style={{ display: state.successMessage ? 'block' : 'none' }} role="alert">
            {state.successMessage}
        </div>
    </div>
    );
}

export default withRouter(UserForm);
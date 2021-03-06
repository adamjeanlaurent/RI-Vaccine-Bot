import React,{ useState, useEffect  } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import './Home.css';

function Home(props) {
    useEffect(() => {
      fetchTasks();
    }, []);

    props.updateTitle('Home');

    const [state, setState] = useState([]);

    const fetchTasks = async () => {
      const response = await fetch('/api/task/getTasks');
      const data = await response.json();
      setState(data);
    }

    const redirectToTasks = () => {
      props.history.push('/form');
    }

    return(
      <div class="container">
          <h2 className="title">Your Current Vaccine Alert Tasks</h2>
          <table className="table">
          <thead className="thead-dark">
            <tr>
              <th scope="col">TaskID</th>
              <th scope="col">FirstName</th>
              <th scope="col">LastName</th>
              <th scope="col">Phone</th>
              <th scope="col">Date</th>
              <th scope="col">StartTime</th>
              <th scope="col">EndTime</th>
              <th scope="col">Completed</th>
            </tr>
          </thead>
          <tbody>
            {state.map(function(task) {
              return (
                <tr>
                <td>{task.TaskID}</td>
                <td>{task.FirstName}</td>
                <td>{task.LastName}</td>
                <td>{task.Phone}</td>
                <td>{task.Date}</td>
                <td>{task.StartTime}</td>
                <td>{task.EndTime}</td>
                <td>{task.Completed ? "Yes" : "No"}</td>
            </tr>
              );
            })}
          </tbody>
        </table>
        <button type="button" class="btn btn-primary" onClick={() => redirectToTasks()}>Create Vaccine Task Alerts</button>
      </div>
    );
    }

export default withRouter(Home);
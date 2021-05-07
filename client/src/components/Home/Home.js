import React,{ useState, useEffect  } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

function Home(props) {
    useEffect(() => {
      fetchTasks();
    }, []);

    const [state, setState] = useState([]);

    const fetchTasks = async () => {
      const response = await fetch('/api/task/getTasks');
      const data = await response.json();
      setState(data);
    }
    return(
      <div class="container">
          <h2> Table to showcase your tasks</h2>
          <table className="table">
          <thead>
            <tr>
              <th>TaskID</th>
              <th>FirstName</th>
              <th>LastName</th>
              <th>Phone</th>
              <th>Date</th>
              <th>TaskID</th>
              <th>StartTime</th>
              <th>EndTime</th>
              <th>Completed</th>
            </tr>
          </thead>
          <tbody>
            {state.data.map(function(task) {
              <tr>
                <td>task.TaskID</td>
                <td>task.FirstName</td>
                <td>task.LastName</td>
                <td>task.Phone</td>
                <td>task.Date</td>
                <td>task.StartTime</td>
                <td>task.EndTime</td>
                <td>task.Completed</td>
             </tr>
            })}
          </tbody>
        </table>
      </div>
    );
    }

export default withRouter(Home);
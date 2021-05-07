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
        <div>
          <h1>hi</h1>
        </div>
    );
    }

export default withRouter(Home);
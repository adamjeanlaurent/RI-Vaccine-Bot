import React,{ useState, useEffect  } from 'react';
import { withRouter } from 'react-router-dom';

function Home(props) {
    function redirectToLogin() {
    props.history.push('/login');
    }

    function Question(props) {
      useEffect(() => {
        fetchQuestion();
      }, []);

      const [state, setState] = useState({});

    const fetchQuestion = async () => {
      const response = await fetch('/api/task/getTasks');
      const data = await response.json();
      setState(data);
    }

    return(
        <div>
          <h1> {state.Question} </h1>
        </div>
    );
}

export default withRouter(Home);
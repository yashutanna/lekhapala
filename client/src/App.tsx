import './index.css';
import Snapshot from './Snapshot';
import ScaledValues from './ScaledValues';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import TrueValues from './TrueValues';
import TimelineContextProvider from './TimelineContext';

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">True Values</Link>
            </li>
            <li>
              <Link to="/scaled">Scaled to 1</Link>
            </li>
            <li>
              <Link to="/snapshot">Snapshot</Link>
            </li>
          </ul>
        </nav>
        <TimelineContextProvider>  
          <Switch>
            <Route path="/scaled">
              <ScaledValues />
            </Route>
            <Route path="/snapshot">
              <Snapshot />
            </Route>
            <Route path="/">
              <TrueValues />
            </Route>
          </Switch> 
        </TimelineContextProvider>
      </div>
    </Router>
  )
};

export default App;
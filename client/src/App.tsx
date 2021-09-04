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
import useTimeline from './useTimeline';

const App = () => {
  const { timeline, snapshot, loading } = useTimeline();
  console.log({ timeline, snapshot, loading });
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

        {
          loading ? "Loading..." : (
            <Switch>
              <Route path="/scaled">
                <ScaledValues timeline={timeline} />
              </Route>
              <Route path="/snapshot">
                <Snapshot snapshot={snapshot} />
              </Route>
              <Route path="/">
                <TrueValues timeline={timeline} />
              </Route>
            </Switch> 
          )
        }
      </div>
    </Router>
  )
};

export default App;
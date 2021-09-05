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
import TimelineContextProvider, { day, hour, TimelineContext } from './TimelineContext';
import { useState } from 'react';

const App = () => {
  const [amount, setAmount] = useState(1);
  const [time, setTime] = useState(day);
  return (
    <Router>
      <div>
        <TimelineContextProvider>  
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
              <li>
                <input value={amount} type="number" onChange={({ target: { value }}) => setAmount(Number(value))}/>
                <select value={time} onChange={({ target: { value }}) => setTime(Number(value))}>
                  <option value={day}>day</option>
                  <option value={hour}>hour</option>
                </select>
                <TimelineContext.Consumer>
                  {({ setFrom }) => (
                    <button onClick={() => setFrom(amount * time)}>filter</button>
                  )}
                </TimelineContext.Consumer>
              </li>
            </ul>
          </nav>
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
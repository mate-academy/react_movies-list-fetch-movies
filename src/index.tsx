import ReactDOM from 'react-dom';
import 'bulma/css/bulma.css';
import dotenv from 'dotenv';
import { App } from './App';

dotenv.config();

ReactDOM.render(<App />, document.getElementById('root'));

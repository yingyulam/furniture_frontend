import { createRoot } from 'react-dom/client';
import './index.css';
import './services/http'; // installs global axios timeout + retry (handles Render cold starts)
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';


// NOTE: StrictMode is intentionally omitted. google-map-react@2.x is not
// compatible with React 18 StrictMode's double mount/unmount cycle and throws
// (getChildren / dispose errors) on the map detail page.
const root = createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import "./App.css";
import Index from "./Index.jsx";
import {store} from './redux/store.js';
import { Provider } from "react-redux";
function App() {
  return (
    <Provider store={store}>
      <Index />
    </Provider>
  );
}

export default App;

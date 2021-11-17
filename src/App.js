import logo from './logo.svg';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"
import UploadFiles from "./components/uploadFileComponent";

function App() {
  return (
    <div className="container" style={{width:"600px"}}>
        <UploadFiles/>
    </div>
  );
}

export default App;

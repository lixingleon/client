import logo from './logo.svg';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"
import UploadFiles from "./components/uploadFileComponent";
import TrainData from "./components/trainDataComponent";

function App() {
  return (
    <div className="container mt-5" style={{width:"600px"}}>
        <h1 style={{textAlign:"center"}}>Help the pet find a home</h1>
        <UploadFiles />
    </div>
  );
}

export default App;

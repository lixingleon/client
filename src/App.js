import logo from './logo.svg';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"
import TrainDataComponent from "./components/TrainDataComponent";
import UploadFiles from "./components/uploadFileComponent";

function App() {
  return (
    <div className="container" style={{width:"600px"}}>
        <TrainDataComponent/>
        <UploadFiles/>
    </div>
  );
}

export default App;

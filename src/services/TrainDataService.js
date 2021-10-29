import axios from 'axios'

const TrainData_URL = 'http://localhost:8080/api/TrainData';
const Train_URL = 'http://localhost:8080/api/Train';

class TrainDataService{

    getTrainResult(data){
        console.log(data)
        return axios.post(Train_URL, data);
    }
    getUploadedFiles(){
        return axios.get(TrainData_URL);
    }
}
export default new TrainDataService();
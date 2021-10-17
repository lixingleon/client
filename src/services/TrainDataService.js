import axios from 'axios'

const TrainData_URL = 'http://localhost:8080/api/TrainData'

class TrainDataService{

    getTrainResult(data){
        console.log(data)
        return axios.post(TrainData_URL, data);
    }
    getUploadedFiles(){
        return axios.get(TrainData_URL);
    }
}
export default new TrainDataService();
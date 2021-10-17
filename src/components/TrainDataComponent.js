import React from 'react';
import TrainDataService from "../services/TrainDataService";
class TrainDataComponent extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            trainDataFiles:[],
            result:''
        }
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        TrainDataService.getUploadedFiles().then((response) =>{
            this.setState({trainDataFiles: response.data});
        })
    }
    handleClick(){
        let data={"name":this.state.trainDataFiles[0].name};
        TrainDataService.getTrainResult(data).then((response) =>{
            this.setState({result: response.data});
        })
    }

    render() {
        return(
            <div style={{display: 'flex',flexDirection:'column' ,justifyContent: 'center', alignItems:'center'}}>
                <h1>Train Data List</h1>
                <table >
                    <thead>
                        <tr>
                            <td> File name</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.trainDataFiles.map(file =>
                                <tr key={file.id}>
                                    <td>{file.name}</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
               <button onClick={this.handleClick}>Train</button>
                <h1>{this.state.result}</h1>
            </div>
        );
    }

}
export default TrainDataComponent;
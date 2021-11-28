import React from "react";
import CryptoJS from 'crypto-js';
import UploadService from "../services/uploadFileService";
import CRUDFileService from "../services/CRUDFileService";
import Button from "@material-ui/core/Button";
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import {Typography} from "@material-ui/core";
import AverageDisplayer from "./AverageDisplayerComponent"

class UploadFileComponent extends React.Component{

    constructor(props) {
        super(props);
        this.state= {
            selectedFiles: undefined,
            currentFile: undefined,
            progress: 0,
            message: "",
            fileInfos: [],
            fileMetaData:undefined,
            selectedFeatures:[]
        }

    }

    componentDidMount() {
        this.listFiles();
    }

    selectFile(event){
        this.setState({
            selectedFiles:event.target.files
        });

    }
    deleteFile(id, name){
        CRUDFileService.deleteFileByIdAndName(id, name)
            .then((response) =>{
                if(response.data === true){
                    this.listFiles();
                    this.setState({
                        fileMetaData:undefined,
                        selectedFeatures:[]
                    })
                }

            });

    }
    listFiles(){
        CRUDFileService.getFiles().then((response) =>{
            const files = response.data;
            this.setState({
                fileInfos: files
            });
        });
    }

    async upload(){
        let currentFile = this.state.selectedFiles[0];
        //获取文件的md5,目的是文件秒传功能
        const md5 = CryptoJS.MD5(CryptoJS.enc.Latin1.parse(currentFile)).toString();
        //检查数据库是否已经有文件了：大文件秒传
        let flag = await CRUDFileService.checkFile(md5);
        console.log(md5);
        console.log("flag", flag);
        if(flag){
            alert("this file has already been uploaded!");
            return;
        }
        this.setState({
            progress:0,
            currentFile:currentFile
        });
        const chunkedFileList = UploadService.getChunkedFile(currentFile);
        let chunkNum = chunkedFileList.length;
        for(let i = 0; i<chunkNum;i ++){
            //check if chunk is exist
            let flag = await CRUDFileService.checkChunk(i, md5);
            if(!flag){
                await UploadService.uploadChunk(chunkedFileList[i], i, chunkNum, currentFile.name, md5);
            }
            this.setState({
                //用已上传的分片文件除以总分片数得到进度条
                progress:Math.round(100*(i+1)/chunkNum)
            });
        }
        await UploadService.orderComposeFile(chunkNum, currentFile.name, md5);
        this.listFiles();


    }


    render(){
        const {
            selectedFiles,
            currentFile,
            progress,
            message,
            fileInfos,
            fileMetaData,
            selectedFeatures
        } = this.state;

        return(

            <div className="container" >
                {currentFile && (
                    <div className="progress">
                        <div
                            className="progress-bar progress-bar-info progress-bar-striped"
                            role="progressbar"
                            aria-valuenow={progress}
                            aria-valuemin="0"
                            aria-valuemax="100"
                            style={{ width: progress + "%" }}
                        >
                            {progress}%
                        </div>
                    </div>
                )}

                <label className="btn btn-default">
                    <input
                        type="file"
                        onChange={(event) =>this.selectFile(event)}
                        className="form-control"
                    />
                </label>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<CloudUploadIcon />}
                    disabled={!selectedFiles}
                    onClick={() =>this.upload()}
                >Upload
                </Button>



                <div className="alert alert-light" role="alert">
                    {message}
                </div>

                <div className="card">
                    <div className="card-header">List of Files</div>
                    <ul className="list-group list-group-flush">
                        {fileInfos &&
                        fileInfos.map(file =>
                            <li className="list-group-item" key={file.id}>
                                <div style={{display:"flex", justifyContent:"space-between",
                                alignItems:"center"}}>
                                    <div>{file.name}</div>
                                    <div>
                                        <Button variant="contained"
                                                color="primary"
                                                onClick={() =>this.getMetaData(file.name)}
                                        >
                                            Explore
                                        </Button>
                                        <Button variant="contained"
                                                color="secondary"
                                                startIcon={<DeleteIcon />}
                                                onClick={()=>this.deleteFile(file.id, file.name)}
                                        >Delete
                                        </Button>
                                    </div>

                                </div>
                            </li>

                        )}
                    </ul>
                </div>
                {fileMetaData && (
                    <div className="card" >
                        <div className="card-header">
                            MetaData
                        </div>
                        <ul className="list-group list-group-flush">
                            {fileMetaData.map(
                                (metadata, index) => {
                                    // <li className="list-group-item" id={index}>

                                    return index>=3 ? <div style={{display:"flex", justifyContent:"center",
                                        alignItems:"center"}}>
                                            <Button
                                            onClick={() => {
                                        this.selectFeature(metadata);
                                            }}
                                            variant="outlined"
                                            color="primary"
                                            style={{width:"70%"}}
                                            >
                                            {metadata}
                                            </Button>
                                            <AverageDisplayer metadata={metadata} />
                                                    </div>
                                        :
                                        <Typography  style={{textAlign:"center"}}>{metadata}</Typography>
                                }

                            )}
                        </ul>
                    </div>
                )}

                {selectedFeatures.length>0 && (
                    <div>
                        <form action="http://localhost:8080/api/Train" method="POST" >
                            <legend>Fill in the features! </legend>
                            {selectedFeatures.map(feature =>
                                <div className="mb-3">
                                    <label htmlFor="feature" className="form-label">{feature}</label>
                                    <input type="text" className="form-control" id="feature" name={feature}
                                           />
                                </div>
                            )}
                            <Button type="submit" variant="contained" color="primary">Submit</Button>
                        </form>

                    </div>

                )}
            </div>
        );

    }


    selectFeature(metadata) {
        this.setState((state) =>({
            selectedFeatures:[...state.selectedFeatures, metadata]
        }));

    }

    async getMetaData(name) {
        const response = await CRUDFileService.getMetaData(name);
        this.setState({
            fileMetaData:response.data
        })
    }
}

export default UploadFileComponent;
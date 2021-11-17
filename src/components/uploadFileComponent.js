import React from "react";
import CryptoJS from 'crypto-js';
import UploadService from "../services/uploadFileService";
import CRUDFileService from "../services/CRUDFileService";
import uploadFileService from "../services/uploadFileService";
class UploadFileComponent extends React.Component{
    constructor(props) {
        super(props);
        this.state= {
            selectedFiles:undefined,
            currentFile: undefined,
            progress: 0,
            message:"",
            fileInfos:[]
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
        const md5 = CryptoJS.MD5(currentFile).toString();
        //检查数据库是否已经有文件了：大文件秒传
        let flag = await CRUDFileService.checkFile(md5);
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
        } = this.state;

        return(
            <div className="container ">
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
                    <input type="file" onChange={(event) =>this.selectFile(event)} />
                </label>

                <button
                    className="btn btn-success"
                    disabled={!selectedFiles}
                    onClick={() =>this.upload()}
                >Upload
                </button>

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
                                    <button className="btn btn-danger "
                                    onClick={()=>this.deleteFile(file.id, file.name)}
                                    >delete</button>
                                </div>
                            </li>

                        )}
                    </ul>
                </div>


            </div>
        );

    }
}

export default UploadFileComponent;
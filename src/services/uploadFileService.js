import http from "../commons/http-commons";

class UploadFileService{
    upload(file, onUploadProgress){
        let formData = new FormData();
        //append key/value对
        formData.append("file", file);
        return http.post("/upload", formData, {
            headers:{
                "Content-Type": "multipart/form-data"
            },
            onUploadProgress
        });
    }

    getFiles(){
        return http.get("files");
    }
}

export default new UploadFileService();
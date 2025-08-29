import axios from axios;
import { BASE_URL } from "./apiPath";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout:10000,
  headers:{
    "Content-Type": "application/json",
    Accept: "application/json",
  }
});
//REQUEST interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Do something before request is sent
        const accessToken=localStorage.getItem('token');
        if(accessToken){
            config.headers.Authorization=`Bearer ${accessToken}`;
        }
        return config;
    },
    
    (error) => {
        // Do something with request error
        return Promise.reject(error);
    }
)
//response intercetor
axiosInstance.interceptors.response.use(
    (response) => {
        // Do something with response data
        return response;
    },
    (error) => {
        // Do something with response error
        if(error.response){
       if(error.response.status===401){
        window.location.href='/';
       } else if(error.response.status===501){
           console.log("server error");
       } 
      } else if(error.code==='ECONNABORTED'){
          console.log("Request timed out");
      }
      return Promise.reject(error);
    }
);

export default axiosInstance;

import axios from "axios";
import {store} from '../redux/store'
axios.defaults.baseURL='http://localhost:5000'
// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    store.dispatch({
        type:'change_isSpin',
        data:true
    })
    return config;
  }, function (error) {
    // Do something with request error
    store.dispatch({
        type:'change_isSpin',
        data:true
    })
    return Promise.reject(error);
  });

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    store.dispatch({
        type:'change_isSpin',
        data:false
    })
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    store.dispatch({
        type:'change_isSpin',
        data:true
    })
    return Promise.reject(error);
  });
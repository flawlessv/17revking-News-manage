import axios from 'axios'
Promise.all([
    axios({
        method:'get',
        url: '/rights'
    }),
    axios({
        method:'get',
        url: '/children'
    })
]).then(result=>{
    console.log(result,'result');
})
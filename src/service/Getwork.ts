import axios from "axios"
export const getData = async ()=>{
    const url = 'http://localhost:3000/temporal/start'
    const res = await axios.get(url)
    return res.data
}
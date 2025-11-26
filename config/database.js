const mongoose = require('mongoose');
module.exports.connect = ()=>{
    try {
        mongoose.connect(process.env.DATABASE);
        console.log("ket noi thanh cong");
    } catch (error) {
        console.log(error);
        console.log("Ket noithat bai")
    }
}

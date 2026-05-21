// var ngonNguLapTring = ["c", "c++ ", "javascrpit", "java", 7 , 7.5] ;
// console.log(ngonNguLapTring);
// console.log(ngonNguLapTring.length);
// console.log(ngonNguLapTring[0]);
// console.log(ngonNguLapTring[1]);
// console.log(ngonNguLapTring[2]);
// console.log(ngonNguLapTring[3]);
// console.log(ngonNguLapTring[4]);
// console.log(ngonNguLapTring[5]);
// for( i = 0 ; i < ngonNguLapTring.length ; i ++){
//     console.log(ngonNguLapTring[i]);
// }
// //them phan tu 
// ngonNguLapTring.push("PHP");
// //xoa phan tu khoi mang 
// ngonNguLapTring.splice(0,5);
// //doi tuong
// var sinhVien = {
//     hoTen : "nguyen van a " ,
//     diemTrungBinh : 9.4 ,
//     hocLuc : "Xuat sac ",
//     hienThiThongTin: function(){
//         console.log("ten :" + this.hoTen);
//         console.log("diem trung binh :" + this.diemTrungBinh);
//         console.log("hoc luc :" + this.hocLuc);

//     }
// };
// // sua diem 
// sinhVien.diemTrungBinh = 8.9 ;
// sinhVien.hienThiThongTin();
// var sinhVienB = {
//     hoTen : "nguyen van b " ,
//     diemTrungBinh : 9.4 ,
//     hocLuc : "Xuat sac ",
//     hienThiThongTin: function(){
//         console.log("ten :" + this.hoTen);
//         console.log("diem trung binh :" + this.diemTrungBinh);              
//         console.log("hoc luc :" + this.hocLuc);

//     }
// };var sinhVienC= {
//     hoTen : "nguyen van C " ,
//     diemTrungBinh : 9.4 ,
//     hocLuc : "Xuat sac " ,
//     hienThiThongTin: function(){
//         console.log("ten :" + this.hoTen);
//         console.log("diem trung binh :" + this.diemTrungBinh);
//         console.log("hoc luc :" + this.hocLuc);

//     },
// };
// sinhVienB.hienThiThongTin();
// sinhVienC.hienThiThongTin();
// var danhSach = [ sinhVien , sinhVienB , sinhVienC]; 
// console.log(danhSach);
// var oto = {
//     hangxe : "toyota" ,
//     mau : "do" ,
//     namSX : 2020 ,
//     giaXe : 500000000 ,
//     hienThiThongTin : function(){
//         console.log("hang xe :" + this.hangxe);
//         console.log("mau :" + this.mau);
//         console.log("nam san xuat :" + this.namSX);
//         console.log("gia xe :" + this.giaXe);
// },
// } ; 
// var oto1 = {
//     hangxe : "honda" ,
//     mau : "den" ,
//     namSX : 2023 ,
//     giaXe : 5000000000 ,
//     hienThiThongTin : function(){
//         console.log("hang xe :" + this.hangxe);
//         console.log("mau :" + this.mau);
//         console.log("nam san xuat :" + this.namSX);
//         console.log("gia xe :" + this.giaXe);
// },
// } ; 
// var oto2 = {
//     hangxe : "toyota" ,
//     mau : "xanh" ,
//     namSX : 2017 ,
//     giaXe : 30000000 ,
//     hienThiThongTin : function(){
//         console.log("hang xe :" + this.hangxe);
//         console.log("mau :" + this.mau);
//         console.log("nam san xuat :" + this.namSX);
//         console.log("gia xe :" + this.giaXe);
// },
// } ; 
// var danhSachOto = [oto , oto1 , oto2];
// for( i = 0 ; i < danhSachOto.length ; i ++){
//     console.log("thong tin oto thu " + (i+1));
//     danhSachOto[i].hienThiThongTin();
// }
// danhSachOto.push(oto3);
// danhSachOto.splice(3, 1);
const h1E1 = document.getElementById("xinchaoh1");
console.log(h1E1);
function ghide(){
    h1E1.innerText = "xin chao lop cntt 19 - da thay doi noi dung";

}
const soDEM = document.getElementById("soDEM");
var giaTri = Number(soDEM.innerText);
function tangSoDem(){
    giaTri++ ;
    soDEM.innerText = giaTri ;
}
const soA = document.getElementById("soA");
const soB = document.getElementById("soB");
const ketQua = document.getElementById("ketQua");
function tongHaiSo(){
    var a = Number(soA.value);
    var b = Number(soB.value);
    ketQua.innerText = "ket qua tong hai so la : " + (a + b) ;
}
function truHaiSo(){
    var a = Number(soA.value);
    var b = Number(soB.value);
    ketQua.innerText = "ket qua hieu hai so la : " + (a - b) ;
}
function nhanHaiSo(){
    var a = Number(soA.value);
    var b = Number(soB.value);
    ketQua.innerText = "ket qua tich hai so la : " + (a * b) ;
}
function chiaHaiSo(){
    var a = Number(soA.value);
    var b = Number(soB.value);
    ketQua.innerText = "ket qua thuong hai so la : " + (a / b) ;
}
const canNang = document.getElementById("canNang");
const chieuCao = document.getElementById("chieuCao");
const ketQuaBMI = document.getElementById("ketQuaBMI");
function tinhBMI(){
    var a = Number(canNang.value);
    var b = Number(chieuCao.value);
    var bmi = a / (b * b);
    ketQuaBMI.innerText  += bmi.toFixed(2) ;
    if(bmi < 18.5){
        ketQuaBMI.innerText += " ban bi thieu can ";
    }
    else if(bmi >= 18.5 && bmi < 25){
        ketQuaBMI.innerText += " ban co the luc binh thuong ";
    }
    else if(bmi >= 25 && bmi < 30){
        ketQuaBMI.innerText += " ban bi thua can ";
    }
    else if (bmi >= 30){
        ketQuaBMI.innerText += " ban bi beo phi ";
    }
}
const soCanDoan = document.getElementById("soCanDoan");


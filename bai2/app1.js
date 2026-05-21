const pEL = document.getElementById("demo");
//so sanh
// innerText : chi lay noi dung van ban ben trong the html
console.log(pEL.innerText);
// textcontent : lay noi dung van ban ben trong the html va ca cac the con ben trong no
console.log(pEL.textContent);
// texHTML : lay noi dung van ban ben trong the html va ca cac the con ben trong no va ca cac the html con ben trong no
console.log(pEL.innerHTML);
// pEL.innerText = "xin chao cac ban lop <span style='display: none'> cntt 19 </span>";
// pEL.innerHTML += " - <span style='color: red'> xin chao cac ban lop cntt 19 </span>";
// pEL.textContent += " - <span style='color: red'> xin chao cac ban lop cntt 19 </span>";
const newP = '<p style="color: red"> xin chao <b style="color: yellow">CNTT 19</b></p>';
function thaydoii(){
    pEL.innerHTML = newP ;
}
const lop = document.getElementById("lop");
function thaydoimau(){
    lop.style.color = "red";
}
function baymau(){
    lop.style.color = "black";
}
function toggleclass(){
    const box = document.getElementById("box");
    lop.classList.toggle("active");
}
document.addEventListener("DOMContentLoaded", function() {
    const btn = document.getElementById("btn");
    btn.addEventListener("click", function() {
        const title = document.getElementById("title");
        title.innerText = "Bạn vừa click";
        title.classList.toggle("active");
    })
}); 
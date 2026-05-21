let title = document.getElementById("title");
let desc = document.getElementById("doanvan");
let img = document.getElementById("image");
function change(){
    title.innerHTML = " Tomobe change <span style='color: red;'> my mind</span>";
    desc.innerText = "yamiyo no hatoru ";
    img.src = "images/anhganyu.webp";
}
function reset(){
    title.innerText = " tomobe is goat";
    desc.innerText = "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Possimus obcaecati, minus eum animi quaerat eligendi odio ratione repellendus suscipit tempora sit voluptas, omnis modi deserunt nostrum ipsum tenetur amet recusandae.";
    img.src = "images/end dark soul 3.jpg"; 
}
let dem = 0;
function capNhat() {
    document.getElementById("bodem").innerHTML = dem;
}
function tang() {
    dem++;
    capNhat();
}
function giam() {
    dem--;
    capNhat();
}
function taolai() {
    dem = 0;
    capNhat();
}
let input = document.getElementById("input");
let addBtn = document.getElementById("addBtn");
let list = document.getElementById("list");

// Mảng lưu công việc
let todos = [];

// Render danh sách
function render() {
    list.innerHTML = "";

    todos.forEach((todo, index) => {
        let li = document.createElement("li");

        // nội dung
        let span = document.createElement("span");
        span.innerText = todo.text;

        // nếu hoàn thành
        if (todo.done) {
            span.classList.add("done");
        }

        // click để hoàn thành
        span.onclick = function () {
            todos[index].done = !todos[index].done;
            render();
        };

        // nút xóa
        let delBtn = document.createElement("button");
        delBtn.innerText = "X";

        delBtn.onclick = function () {
            todos.splice(index, 1);
            render();
        };

        li.appendChild(span);
        li.appendChild(delBtn);

        list.appendChild(li);
    });
}

// Thêm công việc
addBtn.onclick = function () {
    let text = input.value.trim();

    if (text === "") return;

    todos.push({
        text: text,
        done: false
    });

    input.value = "";
    render();
};
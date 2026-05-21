const API_URL = "https://69e9c8b015c7e2d51268b69f.mockapi.io/v1-demo/students";
let danhSachGoc = []; // Lưu danh sách gốc để tìm kiếm

function hienThiDanhSachSinhVien(danhSach) {
  const danhSachElement = document.getElementById("danhSach");

  if (!danhSachElement) {
    return;
  }

  danhSachElement.innerHTML = danhSach
    .map(function (sinhVien) {
      const maSinhVien = sinhVien.ma_sinh_vien || sinhVien.maso || "";
      const hoTen = sinhVien.ho_ten || sinhVien.name || "";
      const tuoi = sinhVien.tuoi || sinhVien.age || "";

      return (
        "<tr>" +
        "<td>" + (sinhVien.id || "") + "</td>" +
        "<td>" + maSinhVien + "</td>" +
        "<td>" + hoTen + "</td>" +
        "<td>" + tuoi + "</td>" +
        "<td>" +
        "<button class='btn btn-warning' onclick='suaSinhVien(\"" + sinhVien.id + "\")'>Sửa</button> " +
        "<button class='btn btn-delete' onclick='xoaSinhVienVaCapNhat(\"" + sinhVien.id + "\")'>Xóa</button>" +
        "</td>" +
        "</tr>"
      );
    })
    .join("");
}

async function laySinhVien() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Không thể lấy danh sách sinh viên");
  }

  const data = await response.json();
  danhSachGoc = data; // Lưu danh sách gốc
  console.log("Danh sách sinh viên:", data);
  hienThiDanhSachSinhVien(data);
  return data;
}

async function layMotSinhVien(id) {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error(`Không thể lấy sinh viên có id = ${id}`);
  }

  const data = await response.json();
  console.log("Một sinh viên:", data);
  return data;
}

async function themMotSinhVien(sinhVienMoi) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sinhVienMoi),
  });

  if (!response.ok) {
    throw new Error("Không thể thêm sinh viên");
  }

  const data = await response.json();
  console.log("Đã thêm sinh viên:", data);
  return data;
}

async function capNhatSinhVien(id, thongTinMoi) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(thongTinMoi),
  });

  if (!response.ok) {
    throw new Error(`Không thể cập nhật sinh viên có id = ${id}`);
  }

  const data = await response.json();
  console.log("Đã cập nhật sinh viên:", data);
  return data;
}

async function xoaSinhVien(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Không thể xóa sinh viên có id = ${id}`);
  }

  const data = await response.json();
  console.log("Đã xóa sinh viên:", data);
  return data;
}

// Hàm xóa và cập nhật danh sách
async function xoaSinhVienVaCapNhat(id) {
  if (confirm("Bạn có chắc chắn muốn xóa sinh viên này?")) {
    try {
      await xoaSinhVien(id);
      alert("Xóa thành công!");
      await laySinhVien();
    } catch (error) {
      alert("Lỗi: " + error.message);
    }
  }
}

// Hàm thêm sinh viên mới từ form
async function themSinhVienMoi() {
  const name = document.getElementById("inputName").value;
  const maso = document.getElementById("inputMaso").value;
  const age = document.getElementById("inputAge").value;

  if (!name || !maso || !age) {
    alert("Vui lòng điền đầy đủ thông tin!");
    return;
  }

  try {
    const newStudent = {
      name: name,
      maso: maso,
      age: parseInt(age),
    };

    await themMotSinhVien(newStudent);
    alert("Thêm sinh viên thành công!");
    
    // Clear form
    document.getElementById("inputName").value = "";
    document.getElementById("inputMaso").value = "";
    document.getElementById("inputAge").value = "";
    
    // Cập nhật danh sách
    await laySinhVien();
  } catch (error) {
    alert("Lỗi: " + error.message);
  }
}

// Hàm sửa sinh viên
function suaSinhVien(id) {
  const newName = prompt("Nhập tên mới:");
  if (newName === null) return;
  
  const newMaso = prompt("Nhập mã sinh viên mới:");
  if (newMaso === null) return;
  
  const newAge = prompt("Nhập tuổi mới:");
  if (newAge === null) return;

  const thongTinMoi = {
    name: newName,
    maso: newMaso,
    age: parseInt(newAge),
  };

  capNhatSinhVienVaLamMoi(id, thongTinMoi);
}

// Hàm cập nhật và làm mới danh sách
async function capNhatSinhVienVaLamMoi(id, thongTinMoi) {
  try {
    await capNhatSinhVien(id, thongTinMoi);
    alert("Cập nhật thành công!");
    await laySinhVien();
  } catch (error) {
    alert("Lỗi: " + error.message);
  }
}

// Tải danh sách khi trang vừa load
window.onload = function() {
  laySinhVien();
};

// Hàm tìm kiếm sinh viên
function timKiemSinhVien() {
  const searchValue = document.getElementById("searchInput").value.toLowerCase();
  
  if (searchValue === "") {
    hienThiDanhSachSinhVien(danhSachGoc);
    return;
  }
  
  const ketQuaTim = danhSachGoc.filter(function(sinhVien) {
    const hoTen = (sinhVien.ho_ten || sinhVien.name || "").toLowerCase();
    const maSinhVien = (sinhVien.ma_sinh_vien || sinhVien.maso || "").toLowerCase();
    
    return hoTen.includes(searchValue) || maSinhVien.includes(searchValue);
  });
  
  hienThiDanhSachSinhVien(ketQuaTim);
}

// Hàm xóa tìm kiếm
function clearSearch() {
  document.getElementById("searchInput").value = "";
  hienThiDanhSachSinhVien(danhSachGoc);
}


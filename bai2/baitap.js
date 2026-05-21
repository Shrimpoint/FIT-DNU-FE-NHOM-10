async function getStudents() {
  const response = await fetch("https://69e9c8b015c7e2d51268b69f.mockapi.io/v1-demo/students");
  const data = await response.json();
  
  const tableBody = document.getElementById("studentTableBody");
  tableBody.innerHTML = "";
  
  data.forEach(student => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${student.id}</td>
      <td>${student.maso}</td>
      <td>${student.name}</td>
      <td>${student.tuoi}</td>
    `;
    tableBody.appendChild(row);
  });
}
document.getElementById("agg").addEventListener('click', () => {
    document.getElementById("formulario").classList.remove("oculto")
});

document.getElementById("tareaForm").addEventListener("submit", function (e) {
  e.preventDefault(); // evita que se recargue la página
  console.log("Formulario enviado");

  const titulo = document.getElementById("titulo").value;
  const descripcion = document.getElementById("descripcion").value;
  const fechaFinalizacion = document.getElementById("fechaFinalizacion").value;

  fetch("http://localhost:3000/tareas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ titulo, descripcion, fechaFinalizacion })
  })
    .then(res => res.json())
    .then(data => {
      alert("✅ Tarea creada");
      mostrarTareas(); // refresca la lista
    })
    .catch(err => console.error("Error:", err));
});
 
document.getElementById("ver").addEventListener("click", mostrarTareas);

function mostrarTareas() {
  fetch("http://localhost:3000/tareas")
    .then(res => res.json())
    .then(data => {
      const contenedor = document.getElementById("listaTareas");
      contenedor.innerHTML = ""; // limpia antes de mostrar

      data.forEach(tarea => {
        const div = document.createElement("div");
        div.innerHTML = `
          <h3>${tarea.titulo}</h3>
          <p>${tarea.descripcion}</p>
          <p>Finaliza: ${tarea.fechaFinalizacion}</p>
          <p>Estado: ${tarea.completada ? "✅ Completada" : "⏳ Pendiente"}</p>
          <button onclick="marcarCompletada(${tarea.id})">Cambiar estado</button>
          <button onclick="eliminarTarea(${tarea.id})">Eliminar</button>
          <hr>
        `;
        contenedor.appendChild(div);
      });
    });
}

function marcarCompletada(id) {
  fetch(`http://localhost:3000/tareas/${id}`, {
    method: "PATCH"
  })
    .then(res => res.json())
    .then(() => mostrarTareas());
}


function eliminarTarea(id) {
  fetch(`http://localhost:3000/tareas/${id}`, {
    method: "DELETE"
  })
    .then(res => res.json())
    .then(() => mostrarTareas());
}

document.getElementById("completadas").addEventListener("click", () => {
  fetch("http://localhost:3000/tareas/completadas")
    .then(res => res.json())
    .then(data => mostrarFiltradas(data));
});

document.getElementById("pendientes").addEventListener("click", () => {
  fetch("http://localhost:3000/tareas")
    .then(res => res.json())
    .then(data => {
      const pendientes = data.filter(t => !t.completada);
      mostrarFiltradas(pendientes);
    });
});

document.getElementById("vencidas").addEventListener("click", () => {
  fetch("http://localhost:3000/tareas")
    .then(res => res.json())
    .then(data => {
      const hoy = new Date();
      const vencidas = data.filter(t => !t.completada && new Date(t.fechaFinalizacion) < hoy);
      mostrarFiltradas(vencidas);
    });
});

function mostrarFiltradas(tareas) {
  const contenedor = document.getElementById("listaTareas");
  contenedor.innerHTML = "";
  tareas.forEach(tarea => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${tarea.titulo}</h3>
      <p>${tarea.descripcion}</p>
      <p>Finaliza: ${tarea.fechaFinalizacion}</p>
      <p>Estado: ${tarea.completada ? "✅ Completada" : "⏳ Pendiente"}</p>
    `;
    contenedor.appendChild(div);
  });
}

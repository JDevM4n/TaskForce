const express = require('express'); //importar express
const cors = require('cors');
const fs = require('fs'); //importar fs para manejar el sistema de archivos
const app = express(); // express crea mi server
app.use(cors());
const PORT = 3000; //puerto a usar
let lista = []; //lista donde se guardarán las tareas
if (fs.existsSync('tareas.json')) { //verifica si el archivo tareas.json existe
    const data = fs.readFileSync('tareas.json', 'utf-8'); //lee el archivo tareas.json
    lista = JSON.parse(data); // acá JSON.parse funciona para convertir el contenido del archivo de JSON a un objeto de JavaScript
}

function guardarTareas() {
    fs.writeFileSync('tareas.json', JSON.stringify(lista, null, 2)); //guarda la lista de tareas en el archivo tareas.json | el null y el 2 son para formatear el JSON de manera legible
}

const archivoTareas = 'tareas.json'; //nombre del archivo donde se guardarán las tareas
app.use(express.json()); //le dice a mi app que acepte datos JSON
app.get('/' , (req,res) => { // '/' es mi ruta raíz req es request que significa solicitud y res es response que significa respuesta
    console.log('Servidor funcionando'); //imprime en la consola del servidor
    res.send('Servidor funcionando'); //responde al navegador
});

app.get('/tareas', (req, res) => { //ruta para obtener todas las tareas
    res.json(lista); //responde con la lista de tareas en formato JSON
});

app.post('/tareas', (req, res) => { //ruta para agregar una nueva tarea
    const { titulo, descripcion , fechaFinalizacion} = req.body; //el usuario envía un objeto con título y descripción entonces los extraemos
    if (!titulo || !descripcion || !fechaFinalizacion) { //verifica si el título o la descripción están vacíos
        return res.status(404).json({ error: 'Título y descripción son requeridos' }); //si no se envían título o descripción, responde con un error 404
    }
    const nuevaTarea = {
    id: lista.length + 1, //asigna un ID basado en la longitud actual de la lista
    titulo,
    descripcion,
    fechaFinalizacion,
    completada: false
};
    lista.push(nuevaTarea); //agrega la nueva tarea a la lista
    guardarTareas(); //llama a la función para guardar las tareas en el archivo tareas.json
    res.status(201).json(nuevaTarea); //responde con el objeto de la nueva tarea y un estado 201 (creado)
});

app.patch('/tareas/:id', (req, res) => {
    const id = parseInt(req.params.id); // extrae el id de la URL
    const tarea = lista.find(t => t.id === id); // busca la tarea por id

    if (!tarea) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    // Cambia el estado de completada a lo contrario
    tarea.completada = !tarea.completada;

    guardarTareas(); // guarda los cambios en tareas.json
    res.json({ mensaje: 'Estado actualizado', tarea }); // responde al frontend
});

// tareas completadas
app.get('/tareas/completadas', (req, res) => {
    const completadas = lista.filter(t => t.completada === true);
    res.json(completadas);
});

app.get('/tareas/:id', (req, res) => { //ruta para obtener una tarea específica por ID
    const id = parseInt(req.params.id); //extrae el ID de la solicitud
    const tarea = lista.find(item => item.id === id); //busca la tarea con el ID especificado
    if (tarea) {
        res.json(tarea); //si la tarea existe, responde con ella en formato JSON
    } else {
        return res.status(404).json({ error: 'Tarea no encontrada' }); //si no existe, responde con un error 404
    }
});


app.put('/tareas/:id', (req, res) => { //ruta para actualizar una tarea específica por ID
    const id = parseInt(req.params.id); //extrae el ID de la solicitud
    const tarea = lista.find(item => item.id === id); //busca la tarea con el ID especificado
    if (!tarea){ //si la tarea no existe
        return res.status(404).json({error: 'Tarea no encontrada'}); //responde con un error 404
    } 

    const { titulo, descripcion, fechaFinalizacion } = req.body; //extrae el título y la descripción del cuerpo de la solicitud

    if (!titulo || !descripcion) { //verifica si el título o la descripción están vacíos
        return res.status(400).json({ error: 'Título y descripción son requeridos' }); //si no se envían título o descripción, responde con un error 400
    }
    tarea.titulo = titulo; //actualiza el título de la tarea
    tarea.descripcion = descripcion; //actualiza la descripción de la tarea
    tarea.fechaFinalizacion = fechaFinalizacion;
    guardarTareas(); //llama a la función para guardar las tareas en el archivo tareas.json
    res.json({mensaje: 'Tarea actualizada con éxito' ,tarea}); //responde con un mensaje de éxito y la tarea actualizada
});

app.delete('/tareas/:id', (req, res) => {
    const id = parseInt(req.params.id); //extrae el ID de la solicitud
    const index = lista.findIndex(item => item.id === id); //busca el índice de la tarea con el ID especificado
    if (index === -1) {
        return res.status(404).json({ error: 'Tarea no encontrada'}); //si no se encuentra la tarea, responde con un error 404
    }
    lista.splice(index, 1); //elimina la tarea de la lista | elimina 1 elemento a partir del índice encontrado
    guardarTareas(); //llama a la función para guardar las tareas en el archivo tareas.json 
    res.json({ mensaje: 'Tarea eliminada exitosamente' }); //responde con un mensaje de éxito
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`); //imprime en la consola del servidor que está escuchando en el puerto especificado
}); //inicia el servidor y lo pone a escuchar en el puerto especificado
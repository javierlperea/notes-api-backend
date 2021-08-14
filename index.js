/* import htttp from 'http' <-- FORMA DE CARGAR MODULOS */

/* ESTO ES HTTP */
// const http = require('http')

/* ESTO ES EXPRESS */
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

app.use((request, response, next) => {
  console.log(request.body)
  next()
})

let notes = [
  {
    id: 1,
    content: 'HTML is easy, lets start',
    date: '2019-05-30T17:30:31.098Z',
    important: true
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    date: '2019-05-30T18:39:34.091Z',
    important: false
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2019-05-30T19:20:14.298Z',
    important: true
  }
]

/* ESTO FUNCIONA CON HTTP */
// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'application/json' })
//   response.end(JSON.stringify(notes))
// })

/* ESTO FUNCIONA CON EXPRESS, DIFERENTES PETICIONES GET CON SU PROPIO PATH */
app.get('/', (request, response) => { // ENVIA UNA PAGINA HTML
  response.send('<h1>Hola Javier</h1>')
})

app.get('/api/notes', (request, response) => { // DEVUELVE ARCHIVO JSON
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => { // DEVUELVE JSON FILTRANDO POR SU ID
  const id = Number(request.params.id)
  // console.log({id})    <-- DE ESTA FORMA BUSCO EL ID PORQUE ES UN OBJETO
  const note = notes.find((note) => note.id === id)
  // console.log({note})  <-- DE ESTA FORMA BUSCO LA NOTA PORQUE ES UN OBJETO

  /* CONFIRMO QUE LA BUSQUEDA SEA CORRECTA, SINO MUESTRO ERROR 404 Y FINALIZO */
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => { // ELIMINA UN OBJETO DEL JSON USANDO SU ID
  const id = Number(request.params.id)
  notes = notes.filter((note) => note.id !== id)
  response.status(204).end()
})

app.post('/api/notes', (request, response) => { // CREA UNA NUEVA NOTA Y LA AÑADE AL ARRAY
  const note = request.body // ACCEDE A LA REQUEST QUE ES DONDE TENGO TODA LA INFORMACION ENVIADA(id, content, date, important)

  const ids = notes.map(note => note.id) // CALCULA EL NUMERO MAX DE ID QUE TIENE notes
  const maxId = Math.max(...ids)

  if (!note.content) { // SIEMPRE TENGO QUE RECIBIR LOS DATOS DE LA NOTA QUE VIENEN EN EL BODY
    return response.status(400).json({ // ERROR DE CODIGO CUANDO SE CREA MAL UN RECURSO
      error: 'note.content is missing' // EL STATUS CODE 400 PERMITE RETORNAR UN MJE
    })
  }

  const newNote = { // FORMATO DE LA NUEVA NOTA
    id: maxId + 1,
    content: note.content,
    date: new Date().toISOString(),
    important: note.important
  }

  notes = [...notes, newNote] // AÑADO LA NUEVA NOTA AL ARRAY notes
  response.json(newNote) // COMO RESPUESTA DEL SERVIDOR ENVIO LA NUEVA NOTA
})

app.use((request, response) => {
  response.status(404).json({
    error: 'Not found'
  })
})
/* CUANDO SE LEVANTA EL SERVIDOR SE HACE FORMA ASINCRONA POR ESO SE PONE UN CALLBACK
   DE ESTA FORMA ESPERA UNA RESPUESTA Y RECIEN MUESTRA EL MSJ POR CONSOLA   */

// const PORT = 3001
// app.listen(PORT)
// console.log(`Server running on port ${PORT}`)

const PORT = process.env.PORT || 3001 // define el puerto que utiliza heroku sino pone 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

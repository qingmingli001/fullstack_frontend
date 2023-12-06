
import './App.css';
import Note from './components/Note'
import {useState, useEffect} from 'react'
import axios from 'axios'
import noteService from './services/notes'
import Notification from './components/Notification'
import Footer from './components/Footer'



const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happened...')

  useEffect(() => {
    console.log('effect')
    noteService.getAll()
      .then(response => {
        console.log('pomise fulfilled')
        setNotes(response)
      }
    )
    .catch(error => {
      console.log('fail')
    })
  },[])
  console.log('render', notes.length, 'notes')



  const notesToShow = showAll ? notes : notes.filter(i => i.important === true)


  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content : newNote,
      important : Math.random() < 0.5,
      id : notes.length + 1
    }
    noteService.create(noteObject).then(respose => {
      console.log(respose)
      setNotes(notes.concat(respose))
      setNewNote('')
    });


    console.log('button clicked', event.target)
  }

  const handleNoteChange = (event) => {
    event.preventDefault()
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  const toggleImportanceOf = (id) =>{
  //  const url = `http://localhost:3001/notes/${id}`
    const selectedNote = notes.find(i=>i.id === id)
    const changedNote = {...selectedNote, important: !selectedNote.important}
    noteService.update(id, changedNote).then(response => 
      setNotes(notes.map(i => i.id !== id ? i : response))
    )
    .catch(error => {
      setErrorMessage(`the note ${selectedNote.content} was already deleted from server`)
      alert(
        `the note ${selectedNote.content} was already deleted from server`
      )
      setTimeout(() => {
        setErrorMessage(null)
        
      }, 5000);
      setNotes(notes.filter(i=>i.id !== id))
    })
  }

  return (
    <div className="App">
      <h1>Notes</h1>
      <Notification message={errorMessage}/>
      <div>
        <button onClick={()=>setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>

      </div>
      <ul>
        {notesToShow.map(i => 
          <Note key={i.id} note={i} toggleImportance={()=>toggleImportanceOf(i.id)}/>
        )}
      </ul>
      
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange}/>
        <button type="submit"> save</button>
      </form>
      <Footer />

    </div>
  );
}

export default App;

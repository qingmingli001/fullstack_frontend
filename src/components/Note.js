const Note = ({note, toggleImportance}) => {
    const label = note.important ? 'make it not important' : 'make it important'
    return (
        <li className="note">
            {note.content}
            <button onClick={toggleImportance}>{label}</button>
        </li>
    )
}
export default Note;
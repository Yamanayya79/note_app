import React, { useState, useEffect } from 'react';
import '../Styles/Styles.css';

const Home = () => {
    const [note, setNote] = useState({
        title: "",
        content: ""
    });

    const [noteList, setNoteList] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [editId, setEditId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState("");

    function handleChange(e) {
        const { name, value } = e.target;
        setNote({
            ...note,
            [name]: value
        });
    }

    function handlesubmit(e) {
        e.preventDefault();

        if (!note.title || !note.content) {
            alert('Please fill all fields');
            return;
        }
        if (editId !== null) {
            // EDIT
            const updatedList = noteList.map((item) =>
                item.id === editId ? { ...item, ...note } : item
            );

            setNoteList(updatedList);
            setEditId(null);
        } else {
            // ADD
            const newNote = {
                id: Date.now(),
                ...note
            };

            setNoteList([newNote, ...noteList]);
        }

        // close modal for both
        setShowModal(false);
        setNote({
            title: "",
            content: ""
        });
    }


    function editNote(item) {
        setNote(item);
        setEditId(item.id);
        setShowModal(true);
    }

    function deletenote(id) {
        const updatedList = noteList.filter((item) => item.id !== id);
        setNoteList(updatedList);

        // if deleting opened note
        if (selectedNote && selectedNote.id === id) {
            setSelectedNote(null);
        }
    }


    // LOAD
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("notes"));
        if (saved) setNoteList(saved);
    }, []);

    // SAVE
    useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(noteList));
    }, [noteList]);
    // 3. Modal scroll control
    useEffect(() => {
        document.body.style.overflow = showModal ? "hidden" : "auto";
    }, [showModal]);

    const filteredNotes = noteList.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.content.toLowerCase().includes(search.toLowerCase())
    );
    return (
        <div>
            <h1>Note App</h1>
            <div className='search_box'>


                <input type="text" placeholder='Search...' value={search} onChange={(e) => setSearch(e.target.value) } />
                {/* <button onClick={() => setSearch("")} className='clear_btn'>Clear</button> */}
            </div>
            <button
                className="add_btn"
                onClick={() => {
                    setNote({ title: "", content: "" }); // clear
                    setEditId(null); // IMPORTANT → ADD MODE
                    setShowModal(true); // open modal
                }}
            >
                +
            </button>
            {/* FORM */}
            {!showModal && (
                <form onSubmit={handlesubmit} className='Home_form'>
                    <input
                        type='text'
                        name='title'
                        value={note.title}
                        onChange={handleChange}
                        placeholder="Title"
                    />
                    <input
                        type='text'
                        name='content'
                        value={note.content}
                        onChange={handleChange}
                        placeholder="Content"
                    />
                    <input type='submit' />
                </form>
            )}
            {filteredNotes.length === 0 && (
                <p style={{ textAlign: "center" }}>No notes found</p>
            )}

            {/* NOTE LIST */}
            {!showModal && selectedNote === null && (
                <div>
                    {filteredNotes.map((item) => (
                        <div className='Home_note' key={item.id}>
                            <div onClick={() => setSelectedNote(item)}>
                                <h2>{item.title}</h2>
                                <p>{item.content?.substring(0, 50)}...</p>
                            </div>

                            <div className='del_edit_btn'>
                                <button onClick={(e) => {
                                    e.stopPropagation();
                                    deletenote(item.id);
                                }}>❌</button>

                                <button onClick={(e) => {
                                    e.stopPropagation();
                                    editNote(item);
                                }}>✏️</button>

                            </div>

                        </div>

                    ))}
                </div>
            )}

            {/* SINGLE NOTE */}
            {!showModal && selectedNote !== null && (
                <div className='display_content'>
                    <h1>{selectedNote.title}</h1>
                    <p>{selectedNote.content}</p>

                    <button onClick={() => setSelectedNote(null)}>Go back</button>

                    <button onClick={() => deletenote(selectedNote.id)}>Delete ❌</button>
                </div>
            )}

            {/* MODAL */}
            {showModal && (
                <div className="modal_overlay">
                    <div className="modal_box">

                        <h2>{editId ? "Edit Note" : "New Note"}</h2>

                        <input
                            type="text"
                            name="title"
                            value={note.title}
                            onChange={handleChange}
                            placeholder="Title"
                        />

                        <textarea
                            name="content"
                            value={note.content}
                            onChange={handleChange}
                            placeholder="Content"
                        />

                        <button onClick={handlesubmit}>Save</button>

                        <button onClick={() => setShowModal(false)}>
                            Cancel
                        </button>

                    </div>
                </div>
            )}

        </div>
    );
};

export default Home;
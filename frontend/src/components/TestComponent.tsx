import React, { useEffect, useState } from 'react';
import firebase from '@fire';


function TestComponent() {
    const db = firebase.firestore(); // database
    const [startups, setStartups] = useState<firebase.firestore.DocumentData[]>([]); // list of startups to display
    const [search, setSearch] = useState(""); // search query
    const [tags, setTags] = useState<String[]>([]); // tags query
    const tagOptions = ["dog", "tail", "startup", "tech", "marketing"]; // tag options available

    // React hook that runs when the component loads or when search, tags, or location fields are changed
    useEffect(() => {
        let arr: firebase.firestore.DocumentData[] = []; // temp array
        
        db.collection("startups").onSnapshot((snapshot) => {
            snapshot.forEach((doc) => {
                if (doc.exists) { 
                    let startup = doc.data();
                    if (search !== "" && startup.name.toLowerCase().includes(search.toLowerCase()) || startup.tags.includes(search.toLowerCase())) { // search query
                        arr.push(startup);
                    }
                    if (tags.length > 0) { // search by tags
                        let containsTags = true;
                        tags.map(tag => { // Check if each tag is included in the startup's tags
                            containsTags = containsTags && startup.tags.includes(tag);
                        });
                        if (containsTags && !arr.includes(startup)) { // duplicate check
                            arr.push(startup);
                        }
                        else if (!containsTags) {
                            arr.pop();
                        }
                    }

                }
              
            });
            if (JSON.stringify(arr) !== JSON.stringify(startups)) { // avoid uneccessary updates
                setStartups(arr);
                console.log(arr);
            }
        });
        
    }, [search, tags.length]); // dependencies are search, tags


    // Handles search query
    function handleSearch(e) {
        let query = "" + e.target.value;
        if (query.length > 0) {
            setSearch(query);
        }
        else {
            setSearch("");
        }
    }

    // Handles selection of tags to include/declude from search
    function handleTags(e) { 
        let tag = e.target.name;
        let arr = [...tags];
        if (!arr.includes(tag)) { // add tag to list of tags selected if not already there
            arr.push(tag);
        }
        else if (arr.indexOf(tag) > -1) { // remove tag from list of tags selected if it exists in the array
            arr.splice(arr.indexOf(tag), 1);
        }
        setTags(arr);
    }


    return (
        <div>
            <h1>Search for Startups</h1>
            <label>Search: <input onChange={handleSearch}></input></label>
            
            <div>
                <h4>Tags: </h4>
                {tagOptions.map((tag) => {
                        return (
                        <div>
                            <label><input type="checkbox" id={tag} name={tag} onChange={handleTags}></input>{tag}</label>
                        </div>
                        )
                    })
                }
            </div>
            <hr></hr>
            <h2>Startups: </h2>
            {startups.map((startup) => {
                return (
                    <div>
                        <h4>{startup.name}</h4>    
                    </div>
                )
            })}
        </div>
    )
}

export default TestComponent

import React, { useEffect, useState } from 'react';
import firebase from '@fire';
import countries from '../data/countries.json';
import us_territories from '../data/us_territories.json'
import { stringLiteralTypeAnnotation } from '@babel/types';

function SearchPage() {
    const db = firebase.firestore(); // database

    const [startups, setStartups] = useState<firebase.firestore.DocumentData[]>([]); // list of startups to display
    const [search, setSearch] = useState(""); // search query
   
    const defaultCountry = {code: "", name: ""}; // default country selection
    const [country, setCountry] = useState(defaultCountry); // country location

    const defaultTerritory = {code: "", name: ""}; // using territory because state is a reserved word in react
    const [territory, setTerritory] = useState(defaultTerritory);

    const tagOptions = ["dog", "tail", "startup", "tech", "marketing"]; // tag options available
    const [tags, setTags] = useState<String[]>([]); // tags query

    // React hook that runs when the component loads or when search, tags, or location fields are changed
    useEffect(() => {
        let arr: firebase.firestore.DocumentData[] = []; // temp array
        
        db.collection("startups").limit(100).onSnapshot((snapshot) => { // retrieve the first 100 startups stored in database
            snapshot.forEach((doc) => {
                if (doc.exists) { 
                    let startup = doc.data();
                    let validated = true;
                    
                    // Search query
                    validated = validated && (search === "" || search.toLowerCase().includes(startup.name.toLowerCase()) || startup.name.toLowerCase().includes(search.toLowerCase()));
                    // Tag fields
                    tags.map(tag => {
                        validated = validated && (startup.tags !== undefined && startup.tags.includes(tag));
                    });

                    // Country
                    validated = validated && (country.code === "" || country.code === startup.country);

                    // Territory
                    validated = validated && (territory.code === "" || territory.code === startup.state);

                    if (validated) {
                        arr.push(startup);
                    }
                }
              
            });
            setStartups(arr);
            //console.log(arr);
           
        });
        
    }, [search, tags.length, country, territory]); // dependencies are search, tags


    // Handles search query
    function handleSearch(e) {
        let query = "" + e.target.value;
        if (query.length > 0) {
            setSearch(query);
        }
        else {
            setSearch("");
        }
        //console.log(query);
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
        //console.log(arr);
    }

    // Handles country selection
    function handleCountry(e) {
        let co = JSON.parse(e.target.value);
        setCountry(co);
        if (co.code === "") { // reset the territory to avoid errors
            setTerritory(defaultTerritory);
        }
        //console.log(co);
    }

    function handleTerritories(e) {
        let te = JSON.parse(e.target.value);
        setTerritory(te);
        //console.log(te);
    }


    return (
        <div>
            <h1>Search for Startups</h1>
            <label>Search:
                <input onChange={handleSearch}></input>
            </label>
            <div>
                <label>Tags:
                {tagOptions.map((tag) => {
                        return (
                        <div>
                            <label><input type="checkbox" id={tag} name={tag} onChange={handleTags}></input>{tag}</label>
                        </div>
                        )
                    })
                }
                </label>
                <h5>Location: </h5>
                <label>Country:
                    <select onChange={handleCountry}>
                        <option value={JSON.stringify(defaultCountry)}>{defaultCountry.code}</option>
                        <option value={JSON.stringify({code: "US", name: "United States of America"})}>{"US"}</option>
                        <hr></hr>
                        {countries.map((country) => {
                            return (
                                <option value={JSON.stringify(country)}>{country.code}</option>
                            )
                        })
                        }
                    </select>
                </label>
               
                
                {country.code !== "" ? <label>State/Territory (US):
                    <select onChange={handleTerritories}>
                        <option value={JSON.stringify(defaultTerritory)}>{defaultTerritory.code}</option>
                        <hr></hr>
                        {country.code === "US" ? us_territories.map((territory) => {
                            return (
                                <option value={JSON.stringify(territory)}>{territory.code}</option>
                            )
                        })
                        :
                        <></>
                        }
                    </select>
                </label>
                : <></>
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

export default SearchPage

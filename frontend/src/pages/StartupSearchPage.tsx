import React, { useEffect, useState } from 'react';
import firebase from '@fire';
import countriesList from '../res/countries.json';
import { useContext } from 'react';
import { AuthenticationContext } from '@contexts/AuthContext';

function StartupSearchPage() {
    const db = firebase.firestore(); // database

    const authContext = useContext(AuthenticationContext);
    const user = authContext.user; // user profile

    const [startups, setStartups] = useState<firebase.firestore.DocumentData[]>([]); // list of startups to display
    const [search, setSearch] = useState(""); // search query
    
    const defaultCountry = {code: "", name: "", states: []}; // default country selection
    const [country, setCountry] = useState(defaultCountry); // country location

    const defaultTerritory = {code: "", name: ""}; // using territory because state is a reserved word in react
    const [territoriesList, setTerritoriesList] = useState<any[]>([defaultTerritory]);
    const [territory, setTerritory] = useState(defaultTerritory);

    const tagOptions = ["dog", "tail", "startup", "tech", "marketing"]; // tag options available
    const [tags, setTags] = useState<String[]>([]); // tags query

    const [goalPercent, setGoalPercent] = useState(-1.0); // default set to negative 1 to avoid confusion, percent progress towards a goal
    const goalPercentBreakpoints = [0.0, 0.25, 0.5, 0.75, 1.0]; // breakpoints for the filters

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
                    
                    // Search query in startup's tags
                    validated = validated || (search === "" || (startup.tags !== undefined && startup.tags.includes(search.toLowerCase())));

                    // Tag fields
                    tags.map(tag => {
                        validated = validated && (startup.tags !== undefined && startup.tags.includes(tag));
                        return validated;
                    });

                    // Country
                    validated = validated && (country.code === "" || country.code === startup.country);

                    // Territory
                    validated = validated && (territory.code === "" || territory.code === startup.state);

                    // Percent Goal Reached
                    validated = validated && (goalPercent < 0 || ((goalPercent - 0.25) < (startup.amountInvested / startup.goal) && (startup.amountInvested / startup.goal) <= goalPercent));

                    if (validated) {
                        arr.push(startup);
                    }
                }
              
            });
            setStartups(arr);
            //console.log(arr);
           
        });
        
    }, [search, tags.length, country, territory, goalPercent]); // dependencies 


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

    function handleGoalPercent(e) {
        let val = e.target.value;
        setGoalPercent(val);
        //console.log(val)
    }

    // Handles country selection
    function handleCountry(e) {
        let co = JSON.parse(e.target.value);
        setCountry(co);
        if (co.code === "") { // reset the territory to avoid errors
            setTerritory(defaultTerritory);
        }
        else if (co.states !== null) {
            setTerritoriesList(co.states);
        }
        console.log(co);
    }

    function handleTerritories(e) {
        let te = JSON.parse(e.target.value);
        setTerritory(te);
        console.log(te);
    }


    return (
        <div>
            <h1>Search for Startups</h1>
            <label>Search:
                <input onChange={handleSearch}></input>
            </label>
            <div>
                <h4>Tags:</h4>
                {tagOptions.map((tag) => {
                        return (
                        <div>
                            <label><input type="checkbox" id={tag} name={tag} onChange={handleTags}></input>{tag}</label>
                        </div>
                        )
                    })
                }
                
                <h4>Location: </h4>
                <label>Country:
                    <select onChange={handleCountry}>
                        <option value={JSON.stringify(defaultCountry)}>{defaultCountry.code}</option>
                        <hr></hr>
                        {countriesList.countries.map((country) => {
                            return (
                                <option value={JSON.stringify(country)}>{country.name}</option>
                            )
                        })
                        }
                    </select>
                </label>
               
                
                {country.code !== "" ? <label>State/Territory:
                    <select onChange={handleTerritories}>
                        <option value={JSON.stringify(defaultTerritory)}>{defaultTerritory.code}</option>
                        <hr></hr>
                        {territoriesList !== undefined ? territoriesList.map((territory) => {
                            return (
                                <option value={JSON.stringify(territory)}>{territory.name}</option>
                            )
                        })
                        :
                        <></>
                        }
                    </select>
                </label>
                : <></>
                }          

                <div>
                    <h4>% Goal Reached: </h4>
                    <div>
                        <label><input type="radio" name={"% Goals Reached"} value={-1.0} onChange={handleGoalPercent} defaultChecked></input>{"Any"}</label>
                    </div>
                    {goalPercentBreakpoints.map((breakpoint, index) => {
                        if (index > 0) {
                            return (
                                <div>
                                    <label><input type="radio" name={"% Goals Reached"} value={breakpoint - 0.01} onChange={handleGoalPercent}></input>{(goalPercentBreakpoints[index-1] * 100) + "% — " + ((breakpoint * 100) - 1) + "%"}</label>
                                </div>
                            )
                        }
                        return <></>
                    })
                    }
                </div>
            </div>

            <hr></hr>
            <div>
                <h2>Startups: </h2>
                {startups.map((startup) => {
                    return (
                        <div>
                            <h4>{startup.name + " | $" + startup.amountInvested + "/$" + startup.goal + " (" + (Math.trunc(startup.amountInvested * 100 / startup.goal)) + "%) raised!"}</h4> 
                            
                        </div>
                    )
                })}
            </div>
          
        </div>
    )
}

export default StartupSearchPage

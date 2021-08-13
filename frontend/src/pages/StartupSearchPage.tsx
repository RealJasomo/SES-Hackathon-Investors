import React, { useEffect, useState } from 'react';
import firebase, { useFirebaseUser, useRecommendedStartups } from '@fire';
import countriesList from '../res/countries.json';
import StartupCard from '@components/StartupCard';
import Startup from '@interfaces/Startup';
import Searchbox from '@components/Searchbox';

import styles from './Search.module.scss';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Card from '@material-ui/core/Card';
import { CardContent, CardHeader } from '@material-ui/core';


function StartupSearchPage() {
    const db = firebase.firestore(); // database
    const user = useFirebaseUser(); // custom hook to retrieve global user
    const recommendedStartups = useRecommendedStartups(); 
    const [showRecommended, setShowRecommended] = useState(false); // initially, show the recommended list

    const [startups, setStartups] = useState<firebase.firestore.DocumentData[]>([]); // list of startups to display
    const [search, setSearch] = useState(""); // search query
    
    const emptyCountry = {code: "", name: "", states: [{name: "", code: ""}]}; // empty case
    const [defaultCountry, setDefaultCountry] = useState(emptyCountry); // default value
    const [country, setCountry] = useState(defaultCountry); // country location
    
    const emptyTerritory = {code: "", name: ""}; // empty case
    const [defaultTerritory, setDefaultTerritory] = useState(emptyTerritory) // default value
    const [territory, setTerritory] = useState(defaultTerritory); // state/territory location

    // Helper function to find a territory within a country
    function countryContains(country, territory) {
        let result = null;
        if (country.states !== null) {
            country.states.forEach(st => {
                if (st.code === territory.code || st.name === territory.name) {
                    //console.log(st.code)
                    result = st;
                }
            });
        }
        return result;
    }
    
  

    const tagOptions = ["dog", "tail", "tech", "marketing"]; // tag options available
    const [tags, setTags] = useState<String[]>([]); // tags query

    const [goalPercent, setGoalPercent] = useState<number>(-1.0); // default set to negative 1 to avoid confusion, percent progress towards a goal
    const goalPercentBreakpoints = [0.0, 0.25, 0.5, 0.75, 1.0]; // breakpoints for the filters



    // useEffect hook that sets the default value of location based on the user's profile
    useEffect(() => {
        if (user) { // set default country to user's location
            countriesList.countries.forEach(co => {
                if (co.code === user.country) {
                    if (co.states === null) {
                        let obj = {code: co.code, name: co.name, states: []}; // deal with weird type checks
                        setDefaultCountry(obj);
                    }
                    else {
                        setDefaultCountry(co);
                        let terr = countryContains(co, {code: user.state, name: user.state})
                            if (terr !== null) {
                                setDefaultTerritory(terr);
                            }
                    }   
                    return;
                }
            });
        }
    }, [user]);
    console.log(goalPercent)
    // useEffect hook that runs when the component loads or when search, tags, or location fields are changed
    useEffect(() => {
        // Update show recommended
        if (recommendedStartups.length > 0 && search === "" && (tags === undefined || tags.length === 0) && country.code === "" && goalPercent === -1.0) {
            setShowRecommended(true);
        }
        else {
            setShowRecommended(false);
            // Startups retrieval
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

                        if (validated) { // add startup to list to display
                            arr.push({
                                id: doc.id,
                                ...startup
                            });
                        }
                    }
                
                });
                setStartups(arr);
                //console.log(arr);
            });
        }
        
    }, [search, tags, country, territory, goalPercent, recommendedStartups.length]); // dependencies 


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
        setGoalPercent(Number(val));
        //console.log(val)
    }

    // Handles country selection
    function handleCountry(e) {
        let co = e.target.value;
        if (co === "-") { 
            setCountry(emptyCountry);
  
        }
        else {
            setCountry(JSON.parse(co));         
        }
        setTerritory(emptyTerritory); // reset the territory to avoid errors
    }

    // Handles territory/state selection
    function handleTerritories(e) {
        let te = e.target.value;
        if (te === "-") {
            setTerritory(emptyTerritory);
        }
        else {
            setTerritory(JSON.parse(te));
            //console.log(JSON.parse(te));
        }
    }

    return (
        <div className={styles.search}>    

            <Card>
                <CardHeader title="Find Startups"></CardHeader>
                <CardContent>
                <Searchbox value={search} onChange={handleSearch}/>
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
                            <option value={"-"}>{"-"}</option>
                            <option value={JSON.stringify(defaultCountry)}>{defaultCountry.name}</option>
                            <hr></hr>
                            {countriesList.countries.map((country) => {
                                return (
                                    <option value={JSON.stringify(country)}>{country.name}</option>
                                )
                            })
                            }
                        </select>
                    </label>
                
                    
                    {country.states !== null && country.code !== "" ? <label>State/Territory:
                        <select onChange={handleTerritories}>
                            {country.states.map((territory, index) => {
                                let terr = countryContains(country, defaultTerritory);
                                if (index === 0 && terr !== null) { // if the default territory is in the list, place it at the top
                                    return (
                                        <>
                                            <option value={"-"}>{"-"}</option>
                                            <option value={JSON.stringify(defaultTerritory)}>{defaultTerritory.name}</option> 
                                            <hr></hr>
                                            {territory !== emptyTerritory ? <option key={index} value={JSON.stringify(territory)}>{territory.name}</option> : <></>}
                                        </>
                                    )
                                }
                                else if (index === 0) { // otherwise place the "-" option
                                    return (
                                        <>
                                            <option value={"-"}>{"-"}</option>
                                            <hr></hr>
                                            {territory !== emptyTerritory ? <option value={JSON.stringify(territory)}>{territory.name}</option> : <></>}
                                        </>
                                    )
                                }
                                else { // all other cases place the current territory in the list
                                    return (
                                        <option value={JSON.stringify(territory)}>{territory.name}</option>
                                    )
                                }
                            })}
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
                                        <label><input key={index} type="radio" name={"% Goals Reached"} value={breakpoint - 0.01} onChange={handleGoalPercent}></input>{(goalPercentBreakpoints[index-1] * 100) + "% — " + ((breakpoint * 100) - 1) + "%"}</label>
                                    </div>
                                )
                            }
                            return <></>
                        })
                        }
                    </div>
                </div>
            </CardContent>
        </Card>    
           <br></br>

            {showRecommended ? 
                <div>
                    <h2>Recommended Startups: </h2>    
                    {recommendedStartups.map((startup, index) => {
                        return (
                            <div>
                                <StartupCard key={index} startup={startup as Startup}/>
                            </div>
                        )
                    })

                    }
                </div>
                :    
                <div>
                <h2>Startups: </h2>
                    {startups.map((startup, index) => {
                        return (
                            <div>
                                <StartupCard key={index} startup={startup as Startup}/> 
                            </div>
                        )
                    })}
                </div>
            }       
          
        </div>
    )
}

export default StartupSearchPage

import { createContext, useEffect, useState } from "react";
import { jobsData } from "../assets/assets";

export const WebContext = createContext()

export const WebContextProvider = (props) => {
    const [searchResults, setSearchResults] = useState([]);
    
    const[searchFilter, setSearchFilter] = useState({
        title:'',
        location:''
    })
    const [isSearched, setIsSearched] = useState(false)

    const [job, setJobs] = useState([])

    const fetchJobs = async () => {
        try {
            setJobs(jobsData)
        } catch (error) {
            console.error("Lỗi", error)
        }
    }
    useEffect(() => {
        fetchJobs()
    }, [])

    const value = {
        setSearchFilter, searchFilter,
        isSearched, setIsSearched,
        job, setJobs,
        searchResults, setSearchResults,
    }
    
    return (<WebContext.Provider value={value}>
        {props.children}
    </WebContext.Provider>)
}
import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context= createContext();


const ContextProvider=(props)=>{

    const[input,setInput]=useState("");
    const [recentPrompt,setRecentPrompt]=useState("");
    const [prevPrompts,setPrevPrompts]=useState([]);
    const [showResult,setShowResult]=useState(false);
    const [loading,setLoading]= useState(false);
    const [resultData,setResultData]=useState("");

    const delayPara=(index,nextWord) =>{
        setTimeout(function(){
            setResultData(prev=>prev+nextWord);
        },75*index)

    }

    const onSent = async () => {
        setLoading(true);
        setShowResult(true);
        setRecentPrompt(input); // This will set the question (input) as recentPrompt
        setPrevPrompts(prev=>[...prev,input])
        setResultData(""); // Clear previous result data
        setInput(""); // Clear the input field
      
        const response = await runChat(input); // Get response from the AI
        let responseArray = response.split("**");
        let newResponse = "";
      
        for (let i = 0; i < responseArray.length; i++) {
          if (i === 0 || i % 2 !== 1) {
            newResponse += responseArray[i];
          } else {
            newResponse += "<b>" + responseArray[i] + "</b>";
          }
        }
      
        let newResponse2 = newResponse.split("*").join("</br>"); 
        let newResponseArray=newResponse2.split(" ");// Ensure line breaks
        for(let i=0;i<newResponseArray.length;i++)
        {
            const nextWord=newResponseArray[i];
            delayPara(i,nextWord+" ")
        }
        setResultData(newResponse2); // Set the AI response
        setLoading(false); // Turn off loading state after receiving the response
      };
      
   

    
    const contextValue={
        recentPrompt,
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput
    }

    return(

        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider

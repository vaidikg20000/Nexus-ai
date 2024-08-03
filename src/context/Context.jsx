import { createContext, useState } from "react";
import runChat from "../config/gemini.js";

export const Context = createContext();

const contextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [previousPrompts, setPreviousPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (index, nextWord) => {
    setTimeout(() => {
       setResultData(prev => prev + nextWord) 
    }, 75*index);
  };

  const newChat = () =>{
    setLoading(false)
    setShowResult(false)
  }

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    setRecentPrompt(input);
    let response;
    if(prompt !== undefined){
        response = await runChat(prompt);
        setRecentPrompt(prompt)
    }else{
        setPreviousPrompts(prev =>[...prev,input])
        setRecentPrompt(input)
        response = await runChat(input);

    }

    let responseArray = response.split("**");
    let newResponse = ""; // Initialize newResponse as an empty string

    for (let i = 0; i < responseArray.length; i++) {
      // Check if the current segment is a part that should be bolded
      if (i % 2 === 1) {
        newResponse += "<b>" + responseArray[i] + "</b>";
      } else {
        newResponse += responseArray[i];
      }
    }

    let newResponse2 = newResponse.split("*").join("<br/>");
    let newResponseArray = newResponse2.split(" ")
    for(let i=0;i<newResponseArray.length;i++){
        const nextWord = newResponseArray[i];
        delayPara(i,nextWord+" ")
    }
    setLoading(false);
    setInput("");
  };
  const contextValue = {
    previousPrompts,
    setPreviousPrompts,
    onSent,
    loading,
    showResult,
    resultData,
    recentPrompt,
    setRecentPrompt,
    input,
    setInput,
    newChat
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default contextProvider;

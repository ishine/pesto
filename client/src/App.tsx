import React from "react";
import "./App.css";
import MainTests from "./MainTests/MainTests";
import MainContainer from "./MainContainer/MainContainer";
import Header from "./Header/Header";

function App() {
  return (
    <div className="app-main-container">
      {/* <MainTests /> */}
      <Header />
      <MainContainer />
    </div>
  );
}

export default App;

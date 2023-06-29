import { FC } from 'react'
import "./Header.css"
import SimpleSVGComponent from "../UI/SimpleSVGComponent";
import PestoIcon from "../assets/play-icon.svg";

const Header: FC= () => {
  return (
    <div className="header-main-container">
      <div className="header-sony-container"></div>
      <div className="header-pesto-container">
        <div className="header-logo-background" />
        PESTO
      </div>
    </div>
  )
}

export default Header

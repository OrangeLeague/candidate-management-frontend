import React from "react";
import img from '../assests/comp_logo.png';

const Header=()=>{
    return (
        <div style={{backgroundColor:'#e5edf5',padding:'20px',display:'flex',alignItems:'center',paddingLeft:'60px',paddingRight:'60px',paddingTop:'30px'}}>
            <img src={img} alt="img" style={{width:'40px',height:'40px'}}/>
            <div style={{color:'#F15D27',fontWeight:700,fontSize:'24px'}}>Orange League</div>
        </div>
    );
};
export default Header;
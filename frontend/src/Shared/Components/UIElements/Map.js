import React, { useRef,useEffect } from "react";
import "./Map.css"

const Map=(props)=>{
    const {center,zoom}=props
    useEffect(()=>{
       
    const map=new window.google.maps.Map(mapRef.current,{
        center:center,
        zoom:zoom
    })
    new window.google.maps.Marker({position:center,map:map})

    },[center,zoom])
    const mapRef=useRef()
    return(
        <div ref={mapRef} className={`map ${props.className} `} style={props.style}></div>
    )

}
export default Map
import './App.scss';
import React,{useEffect, useState} from 'react';
import data from "./data.json";
import background from "./assets/star.jpg";
import Mercury from "./assets/mercury.png";
import Venus from "./assets/venus.png";
import Earth from "./assets/earth2.png";
import Mars from "./assets/mars.png";
import Jupiter from "./assets/jupiter.png";
import Saturn from "./assets/saturn.png";
import Uranus from "./assets/uranus.png";
import Neptune from "./assets/neptune.png";

class App extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      menu:false,
      infoBox:false,
      planet:"earth",
      day:"",
      year:"",
      radius:"",
      planetType:"",
      info:"",
      url:"",
      quote:true,
      prevPos:0,
      stopped: true,
      time:0,
      swipePos:0
    }
    this.setPlanet = this.setPlanet.bind(this);
    this.handlemenu = this.handlemenu.bind(this);
    this.getInfo = this.getInfo.bind(this);
    this.handleDown = this.handleDown.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.handleUp = this.handleUp.bind(this);
    this.spinforPlanet = this.spinforPlanet.bind(this);
  }

  componentDidMount(){
    this.setState({
      day: data["earth"].day,
      year:data["earth"].year,
      radius:data["earth"].radius,
      planetType:data["earth"].planetType,
      info:data["earth"].info,
      url:data["earth"].url
    });
    setTimeout(()=>{this.setState({quote:false})},7000);

    let background = document.querySelector(".backgroundBox");
    background.addEventListener("mousedown", this.handleDown);
    background.addEventListener("mouseup", this.handleUp);
    background.addEventListener("touchstart", this.handleDown);
    background.addEventListener("touchend", this.handleUp);
  }
  componentDidUpdate(){
    setInterval(()=>{
      if(!this.state.stopped){
        this.setState({time:this.state.time+1})
      }
    }, 100);
  }
  componentWillUnmount(){
    let background = document.querySelector(".backgroundBox");
    background.removeEventListener("mousedown", this.handleClick);
    background.removeEventListener("mouseup", this.handleUp);
    background.removeEventListener("touchstart", this.handleDown);
    background.removeEventListener("touchend", this.handleUp);
  }

  handleDown(e){
    let background = document.querySelector(".backgroundBox");
    background.addEventListener("mousemove", this.handleMove);
    background.addEventListener("touchmove", this.handleMove);
    let backgroundImg = document.querySelector(".backgroundImg");
    let backgroundImg2 = document.querySelector(".backgroundImg2");
    let backgroundImg3 = document.querySelector(".backgroundImg3");
    backgroundImg.style.animationPlayState = "paused";
    backgroundImg2.style.animationPlayState = "paused";
    backgroundImg3.style.animationPlayState = "paused";
    let position = window.innerWidth>600? e.clientX : e.touches[0].clientX
    this.setState({prevPos:position, swipePos:position});
  }

  handleMove(e){
    let position = window.innerWidth>600? e.clientX : e.touches[0].clientX
    let prevPos = this.state.prevPos;
    this.setState({prevPos:position})
    document.querySelector(".backgroundBox").style.cursor = "grabbing";
    let backgroundImg = document.querySelector(".backgroundImg");
    let backgroundImg2 = document.querySelector(".backgroundImg2");
    let backgroundImg3 = document.querySelector(".backgroundImg3");
    let currentTime1 = backgroundImg.getAnimations()[0].currentTime;
    let currentTime2 = backgroundImg2.getAnimations()[0].currentTime;
    let currentTime3 = backgroundImg3.getAnimations()[0].currentTime;
    let timepassperframe = window.innerWidth>600? (75000/window.innerWidth)*8 : (75000/window.innerWidth) *2;

    if(currentTime3<75000 && currentTime3>0){
      if(prevPos > position){
        backgroundImg.getAnimations()[0].currentTime = currentTime1+timepassperframe;
        backgroundImg2.getAnimations()[0].currentTime = currentTime2+timepassperframe;
        backgroundImg3.getAnimations()[0].currentTime = currentTime3+timepassperframe;
      }
      else{
        backgroundImg.getAnimations()[0].currentTime = currentTime1-timepassperframe;
        backgroundImg2.getAnimations()[0].currentTime = currentTime2-timepassperframe;
        backgroundImg3.getAnimations()[0].currentTime = currentTime3-timepassperframe;
      }
    }
    else if(currentTime3 >= 75000 && currentTime1>=75000){
      if(prevPos > position){
        backgroundImg.getAnimations()[0].currentTime = currentTime1+timepassperframe;
        backgroundImg2.getAnimations()[0].currentTime = currentTime2+timepassperframe;
      }
      else{
        backgroundImg.getAnimations()[0].currentTime = currentTime1-timepassperframe;
        backgroundImg2.getAnimations()[0].currentTime = currentTime2-timepassperframe;
      }
    }
    else if(currentTime3<0 || (currentTime1<75000 && currentTime3>=75000)){
      backgroundImg.getAnimations()[0].currentTime = currentTime1+150000;
      backgroundImg2.getAnimations()[0].currentTime = currentTime2+150000;
      backgroundImg3.getAnimations()[0].currentTime = 75000;
    }
  
    this.setState({stopped:false});
  }

  handleUp(e){
    let position = window.innerWidth>600? e.clientX : e.changedTouches[0].clientX;
    let timeused = this.state.time;
    this.setState({stopped:true, time:0});
    let background = document.querySelector(".backgroundBox");
    background.removeEventListener("mousemove", this.handleMove);
    background.removeEventListener("touchmove", this.handleMove);
    
    let backgroundImg = document.querySelector(".backgroundImg");
    let backgroundImg2 = document.querySelector(".backgroundImg2");
    let backgroundImg3 = document.querySelector(".backgroundImg3");
    backgroundImg.style.animationPlayState = "running";
    backgroundImg2.style.animationPlayState = "running";
    backgroundImg3.style.animationPlayState = "running";
    document.querySelector(".backgroundBox").style.cursor = "grab";

    let planetList = ["mercury", "venus", "earth", "mars", "jupiter", "saturn", "uranus", "neptune"];
    let random = Math.floor(Math.random()*8+1);
    
    let desktopTest = Math.abs(this.state.swipePos - position)>window.innerWidth/4;
    let mobileTest = Math.abs(this.state.swipePos - position)>window.innerWidth/3;
    
    let testTotal = window.innerWidth >600? desktopTest : mobileTest;
    console.log(this.state.swipePos - position, window.innerWidth/2, timeused)
    if(window.innerWidth>600){
      if(timeused<15 && testTotal){
        backgroundImg.style.animationDuration = "1s";
        backgroundImg2.style.animationDelay ="0.5s";
        backgroundImg2.style.animationDuration = "1s";
        backgroundImg3.style.animationDuration = "1s";
        setTimeout(()=>{
          let planetSpin = planetList[random];
          this.setState({planet: planetSpin});
          this.spinforPlanet(planetSpin);
        },1000)
        setTimeout(()=>{
          backgroundImg.style.animationDuration = "150s";
          backgroundImg2.style.animationDelay ="75s";
          backgroundImg2.style.animationDuration = "150s";
          backgroundImg3.style.animationDuration = "75s";
        }, 2000)
      }
    }
    else{
      if(timeused<200 && testTotal){
        backgroundImg.style.animationDuration = "1s";
        backgroundImg2.style.animationDelay ="0.5s";
        backgroundImg2.style.animationDuration = "1s";
        backgroundImg3.style.animationDuration = "1s";
        setTimeout(()=>{
          let planetSpin = planetList[random];
          this.setState({planet: planetSpin});
          this.spinforPlanet(planetSpin);
        },1000)
        setTimeout(()=>{
          backgroundImg.style.animationDuration = "60s";
          backgroundImg2.style.animationDelay ="30s";
          backgroundImg2.style.animationDuration = "60s";
          backgroundImg3.style.animationDuration = "30s";
        }, 2000)
      }
    }
    

  }

  spinforPlanet(planetName){
    this.setState({
      planet:planetName,
      day: data[planetName].day,
      year:data[planetName].year,
      radius:data[planetName].radius,
      planetType:data[planetName].planetType,
      info:data[planetName].info,
      url:data[planetName].url
    })
  }

  getInfo(){
    this.setState({
      infoBox:!this.state.infoBox
    })
  }
  setPlanet(e){
    let planetName = e.target.getAttribute("planetn")
    this.setState({
      planet:planetName,
      day: data[planetName].day,
      year:data[planetName].year,
      radius:data[planetName].radius,
      planetType:data[planetName].planetType,
      info:data[planetName].info,
      url:data[planetName].url
    })
    if(window.innerWidth<600){
      this.setState({menu:false})
    }
  }
  handlemenu(){
    this.setState({
      menu:!this.state.menu
    })
  }
  render(){
    let currentselc = this.state.planet;
    let planetImg = currentselc ==="earth"? Earth:currentselc==="mercury"?Mercury:currentselc==="venus"? Venus:currentselc ==="jupiter"? Jupiter:currentselc==="saturn"?Saturn:currentselc ==="uranus"?Uranus:currentselc ==="mars"? Mars :Neptune;

    return (
      <div>
        {this.state.quote? <BeginQuote/>: ""}
        <Background/>
        
        {this.state.infoBox?<PlanetInfo planet ={this.state.planet} day ={this.state.day} year ={this.state.year} radius ={this.state.radius} planettype ={this.state.planetType} info ={this.state.info} url ={this.state.url} closebox ={this.getInfo}/>:""}

        {this.state.menu? <PlanetNavBar setplanetN = {this.state.planet} getplanet ={this.setPlanet} handlemenu ={this.handlemenu} open={this.state.menu}/>:
        <PlanetNavBar setplanetN = {this.state.planet} getplanet ={this.setPlanet} handlemenu ={this.handlemenu} open={this.state.menu}/>}

        <Planet img = {planetImg} planetname = {this.state.planet} openbox ={this.getInfo}/>
        <p className = "signature">created by <a href="https://github.com/arthurlee945" target="_blank">Arthur Lee</a></p>
      </div>
    );
  }
}


const PlanetInfo = (props) =>{
  return(
    <div className ="infoBox">
      <div className ="container">
        <i className="fas fa-times closeInfo" onClick={props.closebox}></i>
        <h1>{props.planet}</h1>
        <div>Day: <span>{props.day}</span></div>
        <div>Year: <span>{props.year}</span></div>
        <div>Radius: <span>{props.radius}</span></div>
        <div>Planet Type: <span>{props.planettype}</span></div>
        <div className ="infoContainer">
          <p>Info:</p>
          <p>{props.info}</p>
        </div>
        <a href={props.url} target="_blank">Learn More</a>
      </div>
      
    </div>
  )
}


const Planet = (props) =>{
  const [pclass, setPclass] = useState("")
  useEffect(()=>{
    setPclass("fadeAni")
    setTimeout(() =>{setPclass("")},1000)
  }, [props.planetname]);

  return(
    <div className={`planetBox ${pclass}`}>
      <img className ="planetImage" alt ={props.planetname} src ={props.img}/>
      <div className ="planetName" onClick ={props.openbox}>{props.planetname}</div>
    </div>
  )
}
const PlanetNavBar =(props) =>{
  let planets = ["mercury", "venus", "earth", "mars", "jupiter", "saturn", "uranus", "neptune"]
  let selected = props.setplanetN;
  let notselected = planets.filter(p => p!==selected);
  
  let navBlur = window.innerWidth<600? "navBoxAni": "";

  return(
    <div>
      {props.open? <div className ={`planetNavBox ${navBlur}`}>
        <i className="fas fa-times closeIcon" onClick = {props.handlemenu}></i>
        <div className = "contentbox">
          <div className = "selectedPlanet">{selected}</div>
          <p planetn = {notselected[0]} onClick ={props.getplanet}>{notselected[0]}</p>
          <p planetn = {notselected[1]} onClick ={props.getplanet}>{notselected[1]}</p>
          <p planetn = {notselected[2]} onClick ={props.getplanet}>{notselected[2]}</p>
          <p planetn = {notselected[3]} onClick ={props.getplanet}>{notselected[3]}</p>
          <p planetn = {notselected[4]} onClick ={props.getplanet}>{notselected[4]}</p>
          <p planetn = {notselected[5]} onClick ={props.getplanet}>{notselected[5]}</p>
          <p planetn = {notselected[6]} onClick ={props.getplanet}>{notselected[6]}</p>
        </div>
      </div>:<div className ="planetNavBox"><i className="far fa-compass openIcon" onClick = {props.handlemenu} ></i></div>}
    </div>
    
  )
}
const Background = () =>{
  return(
    <div className = "backgroundBox">
          <img className ="backgroundImg" src ={background} alt="starBackground"/>
          <img className ="backgroundImg2" src ={background} alt="starBackground"/>
          <img className ="backgroundImg3" src ={background} alt="starBackground"/>   
          <div className = "starBox">
            <div className ="star"></div>
            <div className ="star2"></div>
            <div className ="star3"></div>
            <div className ="star4"></div>
            <div className ="star5"></div>
            <div className ="star6"></div>
            <div className ="star7"></div>
            <div className ="star8"></div>
          </div>
    </div>
  )
}
const BeginQuote = () =>{
  return(
    <div className ="quoteBox">
      <div className ="quote">
        <h2>Remember to look up at the stars and not down at your feet.</h2>
        <p>- Stephen Hawking</p>
      </div>
    </div>
  )
}


export default App;


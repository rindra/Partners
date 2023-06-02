import React, {Component} from 'react';
import Section from './Section';
import {Route,withRouter} from 'react-router-dom'
import logo from './logo.svg'
import './App.css'

class App extends Component {
  constructor(props){
    super(props)
    this.state ={
      loggedIn:false
    } 
  }
  render() {    
    return (
    <React.Fragment>
      <Route path='/home/:url' render={(props)=>(
        <React.Fragment>
          <header>
            <div className="logo"/>
            <div className="main_title">Partners Integration</div>
            <div className="sign_out on" onClick={this.logout}>Sign out</div>
          </header>            
          <Section {...this.props} name="Home" partner="" loggedIn={this.state.loggedIn}/>
        </React.Fragment>
      )}/>  
      <Route exact path='/home' render={(props)=>(
        <React.Fragment>
          <header>
            <div className="logo"/>
            <div className="main_title">Partners Integration</div>
            <div className="sign_out on" onClick={this.logout}>Sign out</div>
          </header>                    
          <Section {...this.props} name="Home" loggedIn={this.state.loggedIn}/>
        </React.Fragment>
      )}/>
      <Route exact path='/' render={(props)=>(
        <React.Fragment>
          <header>
            <div className="logo"/>
            <div className="main_title">Partners Integration</div>
            <div className="sign_out">Sign out</div>
          </header>
          <nav>
            <div className="login" onClick={e=>this.login()}>Log in with Gmail</div>
          </nav>
        </React.Fragment>
      )}/>
    </React.Fragment>
    )        
  }
  fakelogin(){
    return new Promise((resolve, reject)=>setTimeout(()=>resolve(), 100))
  }
  login(){
    window.gapi.load('auth2', ()=>{ 
//      console.log("gapi loaded")
      window.gapi.auth2.init({scope:'profile email', client_id:'91405226774-r2hr6m03pkgigbkr75h3s35lbrtkr14q.apps.googleusercontent.com'})
//      window.gapi.auth2.init({scope:'profile email', client_id:'355597262162-bgs094mgj5hpq65rnag20chnqb4unnpf.apps.googleusercontent.com'})
      .then(data=>window.gapi.auth2.getAuthInstance().signIn())
      .then(user=>{
        this.setState({loggedIn: true})
        this.props.history.push('/home/generic')
      })            
    });
  }
  logout = (res)=>{        
    window.gapi.load('auth2', ()=>{ 
//      console.log("gapi loaded")
      window.gapi.auth2.init({scope:'profile email', client_id:'91405226774-r2hr6m03pkgigbkr75h3s35lbrtkr14q.apps.googleusercontent.com'})
//      window.gapi.auth2.init({scope:'profile email', client_id:'355597262162-bgs094mgj5hpq65rnag20chnqb4unnpf.apps.googleusercontent.com'})
      .then(data=>window.gapi.auth2.getAuthInstance().signOut().then(data=>this.props.history.push('/')))      
    })
  }
  componentDidMount() {}
}
export default withRouter(App);

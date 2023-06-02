import React, {Component} from 'react';
import {Route,withRouter} from 'react-router-dom'
import './Home.css';
import home_stream_bg from './home_stream.jpg';
import back_arrow from './back_arrow.svg';
import phone from './phone.svg';
import email from './email.svg';
import world from './world.svg';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      section: 1,
      cardOn:null,
      data:null,
      list:null,
      list_activities:null,
      currentCard: null,
      currentDetails: null,
      loggedIn:false
    };
    this._timer = null;
    this.toggle=this.toggle.bind(this);
  }
  render() {
    return (
//      (this.props.loggedIn) ?
      (this.state.loggedIn) ?
      (<section id="Home">
        <div className="wrapper">
          <div className="partners">
            <div className="label name">Partner name</div>
            {this.state.list}
          </div>
          <div className="home_stream_card">
            <div className="label">Home page</div>
            {this.state.currentCard}
          </div>
          <div className="partners_details">
            <div className="label">Partner page</div>
            {this.state.currentDetails}
          </div>
        </div>
      </section>) :
      (<section id="Home" className="nope">Loading...</section>)
    )
  }
  check_gapi(){
    let i;
    return new Promise((resolve,reject) => {
      i = setInterval(()=>{
        if(window.gapi){
          clearInterval(i)
          resolve('gapi ready')
        }
      },1000)
    })
  }
  componentDidMount() {      
    this.check_gapi()
      .then(data=>window.gapi.load('auth2', ()=>window.gapi.auth2.init({scope:'profile email', client_id:'91405226774-r2hr6m03pkgigbkr75h3s35lbrtkr14q.apps.googleusercontent.com'})
        .then(data=>this.setState({loggedIn: window.gapi.auth2.getAuthInstance().isSignedIn.get()}))
      ))

    fetch("https://turnitup.herokuapp.com/config/partners")
    .then(res=>res.json())
    .then(json=>{
      this.setState({cardOn: this.props.match.params.url})
      this.setState({data: json})
      this.setState((s,p)=>({
        list: s.data.sort((a, b) => a.name.charCodeAt(0) - b.name.charCodeAt(0)).map((n)=>{
          let c = (s.cardOn === n.name) ? 'partner on':'partner',
          v = (n.visible) ? '':' hidden'
          if(s.cardOn === n.url) this.toggle(n.url,n.name,null)
          return (<div className={c+v} onClick={e=>this.toggle(n.url,n.name,e)} key={n.id}>{n.name}</div>)
      })
      }))
    })
  }
  componentWillUnmount() {
    clearInterval(this._timer);
  }
  toggle(link,name,e){
    this.setState({cardOn: name})
    this.setState((s,p)=>({
      list: s.data.map((n)=>{
        let c = (s.cardOn === n.name) ? 'partner on':'partner',
        v = (n.visible) ? '':' hidden'
       return (<div className={c+v} onClick={e=>this.toggle(n.url,n.name,e)} key={n.id}>{n.name}</div>)
       }
      )
      })
    )
    this.setState((s,p)=>({
      currentCard:
        s.data.filter(d=>d.name===name).map((n)=>(

          <div className="image" style={{backgroundImage:`url(${home_stream_bg})`}} key={n.id}>
            <div className="card">
              <div className="bg" style={{backgroundImage:`url(${n.image})`}}></div>
              <div className="caption">
                <div className="name">{n.name}</div>
                <div className="dsc">{n.home_stream_card}</div>
              </div>
            </div>
          </div>

        ))
    }))
    this.setState((s,p)=>({
      currentDetails:
        s.data.filter(d=>d.name===name).map(n=>(
          <div className="details" key={n.id}>
            <div className="arc_container">
              <div className="arc">
                <div className="bg" style={{backgroundImage:`url(${n.image})`}}></div>
                <div className="back_arrow" style={{backgroundImage:`url(${back_arrow})`}}></div>
              </div>
            </div>
            <div className="name">{n.name}</div>
            <div className="label_container">
              <div className="sub_label">at a glance</div>
            </div>
            <div className="container" dangerouslySetInnerHTML={this.createMarkup(n.at_a_glance)} />
            <div className="label_container">
              <div className="sub_label">activities</div>
              <div className="sub_link">history</div>
            </div>
            {this.createMarkupArray(n.activities)}
            <div className="container" dangerouslySetInnerHTML={this.createMarkup(n.contact)} />
            <div className="main_btn">
              <div className="btn">launch</div>
            </div>
          </div>
        ))
    }))
    this.props.history.push(`/home/${link}`)
  }
  createMarkup(html){
    return {__html: html};
  }
  createMarkupArray(t){
    if (t) {      
      return t.map((n,i)=>(
        <div className="container" dangerouslySetInnerHTML={this.createMarkup(n)} key={i} />
      ))
    }
  }
}

export default withRouter(Home);

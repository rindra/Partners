import React, {Component} from 'react';
import Home from './Home';

class Section extends Component {  
  render() {     
    if (!this.props.name) {
      return null                                       
    }else{        
      if(this.props.name === 'Home') return (<Home {...this.props}/>)            
    }
  }
  componentDidMount() {

  }
  componentWillUnmount() {

  }
}

export default Section;

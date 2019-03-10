import React, { Component } from 'react';

import apiManager from '../lib/APIManager';
import messageDispatcher from '../lib/MessageDispatcher';

class GrantScope extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      config: props.config,
      currentUser: props.currentUser,
      client: props.client,
      scope: props.scope
    };
    
    this.handleToggleGrantScope = this.handleToggleGrantScope.bind(this);
    this.handleGrantScope = this.handleGrantScope.bind(this);
    
    messageDispatcher.subscribe('GrantScope', (message) => {
    });
	}
  
  componentWillReceiveProps(nextProps) {
    this.setState({config: nextProps.config, currentUser: nextProps.currentUser, client: nextProps.client, scope: nextProps.scope});
  }

  handleToggleGrantScope(scope) {
    var scopeList = this.state.scope;
    scopeList.forEach((curScope) => {
      if (curScope.name === scope.name) {
        curScope.granted = !curScope.granted;
      }
    });
    this.setState({scope: scopeList});
  }

  handleGrantScope() {
    var scopeList = [];
    this.state.scope.forEach((scope) => {
      if (scope.granted) {
        scopeList.push(scope.name);
      }
    });
    apiManager.glewlwydRequest("/auth/grant/" + encodeURI(this.state.client.client_id), "PUT", {scope: scopeList.join(" ")})
    .then(() => {
      messageDispatcher.sendMessage('App', 'InitProfile');
    });
  }
  
	render() {
    var scopeList = [];
    this.state.scope.forEach((scope, index) => {
      scopeList.push(
      <li className="list-group-item" key={index}>
        <div className="form-check">
          <input className="form-check-input" type="checkbox" onChange={() => this.handleToggleGrantScope(scope)} id={"grant-" + scope.name} checked={scope.granted}/>
          <label className="form-check-label" htmlFor={"grant-" + scope.name}>{scope.display_name}</label>
        </div>
      </li>);
    });
    return (
    <div>
      <div className="row">
        <div className="col-md-12">
          <hr/>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <h4>{i18next.t("login.grant-title", {client: this.state.client.name})}</h4>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <ul className="list-group">
            {scopeList}
          </ul>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <button type="button" className="btn btn-primary" onClick={this.handleGrantScope}>{i18next.t("login.grant")}</button>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <hr/>
        </div>
      </div>
    </div>);
  }

}

export default GrantScope;

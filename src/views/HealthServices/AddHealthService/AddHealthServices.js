import React, { Component } from 'react';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Col,
  Form,
  FormGroup,
  FormText,
  Input,
  Label, Nav, NavItem, NavLink, TabContent, TabPane
} from "reactstrap";
import AddDoctor from "./AddDoctor";
import AddHospital from "./AddHospital";
const axios = require('axios');

class AddHealthServices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 1,
      isSuccessAlertVisible: false,
      isFailAlertVisible: false,
      failAlertMessage: '',
      plans: [],
      languages: [],
      specializations: []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
    this.toggle = this.toggle.bind(this);
    this.tabPane = this.tabPane.bind(this);
  }

  async componentDidMount() {
    try {
      const plansReq = await  axios.get('https://myhealthapp-backend.herokuapp.com/api/plans');
      const langReq = await  axios.get('https://myhealthapp-backend.herokuapp.com/api/languages');
      const specReq = await  axios.get('https://myhealthapp-backend.herokuapp.com/api/specializations');
      this.setState({ plans: plansReq.data, languages: langReq.data, specializations: specReq.data });
      console.log(this.state);
    } catch (error) {
      console.log(error);
      this.setState({ isFailAlertVisible: true, failAlertMessage: 'Error al contactarse con el servidor. Intente nuevamente.'})
    }
  }

  async handleSubmit(healthService, url) {
    try {
      const res = await axios.post(url, healthService);
      this.setState({ isSuccessAlertVisible: true });
      console.log(res);
    } catch (error) {
      let message = 'Error al crear nuevo prestador: ';
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        message.concat(`Mensaje del servidor: ${error.response.body}`);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
        message.concat('No pudo establecerse comunicación con el servidor.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        message.concat('No pudo realizarse el pedido al servidor');
      }
      console.log(error.config);
      this.setState({ isFailAlertVisible: true, failAlertMessage: message });
    }
  }

  handleAlertDismiss(alertName) {
    console.log(alertName);
    this.setState({ [alertName]: false});
  }

  toggle(tab) {
    this.setState({ activeTab: tab});
  }

  tabPane() {
    return (
      <>
        <TabPane tabId={1}>
          <AddDoctor
            plans={this.state.plans}
            specializations={this.state.specializations}
            languages={this.state.languages}
            onSubmit={(healthService, url) => this.handleSubmit(healthService, url)}
          />
        </TabPane>
        <TabPane tabId={2}>
          <AddHospital
            plans={this.state.plans}
            specializations={this.state.specializations}
            languages={this.state.languages}
            onSubmit={(healthService, url) => this.handleSubmit(healthService, url)}
          />
        </TabPane>
      </>
    );
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Alert color="success" isOpen={this.state.isSuccessAlertVisible} name="isSuccessAlertVisible" toggle={() => this.handleAlertDismiss("isSuccessAlertVisible")}>
          Prestador creado con éxito.
        </Alert>
        <Alert color="danger" isOpen={this.state.isFailAlertVisible} name="isFailAlertVisible" toggle={() => this.handleAlertDismiss("isFailAlertVisible")}>
          {this.state.failAlertMessage}
        </Alert>
        <Nav tabs>
          <NavItem>
            <NavLink
              active={this.state.activeTab === 1}
              onClick={() => { this.toggle(1); }}
            >
              Agregar Doctor
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={this.state.activeTab === 2}
              onClick={() => { this.toggle(2); }}
            >
              Agregar Centro de Salud
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          {this.tabPane()}
        </TabContent>
      </div>
    );
  }
}

export  default AddHealthServices;

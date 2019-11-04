import React, { Component } from 'react';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormGroup,
  FormText,
  Input,
  Label
} from "reactstrap";
import CardFooter from "reactstrap/es/CardFooter";
import Search from '../../Search/Search';
import MapWrapper from '../../MapWrapper/MapWrapper';
import { AppSwitch } from '@coreui/react'

const axios = require('axios');

class AddHospital extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: -34.6175,
      lon: -58.3683,
      plans: this.props.plans,
      languages: this.props.languages,
      specializations: this.props.specializations,
      editEnabled: this.props.edit || false, 
      isAlertVisible: false,
      alertColor: '',
      alertMessage: '',
      hospital: {
        minimum_plan: 0,
        name: '',
        mail: '',
        telephone: 0,
        address: '',
        lat: -34.6175,
        lon: -58.3683,
        zone: '',
        specializations: [],
        languages: []
      },
    }; 
  }

  async componentDidMount() {
    try {
      const plansReq = await axios.get('https://myhealthapp-backend.herokuapp.com/api/plans');
      const langReq = await axios.get('https://myhealthapp-backend.herokuapp.com/api/languages');
      const specReq = await axios.get('https://myhealthapp-backend.herokuapp.com/api/specializations');
      const APIKey = await this.getAPIKey();
      if (!this.props.isNew) {
        const hospitalReq = await axios.get(`https://myhealthapp-backend.herokuapp.com/api/health-services/hospitals/${this.props.match.params.id}`);
        hospitalReq.status === 200 ?
        this.setState({ plans: plansReq.data, languages: langReq.data, specializations: specReq.data, APIKey, hospital: hospitalReq.data }) :
          this.setState({ alertColor: 'danger', isAlertVisible: true, alertMessage: 'No pudo establecerse una conexión con el servidor, intente más tarde.' });
      } else {
        this.setState({ plans: plansReq.data, languages: langReq.data, specializations: specReq.data, APIKey });
      }
    } catch (error) {
      this.setState({ alertColor: 'danger', isAlertVisible: true, alertMessage: 'No pudo establecerse una conexión con el servidor, intente más tarde.' })
    }
  }

  getAPIKey = async () => {
    const response = await axios.get('https://myhealthapp-backend.herokuapp.com/api/search-key');
    return response.data.key;
  };

  handleAlertDismiss = (alertName) => {
    this.setState({ [alertName]: false });
  };

  getSelectedValues(values) {
    let result = [];
    values.forEach((value) => {
      if (value.selected) result.push(value.value);
    });
    return result;
  }

  setLatLonAndZone = (address) => {
    const zoneAddressComponent = address.address_components.filter(component => component.types.some((text) => text === 'sublocality' || text === 'locality'))[0]
    this.setState((prevState) => ({
      hospital: {
      ...prevState.hospital,
      lat: address.geometry.location.lat(),
      lon: address.geometry.location.lng(),
      zone: zoneAddressComponent ? zoneAddressComponent.long_name : ''
    }}));
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    event.target.reset();
    try {
      await axios.post('https://myhealthapp-backend.herokuapp.com/api/health-services/hospitals', this.state.hospital);
      window.scrollTo({ top: 0, behavior: 'smooth'});
      this.setState({ alertColor: 'success', isAlertVisible: true, AlertMessage: 'Centro de salud creado con éxito' });
    } catch (error) {
      let message = 'Error al crear nuevo centro de salud: ';
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        message = message.concat(`Mensaje del servidor: ${error.response.statusText}`);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        message = message.concat('No pudo establecerse comunicación con el servidor.');
      } else {
        // Something happened in setting up the request that triggered an Error
        message = message.concat('No pudo realizarse el pedido al servidor');
      }
      this.setState({ alertColor: 'danger', isAlertVisible: true, AlertMessage: message });
    }
    // TODO: Implement update endpoint
    if (this.props.onSubmit) this.props.onSubmit(this.state.hospital, 'https://myhealthapp-backend.herokuapp.com/api/health-services/hospitals');
  };

  handleChange = (event) => {    
    const hospital = {...this.state.hospital};
    if (event.target.name === 'specializations' || event.target.name === 'languages' ) {
      hospital[event.target.name] = this.getSelectedValues(event.target.children)
    } else {
      hospital[event.target.name] = event.target.value
    };    
    this.setState({ hospital });
  };

  render() {
    return (
      <div>
        <Alert color={this.state.alertColor} isOpen={this.state.isAlertVisible} name="isAlertVisible" toggle={() => this.handleAlertDismiss("isAlertVisible")}>
          {this.state.alertMessage}
        </Alert>
        <Card>
          <CardHeader>
            <strong>{this.props.isNew ? 'Ingrese la información del centro de salud' : 'Centro de salud'}</strong>
            {!this.props.isNew && <div style={{ float: 'right' }}>
              <p>Habilitar edición</p>
              <AppSwitch className={'mx-1'} variant={'pill'} color={'primary'} checked={this.state.editEnabled} onChange={() => this.setState((prevState) => ({ ...prevState, editEnabled: !prevState.editEnabled }))} />
            </div>}
          </CardHeader>
          <CardBody>
            <Form id="hospital-form" className="form-horizontal" onSubmit={this.handleSubmit}>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="text-input">Nombre</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="name-input" name="name" value={this.state.hospital.name} onChange={this.handleChange} placeholder={"Hospital Central"} required disabled={!this.state.editEnabled} />
                  {this.props.isNew && <FormText color="muted">Ingrese el nombre completo</FormText>}
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="mail-input">Mail</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="email" id="mail-input" name="mail" placeholder="contacto@hcentral.com.ar" autoComplete="email" required disabled={!this.state.editEnabled} value={this.state.hospital.mail} onChange={this.handleChange} />
                  {this.props.isNew && <FormText className="help-block">Ingrese el mail de contacto</FormText>}
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="email-input">Teléfono</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="number" min="0" id="telephone-input" name="telephone" placeholder="47395539" required disabled={!this.state.editEnabled} value={this.state.hospital.telephone} onChange={this.handleChange} />
                  {this.props.isNew && <FormText className="help-block">Ingrese el teléfono de contacto</FormText>}
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="select">Plan mínimo</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="select" name="minimum_plan" id="minimum-plan-select" required disabled={!this.state.editEnabled} value={this.state.hospital.minimum_plan} onChange={this.handleChange}>
                    <option value="0" disabled>Por favor elija el plan mínimo</option>
                    {this.state.plans && this.state.plans.map(plan => <option key={`plan${plan.plan}`} value={plan.plan}>{plan.plan_name}</option>)}
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3"><Label>Especializaciones</Label></Col>
                <Col md="9">
                  <Input type="select" name="specializations" id="specialization-select" multiple required disabled={!this.state.editEnabled} value={this.state.hospital.specializations} onChange={this.handleChange}>
                    {
                      this.state.specializations && this.state.specializations.map(specialization => <option key={`specialization-${specialization.id}`}>{specialization.name}</option>)
                    }
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label>Idiomas</Label>
                </Col>
                <Col md="9">
                  <Input type="select" name="languages" id="language-select" multiple required disabled={!this.state.editEnabled} value={this.state.hospital.languages} onChange={this.handleChange}>
                    {
                      this.state.languages && this.state.languages.map(language => <option key={`language-${language.id}`}>{language.name}</option>)
                    }
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="text-input">Dirección</Label>
                </Col>
                <Col xs="12" md="9">
                  <Search onSelect={this.setLatLonAndZone} id={'hospital-autocomplete'} disabled={!this.state.editEnabled} value={this.state.hospital.address} onChange={this.handleChange} />
                  {this.props.isNew && <FormText color="muted">Ingrese la dirección del centro de salud</FormText>}
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label>Mapa</Label>
                </Col>
                <Col md="9" style={{ height: '300px' }}>
                  {this.state.APIKey && <MapWrapper APIKey={this.state.APIKey} lat={this.state.hospital.lat} lon={this.state.hospital.lon} styles={{ height: '200px' }} />}
                </Col>
              </FormGroup>
            </Form>
          </CardBody>
          {this.state.editEnabled && <CardFooter>
            <Button type="submit" color="primary" form="hospital-form"><i className="fa fa-dot-circle-o" /> Guardar </Button>
            {' '}
            <Button type="reset" color="danger" form="hospital-form"><i className="fa fa-ban" /> Cancelar</Button>
          </CardFooter>}
        </Card>
      </div>
    );
  }
}

export  default AddHospital;

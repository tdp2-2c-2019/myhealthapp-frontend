import React, { Component } from 'react';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Form,
  FormGroup,
  FormText,
  Input,
  Label
} from "reactstrap";
import Search from '../../Search/Search';
import MapWrapper from '../../MapWrapper/MapWrapper';
import { AppSwitch } from '@coreui/react'

const axios = require('axios');

class AddDoctor extends Component {
  constructor(props) {
    super(props);    
    this.state = {
      APIKey: this.props.APIKey || '',
      editEnabled: this.props.edit || false,
      plans: this.props.plans,
      languages: this.props.languages,
      specializations: this.props.specializations,
      alertColor: '',
      isAlertVisible: false,
      alertMessage: '',
      doctor: {
        minimum_plan: 0,
        name: '',
        mail: '',
        telephone: 0,
        address: '',
        address_notes: '',
        lat: -34.6175,
        lon: -58.3683,
        zone: '',
        specializations: [],
        languages: []
      }
    }; 
  }

  async componentDidMount() {
    try {
      const plansReq = await axios.get('https://myhealthapp-backend.herokuapp.com/api/plans');
      const langReq = await axios.get('https://myhealthapp-backend.herokuapp.com/api/languages');
      const specReq = await axios.get('https://myhealthapp-backend.herokuapp.com/api/specializations');
      const APIKey = await this.getAPIKey();      
      if (!this.props.isNew) {
        const doctorReq = await axios.get(`https://myhealthapp-backend.herokuapp.com/api/health-services/doctors/${this.props.match.params.id}`);
        doctorReq.status === 200 ?
          this.setState({ plans: plansReq.data, languages: langReq.data, specializations: specReq.data, APIKey, doctor: doctorReq.data }) :
          this.setState({ alertColor: 'danger', isAlertVisible: true, alertMessage: 'No pudo establecerse una conexión con el servidor, intente más tarde.' });
      } else {
        this.setState({ plans: plansReq.data, languages: langReq.data, specializations: specReq.data, APIKey });
      }
    } catch (error) {
      this.setState({ alertColor: 'danger', isAlertVisible: true, alertMessage: 'No pudo establecerse una conexión con el servidor, intente más tarde.' })
    }
  }

  handleAlertDismiss = (alertName) => {
    this.setState({ [alertName]: false });
  };

  getAPIKey = async () => {
    const response = await axios.get('https://myhealthapp-backend.herokuapp.com/api/search-key');
    return response.data.key;
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
      doctor: {
        ...prevState.doctor,
        lat: address.geometry.location.lat(),
        lon: address.geometry.location.lng(),
        zone: zoneAddressComponent ? zoneAddressComponent.long_name : ''
      }
    }));
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    event.target.reset();
    try {
      await axios.post('https://myhealthapp-backend.herokuapp.com/api/health-services/doctors', this.state.doctor);
      window.scrollTo({ top: 0, behavior: 'smooth'});
      this.setState({ alertColor: 'success', isAlertVisible: true, alertMessage: 'Doctor guardado con éxito' });
    } catch (error) {
      let message = 'Error al crear nuevo doctor: ';
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
      this.setState({ isAlertVisible: true, alertMessage: message });
    }
  };

  handleChange = (event) => {
    const doctor = { ...this.state.doctor };
    if (event.target.name === 'specializations' || event.target.name === 'languages') {
      doctor[event.target.name] = this.getSelectedValues(event.target.children)
    } else {
      doctor[event.target.name] = event.target.value
    };
    this.setState({ doctor });
  };

  render() {
    return (
      <div>
        <Alert color={this.state.alertColor} isOpen={this.state.isAlertVisible} name="isAlertVisible" toggle={() => this.handleAlertDismiss("isAlertVisible")}>
          {this.state.alertMessage}
        </Alert>
        <Card>
          <CardHeader>
            <strong>{this.props.isNew ? 'Ingrese la información del doctor' : 'Doctor'}</strong>
            {!this.props.isNew && <div style={{ float: 'right' }}>
              <p>Habilitar edición</p>
              <AppSwitch className={'mx-1'} variant={'pill'} color={'primary'} checked={this.state.editEnabled} onChange={() => this.setState((prevState) => ({ ...prevState, editEnabled: !prevState.editEnabled }))} />
            </div>}
          </CardHeader>
          <CardBody>
            <Form id="doctor-form" className="form-horizontal" onSubmit={this.handleSubmit}>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="text-input">Nombre</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="name-input" name="name" placeholder="Juan Perez" required value={this.state.doctor.name} onChange={this.handleChange} disabled={!this.state.editEnabled} />
                  {this.props.isNew && <FormText color="muted">Ingrese el nombre completo</FormText>}
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="mail-input">Mail</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="email" id="mail-input" name="mail" placeholder="juan@perez.com" autoComplete="email" required disabled={!this.state.editEnabled} value={this.state.doctor.mail} onChange={this.handleChange} />
                  {this.props.isNew && <FormText className="help-block">Ingrese el mail</FormText>}
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="email-input">Teléfono</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="number" min="0" id="telephone-input" name="telephone" placeholder="47395539" required disabled={!this.state.editEnabled} value={this.state.doctor.telephone} onChange={this.handleChange} />
                  {this.props.isNew && <FormText className="help-block">Ingrese el teléfono</FormText>}
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="select">Plan mínimo</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="select" name="minimum_plan" id="minimum-plan-select" required disabled={!this.state.editEnabled} value={this.state.doctor.minimum_plan} onChange={this.handleChange}>
                    <option value="0" disabled>Elija el plan mínimo requerido</option>
                    {this.state.plans && this.state.plans.map(plan => <option key={`plan${plan.plan}`} value={plan.plan}>{plan.plan_name}</option>)}
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3"><Label>Especializaciones</Label></Col>
                <Col md="9">
                  <Input type="select" name="specializations" id="specialization-select" multiple required disabled={!this.state.editEnabled} value={this.state.doctor.specializations} onChange={this.handleChange}>
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
                  <Input type="select" name="languages" id="language-select" multiple required disabled={!this.state.editEnabled} value={this.state.doctor.languages} onChange={this.handleChange}>
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
                  <Search onSelect={this.setLatLonAndZone} id={'doctor-autocomplete'} disabled={!this.state.editEnabled} value={this.state.doctor.address} onChange={this.handleChange} />
                  {this.props.isNew && <FormText color="muted">Ingrese la dirección</FormText>}
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="text-input">Piso / Departamento</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="address-notes-input" name="address_notes" placeholder="3 B" required disabled={!this.state.editEnabled} value={this.state.doctor.address_notes} onChange={this.handleChange} />
                  {this.props.isNew && <FormText color="muted">Ingrese el piso y/o departamento</FormText>}
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label>Mapa</Label>
                </Col>
                <Col md="9" style={{ height: '300px' }}>
                  {this.state.APIKey && <MapWrapper APIKey={this.state.APIKey} lat={this.state.doctor.lat} lon={this.state.doctor.lon} styles={{ height: '200px' }} />}
                </Col>
              </FormGroup>
            </Form>
          </CardBody>
          {this.state.editEnabled && <CardFooter>
            <Button type="submit" color="primary" form="doctor-form"><i className="fa fa-dot-circle-o" /> Guardar</Button>
            {' '}
            <Button type="reset" color="danger" form="doctor-form"><i className="fa fa-ban" /> Cancelar</Button>
          </CardFooter>}
        </Card>
      </div>
    );
  }
}

export default AddDoctor;

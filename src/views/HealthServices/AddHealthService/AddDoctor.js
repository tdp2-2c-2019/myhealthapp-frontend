import React, { Component } from 'react';
import {
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
      lat: -34.6175,
      lon: -58.3683,
      zone: null,
      APIKey: this.props.APIKey || '',
      editEnabled: this.props.edit || false,
      plans: this.props.plans,
      languages: this.props.languages,
      specializations: this.props.specializations,
      doctor: {
        minimum_plan: 0,
        name: "",
        mail: "",
        telephone: null,
        address: "",
        address_notes: "",
        lat: 0,
        lon: 0,
        zone: "",
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
      let doctor = null;
      if (!this.state.editEnabled) {
        doctor = await axios.get(`https://myhealthapp-backend.herokuapp.com/api/health-services/doctors/${this.props.match.params.id}`);
      }
      this.setState({ plans: plansReq.data, languages: langReq.data, specializations: specReq.data, APIKey, doctor: doctor.data });
    } catch (error) {
      this.setState({ isFailAlertVisible: true, failAlertMessage: 'Error al contactarse con el servidor. Intente nuevamente.' })
    }
  }

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

  handleSubmit = (event) => {
    event.preventDefault();
    const target = event.target;
    const doctor = {
      name: target[0].value,
      mail: target[1].value,
      telephone: target[2].value,
      address: target[3].value,
      address_notes: target[4].value,
      minimum_plan: target[5].value,
      specializations: this.getSelectedValues(target[6].children),
      languages: this.getSelectedValues(target[7].children),
      lat: this.state.lat,
      lon: this.state.lon,
      zone: this.state.zone,
    };
    event.target.reset();
    if (this.props.onSubmit) this.props.onSubmit(doctor, 'https://myhealthapp-backend.herokuapp.com/api/health-services/doctors');
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
      <Card>
        <CardHeader>
          <strong>{'Doctor'}</strong>
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
                <Input type="text" id="name-input" name="name" placeholder="Juan Perez" required value={this.state.doctor.name} onChange={this.handleChange} disabled={!this.state.editEnabled}/>
                {this.props.isNew && <FormText color="muted">Ingrese el nombre completo</FormText>}
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="mail-input">Mail</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="email" id="mail-input" name="mail" placeholder="juan@perez.com" autoComplete="email" required disabled={!this.state.editEnabled} value={this.state.doctor.mail} onChange={this.handleChange}/>
                {this.props.isNew && <FormText className="help-block">Ingrese el mail</FormText>}
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="email-input">Teléfono</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="number" min="0" id="telephone-input" name="telephone" placeholder="47395539" required disabled={!this.state.editEnabled} value={this.state.doctor.telephone} onChange={this.handleChange}/>
                {this.props.isNew && <FormText className="help-block">Ingrese el teléfono</FormText>}
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="text-input">Dirección</Label>
              </Col>
              <Col xs="12" md="9">
                <Search onSelect={this.setLatLonAndZone} id={'doctor-autocomplete'} disabled={!this.state.editEnabled} value={this.state.doctor.address} onChange={this.handleChange}/>
                {this.props.isNew && <FormText color="muted">Ingrese la dirección</FormText>}
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="text-input">Piso / Departamento</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="text" id="address-notes-input" name="address_notes" placeholder="3 B" required disabled={!this.state.editEnabled} value={this.state.doctor.address_notes} onChange={this.handleChange}/>
                {this.props.isNew && <FormText color="muted">Ingrese el piso y/o departamento</FormText>}
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="select">Plan mínimo</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="select" name="minimum_plan" id="minimum-plan-select" defaultValue="0" required disabled={!this.state.editEnabled} value={this.state.doctor.minimum_plan} onChange={this.handleChange}>
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
                <Label>Mapa</Label>
              </Col>
              <Col md="9" style={{height: '300px'}}>
                {this.state.APIKey && <MapWrapper APIKey={this.state.APIKey} lat={this.state.doctor.lat} lon={this.state.doctor.lon} styles={{height:'200px'}}/>}
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
    );
  }
}

export default AddDoctor;

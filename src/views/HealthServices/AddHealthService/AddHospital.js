import React, { Component } from 'react';
import {
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
      zone: null,
      plans: this.props.plans,
      languages: this.props.languages,
      specializations: this.props.specializations,
      editEnabled: this.props.edit || false, 
      hospital: {
        id: 0,
        minimum_plan: 0,
        name: "",
        mail: "",
        telephone: 0,
        address: "",
        lat: 0,
        lon: 0,
        zone: "",
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
      let hospital = null;
      if (!this.state.editEnabled) {
        hospital = await axios.get(`https://myhealthapp-backend.herokuapp.com/api/health-services/hospitals/${this.props.match.params.id}`);
      }      
      this.setState({ plans: plansReq.data, languages: langReq.data, specializations: specReq.data, APIKey, hospital: hospital.data });
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
    this.setState({
      lat: address.geometry.location.lat(),
      lon: address.geometry.location.lng(),
      zone: zoneAddressComponent ? zoneAddressComponent.long_name : ''
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const target = event.target;
    const hospital = {
      name: target[0].value,
      mail: target[1].value,
      telephone: target[2].value,
      address: target[3].value,
      minimum_plan: target[4].value,
      specializations: this.getSelectedValues(target[5].children),
      languages: this.getSelectedValues(target[6].children),
      lat: this.state.lat,
      lon: this.state.lon,
      zone: this.state.zone,
    };
    event.target.reset();
    this.props.onSubmit(hospital, 'https://myhealthapp-backend.herokuapp.com/api/health-services/hospitals');
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
      <Card>
        <CardHeader>
          <strong>{!this.state.hospital ? 'Ingrese los datos del centro de salud' : 'Centro de salud'}</strong>
          <div style={{ float: 'right' }}>
            <p>Habilitar edición</p>
          <AppSwitch className={'mx-1'} variant={'pill'} color={'primary'} checked={this.state.editEnabled} onChange={() => this.setState((prevState) => ({...prevState, editEnabled: !prevState.editEnabled}))}/>
          </div>
        </CardHeader>
        <CardBody>
          <Form id="hospital-form" className="form-horizontal" onSubmit={this.handleSubmit}>
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="text-input">Nombre</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="text" id="name-input" name="name" value={this.state.hospital.name} onChange={this.handleChange} placeholder={"Hospital Central"} required disabled={!this.state.editEnabled}/>
                {!this.state.hospital && <FormText color="muted">Ingrese el nombre completo</FormText>}
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="mail-input">Mail</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="email" id="mail-input" name="mail" placeholder="contacto@hcentral.com.ar" autoComplete="email" required disabled={!this.state.editEnabled} value={this.state.hospital.mail} onChange={this.handleChange}/>
                {!this.state.hospital && <FormText className="help-block">Ingrese el mail de contacto</FormText>}
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="email-input">Teléfono</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="number" min="0" id="telephone-input" name="telephone" placeholder="47395539" required disabled={!this.state.editEnabled} value={this.state.hospital.telephone} onChange={this.handleChange}/>
                {!this.state.hospital && <FormText className="help-block">Ingrese el teléfono de contacto</FormText>}
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="text-input">Dirección</Label>
              </Col>
              <Col xs="12" md="9">
                <Search onSelect={this.setLatLonAndZone} id={'hospital-autocomplete'} disabled={!this.state.editEnabled} value={this.state.hospital.address} onChange={this.handleChange}/>
                {!this.state.hospital && <FormText color="muted">Ingrese la dirección del centro de salud</FormText>}
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="select">Plan mínimo</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="select" name="minimum_plan" id="minimum-plan-select" defaultValue="0" required disabled={!this.state.editEnabled} value={this.state.hospital.minimum_plan} onChange={this.handleChange}>
                  <option value="0" disabled>Por favor elija el plan mínimo</option>
                  {this.state.plans && this.state.plans.map(plan => <option key={`plan${plan.plan}`} value={plan.plan}>{ plan.plan_name }</option>)}
                </Input>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3"><Label>Especializaciones</Label></Col>
              <Col md="9">
                <Input type="select" name="specializations" id="specialization-select" multiple required disabled={!this.state.editEnabled} value={this.state.hospital.specializations} onChange={this.handleChange}>
                  {
                    this.state.specializations && this.state.specializations.map(specialization => <option key={`specialization-${specialization.id}`}>{ specialization.name }</option>)
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
                    this.state.languages && this.state.languages.map(language => <option key={`language-${language.id}`}>{ language.name }</option>)
                  }
                </Input>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label>Mapa</Label>
              </Col>
              <Col md="9" style={{ height: '300px' }}>
                {this.state.APIKey && <MapWrapper APIKey={this.state.APIKey} lat={(this.state.hospital && this.state.hospital.lat) ? this.state.hospital.lat : this.state.lat} lon={(this.state.hospital && this.state.hospital.lon) ? this.state.hospital.lon : this.state.lon} styles={{ height: '200px' }} />}
              </Col>
            </FormGroup>
          </Form>
        </CardBody>
        {this.state.editEnabled && <CardFooter>
          <Button type="submit" color="primary" form="hospital-form"><i className="fa fa-dot-circle-o" /> Crear</Button>
          {' '}
          <Button type="reset" color="danger" form="hospital-form"><i className="fa fa-ban" /> Cancelar</Button>
        </CardFooter>}
      </Card>
    );
  }
}

export  default AddHospital;

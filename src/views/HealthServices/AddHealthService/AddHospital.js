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

class AddHospital extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: null,
      lon: null,
    }; 
  }

  getSelectedValues(values) {
    let result = [];
    values.forEach((value) => {
      if (value.selected) result.push(value.value);
    });
    return result;
  }

  setLatAndLon = (addressGeometry) => {
    this.setState({
      lat: addressGeometry.location.lat(),
      lon: addressGeometry.location.lng(),
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
    };
    event.target.reset();
    this.props.onSubmit(hospital, 'https://myhealthapp-backend.herokuapp.com/api/health-services/hospitals');
  };

  render() {
    return (
      <Card>
        <CardHeader>
          <strong>Ingrese los datos del centro de salud</strong>
        </CardHeader>
        <CardBody>
          <Form id="hospital-form" className="form-horizontal" onSubmit={this.handleSubmit}>
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="text-input">Nombre</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="text" id="name-input" name="name" placeholder="Hospital Central" required/>
                <FormText color="muted">Ingrese el nombre completo</FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="mail-input">Mail</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="email" id="mail-input" name="mail" placeholder="contacto@hcentral.com.ar" autoComplete="email" required/>
                <FormText className="help-block">Ingrese el mail de contacto</FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="email-input">Teléfono</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="number" id="telephone-input" name="telephone" placeholder="47395539" required/>
                <FormText className="help-block">Ingrese el teléfono de contacto</FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="text-input">Dirección</Label>
              </Col>
              <Col xs="12" md="9">
                <Search onSelect={this.setLatAndLon} id={'hospital-autocomplete'}></Search>
                <FormText color="muted">Ingrese la dirección del centro de salud</FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="select">Plan mínimo</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="select" name="minimum_plan" id="minimum-plan-select" defaultValue="0" required>
                  <option value="0" disabled>Por favor elija el plan mínimo</option>
                  {this.props.plans.map(plan => <option key={`plan${plan.plan}`} value={plan.plan}>{ plan.plan_name }</option>)}
                </Input>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3"><Label>Especializaciones</Label></Col>
              <Col md="9">
                <Input type="select" name="specialization" id="specialization-select" multiple required>
                  {
                    this.props.specializations.map(specialization => <option key={`specialization-${specialization.id}`}>{ specialization.name }</option>)
                  }
                </Input>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label>Idiomas</Label>
              </Col>
              <Col md="9">
                <Input type="select" name="language" id="language-select" multiple required>
                  {
                    this.props.languages.map(language => <option key={`language-${language.id}`}>{ language.name }</option>)
                  }
                </Input>
              </Col>
            </FormGroup>
          </Form>
        </CardBody>
        <CardFooter>
          <Button type="submit" color="primary" form="hospital-form"><i className="fa fa-dot-circle-o" /> Crear</Button>
          {' '}
          <Button type="reset" color="danger" form="hospital-form"><i className="fa fa-ban" /> Cancelar</Button>
        </CardFooter>
      </Card>
    );
  }
}

export  default AddHospital;

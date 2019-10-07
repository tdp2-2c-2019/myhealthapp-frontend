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
const axios = require('axios');

class AddDoctor extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getSelectedValues(values) {
    let result = [];
    values.forEach((value) => {
      if (value.selected) result.push(value.value);
    });
    return result;
  }

  async handleSubmit(event) {
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
      languages: this.getSelectedValues(target[7].children)
    };
    event.target.reset();
    console.log(doctor);
    this.props.onSubmit(doctor, 'https://myhealthapp-backend.herokuapp.com/api/health-services/doctors');
  }

  render() {
    return (
      <Card>
        <CardHeader>
          <strong>Ingrese los datos del doctor</strong>
        </CardHeader>
        <CardBody>
          <Form id="doctor-form" className="form-horizontal" onSubmit={this.handleSubmit}>
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="text-input">Nombre</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="text" id="name-input" name="name" placeholder="Juan Perez" required/>
                <FormText color="muted">Ingrese el nombre completo</FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="mail-input">Mail</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="email" id="mail-input" name="mail" placeholder="juan@perez.com" autoComplete="email" required/>
                <FormText className="help-block">Ingrese su mail</FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="email-input">Teléfono</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="number" id="telephone-input" name="telephone" placeholder="47395539" required/>
                <FormText className="help-block">Ingrese su teléfono</FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="text-input">Dirección</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="text" id="address-input" name="address" placeholder="Matienzos 345" required/>
                <FormText color="muted">Ingrese la dirección del prestador</FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="text-input">Piso / Departamento</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="text" id="address-notes-input" name="address_notes" placeholder="3 B" required/>
                <FormText color="muted">Ingrese el piso y/o departamento del prestador</FormText>
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
          <Button type="submit" color="primary" form="doctor-form"><i className="fa fa-dot-circle-o" /> Crear</Button>
          {' '}
          <Button type="reset" color="danger" form="doctor-form"><i className="fa fa-ban" /> Cancelar</Button>
        </CardFooter>
      </Card>
    );
  }
}

export  default AddDoctor;

import React, { Component } from 'react';
import {
  Button, Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormGroup,
  FormText,
  Input,
  Label
} from "reactstrap";
const axios = require('axios');

class AddHealthServices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plans: [],
      languages: [],
      specializations: [],
      doctor: {
        name: '',
        email: '',
        telephone: -1,

      }
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    try {
      const plansReq = await  axios.get('http://localhost:8080/api/plans');
      const langReq = await  axios.get('http://localhost:8080/api/languages');
      const specReq = await  axios.get('http://localhost:8080/api/specializations');
      this.setState({ plans: plansReq.data, languages: langReq.data, specializations: specReq.data });
      console.log(this.state);
    } catch (error) {
      console.log('Error when getting plans, languages and specializations');
      console.log(error);
    }
  }

  getSelectedValues(values) {
    let result = [];
    values.forEach((value) => {
      if (value.selected) result.push(value.value);
    });
    return result;
  }

  handleSubmit(event) {
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
    console.log(doctor);
    axios.post('http://localhost:8080/api/health-services/doctors', doctor);
  }

  render() {
    return (
      <Card>
        <CardHeader>
          <strong>Agregar prestador</strong>
        </CardHeader>
        <CardBody>
          <Form className="form-horizontal" onSubmit={this.handleSubmit}>
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="text-input">Nombre</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="text" id="name-input" name="name" placeholder="Juan Perez"/>
                <FormText color="muted">Ingrese el nombre completo</FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="mail-input">Mail</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="email" id="mail-input" name="mail" placeholder="juan@perez.com" autoComplete="email"/>
                <FormText className="help-block">Ingrese su mail</FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="email-input">Teléfono</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="number" id="telephone-input" name="telephone" placeholder="47395539"/>
                <FormText className="help-block">Ingrese su teléfono</FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="text-input">Direccion</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="text" id="address-input" name="address" placeholder="Matienzos 345" />
                <FormText color="muted">Ingrese la direccion del prestador</FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="text-input">Piso / Departamento</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="text" id="address-notes-input" name="address_notes" placeholder="3 B" />
                <FormText color="muted">Ingrese el piso y/o departamento del prestador</FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="select">Plan mínimo</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="select" name="minimum_plan" id="minimum-plan-select" defaultValue="0">
                  <option value="0" disabled>Por favor elija el plan mínimo</option>
                  {this.state.plans.map(plan => <option key={`plan${plan.plan}`}>{ plan.plan_name }</option>)}
                </Input>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3"><Label>Especialidades</Label></Col>
              <Col md="9">
                <Input type="select" name="specialization" id="specialization-select" multiple>
                  {
                    this.state.specializations.map(specialization => <option key={`specialization-${specialization.id}`}>{ specialization.name }</option>)
                  }
                </Input>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label>Idiomas</Label>
              </Col>
              <Col md="9">
                <Input type="select" name="language" id="language-select" multiple>
                  {
                    this.state.languages.map(language => <option key={`language-${language.id}`}>{ language.name }</option>)
                  }
                </Input>
              </Col>
            </FormGroup>
            <Button type="submit" size="sm" color="primary"><i className="fa fa-dot-circle-o" />Crear</Button>
            <Button type="reset" size="sm" color="danger"><i className="fa fa-ban" />Cancelar</Button>
          </Form>
        </CardBody>
      </Card>
    );
  }
}

export  default AddHealthServices;

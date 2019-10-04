import React, { Component } from 'react';
import {
  Button, Card,
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

class AddHealthServices extends Component {
  render() {
    return (
      <Card>
        <CardHeader>
          <strong>Agregar prestador</strong>
        </CardHeader>
        <CardBody>
          <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="text-input">Nombre</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="text" id="name-input" name="name-input" placeholder="Juan Perez" />
                <FormText color="muted">Ingrese el nombre completo</FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="email-input">Email</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="email" id="email-input" name="email-input" placeholder="juan@perez.com" autoComplete="email"/>
                <FormText className="help-block">Ingrese su email</FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="email-input">Telefono</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="number" id="telephone-input" name="telephone-input" placeholder="47395539"/>
                <FormText className="help-block">Ingrese su email</FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="text-input">Direccion</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="text" id="address-input" name="address-input" placeholder="Matienzos 345" />
                <FormText color="muted">Ingrese la direccion del prestador</FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="text-input">Piso / Departamento</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="text" id="address-notes-input" name="address-notes-input" placeholder="3 B" />
                <FormText color="muted">Ingrese el piso y/o departamento del prestador</FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="select">Plan minimo</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="select" name="select" id="select">
                  <option value="0">Por favor elija el plan minimo</option>
                  <option value="1">Plan 1</option>
                  <option value="2">Plan 2</option>
                  <option value="3">Plan 3</option>
                </Input>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3"><Label>Especialidades</Label></Col>
              <Col md="9">
                <FormGroup check className="checkbox">
                  <Input className="form-check-input" type="checkbox" id="checkbox1" name="checkbox1" value="option1" />
                  <Label check className="form-check-label" htmlFor="checkbox1">Clinica</Label>
                </FormGroup>
                <FormGroup check className="checkbox">
                  <Input className="form-check-input" type="checkbox" id="checkbox2" name="checkbox2" value="option2" />
                  <Label check className="form-check-label" htmlFor="checkbox2">Cardiologia</Label>
                </FormGroup>
                <FormGroup check className="checkbox">
                  <Input className="form-check-input" type="checkbox" id="checkbox3" name="checkbox3" value="option3" />
                  <Label check className="form-check-label" htmlFor="checkbox3">Nutricion</Label>
                </FormGroup>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label>Idiomas</Label>
              </Col>
              <Col md="9">
                <FormGroup check inline>
                  <Input className="form-check-input" type="checkbox" id="inline-checkbox1" name="inline-checkbox1" value="option1" />
                  <Label className="form-check-label" check htmlFor="inline-checkbox1">Espanol</Label>
                </FormGroup>
                <FormGroup check inline>
                  <Input className="form-check-input" type="checkbox" id="inline-checkbox2" name="inline-checkbox2" value="option2" />
                  <Label className="form-check-label" check htmlFor="inline-checkbox2">Ingles</Label>
                </FormGroup>
                <FormGroup check inline>
                  <Input className="form-check-input" type="checkbox" id="inline-checkbox3" name="inline-checkbox3" value="option3" />
                  <Label className="form-check-label" check htmlFor="inline-checkbox3">Portugues</Label>
                </FormGroup>
              </Col>
            </FormGroup>
          </Form>
        </CardBody>
        <CardFooter>
          <Button type="submit" size="sm" color="primary"><i className="fa fa-dot-circle-o"></i>Crear</Button>
          <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i>Cancelar</Button>
        </CardFooter>
      </Card>
    );
  }
}

export  default AddHealthServices;

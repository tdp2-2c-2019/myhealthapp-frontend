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
import { AppSwitch } from '@coreui/react'

const axios = require('axios');

class ViewAuthorization extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alertColor: '',
            isAlertVisible: false,
            alertMessage: '',
        };
    }

    async componentDidMount() {
    }

    handleAlertDismiss = (alertName) => {
        this.setState({ [alertName]: false });
    };

    render() {
        return (
            <div>
                <Alert color={this.state.alertColor} isOpen={this.state.isAlertVisible} name="isAlertVisible" toggle={() => this.handleAlertDismiss("isAlertVisible")}>
                    {this.state.alertMessage}
                </Alert>
                <Card>
                    <CardHeader>
                        <strong>Autorización</strong>
                    </CardHeader>
                    <CardBody>
                        <Form id="authorizations-form" className="form-horizontal" onSubmit={this.handleSubmit}>
                            <FormGroup row>
                                <Col md="3">
                                    <Label htmlFor="text-input">Titulo</Label>
                                </Col>
                                <Col xs="12" md="9">
                                    <Input type="text" id="title-input" name="title" value={this.state.authorization.title} onChange={this.handleChange} disabled={true} />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md="3">
                                    <Label htmlFor="status-input">Estado</Label>
                                </Col>
                                <Col xs="12" md="9">
                                    <Input type="text" id="status-input" name="status" disabled={true} value={this.state.authorization.status} onChange={this.handleChange} />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md="3">
                                    <Label htmlFor="email-input">Fecha de creación</Label>
                                </Col>
                                <Col xs="12" md="9">
                                    <Input type="date" id="date-created-input" name="date-created" disabled={true} value={this.state.authorization.date_created} onChange={this.handleChange} />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md="3">
                                    <Label htmlFor="select">Creada por</Label>
                                </Col>
                                <Col xs="12" md="9">
                                    <Col xs="12" md="9">
                                        <Input type="text" id="created-by-input" name="created-by" disabled={true} value={this.state.authorization.created_by.dni + this.state.authorization.created_by.first_name + this.state.authorization.created_by.last_name} onChange={this.handleChange} />
                                    </Col>
                                </Col>
                            </FormGroup>
                            {this.state.authorization.created_for && <FormGroup row>
                                <Col md="3">
                                    <Label htmlFor="select">Creada para</Label>
                                </Col>
                                <Col xs="12" md="9">
                                    <Col xs="12" md="9">
                                        <Input type="text" id="created-for-input" name="created-for" disabled={true} value={this.state.authorization.created_for.dni + this.state.authorization.created_for.first_name + this.state.authorization.created_for.last_name} onChange={this.handleChange} />
                                    </Col>
                                </Col>
                            </FormGroup>}
                        </Form>
                    </CardBody>
                    <CardFooter>
                        <Button type="submit" color="primary" form="doctor-form"><i className="fa fa-dot-circle-o" /> Guardar</Button>
                        {' '}
                        <Button type="reset" color="danger" form="doctor-form"><i className="fa fa-ban" /> Cancelar</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }
}

export default ViewAuthorization;
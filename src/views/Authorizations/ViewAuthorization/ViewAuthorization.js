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
    Input,
    Label
} from "reactstrap";

const axios = require('axios');

class ViewAuthorization extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            alertColor: '',
            isAlertVisible: false,
            alertMessage: '',
            authorization: {
                id: 0,
                created_by: {
                    dni: 1,
                    plan: 1,
                    first_name: 'Diego',
                    last_name: 'Armando',
                    mail: 'diego@mail.com',
                },
                created_for: null,
                created_at: '2019-10-29T00:36:01.813Z',
                status: 'PENDIENTE',
                title: 'Ortodoncia adultos',
                note: '',
                type: '',
            }
        };
    }

    async componentDidMount() {
        try {
            const authReq = await axios.get(`https://myhealthapp-backend.herokuapp.com/api/authorizations/${this.state.id}`);
            authReq.status === 200 ?
            this.setState({ authorization: authReq.data }) : 
            this.setState({ alertColor: 'danger', isAlertVisible: true, alertMessage: 'No pudo establecerse una conexión con el servidor, intente más tarde.' });
        } catch (error) {
            this.setState({ alertColor: 'danger', isAlertVisible: true, alertMessage: 'No pudo establecerse una conexión con el servidor, intente más tarde.' });
        }
        
    }

    handleAlertDismiss = (alertName) => {
        this.setState({ [alertName]: false });
    };

    handleSubmit = async (event) => {
        event.preventDefault();        
        event.target.reset();
        try {
            await axios.put(`https://myhealthapp-backend.herokuapp.com/api/authorizations/${this.state.authorization.id}`, { ...this.state.authorization, status: 'APROBADO', note: '' });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.setState({ alertColor: 'success', isAlertVisible: true, alertMessage: 'Autorización aprobada con éxito' });
        } catch (error) {
            this.handleErrorOnSubmit(error);
        }
    };

    handleDenial = async () => {
        try {
            if (this.state.authorization.note === null || this.state.authorization.note === undefined || this.state.authorization.note === "") {
                this.setState({ alertColor: 'danger', isAlertVisible: true, alertMessage: 'El mensaje de observación es requerido al rechazar' });
            } else {
                await axios.put(`https://myhealthapp-backend.herokuapp.com/api/authorizations/${this.state.authorization.id}`, { ...this.state.authorization, status: 'RECHAZADO' });
                window.scrollTo({ top: 0, behavior: 'smooth' });
                this.setState({ alertColor: 'success', isAlertVisible: true, alertMessage: 'Autorización rechazada con éxito' });
            }
        } catch (error) {
            this.handleErrorOnSubmit(error);
        };
    };

    handleErrorOnSubmit = (error) => {
        let message = 'Error al rechazar la autorización: ';
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
        this.setState({ alertColor: 'danger', isAlertVisible: true, alertMessage: message });
    };

    handleChange = (event) => {
        const authorization = { ...this.state.authorization };
        authorization[event.target.name] = event.target.value
        this.setState({ authorization });
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
                        <Form id="authorization-form" className="form-horizontal" onSubmit={this.handleSubmit}>
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
                                    <Label htmlFor="procedure-input">Tipo de procedimiento</Label>
                                </Col>
                                <Col xs="12" md="9">
                                    <Input type="text" id="procedure-input" name="procedure" disabled={true} value={this.state.authorization.type} onChange={this.handleChange} />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md="3">
                                    <Label htmlFor="email-input">Fecha de creación</Label>
                                </Col>
                                <Col xs="12" md="9">
                                    <Input type="text" id="date-created-input" name="date-created" disabled={true} value={new Date(Date.parse(this.state.authorization.created_at)).toLocaleDateString()} onChange={this.handleChange} />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md="3">
                                    <Label htmlFor="select">Creada por</Label>
                                </Col>
                                    <Col xs="12" md="9">
                                        <Input type="text" id="created-by-input" name="created-by" disabled={true} value={`${this.state.authorization.created_by.dni} - ${this.state.authorization.created_by.first_name} ${this.state.authorization.created_by.last_name}`} onChange={this.handleChange} />
                                </Col>
                            </FormGroup>
                            {this.state.authorization.created_for && <FormGroup row>
                                <Col md="3">
                                    <Label htmlFor="select">Creada para</Label>
                                </Col>
                                    <Col xs="12" md="9">
                                        <Input type="text" id="created-for-input" name="created-for" disabled={true} value={`${this.state.authorization.created_for.dni} - ${this.state.authorization.created_for.first_name} ${this.state.authorization.created_for.last_name}`} onChange={this.handleChange} />
                                    </Col>
                            </FormGroup>}
                            <FormGroup row>
                                <Col md="3">
                                    <Label htmlFor="select">Observación</Label>
                                </Col>
                                <Col xs="12" md="9">
                                    <Input type="text" id="note-input" name="note" value={this.state.authorization.note} onChange={this.handleChange} />
                                </Col>
                            </FormGroup>
                        </Form>
                    </CardBody>
                    <CardFooter>
                        <Button type="submit" color="primary" form="authorization-form"><i className="fa fa-dot-circle-o" /> Aprobar</Button>
                        {' '}
                        <Button id="deny" onClick={this.handleDenial} color="danger" form="authorization-form"><i className="fa fa-ban" /> Rechazar</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }
}

export default ViewAuthorization;
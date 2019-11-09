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

class AddAuthorizationType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alertColor: '',
            isAlertVisible: false,
            alertMessage: '',
            type: {
                id: 0,
                title: '',
            }
        };
    }

    handleAlertDismiss = (alertName) => {
        this.setState({ [alertName]: false });
    };

    handleSubmit = async (event) => {
        event.preventDefault();
        event.target.reset();
        try {
            await axios.post(`https://myhealthapp-backend.herokuapp.com/api/authorizations/types`, this.state.type);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.setState({ alertColor: 'success', isAlertVisible: true, alertMessage: 'Tipo de autorización creado con éxito' });
        } catch (error) {
            this.handleErrorOnSubmit(error);
        }
    };

    handleErrorOnSubmit = (error) => {
        let message = 'Error al crear el tipo de autorización: ';
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
        const type = { ...this.state.type };
        type[event.target.name] = event.target.value
        this.setState({ type });
    };

    render() {
        return (
            <div>
                <Alert color={this.state.alertColor} isOpen={this.state.isAlertVisible} name="isAlertVisible" toggle={() => this.handleAlertDismiss("isAlertVisible")}>
                    {this.state.alertMessage}
                </Alert>
                <Card>
                    <CardHeader>
                        <strong>Tipo de Autorización</strong>
                    </CardHeader>
                    <CardBody>
                        <Form id="authorization-type-form" className="form-horizontal" onSubmit={this.handleSubmit}>
                            <FormGroup row>
                                <Col md="3">
                                    <Label htmlFor="text-input">Titulo</Label>
                                </Col>
                                <Col xs="12" md="9">
                                    <Input type="text" id="title-input" placeholder='Implante' name="title" value={this.state.type.title} onChange={this.handleChange} />
                                </Col>
                            </FormGroup>
                        </Form>
                    </CardBody>
                    <CardFooter>
                        <Button type="submit" color="primary" form="authorization-type-form"><i className="fa fa-dot-circle-o" /> Guardar</Button>
                        {' '}
                        <Button type='reset' color="danger" form="authorization-form"><i className="fa fa-ban" /> Cancelar</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }
}

export default AddAuthorizationType;
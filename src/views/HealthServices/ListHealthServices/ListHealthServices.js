import React, { Component } from 'react';
import { Card, CardBody, Pagination, PaginationItem, PaginationLink, Table } from 'reactstrap';
const axios = require('axios');

class ListHealthServices extends Component {
    constructor(props) {
        super(props);
        this.state = {
            services: [],
        }
    }

    componentDidMount = () => {
        this.getServices().then(services => {
            this.setState({ services: services })
        })
    }

    getServices = (offset) => {
        try {
            return axios.get('https://myhealthapp-backend.herokuapp.com/api/health-services').then(response => {
                return response.status === 200 ? response.data : [];
            })
        } catch (error) {
            console.error(error)
        }
    }

    render() {
        return (
            <div className="animated fadeIn">
                <Card>
                    {/* <CardHeader>
                        <i className="fa fa-align-justify"></i> Simple Table
              </CardHeader> */}
                    <CardBody>
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>Plan Minimo</th>
                                    <th>Nombre</th>
                                    <th>Mail</th>
                                    <th>Dirección</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.services.length > 0 && this.state.services.map(service => {
                                    return (< tr key={service.name} >
                                        <td>{service.minimum_plan}</td>
                                        <td>{service.name}</td>
                                        <td>{service.mail}</td>
                                        <td>{service.address}</td>
                                    </tr>)
                                })}
                            </tbody>
                        </Table>
                        <Pagination>
                            <PaginationItem>
                                <PaginationLink previous tag="button"></PaginationLink>
                            </PaginationItem>
                            <PaginationItem active>
                                <PaginationLink tag="button">1</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink tag="button">2</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink tag="button">3</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink tag="button">4</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink next tag="button"></PaginationLink>
                            </PaginationItem>
                        </Pagination>
                    </CardBody>
                </Card>
            </div>
        )
    }
}

export default ListHealthServices;

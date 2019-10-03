import React, { Component } from 'react';
import { Badge, Card, CardBody, Pagination, PaginationItem, PaginationLink, Table } from 'reactstrap';
const axios = require('axios')

class HealthServices extends Component {
    getServices = async () => {
        try {
            return await axios.get('https://myhealthapp-backend.herokuapp.com/api/health-services')
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
                                    <th>ID</th>
                                    <th>Plan Minimo</th>
                                    <th>Nombre</th>
                                    <th>Mail</th>
                                    <th>Dirección</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.getServices().then(hs => {
                                    hs.map(service => {
                                        return < tr >
                                            <td>{service.id}</td>
                                            <td>{service.plan}</td>
                                            <td>{service.name}</td>
                                            <td>{service.mail}</td>
                                            <td>{service.address}</td>
                                        </tr>
                                    })}
                                )})}
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

export default HealthServices;

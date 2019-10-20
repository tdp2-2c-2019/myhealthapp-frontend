import React, { Component } from 'react';
import { Card, CardBody, Pagination, PaginationItem, PaginationLink, Table } from 'reactstrap';
const axios = require('axios');

class ListHealthServices extends Component {
    constructor(props) {
        super(props);
        this.state = {
            services: [],
            currentPage: 0,
            pageSize: 9,
            pagesCount: 0
        }
    }

    componentDidMount = () => {
        this.getServices().then(services => {
            this.setState({ services: services, pagesCount: Math.ceil(services.length / this.state.pageSize) })
        })
    };

    getServices = (offset) => {
        try {
            return axios.get('https://myhealthapp-backend.herokuapp.com/api/health-services').then(response => {
                return response.status === 200 ? response.data : [];
            })
        } catch (error) {
            console.error(error)
        }
    };

    handleClick = (e, index) => {
        e.preventDefault();
        this.setState({ currentPage: index });
    };

    render() {
        const { currentPage, pagesCount, pageSize, services } = this.state;
        return (
            <div className="animated fadeIn">
                <Card>
                    <CardBody>
                        <Table responsive hover>
                            <thead>
                                <tr>
                                    <th>Plan Minimo</th>
                                    <th>Nombre</th>
                                    <th>Mail</th>
                                    <th>Dirección</th>
                                </tr>
                            </thead>
                            <tbody>
                                {services.length > 0 && 
                                    services.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map(service => {
                                    return (
                                        <tr key={service.name} >
                                            <td>{service.minimum_plan}</td>
                                            <td>{service.name}</td>
                                            <td>{service.mail}</td>
                                            <td>{service.address}</td>
                                        </tr>)
                                })}
                            </tbody>
                        </Table>
                        <Pagination>
                            <PaginationItem disabled={currentPage <= 0}>
                                <PaginationLink href="#" previous tag="button" onClick={e => this.handleClick(e, currentPage - 1)} />
                            </PaginationItem>
                                {[...Array(pagesCount)].map((page, i) => 
                                    <PaginationItem active={i === currentPage} key={i}>
                                        <PaginationLink onClick={e => this.handleClick(e, i)} href="#">
                                            {i + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                )}
                            <PaginationItem disabled={currentPage >= pagesCount - 1}>
                                <PaginationLink href="#" next tag="button" onClick={e => this.handleClick(e, currentPage + 1)} />
                            </PaginationItem>
                        </Pagination>
                    </CardBody>
                </Card>
            </div>
        )
    }
}

export default ListHealthServices;

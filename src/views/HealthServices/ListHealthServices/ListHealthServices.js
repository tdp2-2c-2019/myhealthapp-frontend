import React, { Component } from 'react';
import { Alert, Button, Card, CardBody, Pagination, PaginationItem, PaginationLink, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
const axios = require('axios');

class ListHealthServices extends Component {
    constructor(props) {
        super(props);
        this.state = {
            services: [],
            currentPage: 0,
            pageSize: 9,
            pagesCount: 0,
            isFailAlertVisible: false,
            failAlertMessage: '',
        }
    }

    componentDidMount = () => {
        this.getServices().then(services => {
            this.setState({ services: services, pagesCount: Math.ceil(services.length / this.state.pageSize) })
        })
    };

    getServices = (offset) => {
        return axios.get('https://myhealthapp-backend.herokuapp.com/api/health-services').then(response => {
            if (response.status === 200) {
                return response.data;
            } else {
                this.setState({ isFailAlertVisible: true, failAlertMessage: 'No pudo establecerse una conexión con el servidor, intente más tarde.' })
                return [];
            }
        }).catch(e => {
            this.setState({ isFailAlertVisible: true, failAlertMessage: 'No pudo establecerse una conexión con el servidor, intente más tarde.' })
            return [];
        })
    };

    handleAlertDismiss = (alertName) => {
        this.setState({ [alertName]: false });
    };

    handleClick = (e, index) => {
        e.preventDefault();
        this.setState({ currentPage: index });
    };

    render() {
        const { currentPage, pagesCount, pageSize, services } = this.state;
        return (
            
            <div className="animated fadeIn">
                <Alert color="danger" isOpen={this.state.isFailAlertVisible} name="isFailAlertVisible" toggle={() => this.handleAlertDismiss("isFailAlertVisible")}>
                    {this.state.failAlertMessage}
                </Alert>
                <Card>
                    <CardBody>
                        <Table responsive hover>
                            <thead>
                                <tr>
                                    <th>Plan Minimo</th>
                                    <th>Nombre</th>
                                    <th>Mail</th>
                                    <th>Dirección</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {services.length > 0 && 
                                    services.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map(service => {                                        
                                    return (
                                            <tr key={service.name}>
                                                <td>{service.minimum_plan}</td>
                                                <td>{service.name}</td>
                                                <td>{service.mail}</td>
                                                <td>{service.address}</td>
                                            <td>{<Link to={service.health_center ? `/hospitals/${service.id}` : `/doctors/${service.id}`}>
                                                <Button color="link" tabIndex={-1}>Ver detalle</Button>
                                            </Link>}</td>
                                            </tr>
)
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

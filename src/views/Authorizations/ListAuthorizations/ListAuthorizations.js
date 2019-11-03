import React, { Component } from 'react';
import { Alert, Badge, Button, Card, CardBody, Pagination, PaginationItem, PaginationLink, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
const axios = require('axios');

class ListAuthorizations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authorizations: [],
            currentPage: 0,
            pageSize: 9,
            pagesCount: 0,
            isFailAlertVisible: false,
            failAlertMessage: '',
        }
    }

    componentDidMount = () => {
        this.getAuthorizations().then(authorizations => {
            this.setState({ authorizations, pagesCount: Math.ceil(authorizations.length / this.state.pageSize) })
        })
    };

    getAuthorizations = (offset) => {
        return axios.get('https://myhealthapp-backend.herokuapp.com/api/authorizations').then(response => {            
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

    getBadgeColor = (status) => {
        switch (status) {
            case 'RECHAZADO':
                return 'danger';        
            case 'APROBADO':
                return 'success';
            default:
                return 'light';
        }
    }

    render() {
        const { currentPage, pagesCount, pageSize, authorizations } = this.state;
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
                                    <th>ID</th>
                                    <th>Título</th>
                                    <th>Creada por</th>
                                    <th>Creada para</th>
                                    <th>Fecha de creación</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {authorizations.length > 0 &&
                                    authorizations.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map(authorization => {
                                        return (
                                            <tr key={authorization.id}>
                                                <td>{authorization.id}</td>
                                                <td>{authorization.title}</td>
                                                <td>{authorization.created_by.dni}</td>
                                                <td>{authorization.created_for ? authorization.created_by.dni : ""}</td>
                                                <td>{new Date(Date.parse(authorization.created_at)).toLocaleDateString()}</td>
                                                <td>{<Badge color={this.getBadgeColor(authorization.status)}>{authorization.status}</Badge>}</td>
                                                <td>{<Link to={`/authorizations/${authorization.id}`}>
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

export default ListAuthorizations;

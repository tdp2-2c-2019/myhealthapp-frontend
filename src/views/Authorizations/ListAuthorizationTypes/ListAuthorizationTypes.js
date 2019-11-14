import React, { Component } from 'react';
import { Alert, Button, Card, CardBody, Pagination, PaginationItem, PaginationLink, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
const axios = require('axios');

class ListAuthorizationTypes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            types: [],
            currentPage: 0,
            pageSize: 9,
            pagesCount: 0,
            isFailAlertVisible: false,
            failAlertMessage: '',
        }
    }

    componentDidMount = () => {
        this.getAuthorizationTypes().then(types => {
            this.setState({ types, pagesCount: Math.ceil(types.length / this.state.pageSize) })
        })
    };

    getAuthorizationTypes = (offset) => {
        return axios.get('https://myhealthapp-backend.herokuapp.com/api/authorizations/types').then(response => {
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
        const { currentPage, pagesCount, pageSize, types } = this.state;
        return (

            <div className="animated fadeIn">
                <Link to='/authorizations/types/new'>
                    <Button color="primary" tabIndex={-1}>Nuevo </Button>
                </Link>
                <Alert color="danger" isOpen={this.state.isFailAlertVisible} name="isFailAlertVisible" toggle={() => this.handleAlertDismiss("isFailAlertVisible")}>
                    {this.state.failAlertMessage}
                </Alert>
                <Card>
                    <CardBody>
                        <Table responsive hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tipo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {types.length > 0 &&
                                    types.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map(type => {
                                        return (
                                            <tr key={type.id}>
                                                <td>{type.id}</td>
                                                <td>{type.title}</td>
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

export default ListAuthorizationTypes;

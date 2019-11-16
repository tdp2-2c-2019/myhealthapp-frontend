import React, { Component } from 'react';
import {
  CardColumns,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardSubtitle
} from 'reactstrap';
import {
  Line, Pie,
} from 'react-chartjs-2';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

const axios = require("axios");

const options = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips,
  },
  maintainAspectRatio: false,
};

class Metrics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authorized_count_per_day: [],
      rejected_count_per_day: [],
      counts_by_plan: [],
      automatic_approved_count: 0,
      manual_approved_count: 0,
    }
  }

  getLine = () => {
    const line = {
      labels: this.state.authorized_count_per_day.map(acpd => new Date(acpd.date).toLocaleDateString()),
      datasets: [
        {
          label: "Aprobadas",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: this.state.authorized_count_per_day.map(acpd => acpd.status_count)
        },
        {
          label: "Rechazadas",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "#FF6384",
          borderColor: "#FF6384",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "#FF6384",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "#FF6384",
          pointHoverBorderColor: "#FF6384",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: this.state.rejected_count_per_day.map(rcpd => rcpd.status_count)
        }
      ]
    }
    return line;
  }

  getPie= () => {    
    const pie = {
      labels: [
        'Plan 1',
        'Plan 2',
        'Plan 3',
      ],
      datasets: [
        {
          data: this.state.counts_by_plan.map(cbp => cbp.count),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
          ],
          hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
          ],
        }],
    };
    return pie;
  }

  componentDidMount() {
    this.getAffiliatesData();
    this.getAuthorizationsData();
  }

  getAffiliatesData = async () => {
    try {
      const affiliateReq = await axios.get('https://myhealthapp-backend.herokuapp.com/api/charts/affiliates');
      affiliateReq.status === 200 ?
      this.setState({ counts_by_plan: affiliateReq.data }) : 
      this.setState({ alertColor: 'danger', isAlertVisible: true, alertMessage: 'No pudo establecerse una conexión con el servidor, intente más tarde.' });
    } catch (error) {
      this.setState({ alertColor: 'danger', isAlertVisible: true, alertMessage: 'No pudo establecerse una conexión con el servidor, intente más tarde.' });
    }
  }

  getAuthorizationsData = async () => {
    try {
      const authorizationsReq = await axios.get('https://myhealthapp-backend.herokuapp.com/api/charts/authorizations');
      authorizationsReq.status === 200
        ? this.setState({...authorizationsReq.data})
        : this.setState({
            alertColor: "danger",
            isAlertVisible: true,
            alertMessage:
              "No pudo establecerse una conexión con el servidor, intente más tarde."
          });
    } catch (error) {
      this.setState({ alertColor: 'danger', isAlertVisible: true, alertMessage: 'No pudo establecerse una conexión con el servidor, intente más tarde.' });
    }
  }

  render() {
    return (
      <div className="animated fadeIn">
        <CardColumns className="cols-2">
          <Card>
            <CardHeader>
              Autorizaciones
            </CardHeader>
            <CardBody>
              <div className="chart-wrapper">
                <Line data={this.getLine()} /*options={options}*/ />
              </div>
              <CardFooter>
                <CardSubtitle style={{paddingBottom: '5px'}}>Automáticas: {this.state.automatic_approved_count}</CardSubtitle>
                <CardSubtitle style={{ paddingBottom: '5px' }}>Manuales: {this.state.manual_approved_count}</CardSubtitle>
                <CardSubtitle>Total: {parseInt(this.state.manual_approved_count) + parseInt(this.state.automatic_approved_count)}</CardSubtitle>
              </CardFooter>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              Afiliados
            </CardHeader>
            <CardBody>
              <div className="chart-wrapper">
                <Pie data={this.getPie()} />
              </div>
              <CardFooter>
                <CardSubtitle>Total: {this.state.counts_by_plan.reduce((total, cbp) => {return total + parseInt(cbp.count)}, 0)}</CardSubtitle>
              </CardFooter>
            </CardBody>
          </Card>
        </CardColumns>
      </div>
    );
  }
}

export default Metrics;

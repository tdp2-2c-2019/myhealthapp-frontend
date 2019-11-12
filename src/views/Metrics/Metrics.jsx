import React, { Component } from 'react';
import {
  CardColumns,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from 'reactstrap';
import {
  Line, Pie,
} from 'react-chartjs-2';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';


const pie = {
  labels: [
    'Red',
    'Green',
    'Yellow',
  ],
  datasets: [
    {
      data: [300, 50, 100],
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

const line = {
  labels: [...Array(30 + 1).keys()].slice(1),
  datasets: [
    {
      label: "My First dataset",
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
      data: [65, 59, 80, 81, 56, 55, 40]
    }
  ]
};

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
  }

  getAffiliateData = () => {}

  getAuthorizationsData = () => {}

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
                <Line data={line} /*options={options}*/ />
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
                        Afiliados
            </CardHeader>
            <CardBody>
              <div className="chart-wrapper">
                <Pie data={pie} />
              </div>
            </CardBody>
          </Card>
        </CardColumns>
      </div>
    );
  }
}

export default Metrics;

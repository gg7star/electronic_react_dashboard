import React, { Component, PropTypes } from 'react';
import {
  Line as LineChart,
  Bar as BarChart,
  Radar as RadarChart,
  PolarArea as PolarAreaChart,
  Pie as PieChart,
  Doughnut as DoughnutChart
} from 'react-chartjs';

import Paper from 'material-ui/Paper';

const styles = {
  container: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
  }
};

export default class Sales extends Component {
  static propTypes = {
  }

  render() {
    const {
      props: {
        activities,
      },
      state,
    } = this;
    const data = {
      labels: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      datasets: [
        {
          data: Object.keys(activities)
            .map((dayMonth) => Object.keys(activities[dayMonth])
              .filter((timestamp) => !activities[dayMonth][timestamp].changedCartTime)
              .map((timestamp) => activities[dayMonth][timestamp].cart.slice(0, 7)).length),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
          ],
          hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
          ]
        }]
    };
    console.log(Object.keys(activities)
    .map((dayMonth) => Object.keys(activities[dayMonth]).map((timestamp) => activities[dayMonth][timestamp].cart.slice(0, 7)).length));

    return (
      <div>
        <Paper style={styles.container}>
          <LineChart data={data} width="800" height="600" />
        </Paper>
      </div>
    );
  }
}

import React, { useContext, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useStateContext } from '../../../context/ContextProvider'

const BarChart = () => {
    const { statquestion, question } = useStateContext();
  
    useEffect(() => {
      statquestion();
    }, []);
  
    const idModulesArray = question.map((obj) => obj.id_module);
    const totalquestion = question.map((obj) => obj.total_questions);
  
    const chartData = {
      options: {
        chart: {
          type: 'bar',
        },
        dataLabels: {
          enabled: true,
        },
        legend: {
          show: true,
          position: 'bottom',
          horizontalAlign: 'center',
        },
        title: {
          text: 'Nombre de questions par test',
          align: 'center',
          margin: 10,
          offsetY: 0,
          style: {
            fontSize: '20px',
            fontWeight: 'bold',
          },
        },
        xaxis: {
          categories: idModulesArray,
        },
        yaxis: {
          title: {
            text: 'Nombre de questions',
          },
        },
      },
      series: [
        {
          name: 'Nombre de questions',
          data: totalquestion,
        },
      ],
    };
  
    return (
      <div
        style={{
          backgroundColor: '#F7F9FB',
          width: '100%',
          height: '273px',
          marginTop: '32px',
          borderRadius: '10px ',
        }}
      >
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={300}
        />
      </div>
    );
  };
  
  export default BarChart;
import { Text } from '@chakra-ui/react';
import Chart from 'react-apexcharts'

const DonutChart = ({title, data}) => {
  return (
    <div>
        <Text fontSize={20}>{title}</Text>
        <Chart options={data.options} series={data.series} type="donut" width="380" />
    </div>
    
  )
}

export default DonutChart
import { Text } from '@chakra-ui/react';
import Chart from 'react-apexcharts'

const BarChart = ({title, data}) => {
  return (
    <div>
        <Text fontSize={20}>{title}</Text>
        <Chart options={data.options} series={data.series} type="bar"  height={"350"} />
    </div>
  )
}

export default BarChart
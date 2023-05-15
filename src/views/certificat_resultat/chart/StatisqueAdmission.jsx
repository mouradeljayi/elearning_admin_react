import ReactApexChart from "react-apexcharts";
import { useState, useEffect } from "react";
import axiosClient from "../../../axios-client";

function PieChart() {
  const [admission, setAdmission] = useState({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    axiosClient
      .get("/resultat/get_valider_percentage/")
      .then(({ data }) => {
        setAdmission(data);
        setReady(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const PieChart = {
    series: [admission.true_count, admission.false_count],
    options: {
      chart: {
        type: "pie",
      },
      labels: ["Admis", "Non Admis"],
      colors: ["#23E6A4", "#FF0000"], // green and red colors
      legend: {
        position: "bottom",
      },
      title: {
        text: "Pourcentage de reussite et d'echec",
        align: "center",
        style: {
          fontSize: 10,
        },
      },
    },
  };

  return (
    <div id="chart" style={{ width: "100%", height: "100%" }}>
      {ready && (
        <ReactApexChart
          options={PieChart.options}
          series={PieChart.series}
          type="pie"
          height={350}
        />
      )}
    </div>
  );
}

export default PieChart;

import ReactApexChart from "react-apexcharts";
import { useState, useEffect } from "react";
import axiosClient from "../../../axios-client";

function Moyenne() {
  const [count, setCount] = useState({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    axiosClient
      .get("/resultat/get_module_average_results/")
      .then(({ data }) => {
        setCount(data.module_results);
        setReady(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Create an array for each count type
  const moduleName = [];
  const moduleAverage = [];

  for (let i = 0; i < count.length; i++) {
    moduleName.push(count[i].module);
    moduleAverage.push(count[i].average_result);
  }

  const barre = {
    series: [
      {
        data: moduleAverage,
      },
    ],
    options: {
      chart: {
        type: "bar",
        events: {
          click: function (chart, w, e) {
            // console.log(chart, w, e)
          },
        },
      },
      plotOptions: {
        bar: {
          columnWidth: "45%",
          distributed: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      xaxis: {
        categories: moduleName,
        title: {
          text: "Module",
        },
        labels: {
          style: {
            fontSize: "12px",
          },
        },
      },
      yaxis: {
        title: {
          text: "Moyenne du score",
        },
      },
      title: {
        text: "Note Moyenne des tests par module",
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
          options={barre.options}
          series={barre.series}
          width="100%"
          type="bar"
          height={350}
        />
      )}
    </div>
  );
}
export default Moyenne;

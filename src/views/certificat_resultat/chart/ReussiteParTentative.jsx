import ReactApexChart from "react-apexcharts";
import { useState, useEffect } from "react";
import axiosClient from "../../../axios-client";

function Users() {
  const [count, setCount] = useState({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    axiosClient
      .get("/resultat/get_tentative_counts/")
      .then(({ data }) => {
        console.log("tentaiveeeeeeeeeeeeeeeeeeeeeee: ", data);
        setCount(data.counts);
        setReady(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Create an array for each count type
  const tentativeCounts = [];
  const trueCounts = [];
  const falseCounts = [];

  // Loop through the data and populate the count arrays
  for (let i = 0; i < count.length; i++) {
    tentativeCounts.push(count[i].tentative);
    trueCounts.push(count[i].true_counts);
    falseCounts.push(count[i].false_counts);
  }
  console.log(falseCounts);

  const barre = {
    series: [
      {
        name: "Admis",
        data: trueCounts,
      },
      {
        name: "Non Admis",
        data: falseCounts,
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: tentativeCounts,
        title: {
          text: "nombre de tentative",
        },
      },
      yaxis: {
        title: {
          text: "Total",
        },
      },
      fill: {
        opacity: 1,
        colors: ["#23E6A4", "#FF0000"], // green and red colors
      },
      colors: ["#23E6A4", "#FF4560"], // set the colors of the legend

      title: {
        text: "Admis et Non Admis par tentative",
        align: "center",
        style: {
          fontSize: 10,
        },
      },
      // legend: {
      //   position: 'right'
      // },
    },
  };

  return (
    <div id="chart" style={{ width: "100%", height: "100%" }}>
      {ready && (
        <ReactApexChart
          options={barre.options}
          series={barre.series}
          type="bar"
          height={350}
        />
      )}
    </div>
  );
}

export default Users;

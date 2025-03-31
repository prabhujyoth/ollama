import React, { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { TIME_SERIES_URL } from "../api_url/apis";
export default function Stocks() {
  const [chartsData, setChartsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(TIME_SERIES_URL);
        const data = await response.json(); // Await here!
        const timeSeries = data["Time Series (Daily)"];

        if (timeSeries) {
          const transformedData = Object.keys(timeSeries)
            .map((date) => ({
              time: date,
              price: parseFloat(timeSeries[date]["4. close"]),
            }))
            .reverse(); // Reverse for chronological order

          setChartsData(transformedData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Add dependency array to run only once

  return (
    <div>
      <LineChart
        xAxis={[
          { data: chartsData.map((item) => item.time), scaleType: "point" },
        ]}
        series={[
          {
            data: chartsData.map((item) => item.price),
            label: "Closing Price",
          },
        ]}
        width={1600}
        height={800}
      />
    </div>
  );
}

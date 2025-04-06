import React, { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { TIME_SERIES_URL } from "../api_url/apis";
import { TOP_GAINERS_LOSERS } from "../api_url/apis";
import { Text, Paper, Title, Tabs, Table } from "@mantine/core";
import app_icon from "../assets/apple-logo.png";
import tesla_icon from "../assets/tesla.png";
import microsoft_icon from "../assets/microsoft.png";
import amazon_icon from "../assets/amazon.png";
import zillow_icon from "../assets/zillow.png";
import twilio_icon from "../assets/twilio.png";
import draftking from "../assets/draft_king.png";
import vevva_icon from "../assets/veeva.svg";
import bluebrid from "../assets/bluebrid.png";
import plugpower from "../assets/plug-logo.svg";
import inovio from "../assets/inovio.jpg";
import carvana from "../assets/car.svg";

export default function Stocks() {
  const [chartsData, setChartsData] = useState([]);
  const [topGainersData, setTopGainersData] = useState([]);
  const [topLosersData, setTopLosersData] = useState([]);
  const [topActiveData, setTopActiveData] = useState([]);
  const [ticker, setTicker] = useState("");

  useEffect(() => {
    const fetchGainersData = async () => {
      const response = await fetch(TOP_GAINERS_LOSERS);
      const data = await response.json();
      const topGainers = data["top_gainers"];
      const topLosers = data["top_losers"];
      const topActive = data["most_actively_traded"];
      setTopGainersData(topGainers);
      setTopLosersData(topLosers);
      setTopActiveData(topActive);
    };
    fetchGainersData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${TIME_SERIES_URL}${ticker}`);
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
    if (ticker) {
      fetchData();
    }
  }, [ticker]);

  function handleTickerUpdate(ticker) {
    if (ticker) {
      setTicker(ticker);
    }
  }
  const topGainersrows = topGainersData.map((element) => (
    <Table.Tr
      key={element.ticker}
      onClick={() => handleTickerUpdate(element.ticker)}
    >
      <Table.Td>{element.ticker}</Table.Td>
      <Table.Td>{element.price}</Table.Td>
      <Table.Td>
        <span
          className={
            Number(element.change_amount) < 0
              ? "text-red-400"
              : "text-green-400"
          }
        >
          {element.change_amount}
        </span>
      </Table.Td>
      <Table.Td>{element.change_percentage}</Table.Td>
      <Table.Td>{element.volume}</Table.Td>
    </Table.Tr>
  ));

  const topLosersRows = topLosersData.map((element) => (
    <Table.Tr
      key={element.ticker}
      onClick={() => handleTickerUpdate(element.ticker)}
    >
      <Table.Td>{element.ticker}</Table.Td>
      <Table.Td>{element.price}</Table.Td>
      <Table.Td>
        <span
          className={
            Number(element.change_amount) < 0
              ? "text-red-400"
              : "text-green-400"
          }
        >
          {element.change_amount}
        </span>
      </Table.Td>
      <Table.Td>{element.change_percentage}</Table.Td>
      <Table.Td>{element.volume}</Table.Td>
    </Table.Tr>
  ));

  const topActiveRows = topActiveData.map((element) => (
    <Table.Tr
      key={element.ticker}
      onClick={() => handleTickerUpdate(element.ticker)}
    >
      <Table.Td>{element.ticker}</Table.Td>
      <Table.Td>{element.price}</Table.Td>
      <Table.Td>
        <span
          className={
            Number(element.change_amount) < 0
              ? "text-red-400"
              : "text-green-400"
          }
        >
          {element.change_amount}
        </span>
      </Table.Td>
      <Table.Td>{element.change_percentage}</Table.Td>
      <Table.Td>{element.volume}</Table.Td>
    </Table.Tr>
  ));

  // Add dependency array to run only once
  const [activeTab, setActiveTab] = useState("first");
  return (
    <div className="p-4 h-full">
      <div className="flex flex-row gap-4 h-3/4">
        <Paper shadow="xs" p="xl" className="flex-1">
          <Title order={2} className="pb-2">
            {ticker}
          </Title>
          <LineChart
            xAxis={[
              {
                data: chartsData.map((item) => item.time),
                scaleType: "point",
                sx: {
                  ".MuiChartsAxis-tickLabel": { fill: "white" },
                  ".MuiChartsAxis-label": { fill: "white" },
                },
                axisLine: { stroke: "white" },
                tickLabelStyle: { fill: "white" },
              },
            ]}
            yAxis={[
              {
                sx: {
                  // Y axis label and ticks
                  ".MuiChartsAxis-tickLabel": { fill: "white" },
                  ".MuiChartsAxis-label": { fill: "white" },
                },
                axisLine: { stroke: "white" },
                tickLabelStyle: { fill: "white" },
              },
            ]}
            series={[
              {
                data: chartsData.map((item) => item.price),
                label: "Closing Price",
                showMark: false,
              },
            ]}
            sx={{
              ".MuiChartsAxis-line": {
                stroke: "white",
              },
              ".MuiChartsLegend-root": {
                color: "white",
              },
              ".MuiChartsLegend-series": {
                fill: "white",
              },
              ".MuiChartsAxis-tickLabel": {
                fill: "white",
              },
            }}
            width={800}
            height={550}
          />
        </Paper>
        <Paper shadow="xs" p="xl" className="flex-1">
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List>
              <Tabs.Tab value="first">Top Gainers</Tabs.Tab>
              <Tabs.Tab value="second">Top Losers</Tabs.Tab>
              <Tabs.Tab value="third">Mostly Actively Traded</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="first">
              <Table
                className="w-full"
                striped
                highlightOnHover
                withTableBorder
                withColumnBorders
              >
                <Table.Thead className="w-full">
                  <Table.Tr className="w-full">
                    <Table.Th>Ticker</Table.Th>
                    <Table.Th>Price</Table.Th>
                    <Table.Th>Change Amount</Table.Th>
                    <Table.Th>Change Percentage</Table.Th>
                    <Table.Th>Volume</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody className="w-full">{topGainersrows}</Table.Tbody>
              </Table>
            </Tabs.Panel>
            <Tabs.Panel value="second">
              <Table
                className="w-full"
                striped
                highlightOnHover
                withTableBorder
                withColumnBorders
              >
                <Table.Thead className="w-full">
                  <Table.Tr className="w-full">
                    <Table.Th>Ticker</Table.Th>
                    <Table.Th>Price</Table.Th>
                    <Table.Th>Change Amount</Table.Th>
                    <Table.Th>Change Percentage</Table.Th>
                    <Table.Th>Volume</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody className="w-full">{topLosersRows}</Table.Tbody>
              </Table>
            </Tabs.Panel>
            <Tabs.Panel value="third">
              <Table
                className="w-full"
                striped
                highlightOnHover
                withTableBorder
                withColumnBorders
              >
                <Table.Thead className="w-full">
                  <Table.Tr className="w-full">
                    <Table.Th>Ticker</Table.Th>
                    <Table.Th>Price</Table.Th>
                    <Table.Th>Change Amount</Table.Th>
                    <Table.Th>Change Percentage</Table.Th>
                    <Table.Th>Volume</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody className="w-full">{topActiveRows}</Table.Tbody>
              </Table>
            </Tabs.Panel>
          </Tabs>
        </Paper>
      </div>
      <div className="flex flex-row gap-4 pt-4">
        <Paper shadow="xs" p="xl" className="flex-1">
          <Title order={2} className="pb-2">
            High Cap
          </Title>
          <div className="flex gap-2">
            <div
              onClick={() => handleTickerUpdate("AAPL")}
              className="card cursor-pointer flex justify-center items-center"
            >
              <img src={app_icon} className="h-[60%]" alt="" />
            </div>
            <div
              className="card cursor-pointer flex justify-center items-center"
              onClick={() => handleTickerUpdate("MSFT")}
            >
              <img src={microsoft_icon} className="h-[60%]" alt="" />
            </div>
            <div
              className="card cursor-pointer flex justify-center items-center"
              onClick={() => handleTickerUpdate("AMZN")}
            >
              <img src={amazon_icon} className="h-[60%]" alt="" />
            </div>
            <div
              className="card cursor-pointer flex justify-center items-center"
              onClick={() => handleTickerUpdate("TSLA")}
            >
              <img src={tesla_icon} className="h-[60%]" alt="" />
            </div>
          </div>
        </Paper>
        <Paper shadow="xs" p="xl" className="flex-1">
          <Title order={2} className="pb-2">
            Mid Cap
          </Title>
          <div className="flex gap-2">
            <div
              onClick={() => handleTickerUpdate("Z")}
              className="card cursor-pointer flex justify-center items-center"
            >
              <img src={zillow_icon} className="h-[60%]" alt="" />
            </div>
            <div
              className="card cursor-pointer flex justify-center items-center"
              onClick={() => handleTickerUpdate("TWLO")}
            >
              <img src={twilio_icon} className="h-[60%]" alt="" />
            </div>
            <div
              className="card cursor-pointer flex justify-center items-center"
              onClick={() => handleTickerUpdate("DKNG")}
            >
              <img src={draftking} className="h-[60%]" alt="" />
            </div>
            <div
              className="card cursor-pointer flex justify-center items-center"
              onClick={() => handleTickerUpdate("VEEV")}
            >
              <img src={vevva_icon} className="h-[60%]" alt="" />
            </div>
          </div>
        </Paper>
        <Paper shadow="xs" p="xl" className="flex-1">
          <Title order={2} className="pb-2">
            Low Cap
          </Title>
          <div className="flex gap-2">
            <div
              onClick={() => handleTickerUpdate("BLUE")}
              className="card cursor-pointer flex justify-center items-center"
            >
              <img src={bluebrid} className="h-[60%]" alt="" />
            </div>
            <div
              className="card cursor-pointer flex justify-center items-center"
              onClick={() => handleTickerUpdate("PLUG")}
            >
              <img src={plugpower} className="h-[60%]" alt="" />
            </div>
            <div
              className="card cursor-pointer flex justify-center items-center"
              onClick={() => handleTickerUpdate("INO")}
            >
              <img src={inovio} className="h-[60%]" alt="" />
            </div>
            <div
              className="card cursor-pointer flex justify-center items-center"
              onClick={() => handleTickerUpdate("CVNA")}
            >
              <img src={carvana} className="h-[60%]" alt="" />
            </div>
          </div>
        </Paper>
      </div>
    </div>
  );
}

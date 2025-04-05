import React, { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { TIME_SERIES_URL } from "../api_url/apis";
import { TOP_GAINERS_LOSERS } from "../api_url/apis";
import { Text, Paper, Title, Tabs, Table } from "@mantine/core";
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
            <LineChart
              xAxis={[
                {
                  data: chartsData.map((item) => item.time),
                  scaleType: "point",
                  sx: {
                    ".MuiChartsAxis-tickLabel": { fill: "white" },
                    ".MuiChartsAxis-label": { fill: "white" },
                  },
                },
              ]}
              yAxis={[
                {
                  sx: {
                    // Y axis label and ticks
                    ".MuiChartsAxis-tickLabel": { fill: "white" },
                    ".MuiChartsAxis-label": { fill: "white" },
                  },
                },
              ]}
              series={[
                {
                  data: chartsData.map((item) => item.price),
                  label: "Closing Price",
                  showMark: false,
                },
              ]}
              width={800}
              height={550}
            />
          </Title>
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
          <Paper shadow="md" radius="md" withBorder p="xl">
            <Text>Company</Text>
          </Paper>
        </Paper>
        <Paper shadow="xs" p="xl" className="flex-1">
          <Title order={2} className="pb-2">
            Mid Cap
          </Title>
          <Paper shadow="md" radius="md" withBorder p="xl">
            <Text>Company</Text>
          </Paper>
        </Paper>
        <Paper shadow="xs" p="xl" className="flex-1">
          <Title order={2} className="pb-2">
            Low Cap
          </Title>
          <Paper shadow="md" radius="md" withBorder p="xl">
            <Text>Company</Text>
          </Paper>
        </Paper>
      </div>
    </div>
  );
}

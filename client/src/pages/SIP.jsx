import { DonutChart } from "@mantine/charts";
import { NumberInput, TextInput, Title } from "@mantine/core";
import React, { useEffect, useState } from "react";

export default function SIP() {
  const [salary, setSalary] = useState(0);
  const [spiValue, setSpiValue] = useState(0);
  const [chartData, setChartData] = useState([]);

  const needsAmount = ((50 / 100) * salary).toFixed(2);
  const wantsAmount = ((30 / 100) * salary).toFixed(2);
  const investmentAmount = ((20 / 100) * salary).toFixed(2);

  const [sipCalculator, setSipCalculator] = useState({
    totalInvestment: 0,
    expectedReturnRate: 12,
    timePeriod: 10,
  });

  const handleSipUpdate = (value, field) => {
    setSipCalculator((prev) => ({
      ...prev,
      [field]: value || 0, // Ensures a default value instead of undefined
    }));
  };

  useEffect(() => {
    const updatedData = [
      {
        name: "Invested Amount",
        value: sipCalculator.totalInvestment * 12 * sipCalculator.timePeriod,

        color: "yellow.6",
      },
      {
        name: "Estimated Returns",
        value:
          spiValue -
          sipCalculator.totalInvestment * 12 * sipCalculator.timePeriod,
        color: "indigo.6",
      },
    ];

    setChartData(updatedData);
  }, [sipCalculator, spiValue]);

  useEffect(() => {
    function calculateSIP(sipCalculator) {
      let months = sipCalculator.timePeriod * 12;
      let r = sipCalculator.expectedReturnRate / 100 / 12;
      let fv =
        sipCalculator.totalInvestment *
        ((Math.pow(1 + r, months) - 1) / r) *
        (1 + r);
      setSpiValue(fv);
    }

    calculateSIP(sipCalculator);
  }, [sipCalculator]);

  useEffect(() => {
    setSipCalculator({
      totalInvestment: investmentAmount,
      expectedReturnRate: 12,
      timePeriod: 10,
    });
  }, [investmentAmount]);
  return (
    <div className="flex flex-col lg:flex-row md:flex-row sm:flex-col p-6 h-full gap-5">
      <div className="flex border rounded p-4 border-neutral-600 flex-col w-full lg:w-1/4 md:w-1/4 sm:w-full ">
        {/* 💡 Your salary is split as follows */}
        <Title order={2}>Budgeting</Title>

        <div className="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-1 sm:grid-cols-1 gap-4">
          <div>
            <NumberInput
              label="Enter your salary"
              value={salary}
              onChange={setSalary}
              placeholder="i.e, 20,000"
            />
          </div>
          <div>
            <TextInput label="📌 Needs (50%) " value={needsAmount} readOnly />
          </div>
          <div>
            <TextInput label="🎉 Wants (30%)" value={wantsAmount} readOnly />
          </div>
          <div>
            <TextInput
              label="📈 Investments (20%) "
              value={investmentAmount}
              readOnly
            />
          </div>
        </div>
      </div>
      <div className="chart-section border rounded p-4 border-neutral-600 flex-1 w-full lg:w-1/4 md:w-1/4 sm:w-full h-full flex">
        <div className="left flex flex-col w-full">
          <Title order={2}>SIP Calculator</Title>
          <div className="grid grid-cols-2 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 gap-4">
            <NumberInput
              label="Total Investment"
              id="totalInvestment"
              value={sipCalculator.totalInvestment}
              onChange={(value) => handleSipUpdate(value, "totalInvestment")}
              placeholder="i.e, 20,000"
            />
            <NumberInput
              label="Return rate (p.a)"
              id="expectedReturnRate"
              value={sipCalculator.expectedReturnRate}
              onChange={(value) => handleSipUpdate(value, "expectedReturnRate")}
              placeholder="i.e, 12%"
            />
            <NumberInput
              id="timePeriod"
              label="Time Period"
              value={sipCalculator.timePeriod}
              onChange={(value) => handleSipUpdate(value, "timePeriod")}
              placeholder="i.e, 1 Yr"
            />
          </div>
          <div className="flex flex-col lg:flex-row md:flex-row sm:flex-col">
            <div className="right p-4 overflow-hidden">
              <div className="w-56 h-56">
                <DonutChart
                  data={chartData}
                  size={145}
                  thickness={30}
                  className="w-56 h-56"
                  options={{
                    plugins: {
                      legend: {
                        display: true,
                        position: "right",
                        labels: {
                          boxWidth: 10,
                          padding: 5,
                          fontSize: 12,
                        },
                        onHover: null, // Disables hover effect on legend
                      },
                    },
                  }}
                />
              </div>

              {isNaN(spiValue) || (
                <>
                  <div className="flex gap-2 items-center">
                    <div className="circle-legend bg-amber-300"></div>
                    <label htmlFor="">Total Investment</label>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="circle-legend bg-blue-500"></div>
                    <label htmlFor="">Estimated Returns</label>
                  </div>
                </>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 content-center">
              <label htmlFor="" className="text-md">
                Total Investment:{" "}
              </label>
              <label className="font-bold text-xl">
                {isNaN(
                  sipCalculator.totalInvestment || sipCalculator.timePeriod
                )
                  ? `Rs. 0.00`
                  : `Rs. ${(
                      sipCalculator.totalInvestment *
                      12 *
                      sipCalculator.timePeriod
                    ).toFixed(2)}`}{" "}
              </label>
              <label htmlFor="" className="text-md">
                Estimated Returns:{" "}
              </label>
              <label className="font-bold text-xl">
                {isNaN(spiValue)
                  ? `Rs. 0`
                  : `Rs. ${(
                      spiValue -
                      sipCalculator.totalInvestment *
                        12 *
                        sipCalculator.timePeriod
                    ).toFixed(2)}`}{" "}
              </label>
              <hr className="col-span-2" />
              <label htmlFor="" className="text-md">
                Total Value:{" "}
              </label>
              <label className="font-bold text-xl">
                {isNaN(spiValue) ? `Rs. 0.00` : `Rs. ${spiValue.toFixed(2)}`}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

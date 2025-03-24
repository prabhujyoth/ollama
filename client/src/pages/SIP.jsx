import { DonutChart } from "@mantine/charts";
import { NumberInput, TextInput, Title } from "@mantine/core";
import React, { useEffect, useState } from "react";

export default function SIP() {
  const [salary, setSalary] = useState(0);
  const [spiValue, setSpiValue] = useState(0);

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

  const data = [
    {
      name: "Invested Amount",
      value: sipCalculator.totalInvestment * 12 * sipCalculator.timePeriod,
      color: "indigo.6",
    },
    { name: "SPI Amount", value: spiValue, color: "yellow.6" },
  ];

  useEffect(() => {
    function calculateSIP(sipCalculator) {
      let months = sipCalculator.timePeriod * 12; // Convert years to months
      let r = sipCalculator.expectedReturnRate / 100 / 12; // Convert annual rate to monthly decimal
      let fv =
        sipCalculator.totalInvestment *
        ((Math.pow(1 + r, months) - 1) / r) *
        (1 + r);
      setSpiValue(Number(fv.toFixed(2))); // Return value rounded to 2 decimal places
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
    <div className="flex p-6 h-full flex-col gap-5">
      {/* 💡 Your salary is split as follows */}
      <Title order={2}>Budgeting</Title>

      <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 gap-4">
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
      <div className="chart-section flex-1 h-1 flex">
        <div className="left flex flex-col">
          <Title order={2}>SIP Calculator</Title>
          <div className="grid grid-cols-1 gap-4">
            <NumberInput
              label="Total Investment"
              id="totalInvestment"
              value={sipCalculator.totalInvestment}
              onChange={(value) => handleSipUpdate(value, "totalInvestment")}
              placeholder="i.e, 20,000"
            />
            <NumberInput
              label="Expected return rate (p.a)"
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
            <label htmlFor="">
              Total Investment:{" "}
              {isNaN(sipCalculator.totalInvestment || sipCalculator.timePeriod)
                ? `Rs. 0`
                : `Rs. ${
                    sipCalculator.totalInvestment *
                    12 *
                    sipCalculator.timePeriod
                  }`}{" "}
            </label>

            <label htmlFor="">
              Estimated Returns:{" "}
              {isNaN(spiValue)
                ? `Rs. 0`
                : `Rs. ${(
                    spiValue -
                    sipCalculator.totalInvestment *
                      12 *
                      sipCalculator.timePeriod
                  ).toFixed(2)}`}{" "}
            </label>
            <label htmlFor="">
              Total Value: {isNaN(spiValue) ? `Rs. 0` : `Rs. ${spiValue}`}
            </label>
          </div>
        </div>
        <div className="right p-20 overflow-auto flex-1">
          <div className="w-40 h-40">
            <DonutChart
              data={data}
              size={145}
              thickness={30}
              className="w-40 h-40"
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
                <div className="circle bg-amber-300"></div>
                <label htmlFor="">Total Investment</label>
              </div>
              <div className="flex gap-2 items-center">
                <div className="circle bg-blue-500"></div>
                <label htmlFor="">Estimated Returns</label>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

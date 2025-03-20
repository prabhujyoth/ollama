import { DonutChart } from "@mantine/charts";
import { NumberInput, TextInput, Title } from "@mantine/core";
import { LogIn } from "lucide-react";
import React, { useState } from "react";

export default function SIP() {
  const [salary, setSalary] = useState(0);
  const needsAmount = (50 / 100) * salary;
  const wantsAmount = (30 / 100) * salary;
  const investmentAmount = (20 / 100) * salary;
  const data = [
    { name: "USA", value: 400, color: "indigo.6" },
    { name: "India", value: 300, color: "yellow.6" },
    { name: "Japan", value: 100, color: "teal.6" },
    { name: "Other", value: 500, color: "gray.6" },
  ];
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
            <NumberInput label="Total Investment" placeholder="i.e, 20,000" />
            <NumberInput
              label="Expected return rate (p.a)"
              placeholder="i.e, 12%"
            />
            <NumberInput label="Time Period" placeholder="i.e, 1 Yr" />
          </div>
        </div>
        <div className="right overflow-auto flex-1">
          <div className="w-40 h-40">
            <DonutChart
              data={data}
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
        </div>
      </div>
    </div>
  );
}

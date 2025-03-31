import { NumberInput, Table, Title } from "@mantine/core";
import { useState, useEffect } from "react";

export default function SWP() {
  const [swpFormData, setSwpFormData] = useState({
    principleAmount: 0,
    withdrawalAmount: 0, // Changed from withdrawal rate to fixed amount
    growthRate: 12,
  });
  const [tableData, setTableData] = useState([]);

  // Calculate yearly data when form data changes
  useEffect(() => {
    const calculateSWP = () => {
      if (
        swpFormData.principleAmount <= 0 ||
        swpFormData.withdrawalAmount <= 0
      ) {
        setTableData([]);
        return;
      }

      const data = [];
      let currentAmount = swpFormData.principleAmount;
      let year = 1;
      const inflationRate = 6; // Fixed inflation rate of 6%
      let currentWithdrawal = swpFormData.withdrawalAmount;

      while (currentAmount > 0 && year <= 100) {
        // For year 1, use base withdrawal amount; from year 2, apply inflation
        const withdrawal =
          year === 1
            ? currentWithdrawal
            : currentWithdrawal * (1 + inflationRate / 100);

        // Calculate remaining amount after withdrawal
        const amountAfterWithdrawal = currentAmount - withdrawal;
        // Apply growth rate to remaining amount
        const newAmount =
          amountAfterWithdrawal * (1 + swpFormData.growthRate / 100);

        data.push({
          year: year,
          principleAmount: parseFloat(Math.max(newAmount, 0).toFixed(2)), // Ensure no negative values
          withdrawal: parseFloat(withdrawal.toFixed(2)),
          startingAmount: parseFloat(currentAmount.toFixed(2)),
        });

        currentAmount = newAmount;
        // Update withdrawal amount for next year (apply inflation from year 2 onwards)
        if (year > 1) {
          currentWithdrawal = withdrawal;
        }
        year++;
      }

      setTableData(data);
    };

    calculateSWP();
  }, [swpFormData]);

  const yearlySplit = swpFormData.withdrawalAmount.toFixed(2);
  const monthlySplit = (yearlySplit / 12).toFixed(2);

  const handleSwpUpdate = (value, field) => {
    setSwpFormData((prev) => ({
      ...prev,
      [field]: value || 0,
    }));
  };

  const rows = tableData.map((element) => (
    <Table.Tr key={element.year}>
      <Table.Td>{element.year}</Table.Td>
      <Table.Td>{element.startingAmount}</Table.Td>
      <Table.Td>{element.withdrawal}</Table.Td>
      <Table.Td>{element.principleAmount}</Table.Td>
    </Table.Tr>
  ));

  return (
    <div className="flex flex-col lg:flex-row md:flex-row sm:flex-col p-6 h-full gap-5">
      <div className="flex border rounded p-4 border-neutral-600 flex-col w-full lg:w-1/4 md:w-1/4 sm:w-full ">
        {/* 💡 Your salary is split as follows */}
        <Title order={2}>Systematic Withdrawal Plan</Title>
        <div className="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-1 sm:grid-cols-1 gap-4">
          <div>
            <NumberInput
              label="Principle Amount"
              id="principleAmount"
              value={swpFormData.principleAmount}
              onChange={(value) => handleSwpUpdate(value, "principleAmount")}
              placeholder="i.e, 200000"
            />
          </div>
          <div>
            <NumberInput
              label="Yearly Withdrawal Amount"
              id="withdrawalAmount"
              value={swpFormData.withdrawalAmount}
              onChange={(value) => handleSwpUpdate(value, "withdrawalAmount")}
              placeholder="i.e, 10000"
            />
          </div>
          <div>
            <label>
              Monthly Split:{" "}
              <span className="font-bold text-xl">Rs.{monthlySplit}</span>
            </label>
          </div>
          <div>
            <NumberInput
              label="Growth Rate (%)"
              id="growthRate"
              value={swpFormData.growthRate}
              onChange={(value) => handleSwpUpdate(value, "growthRate")}
              placeholder="i.e, 12"
            />
          </div>
        </div>
      </div>
      <div className="chart-section overflow-auto border rounded p-4 border-neutral-600 flex-1 w-full lg:w-1/4 md:w-1/4 sm:w-full h-full flex">
        <Table
          className="w-full"
          striped
          highlightOnHover
          withTableBorder
          withColumnBorders
        >
          <Table.Thead className="w-full">
            <Table.Tr className="w-full">
              <Table.Th>Year</Table.Th>
              <Table.Th>Starting Amount</Table.Th>
              <Table.Th>Withdrawal</Table.Th>
              <Table.Th>Ending Amount</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody className="w-full">{rows}</Table.Tbody>
        </Table>
      </div>
    </div>
  );
}

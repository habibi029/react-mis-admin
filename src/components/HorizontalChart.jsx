import React, { useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { mockDataWeekly, mockDataMonthly } from '../../src/data/mockData';

const HorizontalChart = () => {
  const [isWeekly, setIsWeekly] = useState(true);

  const handleToggle = () => {
    setIsWeekly(!isWeekly);
  };

  return (
    <div style={{ height: 400 }}>
      <button onClick={handleToggle}>
        Switch to {isWeekly ? 'Monthly' : 'Weekly'} Data
      </button>

      <ResponsiveBar
        data={isWeekly ? mockDataWeekly : mockDataMonthly}
        keys={['value']}
        indexBy={isWeekly ? 'week' : 'month'}
        margin={{ top: -1, right: 50, bottom: 250, left: 90 }}
        padding={0.7}
        layout="horizontal"
        colors={{ scheme: 'nivo' }}
        axisBottom={{
          tickSize: 4,
          tickPadding: 4,
          tickRotation: 0,
          legend: 'Value',
          legendPosition: 'middle',
          legendOffset: 30,
          tick: {
            text: {
              fill: '#ff6347', // Font color for axis bottom labels (Tomato color)
            },
          },
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: isWeekly ? 'Week' : 'Month',
          legendPosition: 'middle',
          legendOffset: -40,
          tick: {
            text: {
              fill: '#f5f5f5', // Font color for axis left labels (Tomato color)
            },
          },
        }}
        enableLabel={false}
        isInteractive={true}
      />
    </div>
  );
};

export default HorizontalChart;

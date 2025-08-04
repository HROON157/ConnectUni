import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, LineChart, Line, ResponsiveContainer } from 'recharts';

export const PieChartCard = ({ title, count, data }) => (
  <div className="bg-white p-4 rounded-lg border border-blue-300 border-dashed">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <div className="flex items-center justify-between">
      <div className="text-3xl font-bold">{count}</div>
      <div className="w-24 h-24">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={40}
              fill="#8884d8"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div className="mt-2 space-y-1">
      {data.map((item, index) => (
        <div key={index} className="flex items-center text-xs">
          <div 
            className="w-3 h-3 rounded-full mr-2" 
            style={{ backgroundColor: item.color }}
          ></div>
          <span>{item.name}</span>
        </div>
      ))}
    </div>
  </div>
);

export const BarChartCard = ({ title, count, data }) => (
  <div className="bg-white p-4 rounded-lg border border-blue-300 border-dashed">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <div className="text-3xl font-bold mb-4">{count}</div>
    <div className="h-32">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" hide />
          <YAxis hide />
          <Bar dataKey="value" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
        <div className="mt-2 space-y-1">
      {data.map((item, index) => (
        <div key={index} className="flex items-center justify-between text-xs">
          <div className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: item.color }}
            ></div>
            <span>{item.name}</span>
          </div>
          <span className="font-semibold">{item.value}</span>
        </div>
      ))}
    </div>
  </div>

);

export const LineChartCard = ({ title, count, percentage, trend }) => (
  <div className="bg-white p-4 rounded-lg border border-blue-300 border-dashed">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <div className="flex items-center gap-2 mb-4">
      <span className="text-3xl font-bold">{count}</span>
      <span className="text-green-500 text-sm">↗ {percentage}%</span>
    </div>
    <div className="h-32">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={trend}>
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#10B981" 
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
        <div className="mt-2 space-y-1">
      {trend.slice(-3).map((item, index) => (
        <div key={index} className="flex items-center justify-between text-xs">
          <span className="text-gray-600">{item.month}</span>
          <span className="font-semibold">{item.value}</span>
        </div>
      ))}
    </div>
  </div>
);
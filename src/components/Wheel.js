import React from 'react';
import './Wheel.css';

const Wheel = ({ teams, isSpinning, onSpin }) => {
  if (!teams || teams.length === 0) {
    return (
      <div className="wheel-container">
        <div className="wheel empty-wheel">
          <div className="wheel-center">
            <p>No teams remaining!</p>
            <p>Reset to start over</p>
          </div>
        </div>
      </div>
    );
  }

  const wheelSize = 400;
  const centerX = wheelSize / 2;
  const centerY = wheelSize / 2;
  const radius = wheelSize / 2 - 20;

  const createWheelSegments = () => {
    const segments = [];
    const anglePerSegment = (2 * Math.PI) / teams.length;

    teams.forEach((team, index) => {
      const startAngle = index * anglePerSegment;
      const endAngle = (index + 1) * anglePerSegment;
      const midAngle = startAngle + anglePerSegment / 2;

      // Calculate path for segment
      const x1 = centerX + radius * Math.cos(startAngle);
      const y1 = centerY + radius * Math.sin(startAngle);
      const x2 = centerX + radius * Math.cos(endAngle);
      const y2 = centerY + radius * Math.sin(endAngle);

      const largeArcFlag = anglePerSegment > Math.PI ? 1 : 0;

      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');

      // Calculate text position
      const textRadius = radius * 0.7;
      const textX = centerX + textRadius * Math.cos(midAngle);
      const textY = centerY + textRadius * Math.sin(midAngle);

      segments.push({
        path: pathData,
        text: team,
        textX,
        textY,
        textAngle: (midAngle * 180) / Math.PI,
        color: getTeamColor(index)
      });
    });

    return segments;
  };

  const getTeamColor = (index) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    return colors[index % colors.length];
  };

  const wheelSegments = createWheelSegments();

  return (
    <div className="wheel-container">
      <div className={`wheel ${isSpinning ? 'spinning' : ''}`}>
        <svg width={wheelSize} height={wheelSize} viewBox={`0 0 ${wheelSize} ${wheelSize}`}>
          {/* Wheel segments */}
          {wheelSegments.map((segment, index) => (
            <g key={index}>
              <path
                d={segment.path}
                fill={segment.color}
                stroke="#fff"
                strokeWidth="2"
              />
              <text
                x={segment.textX}
                y={segment.textY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="12"
                fontWeight="bold"
                transform={`rotate(${segment.textAngle}, ${segment.textX}, ${segment.textY})`}
              >
                {segment.text}
              </text>
            </g>
          ))}
          
          {/* Center circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r="15"
            fill="#333"
            stroke="#fff"
            strokeWidth="3"
          />
          
          {/* Pointer */}
          <polygon
            points={`${centerX},${centerY - 25} ${centerX - 10},${centerY - 5} ${centerX + 10},${centerY - 5}`}
            fill="#FFD700"
            stroke="#333"
            strokeWidth="2"
          />
        </svg>
      </div>
      
      {teams && teams.length > 0 && (
        <div className="wheel-info">
          <p>{teams.length} teams remaining</p>
        </div>
      )}
    </div>
  );
};

export default Wheel; 
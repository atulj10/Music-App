import React from "react";
import Svg, { Circle, Line } from "react-native-svg";

interface SearchIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const SearchIcon = ({
  size = 24,
  color = "#000",
  strokeWidth = 2,
}: SearchIconProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth={strokeWidth} />
      <Line
        x1="16.5"
        y1="16.5"
        x2="21"
        y2="21"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default SearchIcon;

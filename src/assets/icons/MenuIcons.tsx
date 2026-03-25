import React from "react";
import Svg, { Path, Circle, Line } from "react-native-svg";

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

/* Play Next */
export const PlayNextIcon = ({
  size = 22,
  color = "#333",
  strokeWidth = 2,
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M10 8l4 4-4 4"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/* Playlist */
export const PlaylistIcon = ({
  size = 22,
  color = "#333",
  strokeWidth = 2,
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line
      x1="4"
      y1="6"
      x2="20"
      y2="6"
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <Line
      x1="4"
      y1="12"
      x2="14"
      y2="12"
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <Line
      x1="4"
      y1="18"
      x2="10"
      y2="18"
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <Circle cx="18" cy="18" r="2" fill={color} />
  </Svg>
);

/* Album */
export const AlbumIcon = ({ size = 22, color = "#333" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
    <Circle cx="12" cy="12" r="3" fill={color} />
  </Svg>
);

/* Artist */
export const ArtistIcon = ({ size = 22, color = "#333" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2" />
    <Path
      d="M4 20c0-4 16-4 16 0"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

/* Info */
export const InfoIcon = ({ size = 22, color = "#333" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Line x1="12" y1="10" x2="12" y2="16" stroke={color} strokeWidth="2" />
    <Circle cx="12" cy="7" r="1" fill={color} />
  </Svg>
);

/* Share */
export const ShareIcon = ({ size = 22, color = "#333" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="18" cy="5" r="3" stroke={color} strokeWidth="2" />
    <Circle cx="6" cy="12" r="3" stroke={color} strokeWidth="2" />
    <Circle cx="18" cy="19" r="3" stroke={color} strokeWidth="2" />
    <Path d="M8.5 13.5l7 4" stroke={color} strokeWidth="2" />
    <Path d="M15.5 6.5l-7 4" stroke={color} strokeWidth="2" />
  </Svg>
);

/* Delete */
export const DeleteIcon = ({ size = 22, color = "#333" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M3 6h18M8 6v12m8-12v12M5 6l1 14h12l1-14"
      stroke={color}
      strokeWidth="2"
    />
  </Svg>
);

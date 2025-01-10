import React from "react";
import * as FaIcons from "react-icons/fa";
import { IconType } from "react-icons";

type IconName = keyof typeof FaIcons;

interface IconRendererProps {
  icon: IconName; // Name of the icon (e.g., "FaBeer")
  size?: number; // Optional size of the icon
  color?: string; // Optional color of the icon
  style?: React.CSSProperties; // Optional style for the icon
}

const IconRenderer: React.FC<IconRendererProps> = ({
  icon,
  size = 24,
  color = "black",
  style,
}) => {
  const getIconComponent = (iconName: IconName): IconType => FaIcons[iconName];

  const IconComponent = getIconComponent(icon);

  if (!IconComponent) {
    return <span>Icon not found</span>; // Fallback in case the icon doesn't exist
  }

  return <IconComponent size={size + "rem"} color={color} style={style} />;
};

export default IconRenderer;

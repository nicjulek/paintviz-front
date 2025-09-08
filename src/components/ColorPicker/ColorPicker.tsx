import { HexColorPicker } from "react-colorful";
import { ColorPickerProps } from "../../types/types";

const ColorPicker = ({ value, onColorChange }: ColorPickerProps) => {
  return <HexColorPicker color={value} onChange={onColorChange} />;
};

export default ColorPicker;
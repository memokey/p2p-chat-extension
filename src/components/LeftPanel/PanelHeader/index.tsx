import React, { FC } from "react";
import { useAppSelector } from "../../../redux/hooks";

const PanelHeader = ({}: {}) => {
  const titles = ['Home', 'Solarity', 'Money Boys', 'Sol Gods'];
  const { groupIndex } = useAppSelector(state => state.chat);
  
  return (
    <div 
      className="py-3 text-center text-gray-200 text-lg font-medium border-b border-b-darkcharcoal"
    >
      {titles[groupIndex]}
    </div>
  );
}

export default PanelHeader;
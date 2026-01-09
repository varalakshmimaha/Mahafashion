import React from 'react';

interface BlouseOptionsProps {
  onSelect?: (option: string) => void;
  defaultValue?: string;
}

const BlouseOptions: React.FC<BlouseOptionsProps> = ({ onSelect, defaultValue = 'yes' }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSelect) {
      onSelect(e.target.value);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Blouse Options</h3>
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center">
          <input 
            type="radio" 
            id="blouse-yes" 
            name="blouse-option" 
            value="yes"
            className="mr-2"
            defaultChecked={defaultValue === 'yes'}
            onChange={handleChange}
          />
          <label htmlFor="blouse-yes" className="text-gray-700">With Blouse Piece</label>
        </div>
        <div className="flex items-center">
          <input 
            type="radio" 
            id="blouse-no" 
            name="blouse-option" 
            value="no"
            className="mr-2"
            defaultChecked={defaultValue === 'no'}
            onChange={handleChange}
          />
          <label htmlFor="blouse-no" className="text-gray-700">Without Blouse Piece</label>
        </div>
      </div>
    </div>
  );
};

export default BlouseOptions;
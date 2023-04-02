import { NativeSelect } from '@mui/material';
import { useState } from 'react';
import { timeline, timelineValues } from 'utils/other/EnvironmentValues';
import SelectInput from './styled';

export default function SelectOptionTimeline({ onValueChanged }) {
  const [selectedTimeline, setSelectedTimeline] = useState(timeline[0]);

  const handleChangeTimeline = (event) => {
    const value = event?.target.value;
    if (value) {
      setSelectedTimeline(value);
      onValueChanged(timelineValues[value], value);
    }
  };

  return (
    <NativeSelect value={selectedTimeline} onChange={handleChangeTimeline} input={<SelectInput />}>
      {(() => {
        return timeline.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ));
      })()}
    </NativeSelect>
  );
}

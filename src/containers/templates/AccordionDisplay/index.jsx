import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import SelectOptionTimeline from 'components/elements/SelectOptionTimeline';
import { reverseTimelineValue } from 'utils/other/EnvironmentValues';
import Component from './styled';

export default function AccordionDisplay({
  data,
  title,
  TableView,
  timelineName,
  setTimelineName,
  timelineValue,
  setTimelineValue,
  ChartView
}) {
  const timelineValueOrdered = reverseTimelineValue(timelineValue, timelineName);

  const buildTableView = (index) => {
    const currentDate = new Date();
    switch (timelineName) {
      case 'tahun':
        return (
          <TableView
            rows={data.filter(
              (element) =>
                element.dateCreated.toDate() >= new Date(currentDate.getFullYear() - index, 0) &&
                element.dateCreated.toDate() < new Date(currentDate.getFullYear() - index + 1, 0)
            )}
          />
        );

      case 'bulan':
        return (
          <TableView
            rows={data.filter(
              (element) =>
                element.dateCreated.toDate() >= new Date(currentDate.getFullYear(), index) &&
                element.dateCreated.toDate() < new Date(currentDate.getFullYear(), index + 1)
            )}
          />
        );

      case 'hari':
        return (
          <TableView
            rows={data.filter(
              (element) =>
                element.dateCreated.toDate() >=
                  new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - index) &&
                element.dateCreated.toDate() <
                  new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - index + 1)
            )}
          />
        );

      default:
        return <TableView rows={data} />;
    }
  };

  const buildChartView = () => {
    return <ChartView />;
  };

  return (
    <Component
      gridTemplateAreas={` 
          "A B"
          "C C"
          "D D"
        `}
    >
      <Box gridArea="A">
        <Typography className="table-title" variant="h2" component="h2">
          {title}
        </Typography>
      </Box>
      <Box gridArea="B">
        <SelectOptionTimeline
          onValueChanged={(value, timeline) => {
            setTimelineName(timeline);
            setTimelineValue(reverseTimelineValue(value, timeline));
          }}
        />
      </Box>
      <Box gridArea="C">{buildChartView()}</Box>
      <Box gridArea="D">
        {(() => {
          return timelineValueOrdered.map((value, index) => (
            <Accordion key={index} className="accordion">
              <AccordionSummary className="accordion-header" expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h4" component="h4">
                  {value}
                </Typography>
              </AccordionSummary>
              <AccordionDetails className="accordion-body">{buildTableView(index)}</AccordionDetails>
            </Accordion>
          ));
        })()}
      </Box>
    </Component>
  );
}

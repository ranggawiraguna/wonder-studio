import { Box, Button, CardMedia, ClickAwayListener, Typography, useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';
import Component from './styled';
import DashboardWelcomeBanner from 'assets/images/background/DashboardWelcomeBanner.svg';
import OptionItemB from 'assets/images/icon/DashboardItemBlueOption.svg';
import OptionItemC from 'assets/images/icon/DashboardItemPurpleOption.svg';
import IconItemB from 'assets/images/icon/DashboardItemBlueIcon.svg';
import IconItemC from 'assets/images/icon/DashboardItemPurpleIcon.svg';
import IconMarkOption from 'assets/images/icon/MarkDotThreeV.svg';
import IconCardNoteInfo from 'assets/images/icon/DashboardCardNoteInfo.svg';
import IconCardNote from 'assets/images/icon/DashboardCardNote.svg';
import AutoSizeText from 'components/elements/AutoSizeText';
import SelectOptionTimeline from 'components/elements/SelectOptionTimeline';
import ChartSingle from 'components/elements/ChartSingle';
import LayerOverlayDetail from 'components/elements/LayerOverlayDetail';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTheme } from '@emotion/react';
import { reverseTimelineValue, timeline, timelineValues } from 'utils/other/EnvironmentValues';
import { dateConverter, moneyFormatter } from 'utils/other/Services';

export default function DashboardGrid({ sectionName, itemValues }) {
  const theme = useTheme();
  const matchOnlyXs = useMediaQuery(theme.breakpoints.only('xs'));

  const accountReducer = useSelector((state) => state.accountReducer);
  const navigate = useNavigate();

  const [timelineValuesD, setTimelineValuesD] = useState(reverseTimelineValue(timelineValues[timeline[0].value], timeline[0].value));
  const [timelineValuesH, setTimelineValuesH] = useState(reverseTimelineValue(timelineValues[timeline[0].value], timeline[0].value));

  const [isOpenOptionItemB, setIsOpenOptionItemB] = useState(false);
  const [isOpenOptionItemC, setIsOpenOptionItemC] = useState(false);
  const [isOpenOptionItemG, setIsOpenOptionItemG] = useState(false);

  const [isOpenLayerItemG, setIsOpenLayerItemG] = useState(false);

  const getDataByTimeline = (timeline, data, reducer) => {
    return timeline.map((value, index) => {
      const currentDate = new Date();

      let count = 0;
      if (timeline.length === 10) {
        count = reducer(
          data.filter(
            (element) =>
              dateConverter(element.dateCreated) >= new Date(currentDate.getFullYear() - 9 + index, 0) &&
              dateConverter(element.dateCreated) < new Date(currentDate.getFullYear() - 9 + index + 1, 0)
          )
        );
      } else if (timeline.length === 12) {
        count = reducer(
          data.filter(
            (element) =>
              dateConverter(element.dateCreated) >= new Date(currentDate.getFullYear(), index) &&
              dateConverter(element.dateCreated) < new Date(currentDate.getFullYear(), index + 1)
          )
        );
      } else if (timeline.length === 7) {
        count = reducer(
          data.filter(
            (element) =>
              dateConverter(element.dateCreated) >=
                new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 6 + index) &&
              dateConverter(element.dateCreated) <
                new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 6 + index + 1)
          )
        );
      }

      return count;
    });
  };

  return (
    <Component>
      <Box gridArea="A">
        <Box className="dashboard-item">
          <CardMedia component="img" src={DashboardWelcomeBanner} />
          <Box>
            <Box />
            <Box />
          </Box>
          <Box>
            <Box />
            <Box>
              <Box>
                <AutoSizeText>Selamat Datang,</AutoSizeText>
                <AutoSizeText>{accountReducer.fullname}</AutoSizeText>
              </Box>
              <Box />
              <AutoSizeText>
                Peluang untuk mendapatkan profit lebih besar menanti kamu 🎉 <br />
                Ayo lakukan manajemen bisnis yang sedang kamu jalani saat ini secara teratur.
              </AutoSizeText>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box gridArea="B">
        <Box className="dashboard-item">
          <Box gridArea="A">
            <Box>
              <AutoSizeText>
                {itemValues[0].title.split('-')[0]}
                <br />
                {itemValues[0].title.split('-')[1]}
              </AutoSizeText>
            </Box>
            <ClickAwayListener mouseEvent="onMouseDown" touchEvent="onTouchStart" onClickAway={() => setIsOpenOptionItemB(false)}>
              <Box>
                <Button type="Button" onClick={() => setIsOpenOptionItemB((prev) => !prev)}>
                  <CardMedia component="img" src={OptionItemB} />
                </Button>
                {isOpenOptionItemB ? (
                  <Box>
                    <Button onClick={() => navigate(`/${sectionName}/${itemValues[0].path}`)}>Lihat Detail</Button>
                  </Box>
                ) : null}
              </Box>
            </ClickAwayListener>
          </Box>
          <Box gridArea="B">
            <AutoSizeText>{itemValues[0].data}</AutoSizeText>
          </Box>
          <Box gridArea="C">
            <CardMedia component="img" src={IconItemB} />
            <Box>
              <AutoSizeText>
                {itemValues[0].note.split('-')[0]}
                <br />
                {itemValues[0].note.split('-')[1]}
              </AutoSizeText>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box gridArea="C">
        <Box className="dashboard-item">
          <Box gridArea="A">
            <Box>
              <AutoSizeText>
                {itemValues[1].title.split('-')[0]}
                <br />
                {itemValues[1].title.split('-')[1]}
              </AutoSizeText>
            </Box>
            <ClickAwayListener mouseEvent="onMouseDown" touchEvent="onTouchStart" onClickAway={() => setIsOpenOptionItemC(false)}>
              <Box>
                <Button type="Button" onClick={() => setIsOpenOptionItemC((prev) => !prev)}>
                  <CardMedia component="img" src={OptionItemC} />
                </Button>
                {isOpenOptionItemC ? (
                  <Box>
                    <Button onClick={() => navigate(`/${sectionName}/${itemValues[1].path}`)}>Lihat Detail</Button>
                  </Box>
                ) : (
                  <></>
                )}
              </Box>
            </ClickAwayListener>
          </Box>
          <Box gridArea="B">
            <AutoSizeText>{itemValues[1].data}</AutoSizeText>
          </Box>
          <Box gridArea="C">
            <CardMedia component="img" src={IconItemC} />
            <Box>
              <AutoSizeText>
                {itemValues[1].note.split('-')[0]}
                <br />
                {itemValues[1].note.split('-')[1]}
              </AutoSizeText>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box gridArea="D">
        <Box className="dashboard-item">
          <Box gridArea="A">
            <Typography variant="h2" component="h2">
              {itemValues[2].title}
            </Typography>
          </Box>
          <Box gridArea="B">
            <Button variant="contained" onClick={() => navigate(`/${sectionName}/${itemValues[2].path}`)}>
              {matchOnlyXs ? 'Detail' : 'Lihat Detail'}
            </Button>
          </Box>
          <Box gridArea="C">
            <SelectOptionTimeline onValueChanged={(value, timeline) => setTimelineValuesD(reverseTimelineValue(value, timeline))} />
          </Box>
          <Box gridArea="D">
            <ChartSingle
              id={`Chart${itemValues[2].title.replace(' ', '')}`}
              type="line"
              label={timelineValuesD}
              data={getDataByTimeline(timelineValuesD, itemValues[2].data, itemValues[2].reducer)}
              stroke="straight"
              color={itemValues[2].color}
            />
          </Box>
        </Box>
      </Box>
      <Box gridArea="E">
        <Box className="dashboard-item">
          <Box gridArea="A">
            <Typography variant="h2" component="h2" sx={{ textAlign: 'start' }}>
              {itemValues[3].title.split('-')[0]}
              <br />
              {itemValues[3].title.split('-')[1]}
            </Typography>
          </Box>
          <Box gridArea="B">
            <CardMedia component="img" src={IconCardNoteInfo} />
          </Box>
          <Box gridArea="C">
            <Typography variant="p" component="p" sx={{ textAlign: 'start' }}>
              Perhitungan 30 hari terakhir
            </Typography>
          </Box>
          <Box gridArea="D">
            <CardMedia component="img" src={itemValues[3].icon} />
          </Box>
          <Box gridArea="E">
            <CardMedia component="img" src={IconCardNote} />
          </Box>
          <Box gridArea="F">
            <Typography variant="h3" component="h3" sx={{ textAlign: 'start' }}>
              {itemValues[3].data}
            </Typography>
          </Box>
          <Box gridArea="G">
            <Typography variant="h4" component="h4" sx={{ textAlign: 'start' }}>
              {itemValues[3].unit}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box gridArea="F">
        <Box className="dashboard-item">
          <Box gridArea="A">
            <Typography variant="h2" component="h2" sx={{ textAlign: 'start' }}>
              {itemValues[4].title.split('-')[0]}
              <br />
              {itemValues[4].title.split('-')[1]}
            </Typography>
          </Box>
          <Box gridArea="B">
            <CardMedia component="img" src={IconCardNoteInfo} />
          </Box>
          <Box gridArea="C">
            <Typography variant="p" component="p" sx={{ textAlign: 'start' }}>
              Perhitungan 30 hari terakhir
            </Typography>
          </Box>
          <Box gridArea="D">
            <CardMedia component="img" src={itemValues[4].icon} />
          </Box>
          <Box gridArea="E">
            <CardMedia component="img" src={IconCardNote} />
          </Box>
          <Box gridArea="F">
            <Typography variant="h3" component="h3" sx={{ textAlign: 'start' }}>
              {itemValues[4].unit === 'Rupiah' ? moneyFormatter(itemValues[4].data).replace('Rp. ', '') : itemValues[4].data}
            </Typography>
          </Box>
          <Box gridArea="G">
            <Typography variant="h4" component="h4" sx={{ textAlign: 'start' }}>
              {itemValues[4].unit}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box gridArea="G">
        <Box className="dashboard-item container-layer">
          <Box gridArea="A">
            <Typography variant="h2" component="h2" sx={{ textAlign: 'start' }}>
              {itemValues[5].title}
            </Typography>
          </Box>
          <Box gridArea="B">
            <ClickAwayListener mouseEvent="onMouseDown" touchEvent="onTouchStart" onClickAway={() => setIsOpenOptionItemG(false)}>
              <Box>
                <Button type="Button" onClick={() => setIsOpenOptionItemG((prev) => !prev)}>
                  <CardMedia component="img" src={IconMarkOption} />
                </Button>
                {isOpenOptionItemG ? (
                  <Box>
                    <Button onClick={() => navigate(`/${sectionName}/${itemValues[5].path}`)}>Lihat Detail</Button>
                  </Box>
                ) : (
                  <></>
                )}
              </Box>
            </ClickAwayListener>
          </Box>
          <Box gridArea="C">
            <ChartSingle
              id={`Chart${itemValues[5].title.replace(' ', '')}`}
              type="pie"
              label={itemValues[5].data.map((element) => element.name)}
              data={itemValues[5].data.map((element) => element.sold)}
              colors={['#B11900', '#e7ba3f', '#6DAFA7', '#7BA7FF', '#B05AF3']}
            />
          </Box>
          <Box gridArea="D">
            <Button variant="contained" onClick={() => setIsOpenLayerItemG(true)}>
              Lihat Keterangan Detail
            </Button>
          </Box>
          <LayerOverlayDetail
            isOpen={isOpenLayerItemG}
            onClose={() => setIsOpenLayerItemG(false)}
            label={itemValues[5].data.map((element) => element.name)}
            colors={['#B11900', '#e7ba3f', '#6DAFA7', '#7BA7FF', '#B05AF3']}
          />
        </Box>
      </Box>
      <Box gridArea="H">
        <Box className="dashboard-item">
          <Box gridArea="A">
            <Typography variant="h2" component="h2">
              {itemValues[6].title}
            </Typography>
          </Box>
          <Box gridArea="B">
            <Button variant="contained" onClick={() => navigate(`/${sectionName}/${itemValues[6].path}`)}>
              {matchOnlyXs ? 'Detail' : 'Lihat Detail'}
            </Button>
          </Box>
          <Box gridArea="C">
            <SelectOptionTimeline onValueChanged={(value, timeline) => setTimelineValuesH(reverseTimelineValue(value, timeline))} />
          </Box>
          <Box gridArea="D">
            <ChartSingle
              id={`Chart${itemValues[6].title.replace(' ', '')}`}
              type="line"
              label={timelineValuesH}
              data={getDataByTimeline(timelineValuesH, itemValues[6].data, itemValues[6].reducer)}
              stroke="smooth"
              color={itemValues[6].color}
            />
          </Box>
        </Box>
      </Box>
    </Component>
  );
}

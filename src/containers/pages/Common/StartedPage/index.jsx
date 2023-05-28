import { Box, Button, CardMedia, Grid, Typography, useMediaQuery } from '@mui/material';
import LogoCircle from 'assets/images/logo/CircleLogo.png';
import IconLocationMap from 'assets/images/icon/LocationMap.png';
import ToolbarStarted from 'components/elements/ToolbarStarted';
import PageRoot from './styled';
import { BoxTransition } from 'components/elements/MotionTransitions';
import { useEffect, useState } from 'react';
import { collection, limit, onSnapshot, query } from 'firebase/firestore';
import { db } from 'config/firebase';
import IconServiceOne from 'assets/images/icon/ServiceOne.png';
import IconServiceTwo from 'assets/images/icon/ServiceTwo.png';
import IconServiceThree from 'assets/images/icon/ServiceThree.png';
import IconServiceFour from 'assets/images/icon/ServiceFour.png';
import IconServiceFive from 'assets/images/icon/ServiceFive.png';
import IconServiceSix from 'assets/images/icon/ServiceSix.png';
import IconPhone from 'assets/images/icon/IconPhone.png';
import IconWhatsApp from 'assets/images/icon/IconWhatsApp.png';
import IconGmail from 'assets/images/icon/IconGmail.png';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useTheme } from '@emotion/react';
import ReactSwipe from 'react-swipe';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';

export default function StartedPage() {
  let reactSwipeEl;

  const listService = [
    {
      title: 'Terjangkau',
      description: 'Tentunya di percetakan kami untuk masalah harga murah & terjangkau',
      icon: IconServiceOne
    },
    {
      title: 'Berpengalaman',
      description: 'Dan kami bekerja sangat berpengalaman dalam percetakan',
      icon: IconServiceTwo
    },
    {
      title: 'Profesional',
      description: 'Di percetakan kami untuk para pekerja sudah sangat profesional dalamm percetakan',
      icon: IconServiceThree
    },
    {
      title: 'Bergaransi',
      description: 'Jika ada kesalahan dalam hasil cetak dapat kami perbaiki',
      icon: IconServiceFour
    },
    {
      title: 'Memuaskan',
      description: 'Untuk di percetakan kami masalah hasil sangat memuaskan',
      icon: IconServiceFive
    },
    {
      title: 'Cepat',
      description: 'Dalam bekerja kami dapat melakukan dengan cepat dan teliti',
      icon: IconServiceSix
    }
  ];
  const listContact = [
    {
      title: 'Telepon',
      description: '021-8791-4104',
      icon: IconPhone
    },
    {
      title: 'WhatsApp',
      description: '0859-6728-1635',
      icon: IconWhatsApp
    },
    {
      title: 'Gmail',
      description: 'cibinong.wonder@gmail.com',
      icon: IconGmail
    }
  ];

  const isScreenMd = useMediaQuery(useTheme().breakpoints.up('md'));

  const navigate = useNavigate();

  const accountReducer = useSelector((state) => state.accountReducer);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const listenerProducts = onSnapshot(query(collection(db, 'products'), limit(6)), (snapshot) => {
      setProducts(snapshot.docs.map((document) => ({ id: document.id, ...document.data() })));
    });

    return () => {
      listenerProducts();
    };
  }, []);

  return (
    <PageRoot>
      <Box className="content section-one">
        <ToolbarStarted
          buttons={[
            {
              text: 'Daftar',
              link: '/daftar',
              color: ''
            },
            {
              text: 'Login',
              link: '/masuk'
            }
          ]}
        />

        <Box className="box-content">
          <BoxTransition variant="fade">
            <Typography variant="h1" component="h1">
              Wonder Studio
            </Typography>
            <Typography variant="p" component="p">
              Wonder Studio merupakan sebuah jasa percetakan digital yang melayani berbagai kebutuhan cetak anda seperti brosur, kartu nama,
              poster, dan lainnya. Kami memberikan kualitas cetak yang terjamin dengan harga yang kompetitif sehingga membantu anda lebih
              efisien dalam mencetak keperluan anda. Semua kebutuhan cetak dan printing kami sediakan dengan kualitas terbaik sehingga
              menarik untuk dibaca serta interaktif.
            </Typography>
            <Box className="map-desc">
              <CardMedia component="img" src={IconLocationMap} />
              <Typography variant="p" component="p">
                Jl. Raya Jakarta-Bogor No.Km. 40,7, Pabuaran, Kec. Cibinong, Kabupaten Bogor, Jawa Barat 16916.
              </Typography>
            </Box>
          </BoxTransition>
          <BoxTransition variant="fadeZoomRotate">
            <CardMedia component="img" src={LogoCircle} />
          </BoxTransition>
        </Box>
        <br />
        <BoxTransition variant="fade">
          <Button
            onClick={() => {
              window.open('https://goo.gl/maps/CRd85HX32rvNL6Sg7', '_blank');
            }}
            variant="contained"
          >
            Lihat Google Maps
          </Button>
        </BoxTransition>
      </Box>
      <Box className="content section-two">
        <BoxTransition>
          <Typography variant="h1" component="h1" fontSize={{ xs: 24, md: 32 }}>
            Layanan Kami
          </Typography>
          <Box sx={{ flex: 1, boxSizing: 'border-box' }}>
            <Grid
              container
              columnSpacing={5}
              rowSpacing={{ xs: 2, md: 5 }}
              sx={{
                padding: '20px 50px 50px'
              }}
            >
              {listService.map((_, __) => (
                <Grid item key={__} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <Box sx={{ padding: 5 }}>
                    <CardMedia component="img" src={_.icon} sx={{ height: { xs: '20vw', md: '8vw' } }} />
                  </Box>
                  <Typography component="h3" variant="h3" sx={{ paddingBottom: 1 }}>
                    {_.title}
                  </Typography>
                  <Typography component="h4" variant="h4" sx={{ fontWeight: 'normal' }}>
                    {_.description}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
        </BoxTransition>
      </Box>
      <Box className="content section-three">
        <BoxTransition>
          <Typography variant="h1" component="h1" fontSize={{ xs: 24, md: 32 }} marginTop={{ xs: 5, md: 0 }}>
            Produk Kami
          </Typography>
          {isScreenMd ? (
            <Box sx={{ flex: 1, boxSizing: 'border-box' }}>
              <Grid
                container
                columnSpacing={5}
                rowSpacing={5}
                sx={{
                  padding: 5
                }}
              >
                {products.map((_, __) => (
                  <Grid item key={__} xs={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <Box sx={{ paddingBottom: 2 }}>
                      <CardMedia component="img" src={_.images[0]} sx={{ height: '9vw' }} />
                    </Box>
                    <Typography component="h3" variant="h3" sx={{ paddingBottom: 1 }}>
                      {_.name}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <Box marginTop={5} marginBottom={5} width="100vw" position="relative">
              <ReactSwipe
                className="carousel"
                swipeOptions={{ continuous: false }}
                ref={(el) => (reactSwipeEl = el)}
                childCount={products.length}
              >
                {products.map((_, __) => (
                  <Box key={__} xs={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <Box sx={{ paddingBottom: 2 }}>
                      <CardMedia component="img" src={_.images[0]} sx={{ height: '30vw' }} />
                    </Box>
                    <Typography component="h3" variant="h3" sx={{ paddingBottom: 1 }}>
                      {_.name}
                    </Typography>
                  </Box>
                ))}
              </ReactSwipe>

              <Button
                onClick={() => reactSwipeEl.prev()}
                sx={{
                  position: 'absolute',
                  top: '40%',
                  left: 10,
                  transform: 'translateY(-50%)',
                  minWidth: 0,
                  minHeight: 0,
                  borderRadius: 1000
                }}
              >
                <ArrowBackIosRoundedIcon sx={{ fill: 'lightgrey', '&:hover': { fill: 'black' } }} />
              </Button>
              <Button
                onClick={() => reactSwipeEl.next()}
                sx={{
                  position: 'absolute',
                  top: '40%',
                  right: 10,
                  transform: 'translateY(-50%)',
                  minWidth: 0,
                  minHeight: 0,
                  borderRadius: 1000
                }}
              >
                <ArrowForwardIosRoundedIcon sx={{ fill: 'lightgrey', '&:hover': { fill: 'black' }  }} />
              </Button>
            </Box>
          )}
          <Typography
            component="h3"
            variant="h3"
            sx={{ fontWeight: 'normal', paddingBottom: 3, textAlign: 'center', fontSize: { xs: 16, md: 20 } }}
          >
            Untuk melihat harga dan lainnya silahkan klik tombol dibawah ini.
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              switch (accountReducer.role) {
                case 'admin':
                  return navigate('/admin/product');

                case 'customer':
                  return navigate('/customer/product');

                default:
                  return navigate('/masuk');
              }
            }}
          >
            Lihat Selengkapnya
          </Button>
        </BoxTransition>
      </Box>
      <Box className="content section-four">
        <BoxTransition>
          <Typography variant="h3" component="h3" fontSize={{ xs: 14, md: 20 }}>
            ANDA TERTARIK DENGAN JASA KAMI ? SEGERA HUBUNGI KAMI !
          </Typography>
          <br />
          <br />
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: { xs: 5, md: 10 },
              padding: { xs: '0 20px', md: '0 50px' }
            }}
          >
            {listContact.map((_, __) => (
              <Box
                key={__}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <CardMedia component="img" src={_.icon} sx={{ height: { xs: '40px', md: '70px' }, width: { xs: '40px', md: '70px' } }} />
                <Box>
                  <Typography variant="h3" component="h3" sx={{ marginBottom: '5px', textAlign: 'start', fontSize: { xs: 16, md: 20 } }}>
                    {_.title}
                  </Typography>
                  <Typography variant="h3" component="h3" sx={{ fontWeight: 'normal', textAlign: 'start', fontSize: { xs: 16, md: 20 } }}>
                    {_.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </BoxTransition>
      </Box>
    </PageRoot>
  );
}

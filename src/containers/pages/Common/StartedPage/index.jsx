import { Box, Button, CardMedia, Grid, Typography } from '@mui/material';
import LogoCircle from 'assets/images/logo/CircleLogo.png';
import IconLocationMap from 'assets/images/icon/LocationMap.png';
import ToolbarStarted from 'components/elements/ToolbarStarted';
import PageRoot from './styled';
import { BoxTransition } from 'components/elements/MotionTransitions';
import { Fragment, useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
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
import { useLocation, useParams } from 'react-router';
import ProductCard from 'components/elements/CardProduct';
import ProductDetailPage from '../ProductDetailPage';

export default function StartedPage() {
  const params = useParams();

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

  const location = useLocation();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const listenerProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
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

        {(() => {
          switch (location.pathname) {
            case '/profile':
              return (
                <Fragment>
                  <Box className="box-content">
                    <BoxTransition variant="fade">
                      <Typography variant="h1" component="h1">
                        Wonder Studio
                      </Typography>
                      <Typography variant="p" component="p">
                        Wonder Studio merupakan sebuah jasa percetakan digital yang melayani berbagai kebutuhan cetak anda seperti brosur,
                        kartu nama, poster, dan lainnya. Kami memberikan kualitas cetak yang terjamin dengan harga yang kompetitif sehingga
                        membantu anda lebih efisien dalam mencetak keperluan anda. Semua kebutuhan cetak dan printing kami sediakan dengan
                        kualitas terbaik sehingga menarik untuk dibaca serta interaktif.
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
                    <br />
                    <br />
                    <br />
                  </BoxTransition>
                </Fragment>
              );

            case '/service':
              return (
                <Box className="content section-two">
                  <BoxTransition variant="fade">
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
                          <Grid
                            item
                            key={`service-${__}`}
                            md={4}
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
                          >
                            <Box sx={{ padding: 5 }}>
                              <CardMedia component="img" src={_.icon} sx={{ height: { xs: '20vw', md: '7vw' } }} />
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
              );

            case '/product':
              return (
                <Box className="content section-three">
                  <BoxTransition variant="fade">
                    <Grid
                      container
                      spacing={2}
                      sx={{
                        padding: '0 30px 30px'
                      }}
                    >
                      {(() =>
                        products.map((_) => (
                          <Grid item xs={12} sm={6} md={4} lg={3} alignContent="center">
                            <ProductCard disableFavorite product={_} />
                          </Grid>
                        )))()}
                    </Grid>
                  </BoxTransition>
                </Box>
              );

            case `/product/${params.id}`:
              return <ProductDetailPage />;

            case '/contact':
              return (
                <Box className="content section-four">
                  <BoxTransition variant="fade">
                    <Typography variant="h3" component="h3" fontSize={{ xs: 14, md: 20 }}>
                      ANDA TERTARIK DENGAN JASA KAMI ? SEGERA HUBUNGI KAMI !
                    </Typography>
                    <br />
                    <br />
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
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
                          <CardMedia
                            component="img"
                            src={_.icon}
                            sx={{ height: { xs: '40px', md: '70px' }, width: { xs: '40px', md: '70px' } }}
                          />
                          <Box>
                            <Typography
                              variant="h3"
                              component="h3"
                              sx={{ marginBottom: '5px', textAlign: 'start', fontSize: { xs: 16, md: 20 } }}
                            >
                              {_.title}
                            </Typography>
                            <Typography
                              variant="h3"
                              component="h3"
                              sx={{ fontWeight: 'normal', textAlign: 'start', fontSize: { xs: 16, md: 20 } }}
                            >
                              {_.description}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </BoxTransition>
                </Box>
              );

            default:
              return <></>;
          }
        })()}
      </Box>
    </PageRoot>
  );
}

import {
  Box,
  Button,
  CardMedia,
  ClickAwayListener,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography
} from '@mui/material';
import { db, storage } from 'config/firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { Fragment, useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { defaultProductImage, sizeAvailable } from 'utils/other/EnvironmentValues';
import IconClose from 'assets/images/icon/CloseCircle.svg';
import IconAdd from 'assets/images/icon/AddCircle.svg';
import PageRoot from './styled';
import ColorPicker from 'components/elements/ColorPicker';
import { motion } from 'framer-motion';
import AlertToast from 'components/elements/AlertToast';
import { default as utils } from 'lodash';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import EmptyContent from 'components/elements/EmptyContent';

export default function ProductEditPage() {
  const params = useParams();

  const [isUpdateProcess, setIsUpdateProcess] = useState(false);

  const [openColorPicker, setOpenColorPicker] = useState(false);
  const [openClickawaySize, setOpenClickawaySize] = useState(false);

  const [selectedImage, setSelectedImage] = useState([null, null, null]);
  const [selectedImageUrl, setSelectedImageUrl] = useState([defaultProductImage, defaultProductImage, defaultProductImage]);

  const [alertDescription, setAlertDescription] = useState({
    isOpen: false,
    type: 'info',
    text: '',
    transitionName: 'slideUp'
  });

  const [product, setProduct] = useState({
    id: '',
    category: '',
    colors: [],
    description: '',
    name: '',
    photos: ['', '', ''],
    price: 0,
    rating: 5,
    sizes: [],
    sold: 0,
    productionHistory: [],
    stocks: []
  });
  const [productTemp, setProductTemp] = useState({
    id: '',
    category: '',
    colors: [],
    description: '',
    name: '',
    photos: ['', '', ''],
    price: 0,
    rating: 5,
    sizes: [],
    sold: 0,
    productionHistory: [],
    stocks: []
  });

  const getValueChanged = () => {
    let data = {};
    for (let path of ['category', 'name', 'description', 'price', 'colors', 'sizes', 'stocks']) {
      if (!utils.isEqual(product[path], productTemp[path])) {
        data = { ...data, [path]: product[path] };
      }
    }

    if (selectedImage.some((image) => image !== null)) {
      data = { ...data, photos: [...selectedImage.map((image, index) => (image ? image : product.images[index]))] };
    }

    if (Object.keys(data).includes('stocks')) {
      if (data.stocks.reduce((a, b) => a + b.count, 0) > productTemp.stocks.reduce((a, b) => a + b.count, 0)) {
        data = {
          ...data,
          productionHistory: [
            ...(productTemp.productionHistory ? productTemp.productionHistory : []),
            {
              dateCreated: new Date(),
              amount: data.stocks.reduce((a, b) => a + b.count, 0) - productTemp.stocks.reduce((a, b) => a + b.count, 0)
            }
          ]
        };
      }
    }

    return data;
  };

  const handleUpdateProduct = async () => {
    if (!isUpdateProcess) {
      let data = getValueChanged();

      if (Object.keys(data).length > 0) {
        setIsUpdateProcess(true);

        let storageRef = [];
        if (Object.keys(data).includes('photos')) {
          for (let i = 0; i < 3; i++) {
            if (!(typeof data.images[i] === 'string')) {
              let photoUrl;
              try {
                storageRef.push(ref(storage, `/product-photos/${params.id}-${i + 1}`));
                const snapshot = await uploadBytes(storageRef[storageRef.length - 1], data.images[i]);
                photoUrl = await getDownloadURL(snapshot.ref);
              } catch (e) {
                photoUrl = defaultProductImage;
                showAlertToast('warning', 'Terjadi kesalahan saat mengupload foto');
              }

              const tempPhotos = [...data.photos];
              tempPhotos[i] = photoUrl;
              data = { ...data, photos: tempPhotos };
            }
          }
        }

        updateDoc(doc(db, 'products', params.id), data)
          .catch(() => {
            for (let refStorage in storageRef) {
              deleteObject(refStorage).catch(() => {});
            }
            showAlertToast('warning', 'Terjadi kesalahan, silahkan coba kembali');
            setIsUpdateProcess(false);
          })
          .then(() => {
            showAlertToast('success', 'Berhasil memperbarui informasi produk');
            setIsUpdateProcess(false);
          });
      } else {
        showAlertToast('warning', 'Silahkan isi bagian formulir yang ingin dirubah');
      }
    }
  };

  const handleChangeImage = (index) => (event) => {
    if (event.target?.files?.[0]) {
      const tempSelectedImage = [...selectedImage];
      const tempSelectedImageUrl = [...selectedImageUrl];
      if (tempSelectedImage[index]) {
        URL.revokeObjectURL(tempSelectedImage[index]);
      }
      tempSelectedImage[index] = event.target?.files?.[0];
      tempSelectedImageUrl[index] = URL.createObjectURL(event.target?.files?.[0]);
      setSelectedImage(tempSelectedImage);
      setSelectedImageUrl(tempSelectedImageUrl);
    }
  };

  const handleDeleteImage = (index) => () => {
    URL.revokeObjectURL(selectedImage[index]);
    const tempSelectedImage = [...selectedImage];
    const tempSelectedImageUrl = [...selectedImageUrl];
    tempSelectedImage[index] = null;
    tempSelectedImageUrl[index] = defaultProductImage;
    setSelectedImage(tempSelectedImage);
    setSelectedImageUrl(tempSelectedImageUrl);
  };

  const handleChangeInput = (prop) => (event) => {
    let value = event.target.value;
    if (prop === 'price') {
      value = parseInt(value.replace(/^0+/, '')) ? parseInt(value.replace(/^0+/, '')) : 0;
      value = value > 0 ? value : 0;
    }
    setProduct({ ...product, [prop]: value });
  };

  const handleAddColor = (selectedColor) => {
    setProduct({
      ...product,
      colors: [...product.colors, selectedColor],
      stocks: [...product.stocks, ...product.sizes.map((size) => ({ color: selectedColor, size: size, count: 0 }))]
    });
  };

  const handleDeleteColor = (selectedColor) => {
    setProduct({
      ...product,
      colors: [...product.colors.filter((color) => color !== selectedColor)],
      stocks: [...product.stocks.filter((stock) => stock.color !== selectedColor)]
    });
  };

  const handleAddSize = (selectedSize) => {
    let tempSizes = [...product.sizes, selectedSize];
    tempSizes = [...sizeAvailable.filter((size) => tempSizes.includes(size))];

    setProduct({
      ...product,
      sizes: tempSizes,
      stocks: [
        ...product.colors.map((color) =>
          tempSizes.map((size) => {
            const stock = product.stocks.find((stock) => stock.color === color && stock.size === size);
            return stock
              ? stock
              : {
                  color: color,
                  size: size,
                  count: 0
                };
          })
        )
      ].reduce((a, b) => [...a, ...b], [])
    });
  };

  const handleDeleteSize = (selectedSize) => {
    setProduct({
      ...product,
      sizes: [...product.sizes.filter((size) => size !== selectedSize)],
      stocks: [...product.stocks.filter((stock) => stock.size !== selectedSize)]
    });
  };

  const showAlertToast = (type, text) =>
    setAlertDescription({
      ...alertDescription,
      isOpen: true,
      type: type,
      text: text
    });

  useEffect(() => {
    const listenerProduct = onSnapshot(doc(db, 'products', params.id), (snapshot) => {
      if (snapshot.exists()) {
        setProduct({
          id: snapshot.id,
          ...snapshot.data()
        });
        setProductTemp({
          id: snapshot.id,
          ...snapshot.data()
        });
      } else {
        setProduct(null);
        setProductTemp(null);
      }

      for (let image of selectedImage) {
        if (image !== null) URL.revokeObjectURL(image);
      }
      setSelectedImage([null, null, null]);
    });

    return () => {
      listenerProduct();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return product !== null ? (
    <Fragment>
      <PageRoot>
        <Box>
          <Typography variant="h3" component="h3">
            Data Produk (Edit)
          </Typography>
          <Button variant="contained" onClick={handleUpdateProduct}>
            Simpan Perubahan
          </Button>
        </Box>
        <Box>
          <Box>
            <FormControl variant="outlined" className="input" fullWidth>
              <InputLabel htmlFor="InputId">ID Produk</InputLabel>
              <OutlinedInput readOnly id="InputId" type="name" value={product.id} label="ID Produk" autoComplete="off" fullWidth />
            </FormControl>
          </Box>
          <Box>
            <Typography variant="h4" component="h4">
              Foto Produk
            </Typography>
            <Box>
              {(() => {
                return selectedImageUrl.map((image, index) => (
                  <Box key={index}>
                    <Box
                      gridArea="A"
                      sx={{
                        backgroundImage: `url(${image})`,
                        backgroundRepeat: 'no-repeat'
                      }}
                    />
                    <Box gridArea="B">
                      <input
                        sx={{ margin: 0, padding: 0, width: '100%', height: '100%' }}
                        hidden
                        id={`picture-file-${index}`}
                        accept="image/*"
                        type="file"
                        onChange={handleChangeImage(index)}
                      />
                      <label htmlFor={`picture-file-${index}`} sx={{ margin: 0, padding: 0, width: '100%', height: '100%' }}>
                        <Button variant="contained" component="span">
                          Ubah
                        </Button>
                      </label>
                    </Box>
                    <Box gridArea="C">
                      <Button variant="contained" onClick={handleDeleteImage(index)}>
                        Hapus
                      </Button>
                    </Box>
                  </Box>
                ));
              })()}
            </Box>
          </Box>
          <Box>
            <FormControl variant="outlined" className="input" fullWidth sx={{ marginTop: '8px' }}>
              <InputLabel htmlFor="InputId">ID Produk</InputLabel>
              <OutlinedInput readOnly id="InputId" type="name" value={product.id} label="ID Produk" autoComplete="off" fullWidth />
            </FormControl>
            <FormControl variant="outlined" className="input" fullWidth>
              <InputLabel htmlFor="InputName">Nama Produk</InputLabel>
              <OutlinedInput
                id="InputName"
                type="name"
                value={product.name}
                onChange={handleChangeInput('name')}
                label="Nama Produk"
                autoComplete="off"
                sx={{ marginBottom: '30px' }}
              />
            </FormControl>
            <FormControl fullWidth sx={{ marginBottom: '30px' }}>
              <InputLabel>Kategori</InputLabel>
              <Select value={product.category} label="Kategori" onChange={handleChangeInput('category')}>
                <MenuItem value={'classic'}>Klasik</MenuItem>
                <MenuItem value={'modern'}>Modern</MenuItem>
                <MenuItem value={'motive'}>Motif</MenuItem>
              </Select>
            </FormControl>
            <FormControl variant="outlined" className="input" fullWidth>
              <InputLabel htmlFor="InputDeskripsi">Deskripsi</InputLabel>
              <OutlinedInput
                multiline
                id="InputDeskripsi"
                type="name"
                value={product.description}
                onChange={handleChangeInput('description')}
                label="Deskripsi"
                autoComplete="off"
                sx={{ marginBottom: '30px' }}
              />
            </FormControl>
            <FormControl variant="outlined" className="input" fullWidth>
              <InputLabel htmlFor="InputHarga">Harga</InputLabel>
              <OutlinedInput
                id="InputHarga"
                type="number"
                value={product.price > 0 ? product.price.toString().replace(/^0+/, '') : 0}
                onChange={handleChangeInput('price')}
                label="Harga"
                autoComplete="off"
                sx={{ marginBottom: '30px' }}
              />
            </FormControl>
            <Box>
              <Typography variant="h4" component="h4">
                Warna
              </Typography>
              <Box>
                {(() => {
                  return product.colors.map((color, index) => {
                    return (
                      <Box key={index}>
                        <Box sx={{ backgroundColor: color }} />
                        <Button onClick={() => handleDeleteColor(color)}>
                          <CardMedia component="img" src={IconClose} />
                        </Button>
                      </Box>
                    );
                  });
                })()}
                <Box>
                  <Button onClick={() => setOpenColorPicker(true)}>
                    <CardMedia component="img" src={IconAdd} />
                  </Button>
                </Box>
              </Box>
            </Box>
            <Box>
              <Typography variant="h4" component="h4">
                Ukuran
              </Typography>
              <Box>
                {(() => {
                  return product.sizes.map((size, index) => {
                    return (
                      <Box key={index}>
                        <Box
                          sx={{ backgroundColor: 'rgba(255,255,255,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        >
                          <Typography sx={{ fontWeight: 'bold', fontSize: '11px' }}>{size}</Typography>
                        </Box>
                        <Button onClick={() => handleDeleteSize(size)}>
                          <CardMedia component="img" src={IconClose} />
                        </Button>
                      </Box>
                    );
                  });
                })()}
                <ClickAwayListener onClickAway={() => setOpenClickawaySize(false)}>
                  <Box>
                    <motion.div
                      animate={openClickawaySize ? 'opened' : 'closed'}
                      variants={{ opened: { rotate: 135, scale: 0.8 }, closed: { rotate: 0, scale: 1 } }}
                    >
                      <Button onClick={() => setOpenClickawaySize(!openClickawaySize)}>
                        <CardMedia component="img" src={IconAdd} />
                      </Button>
                    </motion.div>
                    {openClickawaySize ? (
                      <motion.div
                        animate={openClickawaySize ? 'opened' : 'closed'}
                        variants={{
                          opened: {
                            opacity: 1,
                            height: `${sizeAvailable.filter((size) => !product.sizes.includes(size)).length * 30 + 44}px`
                          },
                          closed: { opacity: 0, height: '0px' }
                        }}
                        style={{
                          position: 'absolute',
                          overflow: 'hidden',
                          top: 0,
                          right: 0,
                          left: 0,
                          zIndex: 1,
                          borderRadius: 1000,
                          paddingTop: '40px',
                          display: 'flex',
                          gap: '5px',
                          flexDirection: 'column',
                          alignItems: 'center',
                          backgroundColor: '#CAD9E3',
                          paddingBottom: '8px'
                        }}
                      >
                        {(() => {
                          return sizeAvailable
                            .filter((size) => !product.sizes.includes(size))
                            .map((size, index) => (
                              <Typography
                                key={index}
                                variant="p"
                                component="p"
                                onClick={() => {
                                  setOpenClickawaySize(false);
                                  handleAddSize(size);
                                }}
                                sx={{
                                  cursor: 'pointer',
                                  width: '25px',
                                  height: '25px',
                                  borderRadius: 1000,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  backgroundColor: 'rgba(255,255,255,0.5)',
                                  fontSize: '11px',
                                  fontWeight: 'bold'
                                }}
                              >
                                {size}
                              </Typography>
                            ));
                        })()}
                      </motion.div>
                    ) : null}
                  </Box>
                </ClickAwayListener>
              </Box>
            </Box>
            <Box>
              <Typography variant="h4" component="h4">
                Stok Produk
              </Typography>
              {(() => {
                return product.colors.map((color, i) => {
                  return product.sizes.map((size, j) => {
                    const stock = product.stocks.find((stock) => stock.color === color && stock.size === size);
                    return (
                      <Box key={`${i}${j}`}>
                        <Box sx={{ backgroundColor: color }} />
                        <Box>{size}</Box>
                        <FormControl variant="outlined" className="input" fullWidth>
                          <InputLabel htmlFor={`InputStok-${i}${j}`}>Jumlah</InputLabel>
                          <OutlinedInput
                            id={`InputStok-${i}${j}`}
                            type="number"
                            value={stock ? (stock.count > 0 ? stock.count.toString().replace(/^0+/, '') : stock.count) : 0}
                            onChange={(e) => {
                              const index = product.stocks.findIndex((stock) => stock.color === color && stock.size === size);
                              let tempStock = [...product.stocks];
                              tempStock[index] =
                                index >= 0
                                  ? {
                                      ...tempStock[index],
                                      count: parseInt(e.target.value.replace(/^0+/, '')) ? parseInt(e.target.value.replace(/^0+/, '')) : 0
                                    }
                                  : tempStock;

                              setProduct({
                                ...product,
                                stocks: tempStock
                              });
                            }}
                            label="Jumlah"
                            autoComplete="off"
                            fullWidth
                          />
                        </FormControl>
                      </Box>
                    );
                  });
                });
              })()}
            </Box>
          </Box>
        </Box>
      </PageRoot>
      <ColorPicker open={openColorPicker} onClose={() => setOpenColorPicker(false)} onConfirmed={handleAddColor} />
      <AlertToast description={alertDescription} setDescription={setAlertDescription} />
    </Fragment>
  ) : (
    <EmptyContent />
  );
}

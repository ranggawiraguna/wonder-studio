import { Box, Button, CardMedia, FilledInput, FormControl, InputAdornment, InputLabel, OutlinedInput, Typography } from '@mui/material';
import { db, storage } from 'config/firebase';
import { deleteField, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { Fragment, useEffect, useState } from 'react';
import { defaultProductImage } from 'utils/other/EnvironmentValues';
import IconClose from 'assets/images/icon/CloseCircle.svg';
import IconAdd from 'assets/images/icon/AddCircle.svg';
import PageRoot from './styled';
import ColorPicker from 'components/elements/ColorPicker';
import AlertToast from 'components/elements/AlertToast';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import DialogSingleForm from 'components/views/DialogOthers/DialogSingleForm';
import { stringCapitalize } from 'utils/other/Services';
import { default as utils } from 'lodash';
import { useParams } from 'react-router';
import FieldGroupView from 'components/elements/FieldGroupView';

export default function ProductEditPage() {
  const params = useParams();

  const [isUpdateProcess, setIsUpdateProcess] = useState(false);
  const [isOpenDialogAddModel, setIsOpenDialogAddModel] = useState(false);
  const [isOpenDialogAddSize, setIsOpenDialogAddSize] = useState(false);

  const [openColorPicker, setOpenColorPicker] = useState(false);

  const [selectedImage, setSelectedImage] = useState([null, null, null]);
  const [selectedImageUrl, setSelectedImageUrl] = useState([defaultProductImage, defaultProductImage, defaultProductImage]);

  const [alertDescription, setAlertDescription] = useState({
    isOpen: false,
    type: 'info',
    text: '',
    transitionName: 'slideUp'
  });

  const [product, setProduct] = useState({
    colors: [],
    models: [],
    description: '',
    uom: '',
    name: '',
    images: ['', '', ''],
    price: 0,
    prices: [],
    minimalOrder: 0,
    rating: 0,
    sizes: []
  });
  const [productTemp, setProductTemp] = useState(product);

  const getValueChanged = () => {
    let data = {};
    for (let path of Object.keys(product)) {
      if (!utils.isEqual(product[path], productTemp[path])) {
        data = { ...data, [path]: product[path] };
      }
    }

    if (selectedImage.some((image) => image !== null)) {
      data = { ...data, images: [...selectedImage.map((image, index) => (image ? image : product.images[index]))] };
    }

    return data;
  };

  const handleUpdateProduct = async () => {
    if (!isUpdateProcess) {
      let data = getValueChanged();

      if (Object.keys(data).length > 0) {
        setIsUpdateProcess(true);

        let storageRef = [];
        if (Object.keys(data).includes('images')) {
          for (let i = 0; i < 3; i++) {
            if (!(typeof data.images[i] === 'string')) {
              let photoUrl;
              try {
                storageRef.push(ref(storage, `/product-images/${params.id}-${i + 1}`));
                const snapshot = await uploadBytes(storageRef[storageRef.length - 1], data.images[i]);
                photoUrl = await getDownloadURL(snapshot.ref);
              } catch (e) {
                photoUrl = defaultProductImage;
                showAlertToast('warning', 'Terjadi kesalahan saat mengupload foto');
              }

              const tempPhotos = [...data.images];
              tempPhotos[i] = photoUrl;
              data = { ...data, images: tempPhotos };
            }
          }
        }

        const dataDoc = await getDoc(doc(db, 'products', params.id));
        if (((product.models ?? []).length > 0 || (product.sizes ?? []).length > 0) && dataDoc.get('price')) {
          data = { ...data, price: deleteField() };
          setProduct({ ...product, price: 0 });
        } else if ((product.models ?? []).length === 0 && (product.sizes ?? []).length === 0 && dataDoc.get('prices')) {
          data = { ...data, prices: deleteField() };
          setProduct({ ...product, prices: [] });
        }

        if ((product.models ?? []).length === 0 && dataDoc.get('models')) {
          data = { ...data, models: deleteField() };
          setProduct({ ...product, models: [] });
        }
        if ((product.sizes ?? []).length === 0 && dataDoc.get('sizes')) {
          data = { ...data, sizes: deleteField() };
          setProduct({ ...product, sizes: [] });
        }

        updateDoc(doc(db, 'products', params.id), { ...data })
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

  const handleAddModel = (selectedModel) => {
    if (selectedModel && !(product.models ?? []).includes(selectedModel.toLowerCase().trim())) {
      setProduct({
        ...product,
        models: [...(product.models ?? []), selectedModel.toLowerCase().trim()]
      });
    }
  };

  const handleDeleteModel = (selectedModel) => {
    setProduct({
      ...product,
      models: [...(product.models ?? []).filter((model) => model !== selectedModel)]
    });
  };

  const handleAddColor = (selectedColor) => {
    setProduct({
      ...product,
      colors: [...(product.colors ?? []), selectedColor]
    });
  };

  const handleDeleteColor = (selectedColor) => {
    setProduct({
      ...product,
      colors: [...product.colors.filter((color) => color !== selectedColor)]
    });
  };

  const handleAddSize = (selectedSize) => {
    if (selectedSize && !(product.models ?? []).includes(selectedSize.toLowerCase().trim())) {
      setProduct({
        ...product,
        sizes: [...(product.sizes ?? []), selectedSize.toLowerCase().trim()]
      });
    }
  };

  const handleDeleteSize = (selectedSize) => {
    setProduct({
      ...product,
      sizes: [...(product.sizes ?? []).filter((size) => size !== selectedSize)]
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

  return (
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
            <FieldGroupView title="ID Produk" data={product.id} sx={{ marginBottom: '30px' }} withFrame />
            <FormControl variant="outlined" className="input" fullWidth>
              <InputLabel htmlFor="InputName">Nama Produk</InputLabel>
              <OutlinedInput
                id="InputName"
                fullWidth
                type="name"
                value={product.name}
                onChange={handleChangeInput('name')}
                label="Nama Produk"
                autoComplete="off"
                sx={{ marginBottom: '30px' }}
              />
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
              <InputLabel htmlFor="InputSatuanJumlah">Satuan Jumlah</InputLabel>
              <OutlinedInput
                id="InputSatuanJumlah"
                type="text"
                value={product.uom}
                onChange={handleChangeInput('uom')}
                label="Minimal Order"
                autoComplete="off"
                sx={{ marginBottom: '30px' }}
              />
            </FormControl>
            <FormControl variant="outlined" className="input" fullWidth>
              <InputLabel htmlFor="InputMinimalOrder">Minimal Order</InputLabel>
              <OutlinedInput
                id="InputMinimalOrder"
                value={product.minimalOrder > 0 ? product.minimalOrder.toString().replace(/^0+/, '') : 0}
                onChange={handleChangeInput('minimalOrder')}
                label="Minimal Order"
                autoComplete="off"
                sx={{ marginBottom: '30px' }}
              />
            </FormControl>
            {(product.sizes ?? []).length === 0 && (product.models ?? []).length === 0 ? (
              <FormControl variant="outlined" className="input" fullWidth>
                <InputLabel htmlFor="InputHarga">Harga</InputLabel>
                <OutlinedInput
                  id="InputHarga"
                  value={product.price > 0 ? product.price.toString().replace(/^0+/, '') : 0}
                  onChange={handleChangeInput('price')}
                  label="Harga"
                  autoComplete="off"
                  sx={{ marginBottom: '30px' }}
                />
              </FormControl>
            ) : (
              <></>
            )}
            <Box className="value-list">
              <Box>
                <Typography variant="h4" component="h4">
                  Warna
                </Typography>
                <Box>
                  {(() => {
                    return (product.colors ?? []).map((color, index) => {
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
                  Jenis
                </Typography>
                <Box>
                  {(() => {
                    return (product.models ?? []).map((model, index) => {
                      return (
                        <Box key={index}>
                          <Box
                            sx={{
                              backgroundColor: 'white',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center'
                            }}
                          >
                            <Typography sx={{ fontWeight: 'bold', fontSize: '12px' }}>{stringCapitalize(model)}</Typography>
                          </Box>
                          <Button onClick={() => handleDeleteModel(model)}>
                            <CardMedia component="img" src={IconClose} />
                          </Button>
                        </Box>
                      );
                    });
                  })()}
                  <Box>
                    <Button onClick={() => setIsOpenDialogAddModel(true)}>
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
                    return (product.sizes ?? []).map((size, index) => {
                      return (
                        <Box key={index}>
                          <Box
                            sx={{
                              backgroundColor: 'white',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center'
                            }}
                          >
                            <Typography sx={{ fontWeight: 'bold', fontSize: '12px' }}>{stringCapitalize(size)}</Typography>
                          </Box>
                          <Button onClick={() => handleDeleteSize(size)}>
                            <CardMedia component="img" src={IconClose} />
                          </Button>
                        </Box>
                      );
                    });
                  })()}
                  <Box>
                    <Button onClick={() => setIsOpenDialogAddSize(true)}>
                      <CardMedia component="img" src={IconAdd} />
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
            {(() => {
              if ((product.sizes ?? []).length > 0 || (product.models ?? []).length > 0) {
                let items = [];
                if ((product.sizes ?? []).length > 0 && (product.models ?? []).length > 0) {
                  for (let model of product.models) {
                    if ((product.sizes ?? []).length > 0) {
                      for (let size of product.sizes) {
                        items.push([model, size]);
                      }
                    } else {
                      items.push([model]);
                    }
                  }
                } else {
                  for (let item of (product.models ?? []).length > 0 ? product.models : product.sizes) {
                    items.push([item]);
                  }
                }

                return (
                  <Box>
                    <Typography variant="h4" component="h4" sx={{ color: '#666666', marginLeft: '2px', marginBottom: 1 }}>
                      Daftar Harga
                    </Typography>
                    {items.map((item) => (
                      <Box key={item} sx={{ marginBottom: 2 }}>
                        <Box sx={{ display: 'flex' }}>
                          {item.map((i) => (
                            <Box
                              key={i}
                              sx={{
                                backgroundColor: 'white',
                                display: 'flex',
                                justifyContent: 'center',
                                padding: '5px 15px',
                                borderRadius: 1000,
                                border: '1px solid rgba(0,0,0,0.1)',
                                marginBottom: 1,
                                alignItems: 'center'
                              }}
                            >
                              <Typography sx={{ fontWeight: 'bold', fontSize: '12px' }}>{stringCapitalize(i)}</Typography>
                            </Box>
                          ))}
                        </Box>
                        <Box>
                          <FormControl fullWidth variant="filled">
                            <InputLabel>Harga</InputLabel>
                            <FilledInput
                              value={
                                parseInt((product.prices ?? []).find((price) => price.fields.join(',') === item.join(','))?.value || 0) > 0
                                  ? ((product.prices ?? []).find((price) => price.fields.join(',') === item.join(','))?.value || 0).toString().replace(/^0+/, '')
                                  : 0
                              }
                              onChange={(_) => {
                                const tempPrices = [...(product.prices ?? [])];
                                const priceIndex = tempPrices.findIndex((price) => price.fields.join(',') === item.join(','));
                                const value = (_.target.value ?? '').replace(/^0+/, '');

                                if (priceIndex >= 0) {
                                  tempPrices[priceIndex].value = parseInt(value);
                                } else {
                                  tempPrices.push({
                                    fields: item,
                                    value: parseInt(value)
                                  });
                                }

                                setProduct({
                                  ...product,
                                  prices: [...tempPrices]
                                });
                                console.log(tempPrices);
                              }}
                              startAdornment={<InputAdornment position="start">Rp. </InputAdornment>}
                            />
                          </FormControl>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                );
              } else {
                return <></>;
              }
            })()}
          </Box>
        </Box>
      </PageRoot>
      <ColorPicker open={openColorPicker} onClose={() => setOpenColorPicker(false)} onConfirmed={handleAddColor} />
      <DialogSingleForm
        open={isOpenDialogAddModel}
        onClose={() => setIsOpenDialogAddModel(false)}
        onConfirmed={handleAddModel}
        title="Masukkan Jenis Produk"
        label="Jenis Produk"
        type="text"
      />
      <DialogSingleForm
        open={isOpenDialogAddSize}
        onClose={() => setIsOpenDialogAddSize(false)}
        onConfirmed={handleAddSize}
        title="Masukkan Ukuran Produk"
        label="Ukuran Produk"
        type="text"
      />
      <AlertToast description={alertDescription} setDescription={setAlertDescription} />
    </Fragment>
  );
}

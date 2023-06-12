import { Avatar, Box, Button, FormControl, OutlinedInput, Typography } from '@mui/material';
import { db } from 'config/firebase';
import { addDoc, collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { dateFormatter, stringCapitalize } from 'utils/other/Services';

export default function ProductDiscussion({ productId, showAlert, disableComment = false }) {
  const accountReducer = useSelector((state) => state.accountReducer);

  const [currentComment, setCurrentComment] = useState('');
  const [discussions, setDiscussions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddDiscussion = async () => {
    if (!isLoading && currentComment.length > 0) {
      setIsLoading(true);
      await addDoc(collection(db, 'discussions'), {
        productId: productId,
        userId: accountReducer.id,
        role: accountReducer.role,
        date: new Date(),
        text: currentComment
      }).catch(() => {
        showAlert('error', 'Terjadi kesalahan, silahkan coba lagi');
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      const listenerDiscussions = onSnapshot(query(collection(db, 'discussions'), where('productId', '==', productId)), (snapshot) =>
        setDiscussions(snapshot.docs.map((document) => ({ id: document.id, ...document.data() })).sort((a, b) => a.date - b.date))
      );

      return () => {
        listenerDiscussions();
      };
    }
  }, [productId]);

  useEffect(() => {
    if (productId) {
      const listenerAdmins = onSnapshot(collection(db, 'customers'), (snapshot) =>
        setCustomers(snapshot.docs.map((document) => ({ id: document.id, ...document.data() })))
      );
      const listenerCustomers = onSnapshot(collection(db, 'admins'), (snapshot) =>
        setAdmins(snapshot.docs.map((document) => ({ id: document.id, ...document.data() })))
      );

      return () => {
        listenerAdmins();
        listenerCustomers();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discussions]);

  return (
    <Box>
      <Typography variant="h3">Diskusi Produk</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '20px 0' }}>
        {discussions.length > 0 ? (
          discussions.map((_, __) => (
            <Box key={__} sx={{ display: 'flex', gap: 2 }}>
              <Avatar
                sx={{ width: 40, height: 40 }}
                src={(_.role === 'customer' ? customers : admins).find((__) => __.id === _.userId)?.photoUrl}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: 0.25 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Typography variant="h5">
                    {(_.role === 'customer' ? customers : admins).find((__) => __.id === _.userId)?.fullname ?? ' '}
                  </Typography>
                  <Typography variant="h5" sx={{ opacity: 0.4 }}>
                    ({stringCapitalize(_.userId === accountReducer.id ? 'Anda' : _.role)})
                  </Typography>
                </Box>
                <Typography variant="p">{dateFormatter(_.date, 'd MMMM yyyy - HH:mm')}</Typography>
                <Typography variant="p">{_.text}</Typography>
              </Box>
            </Box>
          ))
        ) : (
          <Box sx={{ backgroundColor: 'rgba(255,255,255,0.4)', padding: 1, borderRadius: 1, marginTop: -1 }}>
            <Typography variant="h5">Belum ada dikusi mengenai produk ini</Typography>
          </Box>
        )}
        {disableComment ? (
          <></>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Avatar sx={{ width: 40, height: 40 }} src={accountReducer.photoUrl} />
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, marginTop: 0.25 }}>
              <Typography variant="h5">{accountReducer.fullname}</Typography>
              <Typography variant="p" sx={{ marginBottom: 1 }}>
                Komentar kamu
              </Typography>
              <FormControl variant="outlined" fullWidth>
                <OutlinedInput
                  multiline
                  fullWidth
                  minRows={3}
                  type="text"
                  placeholder="Berikan komentar kamu terkait produk"
                  value={currentComment}
                  onChange={(_) => setCurrentComment(_.target.value)}
                  autoComplete="off"
                  sx={{ marginBottom: '10px' }}
                />
              </FormControl>
              <Button variant="contained" sx={{ alignSelf: 'flex-end' }} onClick={handleAddDiscussion}>
                Berikan komentar
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

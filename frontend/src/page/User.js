import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const imganimal = [
  'https://cdn.pixabay.com/photo/2014/11/30/14/11/cat-551554_640.jpg',
  'https://img.freepik.com/premium-photo/happy-puppy-dog-smiling-isolated-purple-background_77749-593.jpg',
  'https://i.pinimg.com/736x/f5/97/35/f597358c6fec2c0fa44a06003b69a872.jpg',
];

const listuser = [
  { userid: 'f035', password: '123456' },
  { userid: 'u035', password: '1234' },
];

const defaultTheme = createTheme();

export default function SignIn() {
  const [loginStatus, setLoginStatus] = React.useState(localStorage.getItem('loginStatus') || null);
  const [userImage, setUserImage] = React.useState(localStorage.getItem('userImage') || '');

  const handleLogout = () => {
    localStorage.removeItem('loginStatus');
    localStorage.removeItem('userImage'); // Remove the stored userImage
    setLoginStatus(null);
    setUserImage('');
  };

  const getRandomUserImage = () => {
    const storedUserImage = localStorage.getItem('userImage');
    if (storedUserImage) {
      // If userImage is already stored, use it
      setUserImage(storedUserImage);
    } else {
      // Otherwise, generate a random user image
      const randomIndex = Math.floor(Math.random() * imganimal.length);
      const newUserImage = imganimal[randomIndex];
      setUserImage(newUserImage);
      localStorage.setItem('userImage', newUserImage); // Store the userImage
    }
  };

  React.useEffect(() => {
    getRandomUserImage();
  }, []); // Get a random user image when the component mounts

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const enteredUserId = data.get('userid');
    const enteredPassword = data.get('password');

    const matchingUser = listuser.find((user) => {
      return user.userid === enteredUserId && user.password === enteredPassword;
    });

    if (matchingUser) {
      setLoginStatus('Success');
      console.log('Success');
      localStorage.setItem('loginStatus', 'Success');
    } else {
      setLoginStatus('Fail');
      console.log('Failed');
      localStorage.setItem('loginStatus', 'Fail');
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {loginStatus === 'Success' ? (
            <Box>
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 200, height: 200 }}>
                <img src={userImage} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Avatar>
              <Typography variant="h6" color="primary">
                <div style={{ textAlign: 'center' }}>Success</div>
              </Typography>
              <Button
                onClick={handleLogout}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Logout
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="userid"
                label="User ID"
                name="userid"
                autoComplete="userid"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              {loginStatus === 'Fail' && (
                <Typography variant="body2" color="error" align="center">
                  กรอกรหัสให้ถูกต้อง.
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

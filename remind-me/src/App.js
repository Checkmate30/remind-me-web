// Remind Me - React Web App with Material UI
// Functionality: User-defined recurring browser notifications

import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  Box,
  Paper,
  CssBaseline,
  IconButton,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Brightness4, Brightness7 } from '@mui/icons-material';

export default function App() {
  const [enabled, setEnabled] = useState(() => localStorage.getItem('remindersEnabled') === 'true');
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('soundEnabled') === 'true');
  const [startHour, setStartHour] = useState(() => parseInt(localStorage.getItem('startHour') || '9'));
  const [endHour, setEndHour] = useState(() => parseInt(localStorage.getItem('endHour') || '17'));
  const [intervalMinutes, setIntervalMinutes] = useState(() => parseInt(localStorage.getItem('intervalMinutes') || '30'));
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('remindersEnabled', enabled);
    localStorage.setItem('soundEnabled', soundEnabled);
    localStorage.setItem('startHour', startHour);
    localStorage.setItem('endHour', endHour);
    localStorage.setItem('intervalMinutes', intervalMinutes);
    localStorage.setItem('darkMode', darkMode);
  }, [enabled, soundEnabled, startHour, endHour, intervalMinutes, darkMode]);

  useEffect(() => {
    let interval;
    if (enabled) {
      interval = setInterval(() => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();

        if (
          hours >= startHour &&
          hours <= endHour &&
          ((hours > startHour || minutes >= 0) && (hours < endHour || minutes <= 59)) &&
          (minutes % intervalMinutes === 0)
        ) {
          new Notification('Check TradingView 📈', {
            body: 'Time to check your chart!',
          });

          if (soundEnabled) {
            const audio = new Audio('/ding.mp3');
            audio.play();
          }
        }
      }, 60000); // Check every minute
    }
    return () => clearInterval(interval);
  }, [enabled, soundEnabled, startHour, endHour, intervalMinutes]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ mt: 6, px: 2 }}>
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" gutterBottom>
              Remind Me
            </Typography>
            <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Box>

          <FormControlLabel
            control={<Switch checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />}
            label="Enable Reminders"
          />

          <FormControlLabel
            control={<Switch checked={soundEnabled} onChange={(e) => setSoundEnabled(e.target.checked)} />}
            label="Play Sound"
          />

          <Box sx={{ mt: 3 }}>
            <Typography variant="body1">Start Hour:</Typography>
            <Select fullWidth value={startHour} onChange={(e) => setStartHour(parseInt(e.target.value))}>
              {Array.from({ length: 24 }, (_, i) => (
                <MenuItem key={i} value={i}>{`${i}:00`}</MenuItem>
              ))}
            </Select>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">End Hour:</Typography>
            <Select fullWidth value={endHour} onChange={(e) => setEndHour(parseInt(e.target.value))}>
              {Array.from({ length: 24 }, (_, i) => (
                <MenuItem key={i} value={i}>{`${i}:00`}</MenuItem>
              ))}
            </Select>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">Reminder Interval (minutes):</Typography>
            <Select fullWidth value={intervalMinutes} onChange={(e) => setIntervalMinutes(parseInt(e.target.value))}>
              {[15, 30, 45, 60].map((min) => (
                <MenuItem key={min} value={min}>{`${min} minutes`}</MenuItem>
              ))}
            </Select>
          </Box>

          <Typography variant="body2" color="textSecondary" sx={{ mt: 4 }}>
            You'll get reminders every {intervalMinutes} minutes between the selected hours.
          </Typography>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

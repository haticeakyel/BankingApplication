import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton,
  Menu, MenuItem, Avatar, Drawer, List, ListItem, ListItemIcon,
  ListItemText, ListItemButton
} from '@mui/material';
import {
  AccountBalance, Dashboard, SwapHoriz, History, Logout,
  Menu as MenuIcon, Person
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    navigate('/login');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
    { label: 'Accounts', path: '/accounts', icon: <AccountBalance /> },
    { label: 'Transfer Money', path: '/transfer', icon: <SwapHoriz /> },
  ];

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const handleDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h6">
          Mini Banking
        </Typography>
        {user && (
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Welcome, {user.username || 'User'}
          </Typography>
        )}
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={isActivePath(item.path)}
              onClick={() => {
                navigate(item.path);
                setMobileDrawerOpen(false);
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  if (!user) {
    return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Mini Banking App
          </Typography>
          {location.pathname !== '/login' && location.pathname !== '/register' && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button color="inherit" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate('/register')}>
                Register
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Mini Banking App
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1, mr: 2 }}>
            {menuItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                onClick={() => navigate(item.path)}
                sx={{
                  bgcolor: isActivePath(item.path) ? 'rgba(255,255,255,0.1)' : 'transparent',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                }}
                startIcon={item.icon}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body1" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {user.username || 'User'}
            </Typography>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="user-menu"
              aria-haspopup="true"
              onClick={handleUserMenuOpen}
              color="inherit"
            >
              <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                <Person />
              </Avatar>
            </IconButton>
            <Menu
              id="user-menu"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleUserMenuClose}
            >
              <MenuItem onClick={handleUserMenuClose} disabled>
                <Person sx={{ mr: 1 }} />
                {user.username || 'User'}
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileDrawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
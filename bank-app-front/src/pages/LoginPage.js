import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box, Alert, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    
    const result = await login(formData);
    
    if (result.success) {
      setMessage({ type: "success", text: "Login successful" });
      navigate("/dashboard");
    } else {
      setMessage({
        type: "error",
        text: result.error || "Login failed",
      });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>Login</Typography>
        {message && <Alert severity={message.type}>{message.text}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField 
            fullWidth 
            margin="normal" 
            label="Username" 
            name="username" 
            value={formData.username} 
            onChange={handleChange} 
            required 
          />
          <TextField 
            fullWidth 
            margin="normal" 
            label="Password" 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
          />
          <Button 
            variant="contained" 
            color="primary" 
            type="submit"
            fullWidth
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <Box mt={2}>
          <Typography variant="body2" align="center">
            Don't have an account?{" "}
            <Link component={RouterLink} to="/register">
              Register
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
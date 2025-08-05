import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box, Alert, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const [formData, setFormData] = useState({ 
    username: "", 
    password: "", 
    email: "" 
  });
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (formData.password.length < 6) {
        setMessage({ type: "error", text: "Password must be at least 6 characters" });
        return;
      }
    
    const result = await register(formData);
    
    if (result.success) {
      setMessage({ type: "success", text: "Registration successful" });
      navigate("/login");
    } else {
      setMessage({
        type: "error",
        text: result.error || "Registration failed",
      });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>Register</Typography>
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
            label="Email" 
            type="email"
            name="email" 
            value={formData.email} 
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
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>
        <Box mt={2}>
          <Typography variant="body2" align="center">
            Already have an account?{" "}
            <Link component={RouterLink} to="/login">
              Login
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;
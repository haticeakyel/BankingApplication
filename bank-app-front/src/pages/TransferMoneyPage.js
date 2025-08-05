import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import {
    Container, Typography, Box, Paper, TextField, Button,
    Card, CardContent, Grid, Alert, Snackbar, MenuItem,
    Divider, InputAdornment
} from "@mui/material";
import { Send, AccountBalance, SwapHoriz } from "@mui/icons-material";

const TransferMoneyPage = () => {
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([]);
    const [transferData, setTransferData] = useState({
        fromAccountId: "",
        toAccountId: "",
        amount: ""
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "success" });

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const response = await api.post("/accounts/search");
            setAccounts(response.data);
        } catch (err) {
            setSnackbar({ open: true, message: "Failed to fetch accounts", type: "error" });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!transferData.fromAccountId) {
            newErrors.fromAccountId = "Please select a source account";
        }
        
        if (!transferData.toAccountId) {
            newErrors.toAccountId = "Please select a destination account";
        }
        
        if (transferData.fromAccountId === transferData.toAccountId) {
            newErrors.toAccountId = "Source and destination accounts cannot be the same";
        }
        
        if (!transferData.amount || parseFloat(transferData.amount) <= 0) {
            newErrors.amount = "Please enter a valid amount";
        }
        
        const fromAccount = accounts.find(acc => acc.id === transferData.fromAccountId);
        if (fromAccount && parseFloat(transferData.amount) > (fromAccount.balance || 0)) {
            newErrors.amount = "Insufficient balance in source account";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTransferData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const handleTransfer = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            await api.post("/transactions/transfer", {
                fromAccountId: transferData.fromAccountId,
                toAccountId: transferData.toAccountId,
                amount: parseFloat(transferData.amount)
            });

            setSnackbar({ 
                open: true, 
                message: "Transfer completed successfully!", 
                type: "success" 
            });
            setTransferData({
                fromAccountId: "",
                toAccountId: "",
                amount: ""
            });
            fetchAccounts();

        } catch (err) {
            const errorMessage = err.response?.data?.message || "Transfer failed";
            setSnackbar({ open: true, message: errorMessage, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const getFromAccount = () => {
        return accounts.find(acc => acc.id === transferData.fromAccountId);
    };

    const getToAccount = () => {
        return accounts.find(acc => acc.id === transferData.toAccountId);
    };

    const getAvailableToAccounts = () => {
        return accounts.filter(acc => acc.id !== transferData.fromAccountId);
    };

    return (
        <Container maxWidth="md">
            <Box mt={4}>
                <Typography variant="h4" gutterBottom display="flex" alignItems="center" gap={1}>
                    <SwapHoriz />
                    Transfer Money
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Paper sx={{ p: 3 }}>
                            <form onSubmit={handleTransfer}>
                                <Box display="flex" flexDirection="column" gap={3}>
                                    <TextField
                                        select
                                        label="From Account"
                                        name="fromAccountId"
                                        value={transferData.fromAccountId}
                                        onChange={handleInputChange}
                                        error={!!errors.fromAccountId}
                                        helperText={errors.fromAccountId}
                                        fullWidth
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AccountBalance />
                                                </InputAdornment>
                                            ),
                                        }}
                                    >
                                        {accounts.map((account) => (
                                            <MenuItem key={account.id} value={account.id}>
                                                {account.name} ({account.number}) - ${account.balance?.toFixed(2)}
                                            </MenuItem>
                                        ))}
                                    </TextField>

                                    <TextField
                                        select
                                        label="To Account"
                                        name="toAccountId"
                                        value={transferData.toAccountId}
                                        onChange={handleInputChange}
                                        error={!!errors.toAccountId}
                                        helperText={errors.toAccountId}
                                        fullWidth
                                        required
                                        disabled={!transferData.fromAccountId}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AccountBalance />
                                                </InputAdornment>
                                            ),
                                        }}
                                    >
                                        {getAvailableToAccounts().map((account) => (
                                            <MenuItem key={account.id} value={account.id}>
                                                {account.name} ({account.number})
                                            </MenuItem>
                                        ))}
                                    </TextField>

                                    <TextField
                                        label="Amount"
                                        name="amount"
                                        type="number"
                                        value={transferData.amount}
                                        onChange={handleInputChange}
                                        error={!!errors.amount}
                                        helperText={errors.amount}
                                        fullWidth
                                        required
                                        inputProps={{ 
                                            min: "0.01", 
                                            step: "0.01",
                                            max: getFromAccount()?.balance || undefined
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    $
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <Box display="flex" gap={2} justifyContent="flex-end">
                                        <Button 
                                            variant="outlined" 
                                            onClick={() => navigate("/accounts")}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            startIcon={<Send />}
                                            disabled={loading}
                                        >
                                            {loading ? "Processing..." : "Transfer Money"}
                                        </Button>
                                    </Box>
                                </Box>
                            </form>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Transfer Summary
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                
                                <Box display="flex" flexDirection="column" gap={2}>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            From Account:
                                        </Typography>
                                        <Typography variant="body1">
                                            {getFromAccount() ? 
                                                `${getFromAccount().name} (${getFromAccount().number})` : 
                                                "Select an account"
                                            }
                                        </Typography>
                                        {getFromAccount() && (
                                            <Typography variant="caption" color="text.secondary">
                                                Available: ${getFromAccount().balance?.toFixed(2)}
                                            </Typography>
                                        )}
                                    </Box>

                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            To Account:
                                        </Typography>
                                        <Typography variant="body1">
                                            {getToAccount() ? 
                                                `${getToAccount().name} (${getToAccount().number})` : 
                                                "Select an account"
                                            }
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Amount:
                                        </Typography>
                                        <Typography variant="h6" color="primary">
                                            {transferData.amount ? `$${parseFloat(transferData.amount)?.toFixed(2)}` : "$0.00"}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>

                        {accounts.length === 0 && (
                            <Alert severity="info" sx={{ mt: 2 }}>
                                You need at least 2 accounts to make transfers.
                            </Alert>
                        )}
                    </Grid>
                </Grid>
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert severity={snackbar.type}>{snackbar.message}</Alert>
            </Snackbar>
        </Container>
    );
};

export default TransferMoneyPage;
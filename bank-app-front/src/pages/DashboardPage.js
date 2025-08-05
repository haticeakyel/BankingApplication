import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import {
    Container, Typography, Box, Grid, Card, CardContent,
    Button, List, ListItem, ListItemText, Chip, Paper,
    IconButton, Divider, Alert
} from "@mui/material";
import {
    AccountBalance, TrendingUp, TrendingDown, Add,
    SwapHoriz, History, Visibility
} from "@mui/icons-material";

const DashboardPage = () => {
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const accountsResponse = await api.post("/accounts/search");
            setAccounts(accountsResponse.data);
            if (accountsResponse.data.length > 0) {
                const transactionPromises = accountsResponse.data.map(account =>
                    api.get(`/transactions/account/${account.id}`).catch(() => ({ data: [] }))
                );
                const transactionResponses = await Promise.all(transactionPromises);
                
                const allTransactions = transactionResponses
                    .flatMap(response => response.data)
                    .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))
                    .slice(0, 5); 
                
                setRecentTransactions(allTransactions);
            }
        } catch (err) {
            setError("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const getTotalBalance = () => {
        return accounts.reduce((total, account) => total + (account.balance || 0), 0);
    };

    const getTransactionType = (transaction, accountId) => {
        if (transaction.from?.id === accountId) {
            return { type: "outgoing", label: "Sent", icon: <TrendingDown />, color: "error" };
        } else {
            return { type: "incoming", label: "Received", icon: <TrendingUp />, color: "success" };
        }
    };

    const getAccountForTransaction = (transaction) => {
        return accounts.find(acc => 
            acc.id === transaction.from?.id || acc.id === transaction.to?.id
        );
    };

    if (loading) return <Typography>Loading dashboard...</Typography>;

    return (
        <Container maxWidth="lg">
            <Box mt={4}>
                <Typography variant="h4" gutterBottom>
                    Dashboard
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography color="text.secondary" gutterBottom>
                                            Total Balance
                                        </Typography>
                                        <Typography variant="h5" color="primary">
                                            ${getTotalBalance()?.toFixed(2)}
                                        </Typography>
                                    </Box>
                                    <AccountBalance color="primary" sx={{ fontSize: 40 }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography color="text.secondary" gutterBottom>
                                            Total Accounts
                                        </Typography>
                                        <Typography variant="h5">
                                            {accounts.length}
                                        </Typography>
                                    </Box>
                                    <AccountBalance sx={{ fontSize: 40 }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography color="text.secondary" gutterBottom>
                                            Recent Transactions
                                        </Typography>
                                        <Typography variant="h5">
                                            {recentTransactions.length}
                                        </Typography>
                                    </Box>
                                    <SwapHoriz sx={{ fontSize: 40 }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography color="text.secondary" gutterBottom>
                                            Quick Transfer
                                        </Typography>
                                        <Button 
                                            variant="contained" 
                                            size="small"
                                            onClick={() => navigate("/transfer")}
                                            disabled={accounts.length < 2}
                                        >
                                            Transfer
                                        </Button>
                                    </Box>
                                    <SwapHoriz color="primary" sx={{ fontSize: 40 }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} lg={8}>
                        <Paper sx={{ p: 2 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6">
                                    Your Accounts
                                </Typography>
                                <Button 
                                    startIcon={<Add />}
                                    variant="outlined"
                                    onClick={() => navigate("/accounts")}
                                >
                                    Manage Accounts
                                </Button>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            
                            {accounts.length === 0 ? (
                                <Box textAlign="center" py={4}>
                                    <Typography color="text.secondary" gutterBottom>
                                        No accounts found
                                    </Typography>
                                    <Button 
                                        variant="contained" 
                                        startIcon={<Add />}
                                        onClick={() => navigate("/accounts")}
                                    >
                                        Create Your First Account
                                    </Button>
                                </Box>
                            ) : (
                                <Grid container spacing={2}>
                                    {accounts.slice(0, 4).map((account) => (
                                        <Grid item xs={12} sm={6} key={account.id}>
                                            <Card variant="outlined">
                                                <CardContent>
                                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                                        <Box>
                                                            <Typography variant="h6" gutterBottom>
                                                                {account.name}
                                                            </Typography>
                                                            <Typography color="text.secondary" variant="body2">
                                                                {account.number}
                                                            </Typography>
                                                            <Typography variant="h6" color="primary" mt={1}>
                                                                ${account.balance?.toFixed(2) || 0.00}
                                                            </Typography>
                                                        </Box>
                                                        <Box>
                                                            <IconButton 
                                                                size="small"
                                                                onClick={() => navigate(`/transactions/${account.id}`)}
                                                                title="View History"
                                                            >
                                                                <History />
                                                            </IconButton>
                                                            <IconButton 
                                                                size="small"
                                                                onClick={() => navigate("/accounts")}
                                                                title="View Details"
                                                            >
                                                                <Visibility />
                                                            </IconButton>
                                                        </Box>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </Paper>
                    </Grid>

                    {/* Recent Transactions */}
                    <Grid item xs={12} lg={4}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Recent Activity
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            
                            {recentTransactions.length === 0 ? (
                                <Typography color="text.secondary" align="center" py={2}>
                                    No recent transactions
                                </Typography>
                            ) : (
                                <List dense>
                                    {recentTransactions.map((transaction, index) => {
                                        const account = getAccountForTransaction(transaction);
                                        const transactionInfo = getTransactionType(transaction, account?.id);
                                        
                                        return (
                                            <ListItem key={transaction.id} divider={index < recentTransactions.length - 1}>
                                                <ListItemText
                                                    primary={
                                                        <Box display="flex" alignItems="center" gap={1}>
                                                            {transactionInfo.icon}
                                                            <Typography variant="body2">
                                                                {transactionInfo.label}
                                                            </Typography>
                                                            <Chip 
                                                                label={`$${transaction.amount?.toFixed(2)}`}
                                                                size="small"
                                                                color={transactionInfo.color}
                                                            />
                                                        </Box>
                                                    }
                                                    secondary={
                                                        <Typography variant="caption">
                                                            {new Date(transaction.transactionDate).toLocaleDateString()}
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            )}
                        </Paper>
                    </Grid>
                </Grid>

                {/* Quick Actions */}
                <Box mt={3}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Quick Actions
                        </Typography>
                        <Box display="flex" gap={2} flexWrap="wrap">
                            <Button 
                                variant="contained" 
                                startIcon={<Add />}
                                onClick={() => navigate("/accounts")}
                            >
                                Create Account
                            </Button>
                            <Button 
                                variant="outlined" 
                                startIcon={<SwapHoriz />}
                                onClick={() => navigate("/transfer")}
                                disabled={accounts.length < 2}
                            >
                                Transfer Money
                            </Button>
                            <Button 
                                variant="outlined" 
                                startIcon={<AccountBalance />}
                                onClick={() => navigate("/accounts")}
                            >
                                View All Accounts
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </Container>
    );
};

export default DashboardPage;
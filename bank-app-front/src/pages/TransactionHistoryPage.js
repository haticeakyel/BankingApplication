import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import {
    Container, Typography, Box, Paper, Table, TableHead, 
    TableRow, TableCell, TableBody, Chip, Button, Alert,
    Card, CardContent, Divider
} from "@mui/material";
import { ArrowBack, TrendingUp, TrendingDown } from "@mui/icons-material";

const TransactionHistoryPage = () => {
    const { accountId } = useParams();
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchTransactionHistory();
        fetchAccountDetails();
    }, [accountId]);

    const fetchTransactionHistory = async () => {
        try {
            const response = await api.get(`/transactions/account/${accountId}`);
            setTransactions(response.data);
        } catch (err) {
            setError("Failed to fetch transaction history");
        } finally {
            setLoading(false);
        }
    };

    const fetchAccountDetails = async () => {
        try {
            const response = await api.get(`/accounts/${accountId}`);
            setAccount(response.data);
        } catch (err) {
            setError("Failed to fetch account details");
        }
    };

    const getTransactionType = (transaction) => {
        if (transaction.from?.id === accountId) {
            return { type: "outgoing", label: "Sent", icon: <TrendingDown />, color: "error" };
        } else {
            return { type: "incoming", label: "Received", icon: <TrendingUp />, color: "success" };
        }
    };

    const formatAmount = (transaction) => {
        const { type } = getTransactionType(transaction);
        const sign = type === "outgoing" ? "-" : "+";
        return `${sign}${(transaction.amount || 0).toFixed(2)}`;
    };

    const getOtherAccount = (transaction) => {
        if (transaction.from?.id === accountId) {
            return transaction.to;
        } else {
            return transaction.from;
        }
    };

    if (loading) return <Typography>Loading...</Typography>;

    return (
        <Container maxWidth="lg">
            <Box mt={4}>
                <Button 
                    startIcon={<ArrowBack />} 
                    onClick={() => navigate("/accounts")}
                    sx={{ mb: 2 }}
                >
                    Back to Accounts
                </Button>

                {account && (
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Transaction History
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                                Account: {account.name} ({account.number})
                            </Typography>
                            <Typography variant="h6" color="primary">
                                Current Balance: ${(account.balance || 0).toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Paper>
                    <Box p={2}>
                        <Typography variant="h6" gutterBottom>
                            Recent Transactions ({transactions.length})
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        
                        {transactions.length === 0 ? (
                            <Typography color="text.secondary" align="center" py={4}>
                                No transactions found for this account.
                            </Typography>
                        ) : (
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Other Account</TableCell>
                                        <TableCell align="right">Amount</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {transactions.map((transaction) => {
                                        const transactionInfo = getTransactionType(transaction);
                                        const otherAccount = getOtherAccount(transaction);
                                        
                                        return (
                                            <TableRow key={transaction.id}>
                                                <TableCell>
                                                    {new Date(transaction.transactionDate).toLocaleString()}
                                                </TableCell>
                                                <TableCell>
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        {transactionInfo.icon}
                                                        <Typography color={transactionInfo.color}>
                                                            {transactionInfo.label}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    {otherAccount ? (
                                                        <Box>
                                                            <Typography variant="body2" fontWeight="bold">
                                                                {otherAccount.name}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {otherAccount.number}
                                                            </Typography>
                                                        </Box>
                                                    ) : (
                                                        <Typography color="text.secondary">
                                                            Unknown Account
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography 
                                                        color={transactionInfo.color}
                                                        fontWeight="bold"
                                                    >
                                                        {formatAmount(transaction)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={transaction.status}
                                                        color={transaction.status === "SUCCESS" ? "success" : "error"}
                                                        size="small"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        )}
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default TransactionHistoryPage;
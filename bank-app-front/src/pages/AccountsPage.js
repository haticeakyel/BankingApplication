import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import {
    Container, Typography, Box, TextField, Button,
    Table, TableHead, TableRow, TableCell, TableBody,
    Dialog, DialogTitle, DialogContent, DialogActions,
    IconButton, Alert, Tooltip, Snackbar
} from "@mui/material";
import { Add, Edit, Delete, SwapHoriz, History } from "@mui/icons-material";

const AccountsPage = () => {
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([]);
    const [filters, setFilters] = useState({ name: "", number: "" });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "success" });
    const [transferDialogOpen, setTransferDialogOpen] = useState(false);
    const [transferData, setTransferData] = useState({
        from: null,
        to: "",
        amount: 0,
        deleteAfterTransfer: false,
        pendingDeletion: false
    });

    const fetchAccounts = async (filter = filters) => {
        try {
          const params = new URLSearchParams();
          if (filter.name && filter.name.trim() !== "") params.append("name", filter.name.trim());
          if (filter.number && filter.number.trim() !== "") params.append("number", filter.number.trim());
      
          const response = await api.post(`/accounts/search?${params.toString()}`);
          setAccounts(response.data);
        } catch (err) {
          setSnackbar({ open: true, message: "Failed to fetch accounts", type: "error" });
        }
      };
      

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = () => {
        fetchAccounts();
    };

    const handleOpenDialog = (account = null) => {
        setEditingAccount(account);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setEditingAccount(null);
        setDialogOpen(false);
    };

    const handleSaveAccount = async () => {
        try {
            if (editingAccount.id) {
                await api.put(`/accounts/${editingAccount.id}`, editingAccount);
                setSnackbar({ open: true, message: "Account updated", type: "success" });
            } else {
                await api.post("/accounts", editingAccount);
                setSnackbar({ open: true, message: "Account created", type: "success" });
            }
            fetchAccounts();
            handleCloseDialog();
        } catch {
            setSnackbar({ open: true, message: "Error saving account", type: "error" });
        }
    };

    const handleDelete = async (account) => {
        if ((account.balance || 0) > 0) {
            setSnackbar({ open: true, message: "Account has balance, please transfer it first.", type: "info" });
            setTransferData({ from: account, to: "", amount: account.balance || 0, pendingDeletion: true });
            setTransferDialogOpen(true);
        } else {
            if (window.confirm("Are you sure you want to delete this account?")) {
                try {
                    await api.delete(`/accounts/${account.id}`);
                    fetchAccounts();
                    setSnackbar({ open: true, message: "Account deleted successfully.", type: "success" });
                } catch {
                    setSnackbar({ open: true, message: "Delete failed", type: "error" });
                }
            }
        }
    };

    const handleTransfer = (fromAccount) => {
        setTransferData({ from: fromAccount, to: "", amount: 0 });
        setTransferDialogOpen(true);
    };

    const handleConfirmTransfer = async () => {
        const { from, to, amount } = transferData;
        if (!to || amount <= 0 || amount > (from.balance || 0)) {
            setSnackbar({ open: true, message: "Invalid transfer data", type: "error" });
            return;
        }

        try {
            await api.post(`/transactions/transfer`, {
                fromAccountId: from.id,
                toAccountId: to,
                amount
            });
            setSnackbar({ open: true, message: "Transfer completed", type: "success" });
            setTransferDialogOpen(false);
            fetchAccounts();

            if (transferData.pendingDeletion) {
                const confirmed = window.confirm(`Do you still want to delete "${from.name}" account after transfer?`);
                if (confirmed) {
                    await api.delete(`/accounts/${from.id}`);
                    fetchAccounts();
                    setSnackbar({ open: true, message: "Account deleted after transfer.", type: "success" });
                }
            }
        } catch {
            setSnackbar({ open: true, message: "Transfer failed", type: "error" });
        }
    };

    const handleShowHistory = (account) => {
        navigate(`/transactions/${account.id}`);
    };

    return (
        <Container maxWidth="md">
            <Box mt={4}>
                <Typography variant="h4" gutterBottom>Accounts</Typography>
                <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
                    <TextField label="Name" name="name" value={filters.name} onChange={handleChange} />
                    <TextField label="Number" name="number" value={filters.number} onChange={handleChange} />
                    <Button variant="outlined" onClick={handleSearch}>Search</Button>
                    <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>Add Account</Button>
                </Box>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Number</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Balance</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {accounts.map((acc) => (
                            <TableRow key={acc.id}>
                                <TableCell>{acc.number}</TableCell>
                                <TableCell>{acc.name}</TableCell>
                                <TableCell>${(acc.balance || 0).toFixed(2)}</TableCell>
                                <TableCell>{new Date(acc.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Tooltip title="Edit this account">
                                        <IconButton color="primary" onClick={() => handleOpenDialog(acc)}>
                                            <Edit />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete this account">
                                        <IconButton color="error" onClick={() => handleDelete(acc)}>
                                            <Delete />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Transfer money from this account">
                                        <IconButton onClick={() => handleTransfer(acc)}>
                                            <SwapHoriz />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="View transfer history">
                                        <IconButton onClick={() => handleShowHistory(acc)}>
                                            <History />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>

            <Dialog open={transferDialogOpen} onClose={() => setTransferDialogOpen(false)}>
                <DialogTitle>Transfer</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <Typography>From: {transferData.from?.name} ({transferData.from?.number})</Typography>
                    <TextField
                        select
                        label="To Account"
                        value={transferData.to}
                        onChange={(e) => setTransferData({ ...transferData, to: e.target.value })}
                        SelectProps={{ native: true }}
                    >
                        <option value=""></option>
                        {accounts.filter(a => a.id !== transferData.from?.id).map(acc => (
                            <option key={acc.id} value={acc.id}>{acc.name} ({acc.number})</option>
                        ))}
                    </TextField>
                    <TextField
                        label="Amount"
                        type="number"
                        value={transferData.amount}
                        onChange={(e) => setTransferData({ ...transferData, amount: parseFloat(e.target.value) })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setTransferDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleConfirmTransfer}>Transfer</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>{editingAccount?.id ? "Edit Account" : "New Account"}</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <TextField
                        label="Number"
                        value={editingAccount?.number || ""}
                        onChange={(e) => setEditingAccount({ ...editingAccount, number: e.target.value })}
                    />
                    <TextField
                        label="Name"
                        value={editingAccount?.name || ""}
                        onChange={(e) => setEditingAccount({ ...editingAccount, name: e.target.value })}
                    />
                    <TextField
                        label="Balance"
                        value={editingAccount?.balance ?? 0}
                        disabled
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveAccount}>
                        {editingAccount?.id ? "Update" : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert severity={snackbar.type}>{snackbar.message}</Alert>
            </Snackbar>
        </Container>
    );
};

export default AccountsPage;
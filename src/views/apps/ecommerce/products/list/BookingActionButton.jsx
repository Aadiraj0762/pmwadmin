
import { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const BookingActionButton = ({ bookingId, currentStatus, onUpdate }) => {
    const [status, setStatus] = useState(currentStatus);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [amount, setAmount] = useState("");
    const [hour, setHour] = useState("");
    const [exitDisabled, setExitDisabled] = useState(false); // ✅ New state to disable Exit button
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });

    // Function to handle API calls
    const handleApiCall = async () => {
        setLoading(true);
        try {
            let url = "";
            let newStatus = status;

            if (status === "Pending") {
                url = `${API_URL}/vendor/approvebooking/${bookingId}`;
                newStatus = "Approved";
                alert(newStatus);
                
                location.reload();
            } else if (status === "Approved") {
                url = `${API_URL}/vendor/allowparking/${bookingId}`;
                newStatus = "Parked";
                alert(newStatus);
                location.reload();

            } else if (status === "Cancelled") {
                alert('status is cancelled ');
                return; // No action after cancellation
            }

            if (url) {
                const response = await axios.put(url);
                if (response.data.success) {
                    setStatus(newStatus);
                    onUpdate(); // Refresh table
                }
            }
        } catch (error) {
            console.error("API Error:", error);
        }
        setLoading(false);
    };

    // Function to handle exit with amount & hours
    const handleExit = async () => {
        setLoading(true);
        try {
            const response = await axios.put(`${API_URL}/vendor/exitvehicle/${bookingId}`, { amount, hour });

            if (response.data.success) {
                setStatus("Completed"); // ✅ Final step, disable the button
                alert('step is completed vehicle exited thank you');
                location.reload();
                setExitDisabled(true); // ✅ Disable Exit button after submission
                onUpdate(); // Refresh table
            }
            window.location.href = "/en/apps/ecommerce/orders/list";

        } catch (error) {
            console.error("Exit API Error:", error);
        }
        setLoading(false);
        setOpenDialog(false);
    };

    // Get button properties dynamically
    const getButtonProps = () => {
        if (status === "Pending") return { label: "Approve", color: "primary", onClick: handleApiCall };
        if (status === "Approved") return { label: "Allow Parking", color: "success", onClick: handleApiCall };
        if (status === "Parked") return { label: "Exit Vehicle", color: "warning", onClick: () => setOpenDialog(true), disabled: exitDisabled }; // ✅ Exit button disabled after submission
        if (status === "Cancelled" || status === "Completed") return { label: status, color: "secondary", disabled: true };

        // ✅ Default fallback to prevent `undefined` errors
        return { label: "Unknown Status", color: "default", disabled: true };
    };

    const buttonProps = getButtonProps();

    return (
        <div>
            <Button variant="contained" color={buttonProps.color} onClick={buttonProps.onClick} disabled={buttonProps.disabled || loading}>
                {buttonProps.label}
            </Button>

            {/* Exit Dialog Form */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Exit Vehicle - Enter Details</DialogTitle>
                <DialogContent>
                    <TextField label="Amount" fullWidth margin="dense" value={amount} onChange={(e) => setAmount(e.target.value)} />
                    <TextField label="Hour" fullWidth margin="dense" value={hour} onChange={(e) => setHour(e.target.value)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleExit} color="primary" disabled={loading || exitDisabled}>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default BookingActionButton;

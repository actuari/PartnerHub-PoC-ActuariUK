import { Alert, Snackbar } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clear } from '../../features/responseSnackbar/reducer';
import { messageSelector } from '../../features/responseSnackbar/selector'

export default function ResponseSnackbar() {
    const { isSuccess, isError, successMessage, errorMessage } = useSelector(messageSelector);
    const dispatch = useDispatch();
    return (
        <Snackbar
            open={isSuccess || isError}
            autoHideDuration={6000}
            onClose={() => dispatch(clear())}
        >
            {isSuccess ? (
                <Alert severity="success">{successMessage}</Alert>
            ) : (
                <Alert severity="error">{errorMessage}</Alert>
            )}
        </Snackbar>
    )
}
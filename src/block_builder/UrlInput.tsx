// @flow
import * as React from 'react';
import {
    Box,
    InputAdornment,
    Select,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Dialog,
    DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import {useState} from "react";


export interface UrlInput {
    method: Method
    url: string
    token?: string
}

interface UrlInputProps {
    value: UrlInput
    onChange: (value: UrlInput) => void
}

export type Method = 'POST' | 'GET' | 'DELETE' | 'UPDATE'

export const methods: Method[] = ['POST', 'GET', 'DELETE', 'UPDATE']

export const UrlInputComponent = (props: UrlInputProps) => {
    const [dialog, setDialog] = useState(false);
    return (
        <div>
            <GetTokenDialog open={dialog} onClose={() => setDialog(false)} onChange={token => {
                props.onChange({
                    ...props.value,
                    token
                });
                setDialog(false);
            }} />
            <Box display={'flex'}>
                <FormControl sx={{width: 150}}>
                    <InputLabel id="demo-simple-select-label">Method</InputLabel>
                    <Select
                        value={props.value.method}
                        label={'Method'}
                        sx={{
                            borderRadius: '10px 0 0 10px !important',
                            '& svg': {
                                fill: '#fff'
                            }
                        }}
                    >
                        {
                            methods.map(k => <MenuItem value={k} key={k}>{k}</MenuItem>)
                        }

                    </Select>
                </FormControl>
                <TextField
                    InputProps={{
                        startAdornment: <InputAdornment position={'start'}>
                            URL
                        </InputAdornment>
                    }}
                    value={props.value.url}
                    onChange={(e) => {
                        props.onChange({
                            ...props.value,
                            url: e.target.value
                        })
                    }}
                    sx={{
                        flexGrow: 1,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '0 !important'
                        }
                    }}
                />

                <Button
                    // startIcon={<Lock/>}
                    onClick={() => setDialog(true)} variant={props.value.token ?  'contained' : 'outlined'} color={'primary'} sx={{borderRadius: '0 10px 10px 0'}}>
                    Authorize
                </Button>
            </Box>
        </div>
    );
};

interface GetTokenDialogProps {
    open: boolean
    onClose: () => void
    onChange: (token: string) => void
}

const GetTokenDialog = (props: GetTokenDialogProps) => {
    const [value, setValue] = useState('');
    return <Dialog open={props.open} maxWidth={'sm'} fullWidth onClose={props.onClose}>
        <DialogTitle>Authorize</DialogTitle>
        <DialogContent dividers>
            <TextField value={value}
                       fullWidth
                       label={'Bearer token'}
                       onChange={e => {
                           setValue(e.target.value);
                       }}/>
        </DialogContent>
        <DialogActions>
            <Button variant={'outlined'} onClick={props.onClose} color={'primary'}>
                Cancel
            </Button>
            <Button onClick={() => {
                props.onChange(value);
            }} variant={'contained'} color={'primary'}>
                Save
            </Button>
        </DialogActions>
    </Dialog>
}
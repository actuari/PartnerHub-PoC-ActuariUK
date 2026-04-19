import { Divider, Grid } from '@mui/material';
import { useState } from 'react';
import CurrentContact from './CurrentContact';
import SearchContact from './SearchContact';
import ContactsList from './ContactsList';
export default function Chat({ chatUserEmail, isMain }: { chatUserEmail: string, isMain: boolean }) {
    const [searchText, setSearchText] = useState("");
    return (
        <Grid item xs={12} md={3}>
            <CurrentContact chatUserEmail={chatUserEmail} isMain={isMain} />
            <Divider />
            <SearchContact searchText={searchText} setSearchText={setSearchText} />
            <Divider />
            <ContactsList chatUserEmail={chatUserEmail} isMain={isMain} searchText={searchText} />
        </Grid>
    );
}
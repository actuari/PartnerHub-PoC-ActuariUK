import { Divider, Grid } from '@mui/material';
import { useState } from 'react';
import CurrentContact from './CurrentContact';
import ContactSearch from './ContactSearch';
import ContactList from './ContactList';

function Contacts({ companyName, isMain }: { companyName: string, isMain: boolean }) {
    const [searchText, setSearchText] = useState("");
    return (
        <Grid item xs={12} md={3}>
            <CurrentContact isMain={isMain} companyName={companyName} />
            <Divider />
            <Grid item xs={12} style={{ padding: '10px' }}>
                <ContactSearch searchText={searchText} setSearchText={setSearchText} />
            </Grid>
            <Divider />
            <ContactList searchText={searchText} />
        </Grid>
    )
}
export default Contacts;
import { Autocomplete, Grid, TextField } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/router';
import { User } from '@prisma/client';
import { useFetch } from '../../../../hooks';
import { routes } from '../../../../const/routes';
export default function Chat({ searchText, setSearchText }: { searchText: string, setSearchText: Dispatch<SetStateAction<string>> }) {
    const router = useRouter();
    const { data: usersData, isLoading } = useFetch(routes.api.users.$);
    const users: User[] = usersData?.data || [];
    const userEmails = users?.map(user => user?.email);
    return (
        <Grid item xs={12} style={{ padding: '10px' }}>
            <Autocomplete
                value={searchText}
                onChange={(event, newValue) => {
                    setSearchText(newValue || "");
                    if (newValue) {
                        router.replace(`/company/chat/${newValue}`)
                    }
                }}
                onInputChange={(e, v) => {
                    setSearchText(v);
                }}
                options={userEmails}
                getOptionLabel={(option) => option}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Select User"
                        variant="outlined"
                    />
                )}
            />
        </Grid>);
}
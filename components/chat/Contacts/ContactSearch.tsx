import { Autocomplete, TextField } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/router';
import { Company } from '@prisma/client';
import { useFetch } from '../../../hooks';
import { routes } from '../../../const/routes';

export default function ContactSearch({ searchText, setSearchText }: { searchText: string, setSearchText: Dispatch<SetStateAction<string>> }) {
    const router = useRouter();
    const { data: companiesData, isLoading } = useFetch(routes.api.companies);
    const companies: Company[] = companiesData?.data || [];
    const companyNames = companies?.map(company => company?.name);
    return (
        <Autocomplete
            value={searchText}
            onChange={(event, newValue) => {
                setSearchText(newValue || "");
                if (newValue) {
                    router.replace(`/chat/${newValue}`)
                }
            }}
            onInputChange={(e, v) => {
                setSearchText(v);
            }}
            options={companyNames}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Select Company"
                    variant="outlined"
                />
            )}
        />
    )
}

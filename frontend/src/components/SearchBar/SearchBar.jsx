import { Container, InputAdornment, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { AiOutlineSearch } from 'react-icons/ai';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { Link } from "react-router-dom";
const SearchBar = ({eventListener}) => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = event => {
        let value = event.target.value;
        setSearchTerm(event.target.value);
        eventListener(event);
    };


    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));
    return (
        <Container style={{ display: "flex", justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: 5 }}>
            <TextField
                id="search"
                type="search"
                label="Search Products"
                value={searchTerm}
                onChange={handleSearch}
                sx={{ width: { xs: 350, sm: 500, md: 800 }, }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <AiOutlineSearch />
                        </InputAdornment>
                    ),
                }}
            />
        </Container >
    )
}

export default SearchBar
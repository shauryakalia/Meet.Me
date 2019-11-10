import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import {
    Table, FormControl, Select, TableHead, TablePagination,
    InputLabel, TableBody, TableCell, TableRow
} from '@material-ui/core';

const columns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'appointment', label: 'Appointment', minWidth: 100 },
    { id: 'status', label: 'Status', minWidth: 100 },
    { id: 'phone', label: 'Phone', minWidth: 100 },
    { id: 'email', label: 'Email', minWidth: 170 },
    { id: 'notes', label: 'Additional Notes', minWidth: 100 },
];

function createData(name, code, population, size) {
    const density = population / size;
    return { name, code, population, size, density };
}

const rows = [
    createData('India', 'IN', 1324171354, 3287263),
    createData('China', 'CN', 1403500365, 9596961),
    createData('Italy', 'IT', 60483973, 301340),
    createData('United States', 'US', 327167434, 9833520),
    createData('Canada', 'CA', 37602103, 9984670),
    createData('Australia', 'AU', 25475400, 7692024),
    createData('Germany', 'DE', 83019200, 357578),
    createData('Ireland', 'IE', 4857000, 70273),
    createData('Mexico', 'MX', 126577691, 1972550),
    createData('Japan', 'JP', 126317000, 377973),
    createData('France', 'FR', 67022000, 640679),
    createData('United Kingdom', 'GB', 67545757, 242495),
    createData('Russia', 'RU', 146793744, 17098246),
    createData('Nigeria', 'NG', 200962417, 923768),
    createData('Brazil', 'BR', 210147125, 8515767),
];

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
    tableWrapper: {
        maxHeight: 440,
        overflow: 'auto',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    }
}));

export default function Bookings() {
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [filter, setFilter] = React.useState('');
    // let startDate, endDate;

    const handleChange = event => {
        setFilter(event.target.value);
        // if(event.target.value === 'Today'){
        //     startDate = new Date(new Date().toDateString());
        //     endDate = new Date(new Date().toDateString());
        // } else if (event.target.value === 'Tomorrow') {
        //     startDate = new Date(new Date().toDateString());
        //     endDate = new Date(new Date().toDateString());
        // } else {
        //     startDate = '';
        //     endDate = '';
        // }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper className={classes.root}>
            <FormControl className={classes.formControl}>
                <InputLabel htmlFor="age-native-simple">Filter</InputLabel>
                <Select
                    native
                    value={filter}
                    onChange={handleChange}
                >
                    <option value="" />
                    <option value={'All'}>All</option>
                    <option value={'Today'}>Today</option>
                    <option value={'Tomorrow'}>Tomorrow</option>
                    <option value={'This Week'}>This Week</option>
                    <option value={'Yesterday'}>Yesterday</option>
                    <option value={'Last 7 Days'}>Last 7 Days</option>
                    <option value={'Last 30 Days'}>Last 30 Days</option>
                    <option value={'This Month'}>This Month</option>
                    <option value={'Last Month'}>Last Month</option>
                    <option value={'Custom Days'}>Custom Days</option>
                </Select>
            </FormControl>
            <div className={classes.tableWrapper}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map(column => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                    {columns.map(column => {
                                        const value = row[column.id];
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {column.format && typeof value === 'number' ? column.format(value) : value}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                backIconButtonProps={{
                    'aria-label': 'previous page',
                }}
                nextIconButtonProps={{
                    'aria-label': 'next page',
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Paper >
    );
}
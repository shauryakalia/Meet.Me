import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Divider, Paper, Checkbox, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { Edit } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
        borderRadius: 0
    },
    title: {
        marginBottom: theme.spacing(2)
    }
}));

function createData(day, openAt, closeAt, closed) {
    return { day, openAt, closeAt, closed };
}

export default function Timings() {
    const classes = useStyles();
    const [state, setState] = React.useState({
        rows: [
            createData('Monday', 159, 6.0, false),
            createData('Tuesday', 237, 9.0, false),
            createData('Wednesday', 159, 6.0, false),
            createData('Thursday', 237, 9.0, false),
            createData('Friday', 159, 6.0, false),
            createData('Saturday', 237, 9.0, false),
            createData('Sunday', 159, 6.0, true)
        ]
    });

    const handleChange = index => event => {
        console.log("Rows", index);
        state.rows[index].closed = event.target.checked;
        console.log("Rows", state.rows);
    };

    return (
        <Paper className={classes.root}>
            <Typography variant="h6" color="secondary">
                Opening Hours
            </Typography>
            <Divider />
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Day</TableCell>
                        <TableCell align="right">Open at</TableCell>
                        <TableCell align="right">Close at</TableCell>
                        <TableCell align="right">Closed</TableCell>
                        <TableCell align="right">Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {state.rows.map((row, index) => (
                        <TableRow key={row.day}>
                            <TableCell component="th" scope="row">
                                {row.day}
                            </TableCell>
                            <TableCell align="right">{row.openAt}</TableCell>
                            <TableCell align="right">{row.closeAt}</TableCell>
                            <TableCell align="right">
                                <Checkbox
                                    checked={row.closed}
                                    onChange={handleChange(index)}
                                    value={row.closed}
                                    inputProps={{
                                        'aria-label': 'Closed',
                                    }}
                                />
                            </TableCell>
                            <TableCell align="right"><Edit /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}
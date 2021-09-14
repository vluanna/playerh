import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        width: 151,
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    playIcon: {
        height: 38,
        width: 38,
    },
    tableRoot: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    },
    row: {
        cursor: 'pointer',
        "&:hover": {
            background: "#333"
        }
    }
}));

const SubtitleDetail = ({
    data,
    onSelectSub = (sub) => { }
}) => {

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const classes = useStyles();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const rows = React.useMemo(() => {
        return rowsPerPage > 0
            ? data?.subtitles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : data?.subtitles
    }, [rowsPerPage, page, data?.subtitles])

    return !!data && (
        <Card className={classes.root}>
            <CardMedia
                component="img"
                height="230"
                className={classes.cover}
                src={data.poster}
                title={data.title || ''}
            />
            <div className={classes.details}>
                <CardContent className={classes.content}>
                    <Typography component="h5" variant="h5">
                        {data.title || ''}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        IMDB: <a style={{ color: 'gray' }} target="_blank" rel="noreferrer" href={data.imdbUrl || ''}>{data.imdbUrl || ''}</a>
                    </Typography>
                </CardContent>
                <div className={classes.controls}>
                    <TableContainer>
                        <Table className={classes.tableRoot} aria-label="simple table">

                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow key={row.url} className={classes.row}>
                                        <TableCell component="th" scope="row" onClick={() => onSelectSub(row)}>
                                            {row.title}
                                        </TableCell>
                                        <TableCell align="right" onClick={() => onSelectSub(row)}>{row.language}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                        count={data.subtitles?.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        SelectProps={{
                                            inputProps: { 'aria-label': 'rows per page' },
                                            native: true,
                                        }}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </Card>
    )
}

export default SubtitleDetail
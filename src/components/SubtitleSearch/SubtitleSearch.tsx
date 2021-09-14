// @ts-nocheck
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { DataProviderContext, Error, useRecordContext } from 'react-admin';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';

import { useDebounce } from 'react-use';
// import { get } from 'lodash';
import { useMemo } from 'react';
import SubtitleDetail from './SubtitleDetail';

const useStyles = makeStyles((theme) => ({
    root: {
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

const SubtitleSearch = ({
    selections = [],
    onSelect = (file) => { }
}) => {
    const record = useRecordContext();
    const classes = useStyles();
    const [name, setName] = useState(record?.name);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [selectedUrl, setSelectedUrl] = useState(null);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const dataProvider = useContext(DataProviderContext);
    const [subDetail, setSubDetail] = useState(null)

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const onSelectSub = (sub) => {
        console.log(sub)
        downloadSubtitle(sub, () => setSubDetail(null))
    }

    const downloadSubtitle = useCallback((sub, callback) => {
        if (sub?.url) {
            setLoading(true)
            dataProvider.getOne('subtitle_download', sub)
                .then(({ data }) => {
                    console.log('SUB DOWNLOAD', data)
                    onSelect(data);
                    callback()
                })
                .catch(error => {
                    console.log(error)
                })
                .finally(() => setLoading(false))
        }
    }, [dataProvider, onSelect])

    const onGetDetailSubtitle = useCallback((url, languages = ['vi']) => {
        if (url) {
            setLoading(true)
            dataProvider.getOne('subtitles', { url, languages })
                .then(({ data }) => {
                    console.log('SUB DETAIL', data)
                    setSubDetail(data);
                })
                .catch(error => {
                    console.log(error)
                })
                .finally(() => setLoading(false))
        }
    }, [dataProvider])

    const searchSubtitle = useCallback((keyword = name) => {
        dataProvider.getList('subtitles', { keyword })
            .then(({ data }) => {
                setData(data);
            })
            .catch(error => {
                setError(error);
            })
            .finally(() => setLoading(false))
    }, [name, dataProvider])

    useDebounce(() => {
        searchSubtitle(name)
    }, 600, [name])

    useEffect(() => {
        const fileName = record?.name?.split('.').slice(0, -1).join('.')
        setName(fileName);
    }, [record?.name]);

    useEffect(() => {
        if (selectedUrl) {
            onGetDetailSubtitle(selectedUrl)
        }
    }, [selectedUrl, onGetDetailSubtitle]);

    const renderSubDetail = () => {
        if (!subDetail) return null

        return (
            <SubtitleDetail data={subDetail} onSelectSub={onSelectSub} />
        )
    }

    const rows = useMemo(() => {
        return rowsPerPage > 0
            ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : data
    }, [rowsPerPage, page, data])

    if (loading) return <CircularProgress color="primary" />;
    if (error) return <Error />;

    return (
        <div style={{ width: 650, margin: '1em' }}>
            {!subDetail ? (
                <TableContainer>
                    <Table className={classes.root} aria-label="simple table">
                        <TableHead>
                            <TextField value={name} onChange={e => setName(e.target.value)} style={{ width: '100%' }} autoFocus />
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.url} className={classes.row}>
                                    <TableCell component="th" scope="row" onClick={() => setSelectedUrl(row.url)}>
                                        {row.title}
                                    </TableCell>
                                    <TableCell align="right" onClick={() => setSelectedUrl(row.url)}>{row.count}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    count={data?.length}
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
            ) : renderSubDetail()}
            {!data.length && !loading && (
                <div>No data</div>
            )}
        </div>
    )
}

export default SubtitleSearch
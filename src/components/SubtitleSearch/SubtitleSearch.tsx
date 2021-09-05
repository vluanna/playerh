// @ts-nocheck
import React, { useState, useEffect, useContext, useCallback, Fragment } from 'react';
import { DataProviderContext, Loading, Error, Button, useRecordContext } from 'react-admin';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { useDebounce } from 'react-use';
import { get } from 'lodash';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: '36ch',
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    },
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
    const [loadingFile, setLoadingFile] = useState(null);
    const [error, setError] = useState();
    const dataProvider = useContext(DataProviderContext);

    const isDownloadDisabled = (sub) => {
        return loadingFile === sub.id || selections.some(item => item.id === sub.id)
    }

    const onDownloadSubtitle = (sub) => {
        const fileId = get(sub, 'attributes.files[0].file_id');
        if (fileId) {
            setLoadingFile(sub.id)
            dataProvider.getOne('subtitles', { ...sub, id: fileId, format: 'vtt', })
                .then(({ data }) => {
                    console.log('SUB DOWNLOADED', data)
                    onSelect(data);
                })
                .catch(error => {
                    console.log(error)
                })
                .finally(() => setLoadingFile(null))
        }
    }

    const searchSubtitle = useCallback((keyword = name, languages = ['vi']) => {
        dataProvider.getList('subtitles', { keyword, languages })
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
        setName(record?.name);
    }, [record?.name]);

    const renderSubtitleItem = (sub) => {
        const imageUrl = sub?.attributes?.related_links?.img_url;
        const release = sub?.attributes?.release;
        const ratings = sub?.attributes?.ratings;
        const downloadCount = sub?.attributes?.download_count;
        return (
            <Fragment>
                <ListItemAvatar>
                    <Avatar alt="Remy Sharp" src={imageUrl} />
                </ListItemAvatar>
                <ListItemText
                    primary={release}
                    secondary={
                        <Fragment>
                            <Typography
                                component="span"
                                variant="body2"
                                className={classes.inline}
                                color="textPrimary"
                            >
                                Ratings: {ratings}
                            </Typography>
                            {` - Download count: ${downloadCount}`}
                            <div>
                                <Button disabled={isDownloadDisabled(sub)} label="Download" onClick={() => onDownloadSubtitle(sub)} />
                            </div>
                        </Fragment>
                    }
                />
            </Fragment>
        )
    }

    if (loading) return <Loading />;
    if (error) return <Error />;

    return (
        <div style={{ width: 400, margin: '1em' }}>
            <TextField value={name} onChange={e => setName(e.target.value)} style={{ width: '100%' }} autoFocus />
            <List className={classes.root}>
                {data.map((sub, index) => (
                    <Fragment key={sub.id || index}>
                        <ListItem alignItems="flex-start">{renderSubtitleItem(sub)}</ListItem>
                        {index < data.length - 1 && (
                            <Divider variant="inset" component="li" />
                        )}
                    </Fragment>
                ))}
            </List>
            {!data.length && !loading && (
                <div>Empty</div>
            )}
        </div>
    )
}

export default SubtitleSearch
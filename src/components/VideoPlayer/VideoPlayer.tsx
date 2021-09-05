// @ts-nocheck
import React, { useEffect, useState, useContext, useMemo } from "react";
import { Loading, Error, DataProviderContext } from 'react-admin';
import ReactPlayer from 'react-player'
import { get, compact } from 'lodash'
import { DEFAULT_LANGUAGE } from "../../constants/Defined";

const VideoPlayer = ({ record, password, subtitles = [] }) => {

    const dataProvider = useContext(DataProviderContext);
    const [data, setData] = useState({})
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState();

    const isDefaultSub = (sub) => {
        return get(sub, 'attributes.language') === DEFAULT_LANGUAGE
    }

    const tracks = useMemo(() => compact(subtitles).map(sub => ({
        kind: 'subtitles', src: sub?.link, srcLang: get(sub, 'attributes.language'), default: isDefaultSub(sub)
    })), [subtitles])

    useEffect(() => {
        if (record?.linkcode) {
            setIsFetching(true)
            dataProvider.getOne('download', record)
                .then(({ data }) => {
                    setData(data);
                })
                .catch(error => {
                    console.log(error);
                    setError(error)
                })
                .finally(() => setIsFetching(false))
        }
    }, [record, password, dataProvider])

    useEffect(() => {
        setIsFetching(true)
        setTimeout(() => setIsFetching(false), 1000)
    }, [tracks])

    if (isFetching) return <Loading />;
    if (error) return <Error />;

    console.log('tracks', tracks, subtitles)

    return (
        <ReactPlayer
            url={data.location}
            controls={true}
            config={{
                file: { tracks }
            }}
        />
    )
}

export default VideoPlayer
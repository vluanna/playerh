// @ts-nocheck
import React from 'react';
import { useResourceContext } from 'react-admin';
import FolderList from '../../../components/FolderList';

const FavoriteList = (props) => {
    const { resource } = useResourceContext();
    return (
        <FolderList {...props} data={props} name={resource} pagination={false} />
    )
}

export default FavoriteList
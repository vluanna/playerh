import React from 'react';
import { Focusable, VerticalList } from 'react-key-navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faStar, faMusic, faEllipsisV, faFilm, faUser, faSearch } from '@fortawesome/free-solid-svg-icons'

class ToogleItem extends React.Component {
    constructor() {
        super();

        this.state = {
            active: false
        }
    }

    render() {
        return (
            <Focusable onFocus={() => this.setState({ active: true })}
                onBlur={() => this.setState({ active: false })}>
                <div className={'item ' + (this.state.active ? 'item-focus' : '')}>
                    <FontAwesomeIcon icon={this.props.icon} /> {this.props.children}
                </div>
            </Focusable>
        );
    }
};

export default class Sidebar extends React.Component {
    constructor() {
        super();

        this.state = {
            active: false
        }
    }

    setActive(status) {
        this.setState({ active: status });
    }

    render() {
        return (
            <div id="sidebar" className={this.state.active ? 'focused' : ''}>
                <div id="icons">
                    <div><FontAwesomeIcon icon={faHome} /></div>
                    <div><FontAwesomeIcon icon={faStar} /></div>
                    <div><FontAwesomeIcon icon={faMusic} /></div>
                    <div><FontAwesomeIcon icon={faEllipsisV} /></div>
                </div>
                <div id="menu">
                    <VerticalList onFocus={() => this.setActive(true)}
                        onBlur={() => this.setActive(false)} focusId="sidebar" retainLastFocus={true}>
                        <ToogleItem icon={faUser}>Login</ToogleItem>
                        <ToogleItem icon={faSearch}>Search</ToogleItem>
                        <ToogleItem icon={faHome}>Home</ToogleItem>
                        <ToogleItem icon={faStar}>Star</ToogleItem>
                        <ToogleItem icon={faMusic}>Music</ToogleItem>
                        <ToogleItem icon={faFilm}>Film</ToogleItem>
                    </VerticalList>
                </div>
            </div>
        );
    }
}
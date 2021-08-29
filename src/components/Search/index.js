import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { Focusable } from 'react-key-navigation'
import clsx from 'clsx'

export default class Search extends React.Component {
  constructor() {
    super();

    this.state = {
      active: false
    };
  }

  onBlur() {
    this.setState({ active: false });
  }

  onFocus() {
    this.setState({ active: true });
  }

  onEnterDown(event, navigation) {
    console.log('enter pressed');
    navigation.forceFocus('sidebar');
  }

  render() {
    return (
      <Focusable onFocus={() => this.onFocus()} onBlur={() => this.onBlur()} onEnterDown={(e, n) => this.onEnterDown(e, n)} navDefault>
        <div className={clsx(this.props.className, {
          'search-box-placeholder-focus': !!this.state.active
        })} id="search-box-placeholder"><FontAwesomeIcon icon={faSearch} /></div>
      </Focusable>
    );
  }
}
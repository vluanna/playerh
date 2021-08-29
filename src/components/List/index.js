import React, { useEffect, useRef, useState } from 'react';

import { Focusable, HorizontalList } from 'react-key-navigation';
import clsx from 'clsx'

export const ListItem = () => {
  const [active, setActive] = useState(false)
  return (
    <Focusable onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}>
      <div className={clsx('item', {
        'item-focus': active
      })}></div>
    </Focusable>
  )
}

const List = ({
  title = '',
  visible = false,
  onFocus = () => { },
  onBlur = () => { },
}) => {

  const content = useRef()
  const [lastFocus, setLastFocus] = useState(null);

  const onFocusList = (index) => {
    if (lastFocus === index) {
      return;
    }

    content.current.style.display = 'block'

    onFocus();

    if (content.current) {
      const items = content.current.getElementsByClassName('item');
      const offsetWidth = items[0].offsetWidth + 20;
      const scrollLeft = offsetWidth * index;
      content.current.scroll({ left: scrollLeft, top: 0, behavior: 'smooth' })
    }

    setLastFocus(index)
  }

  const onBlurList = () => {
    onBlur(content.current)
    setLastFocus(null)
  }

  useEffect(() => {
    const width = (Math.floor(content.current.scrollWidth / content.current.clientWidth) * content.current.clientWidth) + content.current.clientWidth + 20;
    if (content.current.getElementsByClassName('hz-list')[0]) {
      content.current.getElementsByClassName('hz-list')[0].style.width = width + 'px';
    }
  }, [])

  return (
    <div className={clsx("contentgroup", {
      'fading-out': !visible
    })}>
      <h1>{title}</h1>
      <div className="content" ref={content}>
        <HorizontalList className="hz-list"
          style={{ overflow: 'hidden', display: 'block' }}
          onFocus={(index) => onFocusList(index)}
          onBlur={index => onBlurList()}>
          <ListItem></ListItem>
          <ListItem></ListItem>
          <ListItem></ListItem>
          <ListItem></ListItem>
          <ListItem></ListItem>
          <ListItem></ListItem>
          <ListItem></ListItem>
          <ListItem></ListItem>
          <ListItem></ListItem>
        </HorizontalList>
      </div>
    </div>
  )
}

export default List

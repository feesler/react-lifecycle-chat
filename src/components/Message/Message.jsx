import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Message.css';

function Message(props) {
  const { content, color, isOwn, waiting } = props;

  const msgStyle = {
    backgroundColor: color,
  };

  return (
    <li
      className={classNames([
        'message',
        { 'own-message': isOwn },
        { 'waiting-message': waiting }
      ])}
      style={msgStyle}
    >
      {content}
    </li>
  )
}

Message.propTypes = {
  content: PropTypes.string.isRequired,
  color: PropTypes.string,
  isOwn: PropTypes.bool,
  waiting: PropTypes.bool,
};

Message.defaultProps = {
  color: '#ffffff',
  isOwn: false,
  waiting: false,
};


export default Message;

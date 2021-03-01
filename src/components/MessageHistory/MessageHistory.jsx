import React, { useRef, useCallback } from 'react'
import PropTypes from 'prop-types';
import distinctColors from 'distinct-colors'
import './MessageHistory.css';
import Message from '../Message/Message.jsx';

function MessageHistory(props) {
  const { items, userId } = props;

  // Autoscroll
  const listRef = useCallback((node) => {
    if (node) {
      node.scrollTop = node.scrollHeight;
    }
  }, [items]);

  if (!items.length) {
    return null;
  }

  const userMap = {};
  items.forEach((item) => {
    userMap[item.userId] = true;
  });

  const users = Object.keys(userMap);
  const colors = distinctColors({ count: users.length, lightMin: 50 });
  users.forEach((userId, index) => userMap[userId] = colors[index].hex());

  return (
    <ul className="chat-history" ref={listRef}>
      {items.map((message) => {
        const userColor = userMap[message.userId];

        return (
          <Message
            key={message.id}
            {...message}
            color={userColor}
            isOwn={(message.userId === userId)}
          />
        );
      })}
    </ul>
  )
}

MessageHistory.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    userId: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }))
};

MessageHistory.defaultProps = {
};

export default MessageHistory;

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Chat.css';
import { v4 as uuidv4 } from 'uuid';
import { API } from '../../api/index.js';
import MessageHistory from '../MessageHistory/MessageHistory.jsx';

const initialMessage = { content: '' };
const initialState = {
  userId: null,
  messages: [],
  lastMessage: 0,
  currentMessage: initialMessage,
};

const POLLING_INTERVAL = 2000;

function Chat() {
  const [state, setState] = useState(initialState);

  const loadMessages = async () => {
    const messages = await API.messages.read(state.lastMessage);
    if (!messages.length) {
      return;
    }

    setState((prev) => {
      const newState = {
        ...prev,
        messages: [
          ...prev.messages.filter((item) => !item.waiting),
          ...messages
        ],
        lastMessage: messages[messages.length - 1].id,
      };

      return newState;
    });
  }

  /* Setup user id and send initial request */
  useEffect(() => {
    if (state.userId) {
      return;
    }

    let userId = localStorage.getItem('chat-user-id');
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem('chat-user-id', userId);
    }

    setState((prev) => ({
      ...prev,
      userId,
    }));

    loadMessages();
  }, []);

  /* Automatic message loading */
  useEffect(() => {
    const intervalId = setInterval(() => loadMessages(), POLLING_INTERVAL);
    return () => clearInterval(intervalId);
  }, [state])

  const handleChange = (e) => {
    setState((prev) => ({
      ...prev,
      currentMessage: {
        ...prev.currentMessage,
        [e.target.name]: e.target.value,
      }
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!state.currentMessage.content.length) {
      return;
    }

    const sendResult = await API.messages.send(state.userId, state.currentMessage.content);
    if (!sendResult) {
      return;
    }

    setState((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        {
          id: prev.messages.length + prev.lastMessage,
          userId: prev.userId,
          content: prev.currentMessage.content,
          waiting: true,
        }
      ],
      currentMessage: initialMessage,
    }));
  }

  return (
    <div className="chat">
      <MessageHistory items={state.messages} userId={state.userId} />
      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          className="chat-form__input"
          name="content"
          onChange={handleChange}
          value={state.currentMessage.content}
        />
        <button className="chat-form__submit" type="submit" />
      </form>
    </div>
  )
}

Chat.propTypes = {

};

export default Chat;

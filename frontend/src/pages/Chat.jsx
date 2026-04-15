import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Send, User as UserIcon } from 'lucide-react';
import { apiUrl, SOCKET_BASE_URL } from '../proxy';

const Chat = ({ user }) => {
  const [conversations, setConversations] = useState([]);
  const [currentChatInfo, setCurrentChatInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const scrollRef = useRef();
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const preSelectedUserId = queryParams.get('userId');

  useEffect(() => {
    const newSocket = io(SOCKET_BASE_URL);
    setSocket(newSocket);
    newSocket.emit('join', user._id);

    return () => newSocket.disconnect();
  }, [user._id]);

  useEffect(() => {
    if (socket) {
      socket.on('receiveMessage', (data) => {
        if (currentChatInfo && currentChatInfo._id === data.sender) {
          setMessages((prev) => [...prev, data]);
        }
      });
    }
  }, [socket, currentChatInfo]);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(apiUrl('/api/messages/conversations/list'), config);
      
      let convos = data;

      if (preSelectedUserId && !data.find(c => c._id === preSelectedUserId)) {
        const { data: preUser } = await axios.get(apiUrl(`/api/users/profile/${preSelectedUserId}`), config);
        convos = [preUser, ...data];
      }

      setConversations(convos);
      if (preSelectedUserId) {
        handleSelectChat(preSelectedUserId);
      } else if (convos.length > 0) {
        handleSelectChat(convos[0]._id);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const handleSelectChat = async (userId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data: targetUser } = await axios.get(apiUrl(`/api/users/profile/${userId}`), config);
      setCurrentChatInfo(targetUser);

      const { data: msgs } = await axios.get(apiUrl(`/api/messages/${userId}`), config);
      setMessages(msgs);
    } catch (error) {
      console.error('Error selecting chat:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChatInfo) return;

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(apiUrl('/api/messages'), {
        receiverId: currentChatInfo._id,
        text: newMessage
      }, config);

      socket.emit('sendMessage', {
        sender: user._id,
        receiver: currentChatInfo._id,
        text: newMessage,
        createdAt: new Date().toISOString()
      });

      setMessages((prev) => [...prev, data]);
      setNewMessage('');
      
      // Update conversations list if the chat is new
      if (!conversations.find(c => c._id === currentChatInfo._id)) {
        setConversations(prev => [currentChatInfo, ...prev]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="container-fluid py-3 chat-container fade-in">
      <div className="row w-100 mx-auto g-0 glass-card p-0 overflow-hidden" style={{ maxWidth: '1200px', height: '100%' }}>
        
        {/* Sidebar */}
        <div className="col-md-4 chat-sidebar border-end border-secondary">
          <div className="p-3 border-bottom border-secondary">
            <h5 className="mb-0 text-light fw-bold">Recent Chats</h5>
          </div>
          <div className="list-group list-group-flush bg-transparent">
            {conversations.length === 0 ? (
              <div className="text-muted p-4 text-center">No recent chats</div>
            ) : (
              conversations.map(c => (
                <button 
                  key={c._id}
                  onClick={() => handleSelectChat(c._id)}
                  className={`list-group-item list-group-item-action border-0 p-3 d-flex align-items-center gap-3 w-100 text-start ${currentChatInfo?._id === c._id ? 'bg-primary bg-opacity-10 rounded text-light' : 'text-muted bg-transparent hover-bg-light'}`}
                >
                  {c.profilePicture ? (
                    <img src={c.profilePicture} alt="" className="profile-img-sm rounded-circle" />
                  ) : (
                    <div className="profile-img-sm rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white">
                      {c.name.charAt(0)}
                    </div>
                  )}
                  <div className="d-flex flex-column text-truncate">
                    <span className="fw-semibold">{c.name}</span>
                    <small className="text-truncate" style={{ fontSize: '0.8em' }}>{c.role}</small>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="col-md-8 chat-area d-flex flex-column">
          {currentChatInfo ? (
            <>
              <div className="p-3 border-bottom border-secondary d-flex justify-content-between align-items-center bg-dark">
                <div className="d-flex align-items-center gap-3">
                  <div className="position-relative">
                    {currentChatInfo.profilePicture ? (
                      <img src={currentChatInfo.profilePicture} alt="" className="profile-img-sm rounded-circle" />
                    ) : (
                      <div className="profile-img-sm rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white">
                        {currentChatInfo.name.charAt(0)}
                      </div>
                    )}
                    <span className="position-absolute bottom-0 end-0 bg-success border border-dark rounded-circle" style={{ width: 10, height: 10 }}></span>
                  </div>
                  <div>
                     <h6 className="mb-0 text-light">{currentChatInfo.name}</h6>
                     <small className="text-white">{currentChatInfo.branch || currentChatInfo.role}</small>
                  </div>
                </div>
              </div>

              <div className="flex-grow-1 p-4 overflow-auto bg-dark d-flex flex-column gap-3">
                {messages.length === 0 && <div className="text-center text-muted my-auto"><p>Start the conversation 👋</p></div>}
                
                {messages.map((m, i) => {
                  const isMine = m.sender === user._id || m.sender?._id === user._id;
                  return (
                    <div ref={scrollRef} key={i} className={`d-flex ${isMine ? 'justify-content-end' : 'justify-content-start'}`}>
                      {!isMine && (
                         <div className="profile-img-sm rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white me-2 mt-auto" style={{width: '25px', height: '25px', fontSize: '10px'}}>
                           {currentChatInfo.name.charAt(0)}
                         </div>
                      )}
                      <div className={`message-bubble ${isMine ? 'message-sent shadow-sm' : 'message-received border border-secondary shadow-sm'}`}>
                        {m.text}
                        <div className="text-end mt-1" style={{ fontSize: '0.65rem', opacity: 0.7 }}>
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-dark border-top border-secondary">
                <form onSubmit={handleSendMessage} className="d-flex gap-2">
                  <input 
                    type="text" 
                    className="form-control rounded-pill bg-dark text-light border-secondary px-4 focus-ring focus-ring-primary w-100" 
                    placeholder="Type a message..." 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary-gradient rounded-circle d-flex align-items-center justify-content-center shadow" style={{ width: '45px', height: '45px', padding: 0 }}>
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
              <UserIcon size={64} className="mb-3 opacity-25" />
              <h4>Your Messages</h4>
              <p>Select a contact to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;

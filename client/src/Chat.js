import React, { useEffect, useState } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'

function Chat({ socket, username, room }) {

    const [curMessage, setcurMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => {
        if (curMessage !== "") {
            const messageData = {
                room: room,
                author: username,
                message: curMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
            };

            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setcurMessage("");
        }
    };

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
            // console.log(data);
        })
    }, [socket])

    return (
        <div className='chat-window'>
            <div className='chat-header'>
                <p>Live Chat</p>
            </div>
            <div className='chat-body'>
                <ScrollToBottom className="message-container">
                    {messageList.map((element) => {
                        return <div className='message' id={username === element.author ? "you" : "other"}>
                            <div>
                                <div className='message-content'>
                                    <p>{element.message}</p>
                                </div>
                                <div className='message-meta'>
                                    <p id="time">{element.time}</p>
                                    <p id="author">{element.author}</p>
                                </div>
                            </div></div>;
                    })}
                </ScrollToBottom>
            </div>
            <div className='chat-footer'>
                <input type='text' value={curMessage} placeholder="Hey..." onChange={(event) => {
                    setcurMessage(event.target.value);
                }}
                    onKeyDown={(event) => {
                        event.key === "Enter" && sendMessage();
                    }}
                />
                <button onClick={sendMessage}>&#9658;</button>
            </div>
        </div>
    )
}

export default Chat
import React from "react";
import { IoAttachOutline, IoCallOutline, IoCheckmarkDoneOutline, IoCheckmarkOutline, IoEllipsisVerticalOutline, IoHappyOutline, IoPersonOutline, IoSendOutline, IoVideocamOutline } from "react-icons/io5";

function ChatSection({currentChat, getStatusColor, messages, messagesEndRef, sendMessage, newMessage, setNewMessage}) {
    console.log("inside chat section component");
    return (
        <div className="flex-1 flex flex-col">
            {currentChat ? (
                <>
                    {/* Chat Header */}
                    <div className="bg-white border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                        {currentChat.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor('online')} rounded-full border-2 border-white`}></div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{currentChat.name}</h3>
                                    <p className="text-sm text-gray-600 capitalize">{currentChat.status || 'offline'}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                    <IoCallOutline className="h-5 w-5" />
                                </button>
                                <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                    <IoVideocamOutline className="h-5 w-5" />
                                </button>
                                <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors">
                                    <IoEllipsisVerticalOutline className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.receiverId === currentChat.id ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.receiverId === currentChat.id
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-800'
                                    }`}>
                                    <p className="text-sm">{message.content}</p>
                                    <div className={`flex items-center justify-end mt-1 space-x-1 ${message.receiverId === currentChat.id ? 'text-blue-100' : 'text-gray-500'
                                        }`}>
                                        <span className="text-xs">
                                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {message.receiverId === currentChat.id && (
                                            message.read ? (
                                                <IoCheckmarkDoneOutline
                                                className="h-3 w-3" />
                                            ) : (
                                                <IoCheckmarkOutline className="h-3 w-3" />
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className="bg-white border-t border-gray-200 px-6 py-4">
                        <form onSubmit={sendMessage} className="flex items-center space-x-3">
                            <button
                                type="button"
                                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                <IoAttachOutline
                                 className="h-5 w-5" />
                            </button>
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                    <IoHappyOutline className="h-5 w-5" />
                                </button>
                            </div>
                            <button
                                type="submit"
                                disabled={!newMessage.trim()}
                                className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                <IoSendOutline className="h-5 w-5" />
                            </button>
                        </form>
                    </div>
                </>
            ) : (
                /* No Chat Selected */
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <IoPersonOutline className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                        <p className="text-gray-600">Choose a contact to start messaging</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default React.memo(ChatSection);
function About() {
    return ( 
        <div className="h-screen flex flex-col items-center bg-gray-100 p-6">
           <h1>About chat aplication</h1> 
            <p>This is a simple chat application built with React, Node.js, and Socket.io
            </p>
            <p>It allows users to chat in real-time with each other.</p>
            <p>Users can create accounts, log in, and start chatting with friends.</p>
            <p>Messages are sent and received in real-time using WebSockets.</p>
        </div>
     );
}

export default About;
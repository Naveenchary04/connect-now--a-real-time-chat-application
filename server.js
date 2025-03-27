// Handle real-time personal messages
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Save socket IDs for users
  socket.on("register-ip", (ipAddress) => {
    socket.ipAddress = ipAddress; // Attach IP to the socket
  });

  socket.on("personal-message", ({ to, from, message }) => {
    // Find the target socket by IP
    const targetSocket = Array.from(io.sockets.sockets.values()).find(
      (s) => s.ipAddress === to
    );

    if (targetSocket) {
      targetSocket.emit("receive-message", { from, message });
    } else {
      socket.emit("error-message", { error: "User not online" });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

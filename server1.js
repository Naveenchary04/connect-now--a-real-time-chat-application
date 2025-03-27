// Handle group messages
socket.on("group-message", ({ groupId, sender, message }) => {
    const data = loadData();
    const group = data.groups.find((g) => g.groupId === groupId);
  
    if (group) {
      // Save the message to the group
      group.messages.push({ sender, message, timestamp: new Date() });
      saveData(data);
  
      // Emit the message to all members
      group.members.forEach((memberIp) => {
        const memberSocket = Array.from(io.sockets.sockets.values()).find(
          (s) => s.ipAddress === memberIp
        );
        if (memberSocket) {
          memberSocket.emit(`group-${groupId}`, { sender, message });
        }
      });
    } else {
      socket.emit("error-message", { error: "Group not found" });
    }
  });
  
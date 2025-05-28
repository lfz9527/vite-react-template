import React, { createContext, useMemo } from 'react';
import type { MessageInstance } from 'antd/es/message/interface';
import { message } from 'antd';

interface MessageContextType {
  messageApi: MessageInstance;
};

export const MessageContext = createContext<MessageContextType | null>(null);

const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [api, contextHolder] = message.useMessage();

  const value = useMemo(() => ({ messageApi: api }), [api]);

  return (
    <MessageContext.Provider value={value}>
      {contextHolder}
      {children}
    </MessageContext.Provider>
  );
};
export default MessageProvider;

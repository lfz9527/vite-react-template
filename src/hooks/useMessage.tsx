import {MessageContext} from '@context/MessageProvider'
import type { MessageInstance } from 'antd/es/message/interface';

import { useContext } from 'react'

export const useMessageApi = (): MessageInstance => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessageApi must be used within a MessageProvider');
  }
  return context.messageApi;
};
export default useMessageApi;
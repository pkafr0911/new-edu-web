import type { RequestOptions } from '@@/plugin-request/request';
import { useModel, type RequestConfig } from '@umijs/max';
import { message, notification } from 'antd';
import { loginOut } from './helpers';
import { IGNORE_AUTHORIZATION_PAGE } from './consants';

// Error handling strategy: Error types
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}

// Response data format agreed with the backend
interface ResponseStructure {
  success: boolean;
  data: any;
  errorCode?: number;
  errorMessage?: string;
  showType?: ErrorShowType;
}

/**
 * @name Error Handling
 * Built-in error handling for Pro, can be customized here.
 * @doc https://umijs.org/docs/max/request#configuration
 */

const unauthorizedHandler = (error: { response: Response; data: any }) => {
  const { response } = error;

  // ignore authorization page
  if (IGNORE_AUTHORIZATION_PAGE.some((sub) => window.location.pathname.includes(sub))) {
    return;
  }

  if ([401].includes(response.status)) {
    loginOut();
  }
};
export const errorConfig: RequestConfig = {
  // Error handling: Umi@3 error handling strategy
  errorConfig: {
    // Error thrower
    errorThrower: (res) => {
      const { success, data, errorCode, errorMessage, showType } =
        res as unknown as ResponseStructure;
      if (!success) {
        const error: any = new Error(errorMessage);
        error.name = 'BizError';
        error.info = { errorCode, errorMessage, showType, data };
        throw error; // Throw custom error
      }
    },
    // Error reception and handling
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;

      //handle request which unauthorized
      unauthorizedHandler(error);

      // Handling errors thrown by errorThrower
      if (error.name === 'BizError') {
        const errorInfo: ResponseStructure | undefined = error.info;
        if (errorInfo) {
          const { errorMessage, errorCode } = errorInfo;
          switch (errorInfo.showType) {
            case ErrorShowType.SILENT:
              // Do nothing
              break;
            case ErrorShowType.WARN_MESSAGE:
              message.warning(errorMessage);
              break;
            case ErrorShowType.ERROR_MESSAGE:
              message.error(errorMessage);
              break;
            case ErrorShowType.NOTIFICATION:
              notification.open({
                description: errorMessage,
                message: errorCode,
              });
              break;
            case ErrorShowType.REDIRECT:
              // TODO: Implement redirection logic
              break;
            default:
              message.error(errorMessage);
          }
        }
      } else if (error.response) {
        // Axios error: The request was successfully sent, but the server responded with a status code outside the 2xx range.
        console.log('error', error);
        message.error(`Error(${error.response.status}): ${error.response.data.message} `);
      } else if (error.request) {
        // The request was successfully sent but no response was received.
        // `error.request` is an instance of XMLHttpRequest in the browser
        // and an instance of http.ClientRequest in Node.js.
        message.error('No response received! Please retry.');
      } else {
        // An issue occurred while sending the request.
        message.error('Request error, please retry.');
      }
    },
  },
};

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the API slice
export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api/chat/' }), // Your backend URL
  endpoints: (builder) => ({
    // Define the 'chat' endpoint
    sendMessage: builder.mutation<any, { message: string }>({
      query: (message) => ({
        url: 'chat',
        method: 'POST',
        body: { message },
      }),
    }),
  }),
});

export const { useSendMessageMutation } = chatApi;

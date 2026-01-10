import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "@/lib/supabaseClient";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    signUp: builder.mutation({
      async queryFn({ email, password }) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) return { error };
        return { data: "ok" };
      },
    }),

    signIn: builder.mutation({
      async queryFn({ email, password }) {
        const { data, error } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (error) return { error };
        return { data: data.user };
      },
    }),

    getCurrentUser: builder.query({
      async queryFn() {
        const { data } = await supabase.auth.getSession();

        if (!data.session) return { data: null };

        return { data: data.session.user };
      },
    }),
  }),
});

export const {
  useSignUpMutation,
  useSignInMutation,
  useGetCurrentUserQuery,
} = authApi;

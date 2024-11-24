import React, { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_USER_BY_ID } from '@/src/utils/gql/queries/users';
import { CREATE_USER, UPDATE_USER } from '@/src/utils/gql/mutations/users';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createUser } from '@/src/utils/api';
import { Button } from '@/src/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { nanoid } from 'nanoid';

const formSchema = z.object({
  username: z.string(),
  email: z.string(),
});

export async function getServerSideProps(context: { params: { id: string } }) {
  const id = context.params.id;
  return {
    props: { id },
  };
}

const Index = ({ id }: { id: string }) => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
  });

  const [getUser] = useLazyQuery(GET_USER_BY_ID, {
    fetchPolicy: 'network-only',
    onCompleted(data) {
      setUserData(data.user);
    },
  });

  const [userCreateMutation] = useMutation(CREATE_USER);
  const [userUpdateMutation] = useMutation(UPDATE_USER);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: userData?.name,
      email: userData?.email,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (id === 'new') {
      const passsword = nanoid();
      try {
        const usuario = await createUser({
          name: values.username,
          email: values.email,
          password: passsword,
        }).then(async (res) => {
          const user = res.usuario;
          await userCreateMutation({
            variables: {
              data: {
                accounts: {
                  create: {
                    type: user.identities[0].provider,
                    provider: user.identities[0].provider,
                    providerAccountId: user.user_id,
                  },
                },
                name: user.name,
                role: 'USER',
                email: user.email,
                image: user.picture,
              },
            },
          });
        });
        console.log(usuario);
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log(values)
      await userUpdateMutation({
        variables: {
          where: { id: id },
          data: {
            name: {
              set: values.username,
            },
            email: {
              set: values.email,
            },
          },
        },
      });
    }
  }

  useEffect(() => {
    getUser({ variables: { userId: id } });
  }, [id]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder='username'
                  {...field}
                  value={userData?.name ?? ''}
                  onChange={(e) => {
                    setUserData({ ...userData, name: e.target.value });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type='email'
                  placeholder='email'
                  {...field}
                  value={userData?.email ?? ''}
                  onChange={(e) => {
                    setUserData({ ...userData, email: e.target.value });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  );
};

export default Index;

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
import ReactLoading from 'react-loading';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';

const FormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  role: z.string(),
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
    role: '',
  });

  const [getUser, { loading: querieLoading }] = useLazyQuery(GET_USER_BY_ID, {
    fetchPolicy: 'network-only',
    onCompleted(data) {
      setUserData(data.user);
    },
  });

  const [userCreateMutation] = useMutation(CREATE_USER);
  const [userUpdateMutation, { loading: mutationLoading }] =
    useMutation(UPDATE_USER);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: userData?.name,
      email: userData?.email,
      role: userData?.role,
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    if (id === 'new') {
      const passsword = nanoid();
      try {
        await createUser({
          name: values.name,
          email: values.email,
          role: values.role,
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
                role: user.role,
                email: user.email,
                image: user.picture,
              },
            },
          });
        });
      } catch (e) {
        console.error(e);
      }
    } else {
      await userUpdateMutation({
        variables: {
          where: { id: id },
          data: {
            name: {
              set: values.name,
            },
            email: {
              set: values.email,
            },
            role: {
              set: values.role,
            },
          },
        },
      });
    }
  }

  useEffect(() => {
    if (id !== 'new') {
      getUser({ variables: { userId: id } });
    }
  }, [id]);

  useEffect(() => {
    if (userData) {
      form.reset(userData);
    }
  }, [userData, form]);

  if (querieLoading || mutationLoading)
    return (
      <div className='flex items-center justify-center'>
        <ReactLoading
          type='bubbles'
          color='#f9802d'
          height={'20%'}
          width={'20%'}
        />
      </div>
    );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
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

        <FormField
          control={form.control}
          name='role'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder='Select a role' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value='USER'>User</SelectItem>
                      <SelectItem value='ADMIN'>Admin</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
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
function nanoid() {
  throw new Error('Function not implemented.');
}

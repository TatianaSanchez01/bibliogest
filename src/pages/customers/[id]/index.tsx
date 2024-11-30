'use client';
import React, { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_BOOK_BY_ID } from '@/src/utils/gql/queries/books';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Button } from '@/src/components/ui/button';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/src/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/src/components/ui/form';
import ReactLoading from 'react-loading';
import { UPSERT_CUSTOMER } from '@/src/utils/gql/mutations/customers';
import { useRouter } from 'next/navigation';
import { GET_CUSTOMER_BY_ID } from '@/src/utils/gql/queries/customers';

const FormSchema = z.object({
  document: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  address: z.string(),
});

export async function getServerSideProps(context: { params: { id: string } }) {
  const id = context.params.id;
  return {
    props: { id },
  };
}

const Index = ({ id }: { id: string }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [customer, setCustomer] = useState({
    document: '',
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const [getCustomer, { loading: querieLoading }] = useLazyQuery(
    GET_CUSTOMER_BY_ID,
    {
      fetchPolicy: 'network-only',
      onCompleted(data) {
        console.log(data.customer);
        setCustomer(data.customer);
      },
    }
  );

  const [upsertCustomer, { loading: mutationLoading }] =
    useMutation(UPSERT_CUSTOMER);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      document: '',
      name: '',
      email: '',
      phone: '',
      address: '',
    },
  });

  useEffect(() => {
    if (id !== 'add') {
      getCustomer({ variables: { customerId: id } });
    }
  }, [id]);

  useEffect(() => {
    if (customer) {
      form.reset(customer);
    }
  }, [customer]);

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    console.log(values);
    const formData = {
      ...values,
    };

    const data = {
      create: formData,
      update: formData,
    };

    await upsertCustomer({
      variables: {
        where: {
          id: id === 'add' ? '' : id,
        },
        data,
      },
    })
      .then(() => {
        console.log('success');
        toast({
          variant: 'deafult',
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.',
        });
        router.push('/customers');
      })
      .catch((error) => {
        console.log(error);
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.',
        });
      });
  }

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

  const handleRedirect = () => {
    router.push('/customers');
  };

  return (
    <div className='flex gap-3'>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>
            {id === 'add' ? 'Add a new customer' : 'Edit customer'}
          </CardTitle>
          <CardDescription>
            {id === 'add'
              ? 'Add the customer information'
              : 'Edit customer information.'}
          </CardDescription>
        </CardHeader>
        <CardContent className='w-full'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='grid w-full items-center gap-4'>
                <FormField
                  control={form.control}
                  name='document'
                  render={({ field }) => (
                    <FormItem>
                      <div className='flex flex-col space-y-1.5'>
                        <FormLabel htmlFor='document'>Document</FormLabel>
                        <FormControl>
                          <Input
                            type='text'
                            placeholder='Document'
                            {...field}
                            value={customer?.document ?? ''}
                            onChange={(e) => {
                              setCustomer({
                                ...customer,
                                document: e.target.value,
                              });
                            }}
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <div className='flex flex-col space-y-1.5'>
                        <Label>Name</Label>
                        <Input
                          type='text'
                          placeholder='Customer name'
                          {...field}
                          value={customer?.name ?? ''}
                          onChange={(e) => {
                            setCustomer({
                              ...customer,
                              name: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <div className='flex flex-col space-y-1.5'>
                        <Label>Email</Label>
                        <Input
                          type='email'
                          placeholder='Customer email'
                          {...field}
                          value={customer?.email ?? ''}
                          onChange={(e) => {
                            setCustomer({
                              ...customer,
                              email: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='phone'
                  render={({ field }) => (
                    <FormItem>
                      <div className='flex flex-col space-y-1.5'>
                        <Label htmlFor='isbn'>Phone</Label>
                        <Input
                          type='text'
                          placeholder='Customer phone number'
                          {...field}
                          value={customer?.phone ?? ''}
                          onChange={(e) => {
                            setCustomer({
                              ...customer,
                              phone: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='address'
                  render={({ field }) => (
                    <FormItem>
                      <div className='flex flex-col space-y-1.5'>
                        <Label htmlFor='address'>Address</Label>
                        <Input
                          id='address'
                          type='text'
                          placeholder='Customer address'
                          {...field}
                          value={customer?.address ?? ''}
                          onChange={(e) => {
                            setCustomer({
                              ...customer,
                              address: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <div className='flex justify-start gap-5 my-4'>
                <Button type='submit'>Submit</Button>
                <Button
                  variant='outline'
                  type='button'
                  onClick={handleRedirect}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;

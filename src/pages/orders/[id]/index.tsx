'use client';
import React, { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';

import Image from 'next/image';

import { useToast } from '@/src/hooks/use-toast';

import ReactLoading from 'react-loading';
import { useRouter } from 'next/navigation';
import { GET_ORDER_BY_ID } from '@/src/utils/gql/queries/orders';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/src/components/ui/accordion';
import { Badge } from '@/src/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/src/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import { GET_CUSTOMERS_INFO } from '@/src/utils/gql/queries/customers';
import { UPSERT_ORDER } from '@/src/utils/gql/mutations/orders';
import { Button } from '@/src/components/ui/button';
import { GET_BOOKS_INFO } from '@/src/utils/gql/queries/books';
import { CREATE_ORDER_ITEM } from '@/src/utils/gql/mutations/orderItem';

const FormSchema = z.object({
  clientId: z.string(),
  bookId: z.string(),
  newStatus: z.enum(['Completed', 'Canceled']),
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
  const [customers, setCustomers] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState<any[]>([]);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [order, setOrder] = useState({
    id: '',
    status: '',
    createdAt: '',
    customer: {
      document: '',
      id: '',
      name: '',
      email: '',
    },
    items: [
      {
        id: '',
        quantity: 0,
        book: {
          id: '',
          title: '',
          author: '',
          isbn: '',
          publicationDate: '',
          genre: '',
          image: '',
        },
      },
    ],
  });

  const [getCustomers] = useLazyQuery(GET_CUSTOMERS_INFO, {
    fetchPolicy: 'network-only',
    onCompleted(data) {
      setCustomers(data.customers);
    },
  });

  const [getBooks] = useLazyQuery(GET_BOOKS_INFO, {
    fetchPolicy: 'network-only',
    onCompleted(data) {
      setBooks(data.books);
    },
  });

  const [getOrder, { loading: querieLoading }] = useLazyQuery(GET_ORDER_BY_ID, {
    fetchPolicy: 'network-only',
    onCompleted(data) {
      setOrder(data.order);
    },
  });

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const [upsertOrder, { loading: mutationLoading }] = useMutation(UPSERT_ORDER);
  const [createOrderItem] = useMutation(CREATE_ORDER_ITEM);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      clientId: '',
      bookId: '',
      newStatus: 'Completed',
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    console.log(values);

    const data = {
      create: {
        customerId: values.clientId,
        status: 'Requested',
      },
      update: { status: values.newStatus ? values.newStatus : '' },
    };

    await upsertOrder({
      variables: {
        where: {
          id: id === 'add' ? '' : id,
        },
        data,
      },
    })
      .then((data: any) => {
        console.log('success', data);
        const orderId = data.data.upsertOrder?.id;
        console.log(orderId);
        selectedBooks.forEach(async (book) => {
          try {
            const response = await createOrderItem({
              variables: {
                data: {
                  orderId,
                  bookId: book.id,
                  quantity: 1
                },
              },
            });

            console.log(`Order item created for book: ${book.title}`, response);
          } catch (error) {
            console.error(
              `Failed to create order item for book: ${book.title}`,
              error
            );
          }
        });

        toast({
          variant: 'default',
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.',
        });

        router.push('/orders');
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

  useEffect(() => {
    if (id !== 'add') {
      getOrder({ variables: { orderId: id } });
    } else {
      getCustomers();
      getBooks();
    }
  }, [id]);

  if (querieLoading)
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
    router.push('/orders');
  };

  return (
    <>
      {id !== 'add' ? (
        <Card className='w-full'>
          <CardHeader>
            <CardTitle>View the order</CardTitle>
          </CardHeader>
          <CardContent className='w-full'>
            <Accordion type='single' collapsible>
              <AccordionItem value={order.id.toString()}>
                <AccordionTrigger className='flex justify-between items-center bg-accent p-5 rounded-lg text-base hover:bg-accent-light transition'>
                  <div className='flex flex-col text-left'>
                    <span className='font-semibold text-gray-800'>
                      Order N°: {order.id}
                    </span>
                    <span className='text-sm text-gray-600'>
                      Client Document: {order.customer.document}
                    </span>
                    <span className='text-sm text-gray-600'>
                      Name: {order.customer.name}
                    </span>
                    <span className='text-sm text-gray-600'>
                      Email: {order.customer.email}
                    </span>
                  </div>
                  <div className='flex flex-col items-end'>
                    <Badge
                      className={`w-auto px-2 py-1 text-sm rounded-md ${
                        order.status === 'Requested'
                          ? 'bg-yellow-500'
                          : order.status === 'Completed'
                          ? 'bg-green-500'
                          : 'bg-red-500'
                      } text-white`}
                    >
                      {order.status}
                    </Badge>
                    <span className='text-xs text-gray-500'>
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                </AccordionTrigger>

                <AccordionContent className='p-5 bg-gray-50 rounded-b-lg border-t border-gray-200'>
                  {order.items.map((item: any) => (
                    <div
                      key={item.id}
                      className='flex flex-col md:flex-row gap-4 mb-5'
                    >
                      {/* Book Information */}
                      <div className='flex-grow'>
                        <h4 className='font-semibold text-gray-800 mb-2'>
                          {item.book.title}
                        </h4>
                        <ul className='text-sm text-gray-600 space-y-1'>
                          <li>
                            <span className='font-medium'>Author:</span>{' '}
                            {item.book.author}
                          </li>
                          <li>
                            <span className='font-medium'>ISBN:</span>{' '}
                            {item.book.isbn}
                          </li>
                          <li>
                            <span className='font-medium'>
                              Publication Date:
                            </span>{' '}
                            {formatDate(item.book.publicationDate)}
                          </li>
                          <li>
                            <span className='font-medium'>Genre:</span>{' '}
                            {item.book.genre}
                          </li>
                          <li>
                            <span className='font-medium'>Book ID:</span>{' '}
                            {item.book.id}
                          </li>
                        </ul>
                      </div>
                      <div className='flex-shrink-0'>
                        <Image
                          src={item.book.image || '/placeholder-image.png'}
                          alt='Book cover'
                          width={150}
                          height={200}
                          className='rounded-lg object-cover shadow-sm'
                        />
                      </div>
                    </div>
                  ))}
                  <Separator className='mt-4 border-gray-300' />

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <div className='flex justify-between items-center'>
                        <FormField
                          control={form.control}
                          name='newStatus'
                          render={({ field }) => (
                            <FormItem>
                              <div className='mt-4 flex items-center gap-4'>
                                <label className='text-sm font-medium text-gray-600'>
                                  Change Status:
                                </label>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <SelectTrigger className='w-40'>
                                    <SelectValue placeholder='Select status' />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {order.status === 'Requested' && (
                                      <SelectItem value='Completed'>
                                        Completed
                                      </SelectItem>
                                    )}
                                    <SelectItem value='Canceled'>
                                      Canceled
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </FormItem>
                          )}
                        />
                        <Button
                          type='submit'
                          className='px-6 py-2 font-medium rounded-md shadow'
                        >
                          Submit
                        </Button>
                      </div>
                    </form>
                  </Form>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      ) : (
        <div className='flex gap-5'>
          <Card className='w-full h-fit bg-white shadow-lg rounded-lg border border-gray-200'>
            <CardHeader className=' px-6 py-5'>
              <CardTitle className='text-xl font-bold text-gray-800'>
                Add a New Order
              </CardTitle>
            </CardHeader>
            <CardContent className='px-6'>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='space-y-6'
                >
                  <FormField
                    control={form.control}
                    name='clientId'
                    render={({ field }) => (
                      <FormItem>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Select a Customer
                        </label>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className='w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500'>
                            <SelectValue placeholder='Select a customer' />
                          </SelectTrigger>
                          <SelectContent>
                            {customers.map((customer: any) => (
                              <SelectItem key={customer.id} value={customer.id}>
                                {customer.document} | {customer.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  {/* Book Selection */}
                  <FormField
                    control={form.control}
                    name='bookId'
                    render={({ field }) => (
                      <FormItem>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Select a Book
                        </label>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            setSelectedValue(field.value);
                            const selectedBook = books.find(
                              (book: any) => book.id === value
                            );
                            if (selectedBook) {
                              setSelectedBooks((prev) => [
                                ...prev,
                                selectedBook,
                              ]);
                            }
                          }}
                        >
                          <SelectTrigger className='w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500'>
                            <SelectValue placeholder='Select a book' />
                          </SelectTrigger>
                          <SelectContent>
                            {books.map((book: any) => (
                              <SelectItem key={book.id} value={book.id}>
                                <div className='flex items-center justify-between gap-4'>
                                  <div className='text-left flex flex-col gap-1'>
                                    <span className='text-sm font-medium text-gray-800'>
                                      {book.title} | {book.author}
                                    </span>
                                    <span className='text-xs text-gray-500'>
                                      {book.isbn} | {book.genre}
                                    </span>
                                  </div>
                                  <Badge className='flex-shrink-0 text-white px-2 py-1 rounded'>
                                    Copies: {book.copies}
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <div className='flex justify-end gap-5'>
                    <Button
                      type='submit'
                      className='px-6 py-2 font-medium rounded-md shadow'
                    >
                      Submit
                    </Button>
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

          <Card className='w-full bg-white shadow-lg rounded-lg border border-gray-200'>
            <CardHeader>
              <CardTitle>Books added</CardTitle>
            </CardHeader>
            <CardContent className='w-full space-y-4'>
              {selectedBooks.map((book: any) => (
                <div key={book.id}>
                  <div className='flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm'>
                    <div className='flex-shrink-0'>
                      <Image
                        src={book.image || '/placeholder-image.png'}
                        alt='book cover'
                        width={100}
                        height={150}
                        className='rounded-md object-cover'
                      />
                    </div>
                    <div className='flex flex-col flex-grow'>
                      <h3 className='text-lg font-bold text-gray-800'>
                        {book.title}
                      </h3>
                      <p className='text-sm text-gray-600'>
                        <span className='font-medium'>Author:</span>{' '}
                        {book.author}
                      </p>
                      <p className='text-sm text-gray-600'>
                        <span className='font-medium'>ISBN:</span> {book.isbn}
                      </p>
                      <p className='text-sm text-gray-600'>
                        <span className='font-medium'>Genre:</span> {book.genre}
                      </p>
                      <p className='text-xs text-gray-500 mt-2'>
                        <span className='font-medium'>ID:</span> {book.id}
                      </p>
                    </div>
                  </div>
                  <Separator className='my-4 border-gray-200' />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default Index;

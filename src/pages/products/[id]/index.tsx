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
import Image from 'next/image';

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
import { UPSERT_BOOK } from '@/src/utils/gql/mutations/books';
import { useRouter } from 'next/navigation';

const FormSchema = z.object({
  title: z.string(),
  author: z.string(),
  isbn: z.string(),
  publicationDate: z.string().date(),
  copies: z.number(),
  image: z.string(),
  genre: z.string(),
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
  const [book, setBook] = useState({
    title: '',
    author: '',
    isbn: '',
    publicationDate: new Date(),
    copies: 0,
    genre: '',
    image: '',
  });
  const [date, setDate] = useState<Date | undefined>(new Date('01/01/2024'));

  const [getBook, { loading: querieLoading }] = useLazyQuery(GET_BOOK_BY_ID, {
    fetchPolicy: 'network-only',
    onCompleted(data) {
      setBook({
        ...data.book,
        publicationDate: new Date(data.book.publicationDate).toISOString(),
      });

      setDate(new Date(data.book.publicationDate));
    },
  });

  const [upsertBook, { loading: mutationLoading }] = useMutation(UPSERT_BOOK);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      author: '',
      isbn: '',
      publicationDate: new Date().toISOString(),
      copies: 0,
      image: '',
      genre: '',
    },
  });

  useEffect(() => {
    if (id !== 'add') {
      getBook({ variables: { bookId: id } });
    }
  }, [id]);

  useEffect(() => {
    if (book) {
      form.reset({
        ...book,
        publicationDate: new Date(book.publicationDate)
          .toISOString()
          .slice(0, 10),
      });
    }
  }, [book]);

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    console.log(values);
    const formData = {
      ...values,
      publicationDate: new Date(values.publicationDate).toISOString(),
    };

    const data = {
      create: formData,
      update: formData,
    };

    await upsertBook({
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
          variant: 'success',
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.',
        });
        router.push('/products');
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
    router.push('/products');
  };

  return (
    <>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>
            {id === 'add' ? 'Add a new book' : 'Edit your book'}
          </CardTitle>
          <CardDescription>
            {id === 'add'
              ? 'Add your book information'
              : 'Edit your book information.'}
          </CardDescription>
        </CardHeader>
        <CardContent className='w-full '>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='flex justify-around'>
                <div className='grid w-full items-center gap-4'>
                  {id === 'add' && (
                    <FormField
                      control={form.control}
                      name='image'
                      render={({ field }) => (
                        <FormItem>
                          <div className='flex flex-col space-y-1.5'>
                            <FormLabel>Image URL</FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Image URL'
                                {...field}
                                onChange={(e) => {
                                  setBook({ ...book, image: e.target.value });
                                }}
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name='title'
                    render={({ field }) => (
                      <FormItem>
                        <div className='flex flex-col space-y-1.5'>
                          <FormLabel htmlFor='title'>Title</FormLabel>
                          <FormControl>
                            <Input
                              type='text'
                              placeholder='Book title'
                              {...field}
                              value={book?.title ?? ''}
                              onChange={(e) => {
                                setBook({ ...book, title: e.target.value });
                              }}
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='author'
                    render={({ field }) => (
                      <FormItem>
                        <div className='flex flex-col space-y-1.5'>
                          <Label>Author</Label>
                          <Input
                            type='text'
                            placeholder='Book author'
                            {...field}
                            value={book?.author ?? ''}
                            onChange={(e) => {
                              setBook({ ...book, author: e.target.value });
                            }}
                          />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='isbn'
                    render={({ field }) => (
                      <FormItem>
                        <div className='flex flex-col space-y-1.5'>
                          <Label htmlFor='isbn'>ISBN</Label>
                          <Input
                            type='text'
                            placeholder='ISBN Code'
                            {...field}
                            value={book?.isbn ?? ''}
                            onChange={(e) => {
                              setBook({ ...book, isbn: e.target.value });
                            }}
                          />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='publicationDate'
                    render={({ field }) => (
                      <FormItem>
                        <div className='flex flex-col space-y-1.5'>
                          <Label htmlFor='date'>Publication Date</Label>
                          <Input
                            id='date'
                            type='date'
                            placeholder='Publication date'
                            {...field}
                            value={date?.toISOString().slice(0, 10) ?? ''}
                            onChange={(e) => {
                              setDate(new Date(e.target.value));
                            }}
                          />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='genre'
                    render={({ field }) => (
                      <FormItem>
                        <div className='flex flex-col space-y-1.5'>
                          <Label htmlFor='genre'>Genre</Label>
                          <Input
                            id='genre'
                            type='text'
                            placeholder='Genre'
                            {...field}
                            value={book?.genre ?? ''}
                            onChange={(e) => {
                              setBook({
                                ...book,
                                genre: e.target.value,
                              });
                            }}
                          />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='copies'
                    render={({ field }) => (
                      <FormItem>
                        <div className='flex flex-col space-y-1.5'>
                          <Label htmlFor='copies'>N° Copies</Label>
                          <Input
                            id='copies'
                            type='number'
                            placeholder='Author of the book'
                            {...field}
                            value={book?.copies ?? ''}
                            onChange={(e) => {
                              setBook({
                                ...book,
                                copies: Number(e.target.value),
                              });
                            }}
                          />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                {id !== 'add' && (
                  <div className='h-full w-full flex justify-center'>
                    <Image
                      src={book?.image}
                      alt='Book image'
                      width={400}
                      height={600}
                    />
                  </div>
                )}
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
    </>
  );
};

export default Index;

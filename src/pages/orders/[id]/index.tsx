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

// const FormSchema = z.object({
//   title: z.string(),
//   author: z.string(),
//   isbn: z.string(),
//   publicationDate: z.string().date(),
//   copies: z.number(),
//   image: z.string(),
//   genre: z.string(),
// });

export async function getServerSideProps(context: { params: { id: string } }) {
  const id = context.params.id;
  return {
    props: { id },
  };
}

const Index = ({ id }: { id: string }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [order, setOrder] = useState({
    id: String,
    status: String,
    createdAt: String,
    customer: {
      document: String,
      id: String,
      name: String,
      email: String,
    },
    items: [
      {
        id: String,
        quantity: Number,
        book: {
          id: String,
          title: String,
          author: String,
          isbn: String,
          publicationDate: String,
          genre: String,
          image: String,
        },
      },
    ],
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

  //   const [upsertBook, { loading: mutationLoading }] = useMutation(UPSERT_BOOK);

  //   const form = useForm<z.infer<typeof FormSchema>>({
  //     resolver: zodResolver(FormSchema),
  //     defaultValues: {
  //       title: '',
  //       author: '',
  //       isbn: '',
  //       publicationDate: new Date().toISOString(),
  //       copies: 0,
  //       image: '',
  //       genre: '',
  //     },
  //   });

  useEffect(() => {
    if (id !== 'add') {
      getOrder({ variables: { orderId: id } });
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
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>
            {id === 'add' ? 'Add a new order' : 'View the order'}
          </CardTitle>
        </CardHeader>
        <CardContent className='w-full '>
          {id !== 'add' ? (
            <Accordion type='single' collapsible>
              <AccordionItem value={order.id.toString()}>
                <AccordionTrigger className='flex justify-between bg-accent px-5 rounded-t-lg text-base'>
                  <div className='flex flex-col text-left font-normal'>
                    <span className='font-semibold'>
                      Client document: {order.customer.document.toString()}
                    </span>
                    <span>Client name: {order.customer.name.toString()}</span>
                    <span>Client email: {order.customer.email.toString()}</span>
                  </div>
                  <div className='flex flex-col text-right'>
                    <Badge className='w-full justify-center text-sm'>
                      {order.status.toString()}
                    </Badge>
                    {formatDate(order.createdAt.toString())}
                  </div>
                </AccordionTrigger>
                <AccordionContent className='p-5 text-base'>
                  {order.items.map((item: any) => (
                    <div key={item.id} className='flex gap-5 justify-between'>
                      <div className='flex flex-col gap-3'>
                        <span>
                          {' '}
                          <span className='font-semibold'>Book id:</span>{' '}
                          {item.book.id}{' '}
                        </span>
                        <span>
                          {' '}
                          <span className='font-semibold'>
                            Book title:
                          </span>{' '}
                          {item.book.title}{' '}
                        </span>
                        <span>
                          {' '}
                          <span className='font-semibold'>
                            Book author:
                          </span>{' '}
                          {item.book.author}{' '}
                        </span>
                        <span className='font-semibold'>
                          {' '}
                          Book ISBN code: {item.book.isbn}{' '}
                        </span>
                        <span>
                          <span className='font-semibold'>
                            Publication date:{' '}
                          </span>
                          {formatDate(item.book.publicationDate.toString())}{' '}
                        </span>
                        <span>
                          {' '}
                          <span className='font-semibold'>Genre:</span>{' '}
                          {item.book.genre}{' '}
                        </span>
                      </div>
                      <div className='p-0 -mt-5'>
                        <Image
                          src={item.book.image}
                          alt='book cover'
                          width={250}
                          height={150}
                        />
                      </div>
                    </div>
                  ))}
                  <Separator />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ):(
            'hola'
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default Index;

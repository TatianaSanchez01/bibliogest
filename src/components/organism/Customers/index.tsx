import { Badge } from '@/src/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';
import { useRouter } from 'next/navigation';
import { Button } from '../../ui/button';
import { UserRoundPlus } from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_CUSTOMERS } from '@/src/utils/gql/queries/customers';
import ReactLoading from 'react-loading';
import { useToast } from '@/src/hooks/use-toast';
import { DELETE_CUSTOMER } from '@/src/utils/gql/mutations/customers';

export default function Component() {
  const [customers, setCustomers] = useState([]);
  const router = useRouter();
  const { toast } = useToast();
  const [deleteCustomer, { loading: mutationLoading }] =
    useMutation(DELETE_CUSTOMER);

  useQuery(GET_CUSTOMERS, {
    fetchPolicy: 'cache-and-network',
    onCompleted(data) {
      setCustomers(data.customers);
    },
  });

  async function onDelete(id: string) {
    await deleteCustomer({
      variables: {
        where: {
          id,
        },
      },
    })
      .then((data) => {
        console.log('success');
        const response = data.data.deleteCustomer;
        toast({
          variant: 'success',
          title: `The customer  was deleted.`,
          description: `The customer ${response.name} with document ${response.document} was deleted from the database.`,
        });
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'This customer can not be deleted.',
        });
      });
  }

  if (mutationLoading)
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
    <Card>
      <CardHeader className='px-7 flex-row flex items-center justify-between'>
        <div>
          <CardTitle>Clients</CardTitle>
          <CardDescription>Clients for the library.</CardDescription>
        </div>
        <Button
          onClick={() => router.push('/customers/add')}
          className='px-7 flex gap-4'
          variant='default'
        >
          New
          <UserRoundPlus />
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead className='hidden sm:table-cell'>Email</TableHead>
              <TableHead className='hidden sm:table-cell'>Phone</TableHead>
              <TableHead className='hidden md:table-cell'>Address</TableHead>
              <TableHead className='hidden md:table-cell'>Status</TableHead>
              <TableHead className='hidden md:table-cell'>Requests</TableHead>
              <TableHead className='hidden md:table-cell'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer: any) => (
              <TableRow className='bg-accent' key={customer.id}>
                <TableCell>
                  <div className='font-medium'>{customer.name}</div>
                  <div className='hidden text-sm text-muted-foreground md:inline'>
                    {customer.document}
                  </div>
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  {customer.email}
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  {customer.phone}
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  {customer.address}
                </TableCell>
                <TableCell className='hidden sm:table-cell'>
                  <Badge className='text-xs' variant='secondary'>
                    {customer.orders[0]
                      ? customer.orders[0].status
                      : 'No status'}
                  </Badge>
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  {customer.orders ? customer.orders.length : 0}
                </TableCell>
                <TableCell className='hidden md:table-cell justify-center'>
                  <Badge
                    onClick={() => router.push(`/customers/${customer.id}`)}
                    className='text-xs justify-center w-24 cursor-pointer'
                    variant='default'
                  >
                    Edit
                  </Badge>
                  <Badge
                    className='text-xs justify-center w-24 cursor-pointer'
                    variant='default'
                    onClick={() => onDelete(customer.id)}
                  >
                    Delete
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

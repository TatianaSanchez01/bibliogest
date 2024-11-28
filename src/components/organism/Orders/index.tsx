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
import { useRouter } from 'next/router';
import { Button } from '../../ui/button';
import { TicketPlus } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ORDERS } from '@/src/utils/gql/queries/orders';

export default function Component() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);

  useQuery(GET_ORDERS, {
    fetchPolicy: 'cache-and-network',
    onCompleted(data) {
      setOrders(data.orders);
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

  return (
    <Card>
      <CardHeader className='px-7 flex-row flex items-center justify-between'>
        <div>
          <CardTitle>Orders</CardTitle>
          <CardDescription>Recent orders from your store.</CardDescription>
        </div>
        <Button
          onClick={() => router.push('/orders/add')}
          className='px-7 flex gap-4'
          variant='default'
        >
          New
          <TicketPlus />
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order N°</TableHead>
              <TableHead className='hidden sm:table-cell'>Customer</TableHead>
              <TableHead className='hidden sm:table-cell'>Status</TableHead>
              <TableHead className='hidden md:table-cell'>Date</TableHead>
              <TableHead className='text-right'>N° Items</TableHead>
              <TableHead className='hidden md:table-cell'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order: any) => (
              <TableRow className='bg-accent' key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>
                  <div className='font-medium'>{order.customer.name}</div>
                  <div className='hidden text-sm text-muted-foreground md:inline'>
                    {order.customer.email}
                  </div>
                </TableCell>
                <TableCell className='hidden sm:table-cell'>
                  <Badge className='text-xs' variant='secondary'>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  {formatDate(order.createdAt)}
                </TableCell>
                <TableCell className='text-right'>
                  {order.items.length}
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  <div className='flex flex-row gap-5'>
                    <Badge
                      onClick={() => router.push(`/orders/${order.id}`)}
                      className='text-xs justify-center w-24 cursor-pointer'
                      variant='default'
                    >
                      View
                    </Badge>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

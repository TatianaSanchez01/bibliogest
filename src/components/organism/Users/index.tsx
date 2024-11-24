import React from 'react';
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
import { Avatar, AvatarImage } from '@/src/components/ui/avatar';
import { Button } from '@/src/components/ui/button';
import { GET_USERS } from '@/src/utils/gql/queries/users';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { UserRoundPlus } from 'lucide-react';

export default function Component() {
  const [users, setUsers] = React.useState([]);
  const router = useRouter();
  useQuery(GET_USERS, {
    fetchPolicy: 'cache-and-network',
    onCompleted(data) {
      console.log('users', data);
      setUsers(data.users);
    },
  });
  return (
    <Card>
      <CardHeader className='px-7 flex-row flex items-center justify-between'>
        <div>
          <CardTitle>Users</CardTitle>
          <CardDescription>Recent orders from your store.</CardDescription>
        </div>
        <Button
          onClick={() => router.push('/users/new')}
          className='px-7 flex gap-4'
          variant='default'
        >
          Add user
          <UserRoundPlus />
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead className='hidden sm:table-cell'>User</TableHead>
              <TableHead className='hidden sm:table-cell'>Email</TableHead>
              <TableHead className='hidden sm:table-cell'>Deleted</TableHead>
              <TableHead className='hidden sm:table-cell'>Eneabled</TableHead>
              <TableHead className='hidden md:table-cell'>Role</TableHead>
              <TableHead className='hidden md:table-cell'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Avatar>
                    <AvatarImage src={user.image} />
                  </Avatar>
                </TableCell>
                <TableCell className='hidden sm:table-cell'>
                  {user.name}
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  {user.email}
                </TableCell>
                <TableCell className='hidden sm:table-cell'>
                  <Badge className='text-xs' variant='secondary'>
                    {user.deleted ? 'Yes' : 'No'}
                  </Badge>
                </TableCell>
                <TableCell className='hidden sm:table-cell'>
                  <Badge className='text-xs' variant='secondary'>
                    {user.eneabled ? 'Yes' : 'No'}
                  </Badge>
                </TableCell>
                <TableCell className='hidden sm:table-cell'>
                  <Badge className='text-xs' variant='secondary'>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  <div className='flex flex-row gap-5'>
                    <Badge
                      onClick={() => router.push(`/users/${user.id}`)}
                      className='text-xs justify-center w-24'
                      variant='default'
                    >
                      Edit
                    </Badge>
                    <Badge
                      className='text-xs justify-center w-24'
                      variant='default'
                    >
                      Delete
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

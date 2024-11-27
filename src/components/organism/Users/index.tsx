import React, { useState } from 'react';
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
import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { UserRoundPlus } from 'lucide-react';
import { useToast } from '@/src/hooks/use-toast';
import { DELETE_USER } from '@/src/utils/gql/mutations/users';
import ReactLoading from 'react-loading';

export default function Component() {
  const [users, setUsers] = useState([]);
  const { toast } = useToast();
  const router = useRouter();
  const [deleteUser, { loading: mutationLoading }] = useMutation(DELETE_USER);

  useQuery(GET_USERS, {
    fetchPolicy: 'cache-and-network',
    onCompleted(data) {
      setUsers(data.users);
    },
  });

  async function onDelete(id: string) {
    await deleteUser({
      variables: {
        where: {
          id,
        },
      },
    })
      .then((data) => {
        console.log('success');
        const response = data.data.deleteUser;
        toast({
          variant: 'success',
          title: 'The user was deleted.',
          description: `The user ${response.name} was deleted from the database.`,
        });
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'Your book can not be deleted.',
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
                      className='text-xs justify-center w-24 cursor-pointer'
                      variant='default'
                    >
                      Edit
                    </Badge>
                    <Badge
                      className='text-xs justify-center w-24 cursor-pointer'
                      variant='default'
                      onClick={() => onDelete(user.id)}
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

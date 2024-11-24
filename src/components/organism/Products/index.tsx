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
import { Button } from '@/src/components/ui/button';

import { GET_BOOKS } from '@/src/utils/gql/queries/books';
import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Avatar, AvatarImage } from '../../ui/avatar';
import { DiamondPlus } from 'lucide-react';

export default function Component() {
  const [books, setBooks] = useState([]);

  useQuery(GET_BOOKS, {
    fetchPolicy: 'cache-and-network',
    onCompleted(data) {
      setBooks(data.books);
    },
  });

  const router = useRouter();

  return (
    <Card>
      <CardHeader className='px-7 flex-row flex items-center justify-between'>
        <div>
          <CardTitle>Books</CardTitle>
          <CardDescription>List of books in the library.</CardDescription>
        </div>
        <Button
          onClick={() => router.push('/products/add')}
          className='px-7 flex gap-4'
          variant='default'
        >
          New
          <DiamondPlus />
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className='hidden sm:table-cell'>Author</TableHead>
              <TableHead className='hidden sm:table-cell'>ISBN</TableHead>
              <TableHead className='hidden md:table-cell'>
                Publication Date
              </TableHead>
              <TableHead className='hidden md:table-cell'>Genre</TableHead>
              <TableHead className='hidden md:table-cell'>N° Copies</TableHead>
              <TableHead className='hidden md:table-cell'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book: any) => (
              <TableRow className='bg-accent' key={book.id}>
                <TableCell>
                  <Avatar>
                    <AvatarImage src={book.image} />
                  </Avatar>
                </TableCell>
                <TableCell className='hidden sm:table-cell'>
                  {book.title}
                </TableCell>
                <TableCell className='hidden sm:table-cell'>
                  {book.author}
                </TableCell>
                <TableCell className='hidden sm:table-cell'>
                  {book.isbn}
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  {book.publicationDate}
                </TableCell>
                <TableCell className='hidden sm:table-cell'>
                  <Badge className='text-xs' variant='secondary'>
                    {book.genre}
                  </Badge>
                </TableCell>

                <TableCell className='text-right'>{book.copies}</TableCell>
                <TableCell className='hidden md:table-cell'>
                  <div className='flex flex-row gap-5'>
                    <Badge
                      onClick={() => router.push(`/products/${book.id}`)}
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

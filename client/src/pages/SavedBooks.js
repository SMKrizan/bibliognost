// dependencies
import React from 'react'
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/react-hooks';
// utilities
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  // 'useQuery' hook requests data and stores response from server; 'loading' will be used to conditionally render data based on whether there is data to display
  const { loading, data } = useQuery(GET_ME);
  const userData = data?.me || {};
  console.log('userData: ', userData)
  // 'useMutation' hook creates fn that returns mutation code in the form of 'removeBook' fn and checks for errors
  const [removeBook, { error }] = useMutation(REMOVE_BOOK);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return (
      <h2>
        You must be logged in to process this request. Use the navigation links above to sign up or log in!
      </h2>
      )
    }

    try {
      const { data } = await removeBook({
        variables: { userData: bookId },
        // variables: { 
          //   bookId: userData.bookId, 
          //   title: userData.title,
          //   description: userData.description, 
          //   authors: userData.authors, 
          //   image: userData.image, 
          //   link: userData.link }
        });
        // upon success, remove book's id from localStorage
        console.log('userData: ', userData)
        console.log('userData.bookId : ', userData.bookId)
        removeBookId(bookId);
      } catch (err) {
        console.error(err);
      }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;

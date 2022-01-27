import React, { useState, useEffect, useRef } from "react";
import { BookDescription } from "./BookDescription";
import BookSearchItem from "./BookSearchItem";
import { useBookData } from "./useBookData";

type BookSearchDialogProps = {
  maxResults: number;
  onBookAdd: (book: BookDescription) => void;
};

const BookSearchDialog = (props: BookSearchDialogProps) => {
  const titleRef = useRef<HTMLInputElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const books = useBookData(title, author, props.maxResults);

  const handleSearchClick = () => {
    if (!titleRef.current!.value && !authorRef.current!.value) {
      alert("Enter search conditions");
      return;
    }
    setTitle(titleRef.current!.value);
    setAuthor(authorRef.current!.value);
  };

  const handleBookAdd = (book: BookDescription) => {
    props.onBookAdd(book);
  };

  const bookItems = books.map((book, index) => {
    return (
      <BookSearchItem
        description={book}
        onBookAdd={(book) => handleBookAdd(book)}
        key={index}
      />
    );
  });

  return (
    <div className="dialog">
      <div className="operation">
        <div className="conditions">
          <input 
            type="text"
            placeholder="Search by title"
            // onChange={handleTitleInputChange}
            ref={titleRef}
          />
          <input 
            type="text"
            placeholder="Search by Author"
            // onChange={handleAuthorInputChange}
            ref={authorRef}
          />
        </div>
        <div className="button-like" onClick={handleSearchClick}>
        Search
        </div>
      </div>
      <div className="search-results">{bookItems}</div>
    </div>
  );
}

export default BookSearchDialog;
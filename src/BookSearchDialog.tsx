import React, { useState, useEffect, useRef } from "react";
import { BookDescription } from "./BookDescription";
import BookSearchItem from "./BookSearchItem";

type BookSearchDialogProps = {
  maxResults: number;
  onBookAdd: (book: BookDescription) => void;
};

const BookSearchDialog = (props: BookSearchDialogProps) => {
  const [books, setBooks] = useState([] as BookDescription[]);
  const titleRef = useRef<HTMLInputElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);
  // const [title, setTitle] = useState("");
  // const [author, setAuthor] = useState("");  

  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (isSearching) {
    // url生成
    const url = buildSearchUrl(titleRef.current!.value, authorRef.current!.value, props.maxResults);
    fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        return extractBooks(json);
      })
      .then((books) => {
        setBooks(books);
      })
      .catch((err) => {
        console.error(err);
      })
    }
    setIsSearching(false);
  }, [isSearching]);

  function buildSearchUrl(title: string, author: string, maxResults: number): string {
    let url = "https://www.googleapis.com/books/v1/volumes?q=";
    const conditions: string[] = [];
    if (title) {
      conditions.push(`intitle:${title}`);
    }
    if (author) {
      conditions.push(`inauthor:${author}`);
    }
    return url + conditions.join('+') + `&maxResults=${maxResults}`;
  }

  function extractBooks(json: any): BookDescription[] {
    const items: any[] = json.items;
    return items.map((item: any) => {
      const volumeInfo: any = item.volumeInfo;
      console.log(volumeInfo.imageLinks);
      return {
        title: volumeInfo.title,
        authors: volumeInfo.authors ? volumeInfo.authors.join(', ') : "",
        // thumbnail: volumeInfo.imageLinks ? volumeInfo.imageLinks.smallThumbnail : "",
        thumbnail: volumeInfo.imageLinks ? volumeInfo.imageLinks.smallThumbnail : "",
      }
    });
  }

  // const handleTitleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setTitle(e.target.value);
  // }

  // const handleAuthorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setAuthor(e.target.value);
  // }

  const handleSearchClick = () => {
    if (!titleRef.current!.value && !authorRef.current!.value) {
      alert("Enter search conditions");
      return;
    }
    // 検索処理
    setIsSearching(true);
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
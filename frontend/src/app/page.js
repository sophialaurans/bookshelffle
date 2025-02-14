"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import years from './data/years';
import ratings from './data/ratings';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const menuRef = useRef(null);
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [year, setYear] = useState("");
  const [rating, setRating] = useState("");
  const [authorsSuggestions, setAuthorsSuggestions] = useState([]);
  const [categorySuggestions, setCategorySuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAuthor, setLoadingAuthor] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [result, setResult] = useState([]);
  const [resultError, setResultError] = useState("");
  const user = null;

  // Handle menu interaction and scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      if (!menuRef.current) return;

      const menu = menuRef.current;
      const scrollTop = window.scrollY;
      const homeHeight = window.innerHeight;

      if (scrollTop <= homeHeight && !isOpen) {
        menu.style.pointerEvents = 'auto';
      } else if (scrollTop <= homeHeight && isOpen) {
        menu.style.pointerEvents = 'auto';
      } else {
        setIsOpen(prev => !prev); // Usar função dentro do setState para evitar dependência direta
      }
    };

    window.addEventListener("scroll", handleScroll);
  }, [isOpen]);

  // Fetch authors based on user input
  const fetchAuthors = async (query) => {
    if (!query) return;

    setLoadingAuthor(true);

    try {
      const response = await fetch(`http://localhost:5000/api/authors?query=${query}`);
      const data = await response.json();

      const uniqueAuthors = [...new Set(data.filter((author) => author && author.toLowerCase().includes(query.toLowerCase())))];
      setAuthorsSuggestions(uniqueAuthors);
    } catch (error) {
      console.error("Error fetching authors:", error);
    } finally {
      setLoadingAuthor(false);
    }
  };

  // Fetch subjects based on user input
  const fetchCategories = async (query) => {
    if (!query) return;

    setLoadingCategory(true);

    try {
      const response = await fetch(`http://localhost:5000/api/subjects?query=${query}`);
      const data = await response.json();

      const uniqueSubjects = [...new Set(data.filter((category) => category && category.toLowerCase().includes(query.toLowerCase())))];
      setCategorySuggestions(uniqueSubjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    } finally {
      setLoadingCategory(false);
    }
  };

  const fetchBooks = async () => {
    setLoading(true)
    const authorQuery = author ? category ? `inauthor:${author}+` : `inauthor:${author}` : 'a';
    const categoryQuery = category ? `subject:${category.replace(' ', '+')}` : '';

    const fullQuery = `${authorQuery}${categoryQuery}`;

    const queries = [
      `${fullQuery}`,
      `a+${fullQuery}`,
      `the+${fullQuery}`,
      `be+${fullQuery}`,
      `to+${fullQuery}`,
      `of+${fullQuery}`,
      `and+${fullQuery}`,
      `in+${fullQuery}`,
      `that+${fullQuery}`,
      `i+${fullQuery}`
    ];

    const books = [];
    try {
      for (const query of queries) {
        const response = await fetch(`http://localhost:5000/api/books?query=${query}`);
        const data = await response.json();

        if (Array.isArray(data)) {
          books.push(
            ...data.map(book => ({
              title: book.volumeInfo?.title || "N/A",
              author: book.volumeInfo?.authors ? book.volumeInfo.authors.join(", ") : "Unknown",
              publishYear: book.volumeInfo?.publishedDate?.split('-')[0] || "N/A",
              isbn: book.volumeInfo?.industryIdentifiers
                ? book.volumeInfo.industryIdentifiers.find(id => id.type === "ISBN_13")?.identifier ||
                  book.volumeInfo.industryIdentifiers.find(id => id.type === "ISBN_10")?.identifier ||
                  "N/A"
                : "N/A",
              categories: book.volumeInfo?.categories || "N/A",
              averageRating: book.volumeInfo?.averageRating || "N/A",
              summary: book.volumeInfo?.description || "Unavailable",
              thumbnail: book.volumeInfo?.imageLinks ? book.volumeInfo?.imageLinks.thumbnail || book.volumeInfo.imageLinks.smallThumbnail : '/cover.png',
              rating: book.volumeInfo?.averageRating || "?",
              ratingsCount: book.volumeInfo?.ratingsCount || "0",
            }))
          );
        }
      }

      console.log("All books retrieved:", books);

      const filteredBooks = books.filter(book => {
        if (author) {
          
        }

        if (category) {
          return book.categories[0] === category;
        }

        if (year) {
          const [startYear, endYear] = year.split('-');
          console.log("startYear:", startYear, "endYear", endYear, "book.publishYear", book.publishYear)
          return (
            Number(book.publishYear) >= Number(startYear) &&
            Number(book.publishYear) <= Number(endYear)
          );
        }

        if (rating) {
          return Math.floor(book.averageRating) === Number(rating);
        }

        return true;
      });

      if (filteredBooks.length > 0) {
        console.log("Filtered books:", filteredBooks);
        const randomIndex = Math.floor(Math.random() * filteredBooks.length);
        const randomBook = filteredBooks[randomIndex];
        console.log("Random book:", randomBook);
        setResult(randomBook);
        setLoading(false);
        return randomBook;
      } else {
        console.warn("No book was found.");
        setLoading(false);
        setResultError("No book was found.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching books", error);
      setLoading(false);
      setResultError("Error fetching books", error);
      return null;
    }
  };

  // Debounce input for fetching authors
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (author) fetchAuthors(author);
      if (category) fetchCategories(category);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [author, category]);

  return (
    <div>
      <main className="overflow-hidden">
          <div
            id="menu"
            ref={menuRef}
            className={`menu transition-[height] duration-500 ease-in-out ${
            isOpen ? "h-[95vh] bg-[length:100%_100%]" : "h-[30vh] hover:h-[33vh] bg-cover"
          }`}
            style={{
              backgroundImage: "url('/bookmark.png')",
            }}
            onClick={() => setIsOpen(!isOpen)}
          >
            <div
              className={`max-w-[13vw] absolute text-center mb-[20vh] transition-all duration-300 ease-in-out ${
                isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              }`}
              style={{ overflow: "hidden" }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div className="py-[5vh] hover:text-white transition-[color] duration-150">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="0.6"
                  stroke="currentColor"
                  className="size-[6vh] inline-block"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
                <p>User Name</p>
              </div>
              <Link href="#home"><p className="menu-link">Home</p></Link>
              <Link href="#shuffle"><p className="menu-link">Shuffle</p></Link>
              <Link href="#bookshelf"><p className="menu-link">Personal Bookshelf</p></Link>
              <Link href="#about"><p className="menu-link">About</p></Link>
            </div>
          </div>

          <div
            id="menu-mobile"
            className={`menu-mobile transition-[height] duration-500 ease-in-out ${
            isOpenMobile ? "h-[95vh] w-[40vw] bg-[length:100%_100%]" : "h-[15vh] w-[20vw] hover:h-[20vh] bg-cover"
          }`}
            style={{
              backgroundImage: "url('/bookmark-mobile.png')",
            }}
            onClick={() => setIsOpenMobile(!isOpenMobile)}
          >
            <div
              className={` absolute text-center text-[1.1em] w-[100%] mb-[20vh] transition-all duration-300 ease-in-out ${
                isOpenMobile ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              }`}
              style={{ overflow: "hidden" }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div className="py-[5vh] hover:text-white transition-[color] duration-150">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="0.6"
                  stroke="currentColor"
                  className="size-[6vh] inline-block"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
                <p>User Name</p>
              </div>
              <Link href="#home"><p className="menu-link">Home</p></Link>
              <Link href="#shuffle"><p className="menu-link">Shuffle</p></Link>
              <Link href="#bookshelf"><p className="menu-link">Personal Bookshelf</p></Link>
              <Link href="#about"><p className="menu-link">About</p></Link>
            </div>
          </div>
        <section
          id="home" 
          className="section-size sec1-padding all-center justify-around section-bg"
          style={{
            backgroundImage: "url('/bg.png')",
          }}
          >
          <div className={`transition-[margin-left] duration-500 ease-in-out ${
                isOpenMobile ? "is-open" : "not-open"
          }`}>
            <div className="flex flex-col items-center pb-[5vh]">
              <Image
                className="logo"
                src="/icon.png"
                alt="Page Icon"
                width={1000}
                height={1000}
                priority
              />
            </div>
            <div className="text-size">
              <p className="font-light">Stuck on what to read next?</p>
              <p className="pt-[5vh]">
                Let us randomly pick a book from
                <strong className="bg-[length:100%_100%]"
                  style={{
                    backgroundImage: "url('/blue-mark.png')",
                  }}
                  >
                    &nbsp;your own collection
                </strong>
                , from
                <strong className="text-nowrap bg-[length:100%_100%]"
                  style={{
                    backgroundImage: "url('/green-mark.png')",
                  }}
                  >
                    &nbsp;global reads
                  </strong>
                  , or
                  <strong className="text-nowrap bg-[length:100%_100%]"
                  style={{
                    backgroundImage: "url('/blue-green-mark.png')",
                  }}
                  >
                    &nbsp;mix it up
                  </strong>
                  &nbsp;for the ultimate surprise!
              </p>
              <p className="py-[3vh]">
                {`Now you don't have to decide on your own ;)`}
              </p>
            </div>
            <div className="flex gap-10 justify-center flex-wrap text-black">
              <Link href="">
                <div className="bg-[#ffc425] hover:bg-[#467bb3] sec1-button">
                  <Image
                    className="sec1-button-img"
                    src="/3.png"
                    alt="Icon"
                    width={300}
                    height={300}
                    priority
                  />
                  YOUR BOOKSHELF
                </div>
              </Link>
              <div className="bg-[#ffc425] hover:bg-[#0cf79e] sec1-button">
                <Image
                  className="sec1-button-img"
                  src="/4.png"
                  alt="Icon"
                  width={300}
                  height={100}
                  priority
                />
                GLOBAL READS
              </div>
              <Link href="">
                <div className="bg-[#ffc425] hover:bg-[#9ae6ed] sec1-button">
                  <Image
                    className="sec1-button-img"
                    src="/5.png"
                    alt="Icon"
                    width={300}
                    height={100}
                    priority
                  />
                  MIXED PICKS
                </div>
              </Link>
            </div>
          </div>
        </section>
        <section
          id="shuffle"
          className="all-center justify-evenly pl-[20vw] section-size section-bg"
          style={{backgroundImage: "url('/bg1.png')"}}
        >
          <div className="sec2-container"
            style={{backgroundImage: "url('/openbook.png')"}}
          >
            <h1 className="text-[2em] py-6 font-bold">Shuffle</h1>
            <p>Looking for a book on a specific subject, author, or genre? Select it and shuffle.</p>
            <p>{`Or simply shuffle if you're not sure where to start.`}</p>
            
            <div className="flex justify-between pt-[2vh] flex-wrap">
              {/* Author Input */}
              <div className="search-container scrollbar">
                <label htmlFor="author-input">Which author would you like to read?</label>
                <input
                  id="author-input"
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Type an author name..."
                  className="border rounded px-2 py-1 w-full"
                />
                {loadingAuthor && <p>Loading...</p>}
                {author && !loadingAuthor && authorsSuggestions.length > 0 && (
                  <ul className="text-left">
                    {authorsSuggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => setAuthor(suggestion)}
                        className="cursor-pointer hover:bg-gray-200 p-2 border-b border-b-slate-200"
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {/* Category Selection */}
              <div className="search-container scrollbar">
                <label htmlFor="category">Which subject or genre are you most interested in at the moment?</label>
                <input
                  id="category-input"
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Type something..."
                  className="border rounded px-2 py-1 w-full"
                />
                {loadingCategory && <p>Loading...</p>}
                {category && loadingCategory === false && categorySuggestions.length > 0 && (
                  <ul className="text-left">
                    {categorySuggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => setCategory(suggestion)}
                        className="cursor-pointer hover:bg-gray-200 p-2 border-b border-b-slate-200"
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Year Selection */}
              <div className="search-container scrollbar">
                <label htmlFor="year">From which time period would you like your next reading to be from?</label>
                <select id="years" name="years" className="border rounded px-2 py-1 w-full" onChange={(e) => setYear(e.target.value)}>
                  <option value="">Select a year range</option>
                  {years.map((years) => (
                    <option key={years.value} value={years.value}>
                      {years.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating Selection */}
              <div className="search-container scrollbar">
                <label htmlFor="rating">Choose the rating you would like your next reading to have.</label>
                <select id="ratings" name="ratings" className="border rounded px-2 py-1 w-full" onChange={(e) => {
                  setRating(e.target.value);
                }}>
                  <option value="">Select a rating</option>
                  {ratings.map((ratings) => (
                    <option key={ratings.value} value={ratings.value}>
                      {ratings.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Shuffle Button */}
            <div
              className="w-[100%] bg-[#396d94] my-[2%] rounded-xl cursor-pointer hover:bg-[#70a7d1] text-center text-white py-2"
              onClick={fetchBooks}>
              <p>SHUFFLE</p>
            </div>

            {/* Result Section */}
            <div className="w-[100%]">
              {!result.title && !loading &&
                  <p className="pt-[10vh]">The book we select for you will appear here!</p>}
              {loading && 
              <div className="loading">
                  <div className="bookshelf_wrapper">
                    <ul className="books_list">
                      <li className="book_item first"></li>
                      <li className="book_item second"></li>
                      <li className="book_item third"></li>
                      <li className="book_item fourth"></li>
                      <li className="book_item fifth"></li>
                      <li className="book_item sixth"></li>
                    </ul>
                    <div className="shelf"></div>
                  </div>
                </div>}                
              {result.title && !loading && !resultError ?
                <div className="flex gap-5 h-[27vh] bg-no-repeat bg-[length:100%_100%]">
                  <div className="w-[20%]">
                    <Image
                        src={result.thumbnail}
                        width={1000}
                        height={1000}
                        alt="Book Cover"
                        className="max-w-[100%] max-h-[22vh] rounded-md"
                      />
                  </div>
                  <div className="text-left flex flex-col h-[25vh] w-[100%] justify-between">
                    <div className="flex gap-2">
                      <p className="font-bold underline decoration-wavy decoration-[#0cf79e]"> Title:</p>
                      <p className="w-[100%]">{result.title}</p>
                    </div>
                    <div className="flex gap-2">
                      <p className="font-bold underline decoration-wavy decoration-[#0cf79e]"> Author:</p>
                      <p className="w-[100%]">{result.author}</p>
                    </div>
                    <div className="flex gap-2 max-h-[30%]">
                      <p className="font-bold underline decoration-wavy decoration-[#0cf79e]"> Summary:</p>
                      <p className="overflow-y-scroll scrollbar w-[100%]">{result.summary}</p>
                    </div>
                    <div className="flex gap-2 max-h-[30%]">
                      <p className="font-bold underline decoration-wavy decoration-[#0cf79e]"> Subject:</p>
                      <p className="w-[100%]">{result.categories}</p>
                    </div>
                    <div className="flex gap-2">
                      <p className="font-bold underline decoration-wavy decoration-[#0cf79e]"> Publish Year:</p>
                      <p>{result.publishYear}</p>
                    </div>
                    <div className="flex gap-2">
                      <p className="font-bold underline decoration-wavy decoration-[#0cf79e]"> Rate:</p>
                      <p className="w-[100%]">{result.rating} ({result.ratingsCount} ratings)</p>
                    </div>
                </div>
              </div> : resultError}
            </div>
          </div>
        </section>
        {user === null ? <section
          id="bookshelf"
          className="all-center justify-evenly sec3-padding section-size section-bg"
          style={{backgroundImage: "url('/bg2.png')"}}
        >
          <div className="flex gap-2">
            <p className="sign-in-up">SIGN UP</p>
            <p className="content-center">or</p>
            <p className="sign-in-up">SIGN IN</p>
          </div>
          <div className="flex">TO ACCESS YOUR
            <div className="px-3 font-bold bg-[length:100%_100%]"
              style={{backgroundImage: "url('/highlighter.png')"}}
            >PERSONAL BOOKSHELF</div>
          </div>
          <div className="w-[100%] px-[10vw]">
            <div className="postit h-[20vh] justify-self-start"
              style={{backgroundImage: "url('/postit1.png')"}}
            >
              <p className="w-[80%] text-wrap">YOU REGISTER YOUR BOOKS</p>
            </div>
            <div className="postit h-[22vh] justify-self-center"
              style={{backgroundImage: "url('/postit2.png')"}}
            >
              <p className="w-[80%] mt-[10%] text-wrap">WE SHUFFLE YOUR OWN SHELF</p>
            </div>
            <div className="postit h-[20vh] justify-self-end"
              style={{backgroundImage: "url('/postit3.png')"}}
            >
              <p className="w-[80%] text-wrap">WE PICK YOUR NEXT READ</p>
            </div>
          </div>
        </section> : <section
          className="all-center pl-[25vw] pr-[5vw] section-size">
          <h3>{`USER'S PERSONAL BOOKSHELF`}</h3>
          <div className="flex">
            <div className="w-[9vw] h-[27vh] bg-gray-200 hover:translate-y-[-1vh] hover:z-10"></div>
            <div className="book-covers bg-gray-300"></div>
            <div className="book-covers bg-gray-400"></div>
            <div className="book-covers bg-gray-200"></div>
            <div className="book-covers bg-gray-300"></div>
            <div className="book-covers bg-gray-400"></div>
            <div className="book-covers bg-gray-200"></div>
            <div className="book-covers bg-gray-300"></div>
            <div className="book-covers bg-gray-400"></div>
            <div className="book-covers bg-gray-200"></div>
            <div className="book-covers bg-gray-300"></div>
            <div className="book-covers bg-gray-400"></div>
            <div className="book-covers bg-gray-200"></div>
            <div className="book-covers bg-gray-300"></div>
            <div className="book-covers bg-gray-400"></div>
            <div className="book-covers bg-gray-200"></div>
            <div className="book-covers bg-gray-300"></div>
            <div className="book-covers bg-gray-400"></div>
          </div>
          <div className="flex w-[100%] justify-between">
            <p>n books total</p>
            <p>n already read books</p>
            <p>n saved shuffles</p>
          </div>
          <Link href="">MANEGE PERSONAL BOOKSHELF</Link>
          <div>SHUFFLE YOUR OWN SHELF</div>
          <div>MIX IT UP</div>
        </section>}
        <section
          id="about"
          className="last-sec-padding all-center section-size section-bg"
          style={{backgroundImage: "url('/bg4.png')"}}
        >
            <p className="font-bold text-[2em] mb-[5vh]">Welcome to BookShelffle!</p>
              <div className="last-sec-cards-container">
                <div className="relative">
                  <div className="last-sec-cards-marker"
                    style={{backgroundImage: "url('/marker2.png')"}}
                  >About Me</div>
                  <p className="last-sec-cards mt-[2vh]">{`Hi! I'm Sophia, a Systems Development student. I created this website as a personal project to learn, grow, and showcase in my portfolio.`}</p>
                </div>
                <div className="relative">
                  <div className="last-sec-cards-marker"
                    style={{backgroundImage: "url('/marker2.png')"}}
                  >Contact</div>
                  <p className="last-sec-cards mt-[2vh]">If you have any suggestions or want to report a problem, feel free to send me an email at <a href="mailto:bookshellfle@gmail.com" className="text-[#396d94]"> bookshellfle@gmail.com</a>.</p>
                </div>
              </div>
              <div className="relative">
                <div className="last-sec-cards-marker"
                      style={{backgroundImage: "url('/marker2.png')"}}
                >About BookShelffle</div>
                <div className="last-sec-cards">
                  <p>{`Sometimes, I find myself stuck, unsure of which book to pick up next, and end up not reading anything at all. If you've ever felt the same way`}, <strong>BookShelffle is for you!</strong></p>
                  <p>I decided to create this platform to help simplify the decision-making process and make it easier for readers to dive into their next great book.</p>
                  <p>By using the <strong>Google Books API</strong>, BookShelffle randomly suggests books from an extensive library to inspire your next read.</p>
                </div>
              </div>
        </section>
      </main>
    </div>
  );
}
